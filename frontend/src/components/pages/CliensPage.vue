<template>
  <div class="custom-background">
    <v-container fluid class="pa-0">
      <v-toolbar dense class="flex-wrap">
        <v-toolbar-title class="text-center text-h6 flex-grow-1 mb-2 mb-sm-0">
          Clientes
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
        <v-card>
          <v-card-title>Añadir Cliente</v-card-title>
          <v-card-text class="Client-info">
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="newClient.name"
                label="Nombre"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="newClient.email"
                label="Correo Electrónico"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                v-model="newClient.number"
                label="Celular"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-select
                v-model="newClient.preferences"
                :items="preferences"
                label="Preferencias"
                :rules="[rules.required]"
                required
              ></v-select>
              <v-select
                v-model="newClient.intern"
                :items="interno"
                label="Interno o externo"
                :rules="[rules.required]"
                required
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialog">Cerrar</v-btn>
            <v-btn color="primary" @click="addClient">Guardar</v-btn>
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
            'items-per-page-text': 'Clients per page',
          }"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>
                <a :href="`mailto:${item.email}`" class="text-decoration-none">
                  {{ item.email }}
                </a>
              </td>
              <td>
                <v-btn
                  small
                  outlined
                  color="primary"
                  :href="`tel:${item.number}`"
                  class="px-2"
                >
                  <v-icon left small>mdi-phone</v-icon>
                  {{ item.number }}
                </v-btn>
              </td>
              <td>{{ item.preferences }}</td>
              <td class="text-center">
                <v-chip
                  :color="item.intern ? 'success' : 'error'"
                  small
                  label
                >
                  {{ item.intern ? 'Si' : 'No' }}
                </v-chip>
              </td>
              <td>
                <v-btn  small @click="editClient(item)" title="Edit Client" class="mx-1">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <!-- Edit Client Dialog -->
      <v-dialog v-model="editDialog" max-width="600">
        <v-card>
          <v-card-title>Editar usuario</v-card-title>
          <v-card-text class="Client-info">
            <v-form ref="editForm" v-model="editValid">
              <v-text-field
                v-model="editedClient.name"
                label="Nombre"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedClient.email"
                label="Correo Electrónico"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedClient.number"
                label="Teléfono"
                :rules="[rules.required, rules.number]"
                required
              ></v-text-field>
              <v-select
                v-model="editedClient.preferences"
                :items="preferences"
                label="Preferencias"
                :rules="[rules.required]"
                required
              ></v-select>
              <v-select
                v-model="editedClient.intern"
                :items="interno"
                label="Interno"
                :rules="[rules.required]"
                required
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeEditDialog">Cerrar</v-btn>
            <v-btn color="primary" @click="updateClient">Guardar</v-btn>
            <v-btn color="error" @click="deleteClient">Eliminar</v-btn>
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
  name: 'ClientsPage',
  data() {
    return {
      search: '',
      newClient: {
        name: '',
        email: '',
        number: '',
        preferences: '',
        intern: '',
      },
      dialog: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      preferences: ['Ficcion', 'no ficcion', 'tecnicas' ],
      interno: ['interno', 'externo'],
      rules: {
        required: (value) => !!value || 'Requerido.',
        email: (value) => { const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/
          return pattern.test(value) || 'Correo electrónico inválido.'
        },
        number: (value) => /^\d+$/.test(value) || 'Solo se permiten números.',
      },
      editDialog: false,
      editValid: true,
      editedClient: {
        id: Int8Array,
        name: '',
        email: '',
        number: '',
        intern: '',
        preferences: '',
      },
      headers: [
        { title: 'ID', align: 'start', sortable: true, value: 'id' },
        { title: 'Name', align: 'start', sortable: true, value: 'name' },
        { title: 'Email', align: 'start', sortable: false, value: 'email' },
        { title: 'Cel', align: 'start', sortable: false, value: 'number' },
        { title: 'Preferencias', align: 'start', sortable: false, value: 'preferences' },
        { title: 'Interno', align: 'center', sortable: true, value: 'intern' },
      ],
      items: [],
      loading: false,
    };
  },
  methods: {
    async showClients() {
      this.loading = true;
      try {
        const response = await axios.get(`http://${hostname}:3000/clients`);
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching Clients:', error);
        this.$emit('show-snackbar', {
          color: 'error',
          message: 'Error al buscar usuarios.',
        });
      } finally {
        this.loading = false;
      }
    },
    async addClient() {
      if (this.$refs.form.validate()) {
        //verificar si existe el usuario con el correo2
        this.newClient.intern = this.newClient.intern === 'interno';
        this.newClient.number = parseInt(this.newClient.number, 10);
        try {
          await axios.post(`http://${hostname}:3000/clients`, this.newClient);
          this.showSnackbar('success', 'Usuario añadido!');
          this.closeDialog();
          this.showClients();
        } catch (error) {
          this.showSnackbar('error', 'Error al añadir.');
          this.showClients();
        }
      }
    },
    async deleteClient() {
        try {
          await axios.delete(`http://${hostname}:3000/clients/${this.editedClient.id}`);
          this.showSnackbar('success', 'Usuario eliminado');
          this.closeEditDialog();
          this.showClients();
        } catch (error) {
          console.error('Error deleting Client:', error);
          this.showSnackbar('error', 'Error al eliminar.');
        }
    },
    async updateClient() {
        if (this.$refs.editForm.validate()) {
          try {
            this.editedClient.intern = this.editedClient.intern === 'interno';
            this.editedClient.number = parseInt(this.editedClient.number, 10);
            await axios.post(`http://${hostname}:3000/clients/editClient/${this.editedClient.id}`, this.editedClient);
            this.showSnackbar('success', 'Client updated successfully');
            this.closeEditDialog();
            this.showClients();
          } catch (error) {
            console.error('Error updating Client:', error);
            this.showSnackbar('error', 'Error al editar usuario.');
            this.closeDialog();
          }
        }
      },
    editClient(client) {
      this.editedClient = { ...client };
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
    this.showClients();
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
</style>