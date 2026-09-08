@Library('platform-ci@1.0.2') _

ciPipeline(
    registry: 'harbor.gangstand.tech',
    harborCredentials: 'harbor-jenkins',
    project: 'gangstand',

    services: [
        'site': [
            context: '.',
            dockerfile: 'Dockerfile'
        ]
    ]
)
