@Library('platform-ci@1.0.3') _

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
