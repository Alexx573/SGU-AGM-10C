pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'sgu_agm_10c'
    }

    stages {
        // --- Etapa 1: Parar los servicios (Tu lógica) ---
        stage('1. Parando los servicios...') {
            steps {
                    bat '''
                        docker compose -p %COMPOSE_PROJECT_NAME% down || exit /b 0
                    '''
                }
        }

        stage('2. Eliminando imágenes anteriores...') {
            steps {
                    bat '''
                        for /f "tokens=*" %%i in ('docker images --filter "label=com.docker.compose.project=%COMPOSE_PROJECT_NAME%" -q') do (
                            docker rmi -f %%i
                        )
                        if errorlevel 1 (
                            echo No hay imagenes por eliminar
                        ) else (
                            echo Imagenes eliminadas correctamente
                        )
                    '''
                }
        }
        stage('3. Obteniendo actualización...') {
            steps {
                checkout scm
            }
        }


        stage('4. Preparando Entorno (Red y Volumen)') {
            steps {
                bat '''
                    echo Asegurando que la red y el volumen existan...
                    docker network inspect sgu-net > nul 2> nul
                    if errorlevel 1 (
                        echo Creando red externa 'sgu-net'...
                        docker network create --driver bridge sgu-net
                    ) else (
                        echo Red 'sgu-net' ya existe.
                    )
                    docker volume inspect sgu-volume > nul 2> nul
                    if errorlevel 1 (
                        echo Creando volumen externo 'sgu-volume'...
                        docker volume create sgu-volume
                    ) else (
                        echo Volumen 'sgu-volume' ya existe.
                    )
                '''
            }
        }

        stage('5. Construyendo y desplegando servicios...') {
            steps {
                    bat '''
                        docker compose -p %COMPOSE_PROJECT_NAME% up --build -d
                    '''
                }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado con éxito'
            echo 'Aplicación disponible en http://<IP_DE_JENKINS>:3000'
        }
        failure {
            echo 'Hubo un error al ejecutar el pipeline'
        }
        always {
            echo 'Pipeline finalizado'

            cleanWs()
        }
    }
}