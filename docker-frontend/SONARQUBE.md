# Ejecutar SONARQUBE con docker

#### Requisitos

- docker
- docker-compose

<br>

#### Configuración inicial

1. _Para Linux o Mac dar permisos de ejecución al script_

   ```
   chmod +x sonarqube.sh
   ```

2. Levantar los contenedores

   ```
   ./sonarqube.sh up
   ```

   _Esperar que en los logs muestre el mensaje:_

   ```
   INFO  app[][o.s.a.SchedulerImpl] SonarQube is operational
   ```

3. Configurar el servicio

- Abrir el navegador en: **<http://localhost:9000>**
- Loguear en el cliente de sonarqube, user: **admin** ~ pass: **admin**
- Configurar una nueva contraseña
- Elegir: _Crear nuevo proyecto y la opción_: **Manually**
- Establecer: En _project display name:_ **rgp2** ~ _project key:_ **rgp2**
- Establecer: En _How do you want to analyze your repository?:_ **Locally**
- Establecer: En _Provide a token ~ Generate a token:_ **my_token_name** (cualquier nombre para el token)
- Copiar: _el token generado:_ **my_token_generated**

4. Asignar el token al scanner de sonarqube para comenzar el análisis

   ```
   ./sonarqube.sh scan ${my_token_generated}
   ```

5. Esperar por que finalice el análisis y revisar el resultado en: **<http://localhost:9000/dashboard?id=rgp2>**

####

<br>

#### Detener los contenedores

```
./sonarqube.sh down
```

<br>

#### Volver a correr Sonarqube

- levantar los contenedores

  ```
  ./sonarqube.sh up
  ```

- loguear en: **<http://localhost:9000>**
- acceder a: **<http://localhost:9000/tutorials?id=rgp2&selectedTutorial=manual>**

  ```
  1. opción 1:
     _usando un nuevo token:_
     - Elegir: _Generate a token_
     - Establecer: _nombre del token_(cualquier nombre para el token) y dar en **Generate**
     - Copiar: _el nuevo token generado:_ **my_token_generated**
  2. opción 2:

     _usando el mismo token:_

     - Elegir: _Use existing token_
     - Establecer: el token anteriormente usado
- ejecutar el scan

  ```
  ./sonarqube.sh scan ${my_token_generated}
  ```

<br>

#### Solución de errores

Si al levantar los contenedores con `./sonarqube.sh up` aparece en consola algún error de `max_map_count` correr en consola:

```
./sonarqube.sh down

sudo sysctl -w vm.max_map_count=262144

./sonarqube.sh up
```

y repertir los pasos de inicialización
