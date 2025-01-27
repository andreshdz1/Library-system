<template>
  <v-app>
    <SideBar v-if="showSidebar" />
    <v-main :class="{ 'with-sidebar': showSidebar }">
      <v-container fluid class="pa-0">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SideBar from './components/SideBar.vue';
const route = useRoute();

const showSidebar = computed(() => {
  const hideSidebarRoutes = ['/', '/PassForgot', '/PassReset'];
  return !hideSidebarRoutes.includes(route.path)
})

</script>
<style>
.v-main {
  background-color: #f5f5f5;
  transition: padding-left 0.3s ease;
}

.v-main.with-sidebar {
  padding-left: 250px;
}

@media (max-width: 768px) {
  .v-main.with-sidebar {
    padding-left: 60px;
  }
}
</style>