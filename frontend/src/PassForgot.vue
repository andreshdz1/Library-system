<template>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Recuperar contraseña</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="handleForgotPassword" ref="form">
                <v-text-field
                  v-model="email"
                  label="Correo electrónico"
                  name="email"
                  prepend-icon="mdi-email"
                  type="email"
                  :rules="[v => !!v || 'El correo electrónico es requerido']"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="primary" 
                @click="handleForgotPassword" 
                :loading="isLoading" 
                :disabled="isLoading"
              >
                Enviar correo de recuperación
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
      const email = ref('')
      const isLoading = ref(false)
      const showMessage = ref(false)
      const message = ref('')
      const messageColor = ref('')
      const form = ref(null)
  
      const handleForgotPassword = async () => {
        if (form.value.validate()) {
          isLoading.value = true
          message.value = ''
          try {
            await axios.post(`http://${hostname}:3000/auth/PassForgot`, {
              email: email.value
            })
            message.value = 'Se ha enviado un correo de recuperación. Por favor, revisa tu bandeja de entrada.'
            messageColor.value = 'success'
            showMessage.value = true
            setTimeout(() => {
              router.push('/PassReset')
            }, 3000)
          } catch (err) {
            if (err.response) {
              message.value = 'No se pudo enviar el correo de recuperación. Por favor, intenta de nuevo.'
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
        email,
        isLoading,
        showMessage,
        message,
        messageColor,
        handleForgotPassword,
        form
      }
    }
  }
  </script>