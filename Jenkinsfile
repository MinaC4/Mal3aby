// Malaby CI — declarative pipeline driven by ci/services.yaml.
// Runs on Jenkins Kubernetes pod agents in namespace `malaby-ci` (no host Docker socket).
// Pod templates: ci/agents/pod-{node,lint,security,build}.yaml
// Shared library: jenkins-library/vars/*
//
// Self-contained (no global shared-library registration required, so no shared Jenkins
// config is modified). The canonical shared library lives in `jenkins-library/` and will be
// switched to `@Library('malaby-jenkins-library')` once CR-2 is approved.
//
// NOTE: authored in Phase 6; full runtime validation is gated on CI credentials (CR-3).

// Parses ci/services.yaml with a tiny reader (avoids the pipeline-utility-steps plugin,
// which is not installed). The file format is simple and stable.
def malabyServices() {
  def lines = readFile(file: 'ci/services.yaml').split('\n')
  def services = []
  def cur = null
  for (int i = 0; i < lines.size(); i++) {
    def line = lines[i]
    def n = line =~ /^\s*-\s*name:\s*(\S+)/
    if (n) { if (cur != null) { services << cur }; cur = [name: n[0][1].replaceAll('"', ''), context: null, deploy: 'true'] }
    def c = line =~ /^\s*context:\s*(\S+)/
    if (c && cur != null) { cur.context = c[0][1].replaceAll('"', '') }
    def d = line =~ /^\s*deploy:\s*(\S+)/
    if (d && cur != null) { cur.deploy = d[0][1].replaceAll('"', '') }
  }
  if (cur != null) { services << cur }
  return services
}

def malabyLoadServices() {
  return malabyServices().findAll { it.deploy != 'false' }.collect { it.name }
}

// Builds and pushes one image with Kaniko from the pod workspace.
def malabyBuild(String name, String context, String extraArgs) {
  def tag = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
  env.IMAGE_TAG = tag
  def ws = sh(returnStdout: true, script: 'pwd').trim()
  sh "/kaniko/executor --context=dir://${ws}/${context} --dockerfile=Dockerfile --destination=${env.REGISTRY}/${env.HARBOR_PROJECT}/${name}:${tag} ${extraArgs} --insecure --skip-tls-verify"
}

// Uses the Jenkins change set (no `git` binary needed in the pod agent).
def malabyChangedServices() {
  def services = malabyServices().findAll { it.deploy != 'false' }
  def allNames = services.collect { it.name }

  def files = [] as Set
  currentBuild.changeSets.each { set ->
    set.items.each { item -> item.affectedFiles.each { af -> files << af.path } }
  }
  if (files.isEmpty()) { return allNames }

  boolean forceAll = false
  def changed = [] as Set
  files.each { f ->
    if (f.startsWith('Jenkinsfile') || f.startsWith('ci/') || f.startsWith('jenkins-library/')) { forceAll = true }
    services.each { s -> if (s.context && f.startsWith(s.context + '/')) { changed << s.name } }
  }
  if (forceAll || changed.isEmpty()) { return allNames }
  return changed.toList()
}

pipeline {
  agent none
  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '30'))
  }
  parameters {
    booleanParam(name: 'FORCE_ALL', defaultValue: false, description: 'Build and scan every service regardless of changes')
  }
  environment {
    REGISTRY       = '192.168.1.8:30082'
    HARBOR_PROJECT = 'malaby'
    HARBOR_HOST    = 'harbor.192.168.1.8.nip.io'
  }
  stages {

    stage('1 Preflight') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-node.yaml'; defaultContainer 'node' } }
      steps {
        script {
          sh 'node --version && npm --version'
          def svc = malabyServices().findAll { it.deploy != 'false' }
          env.SERVICES_INFO = svc.collect { "${it.name}=${it.context}" }.join(',')
          env.SERVICES = svc.collect { it.name }.join(',')
          env.CHANGED  = (params.FORCE_ALL ? svc.collect { it.name } : malabyChangedServices()).join(',')
          echo "services=${env.SERVICES} changed=${env.CHANGED}"
        }
      }
    }

    stage('2 Secret Scan') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-security.yaml'; defaultContainer 'gitleaks' } }
      steps { container('gitleaks') { sh 'gitleaks dir . --config .gitleaks.toml --redact --exit-code=1' } }
    }

    stage('3 Lint & Static') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-lint.yaml'; defaultContainer 'hadolint' } }
      steps {
        container('hadolint') {
          sh 'for f in malaby/backend/Dockerfile malaby/frontend-user/Dockerfile malaby/frontend-admin/Dockerfile; do hadolint --failure-threshold error "$f"; done'
        }
        container('yamllint') { sh 'yamllint -c .yamllint ci/ gitops/ security/' }
        container('shellcheck') { sh 'find ci/scripts -name "*.sh" -exec shellcheck {} +' }
      }
    }

    stage('4 Unit Tests') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-node.yaml'; defaultContainer 'node' } }
      steps {
        sh 'cd malaby/backend && npm ci --no-audit --no-fund && npm test'
        sh 'cd malaby/frontend-user && npm ci --no-audit --no-fund && npm run check'
        sh 'cd malaby/frontend-admin && npm ci --no-audit --no-fund && npm run check'
      }
    }

    stage('5 SAST') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-security.yaml'; defaultContainer 'semgrep' } }
      steps { container('semgrep') { sh 'semgrep --config p/javascript --config p/security-audit --error --json -o semgrep.json malaby/ || true; head -c 2000 semgrep.json' } }
    }

    stage('6 SCA (source)') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-security.yaml'; defaultContainer 'trivy' } }
      steps { container('trivy') { sh 'trivy fs --scanners vuln --severity CRITICAL,HIGH --exit-code 0 malaby/' } }
    }

    stage('7a Build api') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-build.yaml'; defaultContainer 'kaniko' } }
      steps { script { malabyBuild('api', 'malaby/backend', '') } }
    }
    stage('7b Build frontend-user') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-build.yaml'; defaultContainer 'kaniko' } }
      steps { script { malabyBuild('frontend-user', 'malaby/frontend-user', '') } }
    }
    stage('7c Build frontend-admin') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-build.yaml'; defaultContainer 'kaniko' } }
      steps { script { malabyBuild('frontend-admin', 'malaby/frontend-admin', '--build-arg VITE_BASE_URL=/') } }
    }

    stage('8 SBOM') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-security.yaml'; defaultContainer 'syft' } }
      steps {
        container('syft') {
          sh '''
            for s in api frontend-user frontend-admin; do
              /syft ${REGISTRY}/${HARBOR_PROJECT}/$s:${IMAGE_TAG} -o cyclonedx-json=sbom-$s.cdx.json -o spdx-json=sbom-$s.spdx.json
            done
          '''
        }
        archiveArtifacts artifacts: 'sbom-*.json', allowEmptyArchive: true
      }
    }

    stage('9 Image Scan') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-security.yaml'; defaultContainer 'trivy' } }
      steps {
        container('trivy') {
          sh '''
            for s in api frontend-user frontend-admin; do
              trivy image --scanners vuln,secret,misconfig --severity CRITICAL,HIGH --exit-code 0 \
                ${REGISTRY}/${HARBOR_PROJECT}/$s:${IMAGE_TAG}
            done
          '''
        }
      }
    }

    stage('10 Sign & Attest') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-security.yaml'; defaultContainer 'cosign' } }
      steps {
        container('cosign') {
          withCredentials([file(credentialsId: 'malaby-cosign-key', variable: 'COSIGN_KEY'),
                           string(credentialsId: 'malaby-cosign-password', variable: 'COSIGN_PASSWORD')]) {
            sh '''
              for s in api frontend-user frontend-admin; do
                cosign sign --key $COSIGN_KEY --yes --allow-insecure-registry ${REGISTRY}/${HARBOR_PROJECT}/$s:${IMAGE_TAG}
                cosign attest --key $COSIGN_KEY --predicate sbom-$s.cdx.json --type cyclonedx --yes --allow-insecure-registry ${REGISTRY}/${HARBOR_PROJECT}/$s:${IMAGE_TAG}
              done
            '''
          }
        }
      }
    }

    stage('11 Verify') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-security.yaml'; defaultContainer 'cosign' } }
      steps {
        container('cosign') {
          withCredentials([file(credentialsId: 'malaby-cosign-pub', variable: 'COSIGN_PUB')]) {
            sh '''
              for s in api frontend-user frontend-admin; do
                cosign verify --key $COSIGN_PUB --allow-insecure-registry ${REGISTRY}/${HARBOR_PROJECT}/$s:${IMAGE_TAG}
              done
            '''
          }
        }
      }
    }

    stage('12 Update GitOps (dev)') {
      when { branch 'main' }
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-node.yaml'; defaultContainer 'node' } }
      steps {
        withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
          sh 'malabyUpdateGitOps'
        }
      }
    }
  }
  post {
    // SBOM artifacts are archived inside stage 8 (which runs on a node). With `agent none`
    // a node-less post step would fail, so post only reports here.
    always  { echo 'Malaby CI finished' }
    failure { echo 'Malaby CI failed — see docs/06-ci-design.md for gate policy' }
  }
}
