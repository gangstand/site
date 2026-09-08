@Library('platform-ci@v1') _

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
