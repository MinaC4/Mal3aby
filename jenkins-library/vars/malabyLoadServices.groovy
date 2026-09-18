#!/usr/bin/env groovy
// Reads ci/services.yaml and returns the names of deployable services.
def call() {
    def cfg = readYaml(file: 'ci/services.yaml')
    return cfg.services.findAll { it.deploy != false }.collect { it.name }
}
