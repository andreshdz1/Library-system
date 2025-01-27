# Manual de uso
### Este readme es solo una guia de uso y estructura

---

- **root:**
    - .env: variables de entorno
    - Dockerfile: creacion decontenedor
    - package.json: librerias instaladas y scripts
    - public:
        - main html
    - **src:** 
        - assets: imagenes para el sist
        - components: 
            - barra lateral
            - **pages:** 
                - pestaña de Catalogo
                - pestaña de Beneficiarios
                - pestaña de Clientes
                - Landing casacem pagina
                - pestaña de pagos
                - pestaña punto de venta
                - pestaña de usuarios
        - plugins: funciones para conexion con backend
        - App: pagina principal 
        - Pagina de log in
        - Pass: funcionalidades para recuperacion de contraseñas
        - Router: vue modulo para rutas
    