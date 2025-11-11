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
                    rem Usa -p para asegurar que paramos el proyecto correcto
                    docker compose -p ${COMPOSE_PROJECT_NAME} down || exit /b 0
                '''
            }
        }

        // --- Etapa 2: Eliminar imágenes (Tu lógica) ---
        stage('2. Eliminando imágenes anteriores...') {
            steps {
                bat '''
                    rem Busca imágenes con la etiqueta del proyecto y las borra
                    for /f "tokens=*" %%i in ('docker images --filter "label=com.docker.compose.project=${COMPOSE_PROJECT_NAME}" -q') do (
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

        // --- Etapa 3: Checkout (Tu lógica) ---
        stage('3. Obteniendo actualización...') {
            steps {
                checkout scm
            }
        }


        stage('4. Preparando Entorno (Red y Volumen)') {
            steps {
                bat '''
                    rem --- Esto es REQUERIDO por 'external: true' en docker-compose.yml ---
                    echo Asegurando que la red y el volumen existan...

                    rem Revisa si la red sgu-net existe, si no, la crea
                    docker network inspect sgu-net > nul 2> nul
                    if errorlevel 1 (
                        echo Creando red externa 'sgu-net'...
                        docker network create --driver bridge sgu-net
                    ) else (
                        echo Red 'sgu-net' ya existe.
                    )

                    rem Revisa si el volumen sgu-volume existe, si no, lo crea
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
                    rem Usa -p y levanta los servicios
                    docker compose -p ${COMPOSE_PROJECT_NAME} up --build -d
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