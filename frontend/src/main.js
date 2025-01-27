import { createApp } from 'vue'
import App from './App.vue'
import router from './Router.js'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { icons } from 'lucide-vue-next'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            lucide: icons,
            mdi,
        },
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#0D47A1', // Formal Deep Blue
                    secondary: '#546E7A', // Slate Grey with Blue Undertones
                    accent: '#1E88E5', // Muted Medium Blue
                    error: '#B71C1C', // Deep Red for errors
                    info: '#1565C0', // Rich Blue for info
                    success: '#2E7D32', // Dark Green for success
                    warning: '#F9A825', // Muted Yellow for warnings
                }                              
            },
            dark: {
                dark: true,
                colors: {
                    primary: '#3E2723', // Dark Brown
                    secondary: '#5D4037', // Darker Brown
                    accent: '#8D6E63', // Light Brown
                    error: '#D32F2F', // Red for errors
                    info: '#1976D2', // Blue for info
                    success: '#388E3C', // Green for success
                    warning: '#FBC02D', // Yellow for warnings
                }
            },
        },
    },
})

createApp(App)
    .use(vuetify)
    .use(router)
    .mount('#app')