#!/usr/bin/env groovy
// Change detection driven by ci/services.yaml.
// - a change to Jenkinsfile / ci/** / jenkins-library/** rebuilds ALL services
// - otherwise, only services whose context directory changed
// - falls back to ALL when nothing matches or git history is unavailable
def call() {
    def cfg = readYaml(file: 'ci/services.yaml')
    def allNames = cfg.services.collect { it.name }

    def diff = sh(returnStdout: true, script: 'git diff --name-only origin/main...HEAD 2>/dev/null || git diff --name-only HEAD~1 2>/dev/null || true').trim()
    if (!diff) { return allNames }

    def files = diff.split('\n')
    boolean forceAll = false
    def changed = [] as Set
    files.each { f ->
        if (f.startsWith('Jenkinsfile') || f.startsWith('ci/') || f.startsWith('jenkins-library/')) {
            forceAll = true
        }
        cfg.services.each { s ->
            if (f.startsWith(s.context + '/')) { changed << s.name }
        }
    }
    if (forceAll || changed.isEmpty()) { return allNames }
    return changed.toList()
}
