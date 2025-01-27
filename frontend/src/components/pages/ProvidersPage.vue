<template>
  <div class="custom-background">
    <v-container fluid class="pa-0">
      <v-toolbar dense class="flex-wrap">
        <v-toolbar-title class="text-center text-h6 flex-grow-1 mb-2 mb-sm-0">
          Proveedores
        </v-toolbar-title>
        
        <v-spacer class="d-none d-sm-block"></v-spacer>
        
        <v-dialog v-model="dialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn color="primary" class="ma-1 action-btn" small v-bind="activatorProps" title="añadir usuario">
            <v-icon left small class="d-sm-none">mdi-account-plus</v-icon>
            <span class="d-none d-sm-inline">Añadir</span>
            <v-icon right small class="d-none d-sm-inline">mdi-account-plus</v-icon>
          </v-btn>
        </template>
        
        <!-- añadir button -->
        <v-card>
          <v-card-title>Añadir Provedor</v-card-title>
          <v-card-text class="Provider-info">
            <v-form ref="form" v-model="valid">
              <v-select
                v-model="newProvider.type"
                :items="tipo"
                label="Tipo de persona"
                :rules="[rules.required]"
                required
              ></v-select>
              <v-text-field
              v-if="newProvider.type === 'moral'"
              v-model="newProvider.rsocial"
              label="Razon social"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-text-field
              v-if="newProvider.type === 'fisica'"
              v-model="newProvider.name"
              label="Nombre"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-text-field
              v-if="newProvider.type === 'fisica'"
              v-model="newProvider.fname"
              label="Apellido"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-select
                v-model="newProvider.payment"
                :items="pago"
                label="Metodo de pago"
                :rules="[rules.required]"
                required
              ></v-select>
              <v-select
                v-model="newProvider.period"
                :items="periodo"
                label="Periodo"
                :rules="[rules.required]"
                required
              ></v-select>
              <v-text-field
                v-model="newProvider.percentage"
                label="Porcentaje"
                :rules="[rules.required, rules.percentage]"
                required
                ></v-text-field>
                <v-text-field
                v-if="newProvider.payment === 'tarjeta'"
                v-model="newProvider.account"
                label="Cuenta bancaria"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialog">Cerrar</v-btn>
            <v-btn color="primary" @click="addProvider">Guardar</v-btn>
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
          :loading="loading"
          :items-per-page-options="[5, 10, 15, 20]"
          items-per-page-text="Providers per page"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td :class="{ 'na-text': item.id === null }">{{ formatField(item.id) }}</td>
              <td :class="{ 'na-text': item.type === null }">{{ formatField(item.type) }}</td>
              <td :class="{ 'na-text': item.rsocial === null }">{{ formatField(item.rsocial) }}</td>
              <td :class="{ 'na-text': item.name === null }">{{ formatField(item.name) }}</td>
              <td :class="{ 'na-text': item.fname === null }">{{ formatField(item.fname) }}</td>
              <td :class="{ 'na-text': item.payment === null }">{{ formatField(item.payment) }}</td>
              <td :class="{ 'na-text': item.period === null }">{{ formatField(item.period) }}</td>
              <td :class="{ 'na-text': item.percentage === null }">{{ formatField(item.percentage) }}</td>
              <td :class="{ 'na-text': item.account === null }">{{ formatField(item.account) }}</td>
              <td>
                <v-btn  small @click="editProvider(item)" title="Edit Provider" class="mx-1">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>

      <!-- Edit Provider Dialog -->
      <v-dialog v-model="editDialog" max-width="600">
        <v-card>
          <v-card-title>Editar Proveedor</v-card-title>
          <v-card-text class="Provider-info">
            <v-form ref="form" v-model="editValid">
              <v-select
                v-model="editedProvider.type"
                :items="tipo"
                label="Tipo de persona"
                :rules="[rules.required]"
                required
              ></v-select>
              <v-text-field
              v-if="editedProvider.type === 'moral'"
              v-model="editedProvider.rsocial"
              label="Razon social"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-text-field
              v-if="editedProvider.type === 'fisica'"
              v-model="editedProvider.name"
              label="Nombre"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-text-field
              v-if="editedProvider.type === 'fisica'"
              v-model="editedProvider.fname"
              label="Apellido"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-select
                v-model="editedProvider.payment"
                :items="pago"
                label="Metodo de pago"
                :rules="[rules.required]"
                required
              ></v-select>
              <v-select
                v-model="editedProvider.period"
                :items="periodo"
                label="Periodo"
                :rules="[rules.required]"
                required
              ></v-select>
              <v-text-field
                v-model="editedProvider.percentage"
                label="Porcentaje"
                :rules="[rules.required, rules.percentage]"
                required
                ></v-text-field>
                <v-text-field
                v-if="editedProvider.payment === 'tarjeta'"
                v-model="editedProvider.account"
                label="Cuenta bancaria"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeEditDialog">Cerrar</v-btn>
            <v-btn color="primary" @click="updateProvider">Guardar</v-btn>
            <v-btn color="error" @click="deleteProvider">Eliminar</v-btn>
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
const hostname = window.location.hostname
export default {
  name: 'ProvidersPage',
  data() {
    return {
      search: '',
      newProvider: {
        rsocial: '',
        name: '',
        fname: '',
        type: '',
        payment: '',
        period: '',
        percentage: '',
        account: '',
      },
      dialog: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      tipo: ['moral', 'fisica'],
      pago:['tarjeta', 'efectivo'],
      periodo:['mensual', 'semanal', 'anual'],
      rules: {
        required: (value) => !!value || 'Requerido.',
        percentage: (value) => /^\d+$/.test(value) || 'Solo ingresar el número',
        email: (value) => { const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/
          return pattern.test(value) || 'Correo electrónico inválido.'
        },
        password: (value) => value.length >= 6 || 'Contraseña debe de tener al menos 6 caracteres.',
        number: (value) => /^\d+$/.test(value) || 'Solo se permiten números.',
      },
      editDialog: false,
      editValid: true,
      editedProvider: {
        id: '',
        rsocial: '',
        name: '',
        fname: '',
        type: '',
        payment: '',
        period: '',
        percentage: '',
        account: '',
      },
      headers: [
        { title: 'ID', align: 'start', sortable: true, value: 'id' },
        { title: 'tipo de persona', align: 'start', sortable: false, value: 'type' },
        { title: 'Razòn social', align: 'start', sortable: true, value: 'rsocial' },        
        { title: 'Nombre', align: 'start', sortable: true, value: 'name' },
        { title: 'Apellido', align: 'center', sortable: true, value: 'fname' },
        { title: 'Pago', align: 'start', sortable: false, value: 'payment' },
        { title: 'Periodo', align: 'start', sortable: false, value: 'period' },
        { title: '% por producto', align: 'start', sortable: true, value: 'percentage' },
        { title: 'Cuenta', align: 'start', sortable: true, value: 'account' },

      ],
      items: [],
      loading: false,
    };
  },
  watch: {
    'editedProvider.type'(newType) {
      if (newType === 'moral') {
        this.editedProvider.name = null,
        this.editedProvider.fname = null;
      } else if (newType === 'fisica') {
        this.editedProvider.rsocial = null;
      }
    },
    'editedProvider.payment'(newPago) {
      if (newPago === 'efectivo') {
        this.editedProvider.account = null;
      }
    },
  },
  methods: {
    async showProviders() {
      this.loading = true;
      try {
        const response = await axios.get(`http://${hostname}:3000/providers`);
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching Providers:', error);
        this.$emit('show-snackbar', {
          color: 'error',
          message: 'Error al buscar usuarios.',
        });
      } finally {
        this.loading = false;
      }
    },
    async addProvider() {
      if (this.$refs.form.validate()) {
        //verificar si existe el usuario con el correo2
        this.newProvider.administrator = this.newProvider.administrator === 'ADMINISTRADOR';
        this.newProvider.number = parseInt(this.newProvider.number, 10);
        try {
          await axios.post(`http://${hostname}:3000/providers`, this.newProvider);
          this.showSnackbar('success', 'Usuario añadido!');
          this.closeDialog();
          this.showProviders();
        } catch (error) {
          this.showSnackbar('error', 'Error al añadir.');
          this.showProviders();
        }
      }
    },
    async deleteProvider() {
      if (confirm('Esta seguro que quiere eliminar este usuario?')) {
        try {
          await axios.delete(`http://${hostname}:3000/providers/${this.editedProvider.id}`);
          this.showSnackbar('success', 'Usuario eliminado');
          this.closeEditDialog();
          this.showProviders();
        } catch (error) {
          console.error('Error deleting Provider:', error);
          this.showSnackbar('error', 'Error al eliminar.');
        }
      }
    },
    async updateProvider() {
          try {
            this.editedProvider.percentage = parseInt(this.editedProvider.percentage, 10);
            this.editedProvider.account = parseInt(this.editedProvider.account);
            await axios.post(`http://${hostname}:3000/providers/editProvider/${this.editedProvider.id}`, this.editedProvider);
            this.showSnackbar('success', 'Provider updated successfully');
            this.closeEditDialog();
            this.showProviders();
          } catch (error) {
            console.error('Error updating Provider:', error);
            this.showSnackbar('error', 'Error al editar usuario.');
            this.closeDialog();
        }
      },
    editProvider(Provider) {
      this.editedProvider = { ...Provider };
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
  },
  mounted() {
    this.showProviders();
  },
  computed: {
    formatField() {
      return (field) => {
        return field === null ? 'NA' : field;
      };
    },
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
  color: red; /* Change this to your desired color */
}
</style>