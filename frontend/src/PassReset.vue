<template>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Restablecer contraseña</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="handleResetPassword" ref="form">
                <v-text-field
                  v-model="token"
                  label="Código de recuperación"
                  name="token"
                  prepend-icon="mdi-key"
                  :rules="[v => !!v || 'El código de recuperación es requerido']"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="newPassword"
                  label="Nueva contraseña"
                  name="newPassword"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="[v => !!v || 'La nueva contraseña es requerida']"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirmar nueva contraseña"
                  name="confirmPassword"
                  prepend-icon="mdi-lock-check"
                  type="password"
                  :rules="[
                    v => !!v || 'La confirmación de la contraseña es requerida',
                    v => v === newPassword || 'Las contraseñas no coinciden'
                  ]"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="primary" 
                @click="handleResetPassword" 
                :loading="isLoading" 
                :disabled="isLoading"
              >
                Restablecer contraseña
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-snackbar
            v-model="showMessage"
            :color="messageColor"
            timeout="5000"
          >
            {{ message }}
            <template v-slot:action="{ attrs }">
              <v-btn
                text
                v-bind="attrs"
                @click="showMessage = false"
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
      const token = ref('')
      const newPassword = ref('')
      const confirmPassword = ref('')
      const isLoading = ref(false)
      const showMessage = ref(false)
      const message = ref('')
      const messageColor = ref('')
      const form = ref(null)
  
      const handleResetPassword = async () => {
        if (form.value.validate()) {
          isLoading.value = true
          message.value = ''
          try {
            await axios.post(`http://${hostname}:3000/auth/PassReset`, {
              token: token.value,
              newPassword: newPassword.value
            })
            message.value = 'Tu contraseña ha sido restablecida exitosamente.'
            messageColor.value = 'success'
            showMessage.value = true
            setTimeout(() => {
              router.push('/Landing')
            }, 3000)
          } catch (err) {
            if (err.response) {
              message.value = 'No se pudo restablecer la contraseña. Por favor, verifica el código e intenta de nuevo.'
            } else {
              message.value = 'Error de conexión'
            }
            messageColor.value = 'error'
            showMessage.value = true
          } finally {
            isLoading.value = false
          }
        }
      }
  
      return {
        token,
        newPassword,
        confirmPassword,
        isLoading,
        showMessage,
        message,
        messageColor,
        handleResetPassword,
        form
      }
    }
  }
  </script>