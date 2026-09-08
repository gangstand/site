@Library('platform-ci@1.0.0') _

ciPipeline(
    registry: 'harbor.gangstand.tech',
    harborCredentials: 'harbor-jenkins',
    project: 'gangstand',

    services: [
        'jenkins-test': [
            context: '.',
            dockerfile: 'Dockerfile'
        ]
    ]
)
