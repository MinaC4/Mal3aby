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

def malabyLoadServices() {
  def cfg = readYaml(file: 'ci/services.yaml')
  return cfg.services.findAll { it.deploy != false }.collect { it.name }
}

def malabyChangedServices() {
  def cfg = readYaml(file: 'ci/services.yaml')
  def allNames = cfg.services.findAll { it.deploy != false }.collect { it.name }
  def diff = sh(returnStdout: true, script: 'git diff --name-only origin/main...HEAD 2>/dev/null || git diff --name-only HEAD~1 2>/dev/null || true').trim()
  if (!diff) { return allNames }
  boolean forceAll = false
  def changed = [] as Set
  diff.split('\n').each { f ->
    if (f.startsWith('Jenkinsfile') || f.startsWith('ci/') || f.startsWith('jenkins-library/')) { forceAll = true }
    cfg.services.each { s -> if (f.startsWith(s.context + '/')) { changed << s.name } }
  }
  if (forceAll || changed.isEmpty()) { return allNames }
  return changed.toList()
}

pipeline {
  agent none
  options {
    timestamps()
    ansiColor('xterm')
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
          sh 'node --version && npm --version && git --version'
          def all = malabyLoadServices()
          env.SERVICES = all.join(',')
          env.CHANGED  = (params.FORCE_ALL ? all : malabyChangedServices()).join(',')
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

    stage('7 Build & Push Images') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-build.yaml'; defaultContainer 'kaniko' } }
      steps {
        script {
          def tag = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
          env.IMAGE_TAG = tag
          def ws = sh(returnStdout: true, script: 'pwd').trim()
          def services = params.FORCE_ALL ? malabyLoadServices() : malabyChangedServices()
          services.each { svc ->
            def extra = (svc == 'frontend-admin') ? '--build-arg VITE_BASE_URL=/' : ''
            sh """
              /kaniko/executor \
                --context=dir://${ws}/malaby/${svc} \
                --dockerfile=${ws}/malaby/${svc}/Dockerfile \
                --destination=${REGISTRY}/${HARBOR_PROJECT}/${svc}:${tag} \
                ${extra} --insecure --skip-tls-verify
            """
          }
        }
      }
    }

    stage('8 SBOM') {
      agent { kubernetes { namespace 'malaby-ci'; yamlFile 'ci/agents/pod-security.yaml'; defaultContainer 'syft' } }
      steps {
        container('syft') {
          sh '''
            for s in api frontend-user frontend-admin; do
              syft ${REGISTRY}/${HARBOR_PROJECT}/$s:${IMAGE_TAG} -o cyclonedx-json=sbom-$s.cdx.json -o spdx-json=sbom-$s.spdx.json
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
          withCredentials([file(credentialsId: 'cosign-key', variable: 'COSIGN_KEY'),
                           string(credentialsId: 'cosign-password', variable: 'COSIGN_PASSWORD')]) {
            sh '''
              for s in api frontend-user frontend-admin; do
                cosign sign --key $COSIGN_KEY --yes ${REGISTRY}/${HARBOR_PROJECT}/$s:${IMAGE_TAG}
                cosign attest --key $COSIGN_KEY --predicate sbom-$s.cdx.json --type cyclonedx --yes ${REGISTRY}/${HARBOR_PROJECT}/$s:${IMAGE_TAG}
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
          withCredentials([file(credentialsId: 'cosign-pub', variable: 'COSIGN_PUB')]) {
            sh '''
              for s in api frontend-user frontend-admin; do
                cosign verify --key $COSIGN_PUB ${REGISTRY}/${HARBOR_PROJECT}/$s:${IMAGE_TAG}
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
    always  { archiveArtifacts artifacts: 'sbom-*.json, semgrep.json', allowEmptyArchive: true }
    failure { echo 'Malaby CI failed — see docs/06-ci-design.md for gate policy' }
  }
}
