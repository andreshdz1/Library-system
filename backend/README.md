# Manual de uso
### Este readme es solo una guia de uso y estructura

---

- **root:**
  - Dockerfile: Archivo para levantar contenedor
  -  nest configs
  - configuraciones de typescript
  - .env: variables de entorno
  - db: 
    - conexion con base de datos
  - src: 
    - auth: modulo de autenticacion
      - Guard: modulo para proteccion de endpoint
    - modulos:
      - beneficiarios
      - catalogo
      - clasificacion de libros
      - clientes
      - envio de correos
      - pagos
      - proovedores
      - reservacion de libros
      - roles de usuarios
      - usuarios
    - APP module: modulo de aplicaion, aqui se exportan los otros modulos, cada uno cuenta con un servicio y un controlador, asi como una entidad representando tablas, y un archivo dto para crear movimientos en DB
    - main.ts: configuracion general de la aplicaion