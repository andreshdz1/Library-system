<template>
  <div class="custom-background">
    <v-container fluid class="pa-0">
      <v-toolbar dense class="flex-wrap">
        <v-toolbar-title class="text-center text-h6 flex-grow-1 mb-2 mb-sm-0">
          Pagos y movimientos
        </v-toolbar-title>
        
        <v-spacer class="d-none d-sm-block"></v-spacer>
       <!-- comisines button -->
       <v-dialog v-model="comisionsDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn color="primary" class="ma-1 action-btn" small v-bind="activatorProps" title="Comisiones">
            <v-icon left small class="d-sm-none">mdi-file-chart</v-icon>
            <span class="d-none d-sm-inline">Comisiones</span>
            <v-icon right small class="d-none d-sm-inline">mdi-file-chart</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Comisiones</v-card-title>
          <v-card-text>
              <v-checkbox
                label="todos los usuarios"
                v-model="radioSelected"
                @change="toggleSelectStatus"
              ></v-checkbox>
              <v-select
                :items="users"
                label="seleccionar un usuario"
                v-model="UserSelected"
                :disabled="radioSelected"
                @change="handleSelectedUser"
              ></v-select>
              <div class="d-flex justify-center">
                <v-date-input
                  v-model="dateRange"
                  label="Selecciona un rango de fechas"
                  max-width="368"
                  multiple="range"
                ></v-date-input>
              </div>
            <p v-if="(radioSelected || UserSelected) && dateRange.length > 0">
              Rango de fechas<br>
              {{ formatDateRange(dateRange) }}
            </p>
            <p>Total de ventas: ${{ calculatedCommission.total }} <br>Comisión: ${{ calculatedCommission.comision }}</p>
            </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeComDialog">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Export button -->
    <v-dialog v-model="exportDialog" max-width="400">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn color="primary" class="ma-1 action-btn" small v-bind="activatorProps" title="Exportar Beneficiario">
          <v-icon left small class="d-sm-none">mdi-account-cash</v-icon>
          <span class="d-none d-sm-inline">Generar reporte</span>
           <v-icon right small class="d-none d-sm-inline">mdi-account-cash</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Generar reporte</v-card-title>
          <v-card-text class="Benerificiarie-info">
            <v-form ref="form" v-model="valid">
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn text @click="closeExportDialog">Cerrar</v-btn>
                <v-btn color="success" class="ma-1 action-btn" @click="exportMovements">
                <v-icon left small>mdi-file-excel</v-icon>
                Guardar
                </v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
      </v-toolbar>
      <!-- data table -->
      <v-card class="elevation-1 mt-4">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [5, 10, 15, 20],
            'items-per-page-text': 'movimientos por pagina',
          }"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td :class="{ 'na-text': item.id === null }">{{ formatField(item.id) }}</td>
              <td :class="{ 'na-text': item.article === null }">{{ formatField(item.article) }}</td>
              <td :class="{ 'na-text': item.transaction_type === null }">{{ formatField(item.transaction_type) }}</td>
              <td :class="{ 'na-text': item.total === null }">{{ formatField(item.total) }}</td>
              <td :class="{ 'na-text': item.user_name === null }">{{ formatField(item.user_name) }}</td>
              <td :class="{ 'na-text': item.date === null }">{{ formatField(item.date) }}</td>
              <td :class="{ 'na-text': item.title === null }">{{ formatField(item.title) }}</td>
              <td :class="{ 'na-text': item.isbn === null }">{{ formatField(item.isbn) }}</td>
              <td :class="{ 'na-text': item.id_article === null }">{{ formatField(item.id_article) }}</td>
              <td :class="{ 'na-text': item.clients === null }">{{ formatField(item.clients) }}</td>
              <td>
                <v-btn  small @click="editMovement(item)" title="Edit Benerificiarie" class="mx-1">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>

      <!-- Edit payment Dialog -->
      <v-dialog v-model="editDialog" max-width="600">
        <v-card>
          <v-card-title>Editar Movimiento</v-card-title>
          <v-card-text class="Provider-info">
            <v-form ref="form" v-model="editValid">
              <v-select
              v-model="editedMovement.article"
              :items="types"
              label="Tipo de articulo"
              :rules="[rules.required]"
              required
              ></v-select>
              <v-text-field
              v-model="editedMovement.transaction_type"
              label="Tipo de movimiento"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-text-field
              v-model="editedMovement.total"
              label="Total"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-select
                v-model="editedMovement.user_name"
                label="Usuario"
                :rules="[rules.required]"
                :items="users"
                required
                ></v-select>
              <v-text-field
                v-if="editedMovement.article === 'libro'"
                v-model="editedMovement.title"
                label="Titulo de libro"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
              v-if="editedMovement.article === 'libro'"
                v-model="editedMovement.isbn"
                label="ISBN"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
              v-if="editedMovement.article === 'articulo'"
                v-model="editedMovement.id_article"
                label="Id de articulo"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedMovement.clients"
                label="Cliente"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeEditDialog">Cerrar</v-btn>
            <v-btn color="primary" @click="updateMovement">Guardar</v-btn>
            <v-btn color="error" @click="deleteMovement">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Snackbar for notifications -->
      <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="4000">
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import { VDateInput } from 'vuetify/labs/VDateInput'
import { format } from 'date-fns';
const hostname = window.location.hostname

export default {
  name: 'PayloadsComisions',  
  data() {
    return {
      search: '',
      newMovement: {
        article: '',
        transaction_type: '',
        total: '',
        user: '',
        payment: '',
        date: '',
        title: '',
        isbn: '',
        id_article: '',
        clients: '',
      },
      valid: false,
      addDialog: false,
      snackbar: false,
      editDialog: false,
      editValid: true,
      exportDialog: false,
      comisionsDialog: false,
      snackbarText: '',
      snackbarColor: '',
      types: ['articulo', 'libro'],
      radioSelected: false,
      users: [],
      dateRange: [],
      UserSelected: null, // Updated: UserSelected initialized
      rules: {
        required: (value) => !!value || 'Requerido.',
        percentage: (value) => /^\d+$/.test(value) || 'Solo ingresar el número',
      },
      editedMovement: {
        id: '',
        article: '',
        transaction_type: '',
        total: '',
        user: '',
        payment: '',
        date: '',
        title: '',
        isbn: '',
        id_article: '',
        clients: '',     
      },
      headers: [
        { title: 'ID', align: 'start', sortable: true, value: 'id' },
        { title: 'Articulo', align: 'start', sortable: false, value: 'article' },
        { title: 'Tipo de movimiento', align: 'start', sortable: true, value: 'transaction_type' },        
        { title: 'Total', align: 'start', sortable: true, value: 'total' },
        { title: 'Usuario', align: 'start', sortable: true, value: 'user_name' },
        { title: 'Fecha', align: 'start', sortable: true, value: 'date' },
        { title: 'Titulo', align: 'start', sortable: false, value: 'title' },
        { title: 'ISBN', align: 'start', sortable: false, value: 'isbn' },
        { title: 'Id de articulo', align: 'start', sortable: true, value: 'id_article' },
        { title: 'Cliente', align: 'start', sortable: false, value: 'clients' },
      ],
      items: [],
      loading: false,
    };
  },
  watch: {
    'editedMovement.title'(newType) {
      if (this.editedMovement.id_article !== null) {
        this.editedMovement.title = null,
        this.editedMovement.isbn = null;
      } else if (newType === 'fisica') {
        this.editedMovement.rsocial = null;
      }
    },
    'editedMovement.payment'(newPago) {
      if (newPago === 'efectivo') {
        this.editedMovement.account = null;
      }
    },
  },
  methods: {
    async showMovements() {
      this.loading = true;
      try {
      const response = await axios.get(`http://${hostname}:3000/payments`);
      this.items = response.data;
      this.users = [...new Set(response.data.map(item => item.user_name))];
      } catch (error) {
      console.error('Error fetching payments:', error);
      this.$emit('show-snackbar', {
        color: 'error',
        message: 'Error al buscar pagos.',
      });
      } finally {
      this.loading = false;
      }
    },
    async addMovement() {
      if (this.$refs.form.validate()) {
        try {
          await axios.post(`http://${hostname}:3000/payments`, this.newMovement);
          this.showSnackbar('success', 'Movimiento añadido!');
          this.closeDialog();
          this.showMovements();
        } catch (error) {
          this.showSnackbar('error', 'Error al añadir.');
          this.showMovements();
        }
      }
    },
    async deleteMovement() {
      if (confirm('Esta seguro que quiere eliminar esta entrada?')) {
        try {
          await axios.delete(`http://${hostname}:3000/payments/${this.editedMovement.id}`);
          this.showSnackbar('success', 'Movimiento eliminado');
          this.closeEditDialog();
          this.showMovements();
        } catch (error) {
          console.error('Error deleting movement:', error);
          this.showSnackbar('error', 'Error al eliminar.');
        }
      }
    },
    async updateMovement() {
          try {
            await axios.put (`http://${hostname}:3000/payments/${this.editedMovement.id}`, this.editedMovement);
            this.showSnackbar('success', 'Movement updated successfully');
            this.closeEditDialog();
            this.showMovements();
          } catch (error) {
            console.error('Error updating movement:', error);
            this.showSnackbar('error', 'Error al editar movimiento.');
            this.closeDialog();
        }
      },
      async exportMovements() {
      try {
        const response = await axios.get(`http://${hostname}:3000/payments/excel`, {
          responseType: 'blob',
        });

        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Movimientos.xlsx'); // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showSnackbar('success', 'Descargando');
        this.closeExportDialog();
      } catch (error) {
        console.error('Error exporting movements:', error);
        this.showSnackbar('error', 'Error al exportar reporte movimientos.');
      }
    },
    editMovement(Movement) {
      this.editedMovement = { ...Movement };
      this.editDialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    showSnackbar(color, message) {
      this.snackbarColor = color;
      this.snackbarText = message;
      this.snackbar = true;
    },
    closeExportDialog() {
      this.exportDialog = false;
      this.$refs.form.reset();
    },
    closeComDialog() {
      this.comisionsDialog = false;
      this.resetForm();
    },
    resetForm() {
      this.radioSelected = false;
      this.UserSelected = null; // Updated: Reset UserSelected
    },
    toggleSelectStatus(){
      if(this.radioSelected){
        this.UserSelected = null // Updated: Reset UserSelected
      }
    }, 
    handleSelectedUser() { // Updated handleSelectedUser method
      console.log('Selected user:', this.UserSelected);
    },
    formatDateRange(range) {
      let size = range.length;
      if (range.length === 0) return '';
      if (range.length === 1) {
        return format(new Date(range[0]), 'yyyy-MM-dd');
      }
      return `${format(new Date(range[0]), 'yyyy-MM-dd')} - ${format(new Date(range[size-1]), 'yyyy-MM-dd')}`;
    },
    calcComisions() {
      if (!this.dateRange.length || (!this.UserSelected && !this.radioSelected)) {
        return 0; // Return 0 if date range or user selection is not set
      }
      let size = this.dateRange.length;
      const startDate = new Date(this.dateRange[0]);
      const endDate = this.dateRange.length > 1 ? new Date(this.dateRange[size-1]) : new Date(this.dateRange[0]);
      let totalByDate = {};

      this.items.forEach(item => {
        const itemDate = new Date(item.date);
        if (itemDate >= startDate && itemDate <= endDate) {
          if (this.radioSelected || item.user_name === this.UserSelected) {
              const dateKey = itemDate.toISOString().split('T')[0]; // Use date as key
              if (!totalByDate[dateKey]) {
                totalByDate[dateKey] = 0;
              }
              totalByDate[dateKey] += parseFloat(item.total) || 0;
            }
        }
      });

      // Sum up all daily totals
      const total = Object.values(totalByDate).reduce((sum, dailyTotal) => sum + dailyTotal, 0);
      const comision = total * 0.1 //10 de comision
      return {total, comision};
    },

  },
  mounted() {
    this.showMovements();
},
  computed: {
    formatField() {
      return (field) => {
        return field === null ? 'NA' : field;
      };
    },
    calculatedCommission() {
      return this.calcComisions();
    },
  },
  components: {
    VDateInput,
  },
};
</script>

<style scoped>
.custom-background {
  background-color: #c8d5db23; /* Light gray background */
  min-height: 100vh; /* Ensure the background covers the full viewport height */
}

.v-toolbar {
  background-color: #ffffff;
}

.action-btn {
  text-transform: none;
}

.v-data-table ::v-deep .v-data-table__wrapper {
  overflow-x: auto;
}

.v-data-table ::v-deep .v-data-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.v-data-table ::v-deep .v-data-table-header {
  background-color: #f5f5f5;
}

.v-data-table ::v-deep .v-data-table-header th {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.v-data-table ::v-deep .v-data-table__wrapper tbody tr:nth-of-type(even) {
  background-color: #f9f9f9;
}

.v-data-table ::v-deep .v-data-table__wrapper tbody tr:hover {
  background-color: #e8f0fe;
}

@media (max-width: 600px) {
  .v-btn {
    min-width: 0;
    padding: 0 8px;
  }
}
.na-text {
  color: red; 
}
</style>

