pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Build Application') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t saarthi-app .'
            }
        }

        stage('Docker Compose') {
            steps {
                bat 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo 'Saarthi CI/CD Pipeline completed successfully!'
        }

        failure {
            echo 'Saarthi CI/CD Pipeline failed!'
        }
    }
}