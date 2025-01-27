# CASACEM
### Documentación del Sistema Administrativo para Biblioteca

---

#### Descripción General

Este sistema administrativo para la gestión de bibliotecas fue desarrollado con **Vue.js** para el frontend, **NestJS** para el backend, y **PostgreSQL** como base de datos. La seguridad del sistema está basada en una **administración de roles** y utiliza **JSON Web Tokens (JWT)** para manejar las transacciones de manera segura.

**Desarrollado por:** Andrés Hernández

---

## Funcionalidades Principales

### Gestión de Libros

- **Agregar, editar y eliminar libros.**
- **Buscar libros:** Filtrado por título, autor, género, o código.
- **Reservas de libros:** Permite a los usuarios reservar libros en fechas específicas.
  
### Gestión de Usuarios

- **Administración basada en roles:**
  - Roles disponibles: Administrador, Bibliotecario, Usuario.
  - Cada rol tiene permisos específicos para acceder y gestionar recursos.
- **Autenticación:** Utiliza **JWT** para validar usuarios y gestionar sesiones.

### Reportes

- Generación de reportes personalizados:
  - Inventario actual de libros.
  - Historial de préstamos.
  - Registros de reservas.

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

---

## Requisitos Previos

### Herramientas necesarias

1. **Node.js:** [Descargar e instalar](https://nodejs.org/)
2. **PostgreSQL:** [Descargar e instalar](https://www.postgresql.org/download/)
3. **Docker:** (Opcional, para despliegue en contenedores) [Descargar e instalar](https://www.docker.com/)

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
    >front
    
    aqui se debe de agregar solo una dentro de un **.env** file
    ```
    BACKEND_URL=http://localhost:3000
    ```
    > back

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
