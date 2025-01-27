<template>
  <v-app>
    <v-app-bar dark>
      <v-toolbar-title class="text-h4 font-weight-bold text-center">LIBRERÍA DE VIEJO</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main class="bg-brown-lighten-5">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="3" v-for="tab in tabs" :key="tab.value">
            <v-btn
              @click="activeTab = tab.value"
              :color="activeTab === tab.value ? 'primary' : ''"
              block
              class="mb-2"
              elevation="2"
            >
              <v-icon start :icon="tab.icon"></v-icon>
              {{ tab.text }}
            </v-btn>
          </v-col>
        </v-row>

        <v-card class="mx-auto mt-4" elevation="5">
          <v-window v-model="activeTab">
            <!-- New Sale -->
            <v-window-item value="sell">
              <v-card-title class="text-h5 font-weight-bold primary--text">
                Nueva Venta
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="clientName"
                      label="Nombre del cliente"
                      @blur="checkClientExists"
                      outlined
                      dense
                      style="max-width: 600px;"
                    ></v-text-field>
                    <span v-if="!clientExists && clientName" class="text-caption red--text">
                      Cliente no encontrado. ¿Desea registrarlo?
                    </span>
                  </v-col>
                    <v-col cols="12" sm="4">
                    <v-btn
                      v-if="!clientExists && clientName"
                      color="primary"
                      @click="showRegisterDialog = true"
                      elevation="2"
                      style="max-width: 300px;"
                    >
                      Registrar Cliente
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="newSaleItem"
                      label="Nombre o ISBN del libro"
                      append-inner-icon="mdi-plus"
                      @keyup.enter="addToSale"
                      outlined
                      dense
                      style="max-width: 600px;"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-btn color="primary" block @click="addToSale" elevation="2" style="max-width: 300px;">
                      Añadir al carrito
                    </v-btn>
                  </v-col>
                </v-row>
                <v-data-table
                  v-if="currentSale.length > 0"
                  :headers="saleHeaders"
                  :items="currentSale"
                  class="elevation-1 mt-4"
                  hide-default-footer
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td>{{ item.title }}</td>
                      <td>${{ item.price.toFixed(2) }}</td>
                      <td>
                        <v-btn icon small color="error" @click="removeFromSale(item)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
                <v-card-text v-if="currentSale.length > 0" class="text-left">
                  <span class="text-h5 font-weight-bold">Total: ${{ saleTotal.toFixed(2) }}</span>
                  <v-text-field
                    v-model="paymentAmount"
                    label="Monto de pago"
                    outlined
                    dense
                    class="mt-2"
                  ></v-text-field>
                  <span v-if="exchange > 0" class="text-h6 font-weight-bold mt-2">
                    Cambio: ${{ exchange.toFixed(2) }}
                  </span>
                </v-card-text>
                <v-card-actions v-if="currentSale.length > 0">
                  <v-btn color="success" dark block @click="completeSale" elevation="2" style="max-width: 300px;">
                  Completar Venta
                </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-window-item>
 <!-- Lend Article -->
 <v-window-item value="lend">
              <v-card-title class="text-h5 font-weight-bold primary--text">
                Prestar Artículo
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="clientName"
                        label="Nombre del cliente"
                        @blur="checkClientExists"
                        outlined
                        dense
                        style="max-width: 600px;"
                      ></v-text-field>
                      <span v-if="!clientExists && clientName" class="text-caption red--text">
                        Cliente no encontrado. ¿Desea registrarlo?
                      </span>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-btn
                        v-if="!clientExists && clientName"
                        color="primary"
                        @click="showRegisterDialog = true"
                        elevation="2"
                        style="max-width: 200px;"
                      >
                        Registrar Cliente
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="lendArticleId"
                        label="Nombre o ISBN del libro"
                        append-inner-icon="mdi-plus"
                        @keyup.enter="addLend"
                        outlined
                        dense
                        style="max-width: 600px;"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-btn color="primary" block @click="addLend" elevation="2" style="max-width: 300px;">
                        Añadir al carrito
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <div class="d-flex justify-center">
                        <v-date-input
                          v-model="dateRange"
                          label="Selecciona una fecha de regreso"
                          max-width="368"
                          multiple="false"
                        ></v-date-input>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-data-table
                        v-if="currentlend.length > 0"
                        :headers="lendHeader"
                        :items="currentlend"
                        class="elevation-1 mt-4"
                        hide-default-footer
                      >
                        <template v-slot:item="{ item }">
                          <tr>
                            <td>{{ item.title }}</td>
                            <td>
                              <v-btn icon small color="error" @click="removeFromSale(item)">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-btn color="success" block @click="completeLend" elevation="2" style="max-width: 300px;">
                        Prestar Artículo
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-window-item>

                   <!-- Trueque -->
            <v-window-item value="exchange">
              <v-card-title class="text-h5 font-weight-bold primary--text">
                Trueque
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-btn color="primary" block @click="openBookDialog()" elevation="2">
                        Añadir Libro de Entrada
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" >
                      <v-card-subtitle class="text-h6 font-weight-bold primary--text">
                        Seleccionar Libro de Salida
                      </v-card-subtitle>
                      <v-text-field
                        v-model="exchangeArticle"
                        label="Nombre o ISBN del libro"
                        append-inner-icon="mdi-plus"
                        @keyup.enter="addExchange"
                        outlined
                        dense
                        style="max-width: 600px;"
                      ></v-text-field>
                      <v-col cols="12" sm="4">
                        <v-btn color="primary" block @click="addExchange" elevation="2" style="max-width: 300px;">
                          Añadir al carrito
                        </v-btn>
                      </v-col>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" v-if="exchangeInBook.length > 0">
                      <v-card-subtitle class="text-h6 font-weight-bold primary--text">
                        Libros de Entrada
                      </v-card-subtitle>
                      <v-data-table
                        
                        :headers="saleHeaders"
                        :items="exchangeInBook"
                        class="elevation-1 mt-4"
                        hide-default-footer
                      >
                        <template v-slot:item="{ item }">
                          <tr>
                            <td>{{ item.title }}</td>
                            <td>${{ item.price }}</td>
                            <td>
                              <v-btn icon small color="error" @click="removeFromExchange(item)">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" v-if="currentExchange.length > 0">
                      <v-card-subtitle class="text-h6 font-weight-bold primary--text" >
                        Libros de salida
                      </v-card-subtitle>
                      <v-data-table
                        :headers="saleHeaders"
                        :items="currentExchange"
                        class="elevation-1 mt-4"
                        hide-default-footer
                      >
                        <template v-slot:item="{ item }">
                          <tr>
                            <td>{{ item.title }}</td>
                            <td>${{ item.price }}</td>
                            <td>
                              <v-btn icon small color="error" @click="removeFromExOut(item)">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-btn color="success" block @click="completeExchange" class="mt-4" elevation="2" :disabled="!canCompleteExchange">
                        Completar Trueque
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-window-item>

            <!-- Consult Articles -->
            <v-window-item value="consult">
              <v-card-title class="text-h5 font-weight-bold primary--text">
                Consultar Artículos
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="searchQuery"
                      label="Buscar artículos..."
                      append-inner-icon="mdi-magnify"
                      @click:append-inner="searchArticles"
                      @keyup.enter="searchArticles"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                  </v-col>
                </v-row>
                <v-data-table
                  :headers="articleHeaders"
                  :items="items"
                  :search="searchQuery"
                  class="elevation-1 mt-4"
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td :class="{ 'na-text': item.id === null }">{{ formatField(item.id) }}</td>
                      <td :class="{ 'na-text': item.isbn === null }">{{ formatField(item.isbn) }}</td>
                      <td :class="{ 'na-text': item.title === null }">{{ formatField(item.title) }}</td>
                      <td :class="{ 'na-text': item.price === null }">{{ formatField(item.price) }}</td>
                      <td :class="{ 'na-text': item.amount === null }">{{ formatField(item.amount) }}</td>
                      <td :class="{ 'na-text': item.location === null }">{{ formatField(item.location) }}</td>
                      <td :class="{ 'na-text': item.clasification === null }">{{ formatField(item.clasification) }}</td>
                      <td>
                        <v-btn   small @click="addSellButt(item)" title="Añadir a venta" class="mx-1">
                          <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                      </td>
                      <td>
                        <v-btn  small @click="addLendButt(item)" title="Añadir a prestamo" class="mx-1">
                          <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                      </td>
                      <td>
                        <v-btn  small @click="addExchangeButt(item)" title="Añadir a Trueque" class="mx-1">
                          <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-window-item>

            <!-- New Reservation tab -->
              <v-window-item value="reservation">
                <v-card-title class="text-h5 font-weight-bold primary--text">
                  Reservar Libro
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="reservationBook"
                        label="Nombre o ISBN del libro"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="clientName"
                        label="Nombre del cliente"
                        @blur="checkClientExists"
                        outlined
                        dense
                        style="max-width: 600px;"
                      ></v-text-field>
                      <span v-if="!clientExists && clientName" class="text-caption red--text">
                        Cliente no encontrado. ¿Desea registrarlo?
                      </span>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-btn
                        v-if="!clientExists && clientName"
                        color="primary"
                        @click="showRegisterDialog = true"
                        elevation="2"
                        style="max-width: 200px;"
                      >
                        Registrar Cliente
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-date-input
                        title="Selecciona una fecha limite de reserva"
                        v-model="reservationDate"
                        class="mt-4"
                        min="2025-01-01"
                        multiple="false"
                      ></v-date-input>
                    </v-col>
                  </v-row>
                    <v-row justify="center">
                    <v-col cols="12" sm="6" class="d-flex justify-center">
                      <v-btn color="primary" @click="makeReservation" block>
                        Hacer Reservación
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-title class="text-h5 font-weight-bold primary--text">
                  Reservaciones
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="searchQuery"
                      label="Buscar artículos..."
                      append-inner-icon="mdi-magnify"
                      @click:append-inner="searchArticles"
                      @keyup.enter="searchArticles"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                  </v-col>
                </v-row>
                <v-data-table
                  :headers="reservationHeaders"
                  :items="reservations"
                  :search="searchQuery"
                  class="elevation-1 mt-4"
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td :class="{ 'na-text': item.id === null }">{{ formatField(item.id) }}</td>
                      <td :class="{ 'na-text': item.book_id === null }">{{ formatField(item.book_id) }}</td>
                      <td :class="{ 'na-text': item.book_title === null }">{{ formatField(item.book_title) }}</td>
                      <td :class="{ 'na-text': item.user_id === null }">{{ formatField(item.user_id) }}</td>
                      <td :class="{ 'na-text': item.reservation === null }">{{ formatField(item.reservation) }}</td>
                      <td :class="{ 'na-text': item.due_date === null }">{{ formatField(item.due_date) }}</td>
                      <td>
                      <v-btn  small @click="removeReservation(item)" title="Eliminar" class="mx-1">
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                    </td>
                    </tr>
                  </template> 
                </v-data-table>
              </v-card-text>
              </v-window-item>

            <!-- Daily Report -->
            <v-window-item value="report">
              <v-card-title class="text-h5 font-weight-bold primary--text">
                Reporte Diario de Ventas
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-card outlined>
                      <v-card-text>
                        <div class="text-h6">Total de Ventas</div>
                        <div class="text-h4 font-weight-bold">${{ totalSales }}</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-card outlined>
                      <v-card-text>
                        <div class="text-h6">Número de Transacciones</div>
                        <div class="text-h4 font-weight-bold">{{ numberOfTransactions }}</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-btn color="primary" block @click="generateReport" class="mt-4" elevation="2">
                  Generar Reporte Detallado
                </v-btn>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="4000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    <!-- REGISTRO DE CLIENTE -->
    <v-dialog v-model="showRegisterDialog" max-width="500px">
      <v-card>
        <v-card-title>Nombre de nuevo cliente </v-card-title>
        <v-card-text>
          <v-text-field v-model="newClientName" label="Nombre" outlined dense></v-text-field>
          <v-text-field v-model="newClientEmail" label="Email" outlined dense></v-text-field>
          <v-text-field v-model="newClientPhone" label="Teléfono" outlined dense></v-text-field>
          <v-select v-model="newclientIntern" label="Interno o externo" outlined dense :items="internal"></v-select>
          <v-select v-model="newclientPreferences" label="Preferencias" outlined dense :items="categoryClasses"></v-select>
          <p class="text-caption">
            Si no desea registrar al cliente, simplemente haga clic en "Cancelar".
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showRegisterDialog = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="registerNewClient">Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  <!-- Book Dialog -->
  <v-dialog v-model="bookDialog.show" max-width="600">
    <v-card>
      <v-card-title> Registro de libro</v-card-title>
      <v-card-text>
        <v-form ref="bookForm" v-model="bookDialog.valid">
          <v-checkbox
                label="Asignar isbn"
                v-model="generateIsbn"
                @change="handleIsbnChange"
          ></v-checkbox>
          <v-text-field
            v-model="bookDialog.book.isbn"
            label="ISBN"
            :rules="[v => !!v || 'ISBN es requerido']"
            :disabled="generateIsbn"
            required
          ></v-text-field>
          <v-text-field
            v-model="bookDialog.book.title"
            label="Título"
            :rules="[v => !!v || 'Título es requerido']"
            required
          ></v-text-field>
          <v-text-field
            v-model="bookDialog.book.author"
            label="Autor"
          ></v-text-field>
          <v-text-field
            v-model="bookDialog.book.editorial"
            label="Editorial"
          ></v-text-field>
          <v-text-field
            v-model="bookDialog.book.edition"
            label="Edición"
          ></v-text-field>
          <v-select
            v-model="bookDialog.book.conditions"
            label="Condiciones"
            :items="condiciones"
          ></v-select>
          <v-select
            v-model="bookDialog.book.clasification"
            label="Clasificación"
            :items="categoryClasses"
          ></v-select>
          <v-text-field
            v-model="bookDialog.book.location"
            label="Ubicación"
          ></v-text-field>
          <v-text-field
            v-model="bookDialog.book.price"
            label="Precio $"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeBookDialog">Cerrar</v-btn>
        <v-btn color="primary" @click="AddQueue">Añadir a cola</v-btn>
        <v-btn color="primary" @click="saveBook">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-app>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios';
const hostname = window.location.hostname
import { VDateInput } from 'vuetify/labs/VDateInput'
const globalUser = ref(false)
// State
const activeTab = ref('sell')
const newSaleItem = ref('')
const currentSale = ref([])
const lendArticleId = ref('')
const exchangeArticle = ref('')
const currentlend = ref([])
const searchQuery = ref('')
const dailyTotal = ref(0)
const dailyTransactions = ref(0)
const items = ref([])
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('')
const clientName = ref('')
const clientExists = ref('')
const showRegisterDialog = ref(false)
// const booksDialog = ref(false)
const newClientName = ref('')
const newClientEmail = ref('')
const newClientPhone = ref('')
const newclientPreferences = ref('')
const newclientIntern = ref('')
const clasifications = ref([])
const loading = ref(false)
const categoryClasses = ref([])
const internal = ref(['interno', 'externo'])
const paymentAmount = ref(0)
const dateRange = ref([])
const generateIsbn = ref(false);
const exchangeInBook = ref([])
const currentExchange = ref([])
const dailyMovements = ref({ totAmount: 0, totMov: 0})
const reservationBook = ref('')
const reservationDate = ref([])
const reservations = ref([])
// Computed properties for the values
const totalSales = computed(() => {
  return dailyMovements.value.totAmount.toFixed(2)
})

const numberOfTransactions = computed(() => {
  return dailyMovements.value.totMov
})
const condiciones = ref(['Excelentes Condiciones', 'Buena', 'Poco maltratado', 'Maltratado'])
const bookDialog = ref({
  show: false,
  title: '',
  valid: false,
  type: '',
  book: {
    isbn: '',
    title: '',
    author: '',
    editorial: '',
    edition: '',
    conditions: '',
    clasification: '',
    location: '',
    amount: 1,
    price: ''
  }
})

const canCompleteExchange = computed(() => {
  return exchangeInBook.value && currentExchange.value
})
const saleTotal = computed(() => {
  return currentSale.value.reduce((total, item) => total + item.price, 0)
})

const exchange = computed(() => {
  const payment = parseFloat(paymentAmount.value)
  return payment > saleTotal.value ? payment - saleTotal.value : 0
})

// Data
const tabs = [
  { value: 'sell', text: 'Nueva venta', icon: 'mdi-cart' },
  { value: 'lend', text: 'Prestar artículo', icon: 'mdi-book-open-variant' },
  { value: 'exchange', text: 'Trueque', icon: 'mdi-swap-horizontal' },
  { value: 'consult', text: 'Consultar artículos', icon: 'mdi-magnify' },
  { value: 'report', text: 'Corte de caja', icon: 'mdi-chart-bar' },
  { value: 'reservation' ,text: 'Calendario de apartados' ,icon: 'mdi-calendar-clock'},
]
const reservationHeaders = [
  { title: 'ID', value: 'id' },
  { title: 'ID Libro', value: 'book_id' },
  { title: 'Titulo', value: 'book_title' },
  { title: 'Usuario', value: 'user_id' },
  { title: 'Fecha de Reservación', value: 'reservation' },
  { title: 'Fecha de Vencimiento', value: 'due_date' },
]
const saleHeaders = [
  { title: 'Nombre', value: 'name' },
  { title: 'Precio', value: 'price' },
]

const lendHeader = [
  { title: 'Titulo', value: 'title' },
]

const articleHeaders = [
  { title: 'ID', value: 'id' , sortable: true},
  { title: 'ISBN', value: 'isbn', sortable: true },
  { title: 'Titulo', value: 'title' , sortable: true},
  { title: 'Precio', value: 'price', sortable: true },
  { title: 'Stock', value: 'Amount', sortable: true },
  { title: 'Ubicacion', value: 'location', sortable: true },
  { title: 'Clasificacion', value: 'classification', sortable: true },
  { title: 'Añadir a venta', value: 'edit' },
  { title: 'Añadir a prestamo', value: 'lend' },
  { title: 'Añadir a trueque', value: 'exchange' },
]

// VENTA

const addToSale = async () => {
  try {
    const isId = /^\d+$/.test(newSaleItem.value);
    let response;
    
    if (isId) {
      response = await axios.post(`http://${hostname}:3000/Catalog/findByIsbn`, {
        isbn: newSaleItem.value
      });
    } else {
      response = await axios.post(`http://${hostname}:3000/Catalog/findByTitle`, {
        title: newSaleItem.value
      });
    }
    const article = response.data;
    if (article) {
      if (article.amount === 0) {
        showSnackbar('error', 'Articulo sin existencia')
      } else if (currentSale.value.length > 0) {
        const exist = currentSale.value.some(item => item.id === article.id)
        if (exist) {
          const index = currentSale.value.findIndex(item => item.id === article.id)
          if (currentSale.value[index].amount < article.amount) {
            currentSale.value[index].amount += 1;
            currentSale.value.push({
              id: article.id,
              title: article.title,
              price: article.price || 0,
              isbn: article.isbn,
            });
            newSaleItem.value = '';
          } else {
            showSnackbar('error', 'No hay suficiente stock');
          }
        } else {
          currentSale.value.push({
            id: article.id,
            title: article.title,
            price: article.price || 0,
            isbn: article.isbn,
            amount: 1,
          });
          newSaleItem.value = '';
        }
      } else {
        currentSale.value.push({
          id: article.id,
          title: article.title,
          price: article.price || 0,
          isbn: article.isbn,
          amount: 1,
        });
        newSaleItem.value = '';
      }
    } else {
      showSnackbar('error', 'Artículo no encontrado')
    }
  } catch (error) {
    console.error('Error al añadir artículo:', error)
    showSnackbar('error', 'Error al añadir artículo')
  }
}

const removeFromSale = (item) => {
  const index = currentSale.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    currentSale.value.splice(index, 1)
  }
  const index2 = currentlend.value.findIndex(i => i.id === item.id)
  if (index2 !== -1) {
    currentlend.value.splice(index, 1)
  }
}


const checkClientExists = async () => {
  if (clientName.value) {
    try {
      const response = await axios.post(`http://${hostname}:3000/clients/findByname`, {
        name: clientName.value
      })
      clientExists.value = response.data
      // Removed automatic dialog display
    } catch (error) {
      console.error('Error checking client:', error)
      showSnackbar('error', 'Error al verificar el cliente')
    }
  }
}

const getClasifications = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`http://${hostname}:3000/clasification`);
    clasifications.value = response.data;
    categoryClasses.value = clasifications.value.map(item => item.class);
  } catch (error) {
    console.error('Error fetching Clasifications:', error);
    showSnackbar('error', 'Error al buscar clasificaciones');
  } finally {
    loading.value = false;
  }
}

const registerNewClient = async () => {
  try {
    const response = await axios.post(`http://${hostname}:3000/clients`, {
      name: newClientName.value,
      email: newClientEmail.value,
      number: newClientPhone.value,
      preferences: newclientPreferences.value,
      intern: newclientIntern.value
    })
    if (response) {
      clientExists.value = true
      clientName.value = newClientName.value
      showRegisterDialog.value = false
      showSnackbar('success', 'Cliente registrado exitosamente')
    }
  } catch (error) {
    console.error('Error registering client:', error)
    showSnackbar('error', 'Error al registrar el cliente')
  }
}

const completeSale = async () => {
  if (!clientName.value) {
    showSnackbar('error', 'Por favor, ingrese un nombre de cliente o registre uno nuevo')
    return
  }
  if (parseFloat(paymentAmount.value) < saleTotal.value) {
    showSnackbar('error', 'El monto de pago es insuficiente')
    return
  }
  try {
    for (const item of currentSale.value) {
      if (item.isbn) {
        await axios.post(`http://${hostname}:3000/Payments`, {
          article: 'libro',
          transaction_type: 'venta',
          total: item.price,
          title: item.title,
          user_name: globalUser.value,
          clients: clientName.value,
          isbn: item.isbn,
          id_article: null
        })
      } else {
        await axios.post(`http://${hostname}:3000/Payments`, {
          article: 'libro',
          transaction_type: 'venta',
          total: item.price,
          title: item.title,
          user_name: globalUser.value,
          clients: clientName.value,
          isbn: null,
          id_article: item.id 
        })
      }
      await axios.post(`http://${hostname}:3000/Catalog/stock`, {
        id: item.id
      })
      .catch(error => {
        console.error('Error al actualizar el stock:', error)
        showSnackbar('error', 'Error al actualizar el stock')
      })
    }
    
      
    dailyTotal.value += saleTotal.value
    dailyTransactions.value++
    showSnackbar('success', `Venta completada! Total: $${saleTotal.value.toFixed(2)}, Cambio: $${exchange.value.toFixed(2)}`)
    currentSale.value = []
    clientName.value = ''
    clientExists.value = false
    paymentAmount.value = 0
  } catch (error) {
    console.error('Error al completar la venta:', error)
    showSnackbar('error', 'Error al completar la venta')
  }
}

// PRESTAMO

const addLend = async () => {
  try {
    const isId = /^\d+$/.test(lendArticleId.value);
    let response;
    
    if (isId) {
      response = await axios.post(`http://${hostname}:3000/Catalog/findByIsbn`, {
        isbn: lendArticleId.value
      });
    } else {
      response = await axios.post(`http://${hostname}:3000/Catalog/findByTitle`, {
        title: lendArticleId.value
      });
    }
    const article = response.data;
    if (article) {
      if (article.amount === 0) {
        showSnackbar('error', 'Articulo sin existencia')
      } else {
        const newLendItem = {
          id: article.id,
          title: article.title,
          price: article.price || 0,
          isbn: article.isbn,
          amount: 1,
        };
        
        if (Array.isArray(currentlend.value)) {
          const existingIndex = currentlend.value.findIndex(item => item.id === article.id);
          if (existingIndex !== -1) {
            if (currentlend.value[existingIndex].amount < article.amount) {
              currentlend.value[existingIndex].amount += 1;
            } else {
              showSnackbar('error', 'No hay suficiente stock');
            }
          } else {
            currentlend.value.push(newLendItem);
          }
        } else {
          currentlend.value = [newLendItem];
        }
        
        lendArticleId.value = '';
      }
    } else {
      showSnackbar('error', 'Artículo no encontrado')
    }
  } catch (error) {
    console.error('Error al añadir artículo:', error)
    showSnackbar('error', 'Error al añadir artículo')
  }
}

const completeLend = async () => {
  if (!clientName.value) {
    showSnackbar('error', 'Por favor, ingrese un nombre de cliente o registre uno nuevo')
    return
  }
  //DATE RANGES DOES ABSOLUTELY NOTHING
  //IS JUST TO REMEMBER USER TO RETURN BOOK
  if (!dateRange.value) {
    showSnackbar('error', 'Por favor, seleccione una fecha de regreso')
    return
  }
  try {
    for (const item of currentlend.value) {
      if (item.isbn) {
        await axios.post(`http://${hostname}:3000/Payments`, {
          article: 'libro',
          transaction_type: 'Prestamo',
          title: item.title,
          user_name: globalUser.value,
          clients: clientName.value,
          isbn: item.isbn,
          id_article: null
        })
      } else {
        await axios.post(`http://${hostname}:3000/Payments`, {
          article: 'Articulo',
          transaction_type: 'Prestamo',
          title: item.title,
          user_name: globalUser.value,
          clients: clientName.value,
          isbn: null,
          id_article: item.id 
        })
      }
      console.log('id: ', item.id)
      await axios.post(`http://${hostname}:3000/Catalog/stock`, {
        location: 'prestado',
        id: item.id
      })
      .catch(error => {
        console.error('Error al actualizar el stock:', error)
        showSnackbar('error', 'Error al actualizar el stock')
      })
    }
    dailyTotal.value += saleTotal.value
    dailyTransactions.value++
    showSnackbar('success', `Prestamo completado! `)
    currentlend.value = []
    clientName.value = ''
    clientExists.value = false
    dateRange.value = []
  } catch (error) {
    console.error('Error al completar la venta:', error)
    showSnackbar('error', 'Error al completar la venta')
  }
}

//INTERCAMBIO
//bloquear si uno de los dos no esta
//salida no esta teniendo value
const removeFromExchange = (item) => {
  const index = exchangeInBook.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    exchangeInBook.value.splice(index, 1)
  }
}
const saveBook = async () => {
    exchangeInBook.value.push(bookDialog.value.book),
    closeBookDialog()
  }
const removeFromExOut = (item) => {
  const index = currentExchange.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    currentExchange.value.splice(index, 1)
  }
}

const registerEntranceBook = async () => {
  try {
    const promises = exchangeInBook.value.map(async (item, index) => {
      if (!item || typeof item !== 'object') {
        throw new Error(`Invalid item at index ${index}`);
      }

      if (!item.title || !item.isbn) {
        throw new Error(`Missing required properties for item at index ${index}`);
      }

      try {
        const catalogResponse = await axios.post(`http://${hostname}:3000/Catalog`, item);
        console.log(`Catalog response for item ${index}:`, catalogResponse.data);

        const paymentResponse = await axios.post(`http://${hostname}:3000/Payments`, {
          article: 'libro',
          transaction_type: 'Trueque ingreso',
          title: item.title,
          user_name: globalUser.value,
          isbn: item.isbn,
          id_article: null
        });
        console.log(`Payment response for item ${index}:`, paymentResponse.data);
      } catch (error) {
        console.error(`Error processing item ${index}:`, error);
        throw error; // Re-throw to be caught by the outer catch block
      }
    });
      await Promise.all(promises);

      dailyTotal.value += saleTotal.value;
      dailyTransactions.value++;
      exchangeInBook.value = [];
      showSnackbar('success', 'Libros de entrada registrados exitosamente');
      } catch (error) {
        console.error('Error in registerEntranceBook:', error);
      if (error.response) {
        console.error('API error response:', error.response.data);
      }
      showSnackbar('error', `Error al registrar los libros de entrada: ${error.message}`);
      }
    };
    
const registerExitBook = async () => {
  try {
    for (const item of currentExchange.value) {
      if (item.isbn) {
        await axios.post(`http://${hostname}:3000/Payments`, {
          article: 'libro',
          transaction_type: 'Trueque Salida',
          title: item.title,
          user_name: globalUser.value,
          isbn: item.isbn,
          id_article: null
        })
      } else {
        await axios.post(`http://${hostname}:3000/Payments`, {
          article: 'Articulo',
          transaction_type: 'Trueque Salida',
          title: item.title,
          user_name: globalUser.value,
          isbn: null,
          id_article: item.id 
        })
      }
      await axios.post(`http://${hostname}:3000/Catalog/stock`, {
        id: item.id
      })
      .catch(error => {
        console.error('Error al actualizar el stock:', error)
        showSnackbar('error', 'Error al actualizar el stock')
      })
    }
    dailyTotal.value += saleTotal.value
    dailyTransactions.value++
    currentExchange.value = []
  } catch (error) {
    console.error('Error al completar la venta:', error)
    showSnackbar('error', 'Error al completar la venta')
  }
}

const completeExchange = async () => {
  if (!exchangeInBook.value || !currentExchange.value) {
    showSnackbar('error', 'Por favor, seleccione los libros para el intercambio')
    return
  }

  try {
    registerEntranceBook()
    registerExitBook()

    showSnackbar('success', 'Intercambio completado exitosamente')
    // Reset exchange-related data
    exchangeInBook.value = ''
    currentExchange.value = ''
  } catch (error) {
    console.error('Error completing exchange:', error)
    showSnackbar('error', 'Error al completar el intercambio')
  }
}

const addExchange = async () => {
  try {
    const isId = /^\d+$/.test(exchangeArticle.value);
    let response;
    
    if (isId) {
      response = await axios.post(`http://${hostname}:3000/Catalog/findByIsbn`, {
        isbn: exchangeArticle.value
      });
    } else {
      response = await axios.post(`http://${hostname}:3000/Catalog/findByTitle`, {
        title: exchangeArticle.value
      });
    }
    const article = response.data;
    if (article) {
      if (article.amount === 0) {
        showSnackbar('error', 'Articulo sin existencia')
      } else if (currentExchange.value.length > 0) {
        const exist = currentExchange.value.some(item => item.id === article.id)
        if (exist) {
          const index = currentExchange.value.findIndex(item => item.id === article.id)
          if (currentExchange.value[index].amount < article.amount) {
            currentExchange.value[index].amount += 1;
            currentExchange.value.push({
              id: article.id,
              title: article.title,
              price: article.price || 0,
              isbn: article.isbn,
            });
            exchangeArticle.value = '';
          } else {
            showSnackbar('error', 'No hay suficiente stock');
          }
        } else {
          currentExchange.value.push({
            id: article.id,
            title: article.title,
            price: article.price || 0,
            isbn: article.isbn,
            amount: 1,
          });
          exchangeArticle.value = '';
        }
      } else {
        currentExchange.value.push({
          id: article.id,
          title: article.title,
          price: article.price || 0,
          isbn: article.isbn,
          amount: 1,
        });
        exchangeArticle.value = '';
      }
    } else {
      showSnackbar('error', 'Artículo no encontrado')
    }
  } catch (error) {
    console.error('Error al añadir artículo:', error)
    showSnackbar('error', 'Error al añadir artículo')
  }
}
const AddQueue = async () => {
  try{
    if(bookDialog.value.book.price === ''){
      bookDialog.value.book.price = 0
    }
  if(bookDialog.value.book.isbn === '' || bookDialog.value.book.title === '' ){
    showSnackbar('error', 'Titulo e ISBN son requeridos')
  }else{
    await axios.post(`http://${hostname}:3000/Catalog/queue`, bookDialog.value.book)    
    exchangeInBook.value.push(bookDialog.value.book),
    showSnackbar('success', 'Libro añadido, favor de completar registro en Catalogo')
    closeBookDialog()
    }
  } 
  catch (error) {
    console.error('Error al añadir libro a la cola:', error)
    showSnackbar('error', 'Error al añadir libro a la cola')
  }
}
// DAILY REPORT

const getDailyMovements = async () => {
  try {
    const response = await axios.get(`http://${hostname}:3000/payments/dailyTran`)
    dailyMovements.value = response.data
    if (Array.isArray(response.data)) {
      dailyMovements.value = response.data;
    } else {
      console.error('', dailyMovements.value);
    }
  } catch (error) {
    console.error('Error fetching daily movements:', error)
    showSnackbar('error', 'Error al buscar movimientos diarios')
  }

}
// CALENDAR
const makeReservation = async () => {
  try {
  const isId = /^\d+$/.test(reservationBook.value);
    let response;
    if (isId) {
      response = await axios.post(`http://${hostname}:3000/Catalog/findByIsbn`, {
        isbn: reservationBook.value
      });
    } else {
      response = await axios.post(`http://${hostname}:3000/Catalog/findByTitle`, {
        title: reservationBook.value
      });
    }
    const article = response.data;
    if (article) {
      if (article.amount === 0) {
        showSnackbar('error', 'Articulo sin existencia')
        reservationBook.value = ''
      }
      else {
        const response = await axios.post(`http://${hostname}:3000/reservation`, {
          user_id: clientName.value,
          book_id: article.id,
          due_date: reservationDate.value,
          book_title: article.title
        })
        await axios.post(`http://${hostname}:3000/Catalog/stock`, {
          location: 'reservado',
          id: article.id
      })
        if (response.data) {
          showSnackbar('success', 'Reservación realizada con éxito')
          reservationBook.value = ''
          reservationDate.value = []
        }
      }
    } else {
      showSnackbar('error', 'Artículo no encontrado')
    }
  } catch (error) {
    console.error('Error al hacer la reservación:', error)
    showSnackbar('error', 'Error al hacer la reservación')
  }
}
const showReservations = async () => {
  try {
    const response = await axios.get(`http://${hostname}:3000/reservation`)
    reservations.value = response.data;
  } catch (error) {
    console.error('Error al buscar reservaciones:', error)
    showSnackbar('error', 'Error al buscar reservaciones')
  }
}
const removeReservation = async (item) => {
  console.log('item:', item.id)
  try {
    await axios.delete(`http://${hostname}:3000/reservation/${item.id}`)
      showSnackbar('success', 'Reservación eliminada con éxito')
  } catch (error) {
    console.error('Error al eliminar la reservación:', error)
    showSnackbar('error', 'Error al eliminar la reservación')
  }
  try{
    await axios.post(`http://${hostname}:3000/Catalog/stockInc`, {
      id: item.book_id
    })
  } catch (error) {
    console.error('Error al actualizar el stock:', error)
    showSnackbar('error', 'Error al actualizar el stock')
  }
}
//OTHER METHODS

const addSellButt = (item) => {
      const newItem = {
        id: item.id,
        title: item.title,
        price: item.price || 0,
        isbn: item.isbn,
        amount: item.amount
      };

      if (item.amount === 0) {
        showSnackbar('error', 'Articulo sin existencia')
      } else if (currentSale.value.length > 0) {
        const exist = currentSale.value.some(item => item.id === newItem.id)
        if (exist) {
          const index = currentSale.value.findIndex(item => item.id === newItem.id)
          if (currentSale.value[index].amount < item.amount) {
            currentSale.value[index].amount += 1;
            currentSale.value.push(newItem);
          } else {
            showSnackbar('error', 'No hay suficiente stock');
          }
        } else {
          currentSale.value.push(newItem);
          showSnackbar('success', 'Artículo añadido a la venta');
        }
      } else {
        currentSale.value.push(newItem);
        showSnackbar('success', 'Artículo añadido a la venta');
      }
    }

    const addLendButt = (item) => {
      const newItem = {
        id: item.id,
        title: item.title,
        price: item.price || 0,
        isbn: item.isbn,
        amount: item.amount
      };

      if (item.amount === 0) {
        showSnackbar('error', 'Articulo sin existencia')
      } else if (currentlend.value.length > 0) {
        const exist = currentlend.value.some(item => item.id === newItem.id)
        if (exist) {
          const index = currentlend.value.findIndex(item => item.id === newItem.id)
          if (currentlend.value[index].amount < item.amount) {
            currentlend.value[index].amount += 1;
            currentlend.value.push(newItem);
          } else {
            showSnackbar('error', 'No hay suficiente stock');
          }
        } else {
          currentlend.value.push(newItem);
          showSnackbar('success', 'Artículo añadido al prestamo');
        }
      } else {
        currentlend.value.push(newItem);
        showSnackbar('success', 'Artículo añadido al prestamo');
      }
    }

    const addExchangeButt = (item) => {
      const newItem = {
        id: item.id,
        title: item.title,
        price: item.price || 0,
        isbn: item.isbn,
        amount: item.amount
      };

      if (item.amount === 0) {
        showSnackbar('error', 'Articulo sin existencia')
      } else if (currentExchange.value.length > 0) {
        const exist = currentExchange.value.some(item => item.id === newItem.id)
        if (exist) {
          const index = currentExchange.value.findIndex(item => item.id === newItem.id)
          if (currentExchange.value[index].amount < item.amount) {
            currentExchange.value[index].amount += 1;
            currentExchange.value.push(newItem);
          } else {
            showSnackbar('error', 'No hay suficiente stock');
          }
        } else {
          currentExchange.value.push(newItem);
          showSnackbar('success', 'Artículo añadido al trueuq');
        }
      } else {
        currentExchange.value.push(newItem);
        showSnackbar('success', 'Artículo añadido al trueque');
      }
    }

const searchArticles = async () => {
  try {
    const response = await axios.get(`http://${hostname}:3000/Catalog`)
    items.value = response.data;
    console.log(items.value)
  } catch (error) {
    console.error('Error al buscar artículos:', error)
    showSnackbar('error', 'Error al buscar artículos')
  }
}

const generateReport = async () => {
  try {
        const response = await axios.get(`http://${hostname}:3000/payments/excelDay`, {
          responseType: 'blob',
        });
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Corte de Caja.xlsx'); // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showSnackbar('success', 'Descargando');
      } catch (error) {
        console.error('Error exporting movements:', error);
        showSnackbar('error', 'Error al exportar reporte movimientos.');
      }
}

const formatField = (field) => {
  return field === null ? 'NA' : field
}

const showSnackbar = (color, message) => {
  snackbarColor.value = color;
  snackbarText.value = message;
  snackbar.value = true;
}
const createIsbn = () => {
    let base = '97884001'
    let unique = false;
    while (!unique) {
      let sec = Math.floor(Math.random() * 1000000);
      let isbn = base + sec;
      if (!items.value.find(item => item.isbn === isbn)) {
        unique = true;
        return isbn;
      }
    }
  }
const handleIsbnChange = () => {
      if (generateIsbn.value) {
        bookDialog.value.book.isbn = createIsbn();
      } else {
        bookDialog.value.book.isbn = '';
      }
  }
const openBookDialog = () => {
  bookDialog.value.show = true
}

const closeBookDialog = () => {
  bookDialog.value.show = false
  bookDialog.value.valid = false
  generateIsbn.value = false
  bookDialog.value.book = {
    isbn: '',
    title: '',
    author: '',
    editorial: '',
    edition: '',
    conditions: '',
    clasification: '',
    location: '',
    price: ''
  }
}

onMounted(() => {
  searchArticles()
  getClasifications()
  getDailyMovements()
  showReservations()
  globalUser.value = localStorage.getItem('name')
  console.log('globalUser:', globalUser.value)
})
</script>

<style scoped>
.v-btn {
  text-transform: none;
}

.na-text {
  color: #999;
  font-style: italic;
}
</style>