<template>
  <div class="sidebar">
    <nav>
      <ul class="sidebar-nav">

        <h3 class="subtitles" v-if="isAdministrator">Administracion de usuarios</h3>
        <template v-if="isAdministrator">
          <Router-link to="/Usuarios" class="sidebar-link" title="Usuarios">
            <v-icon>mdi-account</v-icon>
            <span class="link-text">Usuarios</span>
          </Router-link>
          <Router-link to="/Clientes" class="sidebar-link" title="Clientes">
            <v-icon>mdi-clipboard-account</v-icon>
            <span class="link-text">Clientes</span>
          </Router-link>
        </template>

        <h3 class="subtitles" v-if="isAdministrator">Pagos y comisiones</h3>
        <Router-link v-if="isAdministrator" to="/Pagos" class="sidebar-link" title="Pagos">
          <v-icon>mdi-currency-usd</v-icon>
          <span class="link-text">Pagos y comisiones</span>
        </Router-link>

        <h3 class="subtitles">Catalogo de articulos</h3>
        <Router-link to="/Catalogo" class="sidebar-link" title="Catalogo">
          <v-icon>mdi-book</v-icon>
          <span class="link-text">Catalogo</span>
        </Router-link>

        <h3 class="subtitles" v-if="isAdministrator">Proveedores y beneficiarios</h3>
        <template v-if="isAdministrator">
          <Router-link to="/Proveedores" class="sidebar-link" title="Proveedores">
            <v-icon>mdi-account-arrow-right</v-icon>
            <span class="link-text">Proveedores</span>
          </Router-link>
          <Router-link to="/Beneficiarios" class="sidebar-link" title="Beneficiarios">
            <v-icon>mdi-account-arrow-left</v-icon>
            <span class="link-text">Beneficiarios</span>
          </Router-link>
        </template>

        <h3 class="subtitles">Punto de Venta</h3>
        <Router-link to="/PuntoDeVenta" class="sidebar-link" title="Punto de venta">
          <v-icon>mdi-archive-marker</v-icon>
          <span class="link-text">Panel</span>
        </Router-link>
        
        <v-dialog max-width="500">
          <template v-slot:activator="{ props }">
            <div class="sidebar-link" v-bind="props" title="Ayuda">
              <v-icon>mdi-help-circle</v-icon>
              <span class="link-text">Ayuda</span>
            </div>
          </template>
          
          <template v-slot:default="{ isActive }">
            <v-card title="Ayuda" color="secondary">
              <v-card-text class="text--primary">
                <p><strong>Usuarios:</strong> En esta sección administras los usuarios de toda la aplicación.</p>
                <p><strong>Clientes:</strong> En esta sección administras los clientes de la aplicación.</p>
                <p><strong>Pagos y comisiones:</strong> En esta sección se muestran movimientos y generas reportes de pagos.</p>
                <p><strong>Catálogo:</strong> En esta sección se muestran los artículos disponibles para la venta.</p>
                <p><strong>Proveedores:</strong> En esta sección se muestran los proveedores de artículos.</p>
                <p><strong>Beneficiarios:</strong> En esta sección se muestran los beneficiarios a los cuales se donan.</p>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text="Cerrar" @click="isActive.value = false"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <Router-link to="/" class="sidebar-link" title="Cerrar sesion">
          <v-icon>mdi-logout</v-icon>
          <span class="link-text">Cerrar sesion</span>
        </Router-link>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const administrator = ref(false)

onMounted(() => {
  administrator.value = localStorage.getItem('administrator') === 'true'
})

const isAdministrator = computed(() => administrator.value)
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 250px;
  background-color: #0D47A1; /* primary deep blue */
  color: #90CAF9; /* accent light blue */
  padding: 1.25rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: width 0.3s ease;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
  text-decoration: none;
  color: #90CAF9; /* accent light blue */
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.sidebar-link:hover {
  background-color: #546E7A; /* secondary grey-blue */
  color: #FFFFFF;
}

.sidebar-link.router-link-active {
  background-color: #1565C0; /* darker blue */
  color: #FFFFFF;
}

.subtitles {
  text-align: left;
  font-size: 0.9rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #E3F2FD; /* lighter blue for subtitles */
}

.link-text {
  margin-left: 0.5rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }

  .link-text, .subtitles {
    display: none;
  }

  .sidebar-link {
    justify-content: center;
    padding: 0.5rem;
  }
}
</style>
