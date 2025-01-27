# CASACEM
### Documentación del Sistema Administrativo para Biblioteca

---

#### Descripción General

Este sistema administrativo para la gestión de bibliotecas fue desarrollado con **Vue.js** para el frontend, **NestJS** para el backend, y **PostgreSQL** como base de datos. La seguridad del sistema está basada en una **administración de roles** y utiliza **JSON Web Tokens (JWT)** para manejar las transacciones de manera segura, el proyecto esta pensado para usarse contenerizado utilizando **Docker y docker-compose**

**Desarrollado por:** Andrés Hernández

---

## Funcionalidades Principales

### Gestión de Libros

- **Agregar, editar y eliminar libros.**
- **Agregar, editar y eliminar categorias de libros**
- **Ventas de libros:** Filtrado por titulo o codigo ISBN.
- **Trueque de libros:** Filtrado por titulo o codigo ISBN.
- **Prestamo de libros:** Filtrado por titulo o codigo ISBN.
- **Ventas de Articulos (cd's, peliculas, etc,):** Filtrado por titulo.
- **Buscar libros y articulos en general:** Filtrado por título, autor, género, o código ISBN.
- **Reservas de libros:** Permite a los usuarios reservar libros en fechas específicas.
  
### Gestión de Usuarios

- **Administración basada en roles:**
  - Roles disponibles: Administrador, Usuario.
  - Cada rol tiene permisos específicos para acceder y gestionar recursos.
- **Autenticación:** Utiliza **JWT** para validar usuarios y gestionar sesiones.

### Reportes

- Generación de reportes personalizados:
  - Corte de caja diario
  - Repote de ventas calendarizado
---

## Tecnologías Utilizadas

1. **Frontend:**
   - Framework: [Vue.js](https://vuejs.org/)
   - Estilo: [Vuetify](https://vuetifyjs.com/), para componentes predefinidos.

2. **Backend:**
   - Framework: [NestJS](https://nestjs.com/)
   - Seguridad: Implementación de [JWT](https://jwt.io/) y administración de roles.

3. **Base de datos:**
   - Gestión de datos con [PostgreSQL](https://www.postgresql.org/).

4. **Contenerización:**
   - Contenedores: [Docker](https://www.docker.com/)
   - Orquestación: [docker-compose](https://docs.docker.com/compose/)

---

## Requisitos Previos

### Herramientas necesarias

1. **Node.js:** [Descargar e instalar](https://nodejs.org/)
2. **PostgreSQL:** [Descargar e instalar](https://www.postgresql.org/download/)
3. **Docker:** (Opcional, para despliegue en contenedores) [Descargar e instalar](https://www.docker.com/)
4. **docker-compose:** [Descargar e instalar](https://docs.docker.com/compose/install/)

### Configuración del Proyecto

1. **Clonar el repositorio:**  
   ```bash
   git clone https://github.com/andreshdz1/sistema-biblioteca.git
   cd sistema-biblioteca
   ```
2. **Instalar las dependencias de front end**
    ```bash
    cd FRONTEND
    npm install
    ```
3. **Instalar dependencias de backend**
    ```bash
    cd BACKEND
    npm install
    ```
4. **Variables de entorno**
   1. **front**
    
    aqui se debe de agregar solo una dentro de un **.env** file
    ```
    BACKEND_URL=http://localhost:3000
    ```
    2. **back**

    Aqui el archivo .env puede que ya este creado, desde instalacion, si no es asi crear igualmente un **.env** y agregar lo siguiente
    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=admin
    DB_NAME=libreria
    JWT_SECRET=THIS_SHOULD_BE_A_SECRET
    ```

    ----
## Uso del sistema

**backend**
``` bash
nest start
```
**frondend**
``` bash
vue serve
```
En este ulimo se proporcionan dos URL que correr en un servidor expres, localmente en 

http://localhost:8080/ 

o

http://127.0.0.0:8080/ 

Tambien se muestra un URL para usar en Network

## Uso de Docker

### Construcción y ejecución con Docker

1. **Para crear y ejecutar los contenedores con docker-compose:**
   ```bash
   docker-compose up --build
   ```

Esto levantará los servicios definidos en el archivo `docker-compose.yml`, incluyendo la base de datos PostgreSQL, el backend y el frontend.

### Archivo `docker-compose.yml` de ejemplo, 
Reemplaza `your_database_name`, `your_username`, y `your_password` con tus credenciales de DB

```yaml
version: '3'
services:
  database:
    image: postgres:13
    environment:
      POSTGRES_DB: your_database_name
      POSTGRES_USER: your_username
      POSTGRES_PASSWORD: your_password
    volumes:
      - ./pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    depends_on:
      - database
    environment:
      DATABASE_URL: postgres://your_username:your_password@database/your_database_name
    ports:
      - "3000:3000"

  frontend:
    build: ./frontend
    ports:
      - "8080:8080"
    depends_on:
      - backend
```

Despues de haberlos creado solo sera necesario los siguientes comandos

- **Iniciar**
```bash
docker-compose up -d
```
Verificar que esten corriendo:
```bash
docker ps
```
- **Detener**
```bash
docker-compose down
```

### Docker GUI
Asi mismo si se busca una visualizacion mas amigable se puede usar **Docker desktop**

Para utilizar Docker Desktop con su proyecto:

1. Instale Docker Desktop desde el sitio web oficial de Docker.
2. Abra el escritorio Docker.
3. Navegue hasta la pestaña "Contenedores/Aplicaciones".
4. Haga clic en "Agregar contenedor" y seleccione "Usar Docker Compose".
5. Busque el directorio de su proyecto que contiene el archivo `docker-compose.yml`.
6. Haga clic en "Iniciar" para ejecutar todos sus servicios.