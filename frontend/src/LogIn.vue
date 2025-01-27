<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Iniciar sesión</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleLogin" ref="form">
              <v-text-field
                v-model="email"
                label="Correo electrónico"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                :rules="[v => !!v || 'El correo electrónico es requerido']"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Contraseña"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="[v => !!v || 'La contraseña es requerida']"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="primary"
              @click="goToForgotPassword"
            >
              ¿Olvidaste tu contraseña?
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="handleLogin" 
              :loading="isLoading" 
              :disabled="isLoading"
            >
              Iniciar sesión
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-snackbar
          v-model="showError"
          color="error"
          timeout="5000"
        >
          {{ error }}
          <template v-slot:action="{ attrs }">
            <v-btn
              text
              v-bind="attrs"
              @click="showError = false"
            >
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const hostname = window.location.hostname

export default {
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false)
    const showError = ref(false)
    const form = ref(null)

    const handleLogin = async () => {
      if (form.value.validate()) {
        isLoading.value = true
        error.value = ''
        try {
          const response = await axios.post(`http://${hostname}:3000/auth/login`, {
            email: email.value,
            password: password.value
          })
          localStorage.setItem("accessToken", response.data.accessToken)
          localStorage.setItem("name", response.data.name)  
          localStorage.setItem("administrator", response.data.administrator)        
          router.push('/Landing')
        } catch (err) {
          if (err.response) {
            error.value = 'Correo o contraseña incorrectos'
          } else {
            error.value = 'Error de conexión'
          }
          showError.value = true
        } finally {
          isLoading.value = false
        }
      }
    }

    const goToForgotPassword = () => {
      router.push('/PassForgot')
    }

    return {
      email,
      password,
      error,
      isLoading,
      showError,
      handleLogin,
      form,
      goToForgotPassword
    }
  }
}
</script>