<template>
  <div class="custom-background">
    <v-container fluid class="pa-0">
      <v-toolbar dense class="flex-wrap">
        <v-toolbar-title class="text-center text-h6 flex-grow-1 mb-2 mb-sm-0">
          Beneficiarios
        </v-toolbar-title>
        
         <v-spacer class="d-none d-sm-block"></v-spacer>
        
        <!-- añadir button -->
        <v-dialog v-model="addDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn color="primary" class="ma-1 action-btn" small v-bind="activatorProps" title="añadir usuario">
            <v-icon left small class="d-sm-none">mdi-account-plus</v-icon>
            <span class="d-none d-sm-inline">Añadir</span>
            <v-icon right small class="d-none d-sm-inline">mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Añadir Beneficiario</v-card-title>
          <v-card-text class="Benerificiarie-info">
            <v-form ref="form" v-model="valid">
              <v-text-field
              v-model="newBenefiriaries.rsocial"
              label="Razon social"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-text-field
              v-model="newBenefiriaries.address"
              label="Direccion"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-text-field
              v-model="newBenefiriaries.contact"
              label="Nombre de contacto"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-text-field
              v-model="newBenefiriaries.number"
              :items="pago"
              label="Celular"
              :rules="[rules.required, rules.number]"
              required
              ></v-text-field>
              <v-text-field
              v-model="newBenefiriaries.program"
              :items="periodo"
              label="Nombre de programa"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-select
              v-model="newBenefiriaries.material"
              label="Tipo de material"
              :items="material"
              :rules="[rules.required]"
              required
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeAddDialog">Cerrar</v-btn>
            <v-btn color="primary" @click="addBenefirciaries">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Export button -->
    <v-dialog v-model="exportDialog" max-width="400">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn color="primary" class="ma-1 action-btn" small v-bind="activatorProps" title="Exportar Beneficiario">
          <v-icon left small class="d-sm-none">mdi-export</v-icon>
          <span class="d-none d-sm-inline">Exportar</span>
           <v-icon right small class="d-none d-sm-inline">mdi-export</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Exportart Beneficiarios a hoja de excel</v-card-title>
          <v-card-text class="Benerificiarie-info">
            <v-form ref="form" v-model="valid">
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn text @click="closeExportDialog">Cerrar</v-btn>
                <v-btn color="success" class="ma-1 action-btn" @click="exportBeneficiaries">
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
          :loading="loading"
          :items-per-page-options="[5, 10, 15, 20]"
          items-per-page-text="Beneficiaries per page"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td :class="{ 'na-text': item.id === null }">{{ formatField(item.id) }}</td>
              <td :class="{ 'na-text': item.rsocial === null }">{{ formatField(item.rsocial) }}</td>
              <td :class="{ 'na-text': item.address === null }">{{ formatField(item.address) }}</td>
              <td :class="{ 'na-text': item.contact === null }">{{ formatField(item.contact) }}</td>
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
              <td :class="{ 'na-text': item.program === null }">{{ formatField(item.program) }}</td>
              <td :class="{ 'na-text': item.material === null }">{{ formatField(item.material) }}</td>
              <td :class="{ 'na-text': item.registered === null }">{{ formatField(item.registered) }}</td>
              <td>
                <v-btn  small @click="editBeneficiaries(item)" title="Edit Benerificiarie" class="mx-1">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>

      <!-- Edit Benerificiarie Dialog -->
      <v-dialog v-model="editDialog" max-width="400">
        <v-card>
          <v-card-title>Añadir Beneficiario</v-card-title>
          <v-card-text class="Benerificiarie-info">
            <v-form ref="form" v-model="valid">
             <v-text-field
              v-model="editedBeneficiaries.rsocial"
              label="Razon social"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-text-field
              v-model="editedBeneficiaries.address"
              label="Direccion"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-text-field
              v-model="editedBeneficiaries.contact"
              label="Nombre de contacto"
              :rules="[rules.required]"
              required
              ></v-text-field>
              <v-text-field
                v-model="editedBeneficiaries.number"
                :items="pago"
                label="Celular"
                :rules="[rules.required, rules.number]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedBeneficiaries.program"
                :items="periodo"
                label="Nombre de programa"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-select
                v-model="editedBeneficiaries.material"
                label="Tipo de material"
                :items="material"
                :rules="[rules.required]"
                required
                ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeEditDialog">Cerrar</v-btn>
            <v-btn color="primary" @click="updateBeneficiarie">Guardar</v-btn>
            <v-btn color="error" @click="deleteBeneficiarie">Eliminar</v-btn>
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
  name: 'BeneficiariesPage',
  data() {
    return {
      search: '',
      newBenefiriaries: {
        rsocial: '',
        address: '',
        contact: '',
        number: '',
        program: '',
        material: '',
      },
      valid: false,
      addDialog: false,
      snackbar: false,
      editDialog: false,
      editValid: true,
      exportDialog: false,
      snackbarText: '',
      snackbarColor: '',
      material: ['Libros', 'Otros'],
      rules: {
        required: (value) => !!value || 'Requerido.',
        percentage: (value) => /^\d+$/.test(value) || 'Solo ingresar el número',
        email: (value) => { const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/
          return pattern.test(value) || 'Correo electrónico inválido.'
        },
        password: (value) => value.length >= 6 || 'Contraseña debe de tener al menos 6 caracteres.',
        number: (value) => /^\d+$/.test(value) || 'Solo se permiten números.',
      },
      editedBeneficiaries: {
        id: '',
        rsocial: '',
        address: '',
        contact: '',
        number: '',
        program: '',
        material: '',
        registered: '',
      },
      headers: [
        { title: 'ID', align: 'start', sortable: true, value: 'id' },
        { title: 'Razon social', align: 'start', sortable: true, value: 'rsocial' },        
        { title: 'Direccion', align: 'start', sortable: false, value: 'address' },
        { title: 'contacto', align: 'start', sortable: true, value: 'contact' },
        { title: 'Celular', align: 'center', sortable: true, value: 'number' },
        { title: 'Programa', align: 'start', sortable: false, value: 'program' },
        { title: 'material', align: 'start', sortable: false, value: 'meterial' },
        { title: 'Fecha de alta', align: 'start', sortable: true, value: 'registered' },

      ],
      items: [],
      loading: false,
    };
  },
  watch: {
    'editedBeneficiaries.type'(newType) {
      if (newType === 'moral') {
        this.editedBeneficiaries.name = null,
        this.editedBeneficiaries.fname = null;
      } else if (newType === 'fisica') {
        this.editedBeneficiaries.rsocial = null;
      }
    },
    'editedBeneficiaries.payment'(newPago) {
      if (newPago === 'efectivo') {
        this.editedBeneficiaries.account = null;
      }
    },
  },
  methods: {
    async showBeneficiaries() {
      this.loading = true;
      try {
        const response = await axios.get(`http://${hostname}:3000/beneficiaries`);
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching Beneficiaries:', error);
        this.$emit('show-snackbar', {
          color: 'error',
          message: 'Error al buscar beneficiarios.',
        });
      } finally {
        this.loading = false;
      }
    },
    async addBenefirciaries() {
      if (this.$refs.form.validate()) {
        //verificar si existe el usuario con el correo2
        this.newBenefiriaries.number = parseInt(this.newBenefiriaries.number, 10);
        try {
          await axios.post(`http://${hostname}:3000/beneficiaries`, this.newBenefiriaries);
          this.showSnackbar('success', 'Beneficiario añadido!');
          this.closeAddDialog();
          this.showBeneficiaries();
        } catch (error) {
          this.showSnackbar('error', 'Error al añadir.');
          this.showBeneficiaries();
        }
      }
    },
    async deleteBeneficiarie() {
      if (confirm('Esta seguro que quiere eliminar este beneficiario?')) {
        try {
          await axios.delete(`http://${hostname}:3000/beneficiaries/${this.editedBeneficiaries.id}`);
          this.showSnackbar('success', 'Usuario eliminado');
          this.closeEditDialog();
          this.showBeneficiaries();
        } catch (error) {
          console.error('Error deleting Benerificiarie:', error);
          this.showSnackbar('error', 'Error al eliminar.');
        }
      }
    },
    async updateBeneficiarie() {
          try {
            this.editedBeneficiaries.percentage = parseInt(this.editedBeneficiaries.percentage, 10);
            this.editedBeneficiaries.account = parseInt(this.editedBeneficiaries.account);
            await axios.post(`http://${hostname}:3000/beneficiaries/editBeneficiaries/${this.editedBeneficiaries.id}`, this.editedBeneficiaries);
            this.showSnackbar('success', 'Benerificiarie updated successfully');
            this.closeEditDialog();
            this.showBeneficiaries();
          } catch (error) {
            console.error('Error updating Benerificiarie:', error);
            this.showSnackbar('error', 'Error al editar usuario.');
            this.closeAddDialog();
        }
      },
      async exportBeneficiaries() {
      try {
        const response = await axios.get(`http://${hostname}:3000/beneficiaries/excel`, {
          responseType: 'blob',
        });

        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'beneficiaries.xlsx'); // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showSnackbar('success', 'Descargando');
        this.closeExportDialog();
      } catch (error) {
        console.error('Error exporting Beneficiaries:', error);
        this.showSnackbar('error', 'Error al exportar beneficiarios.');
      }
    },
    editBeneficiaries(Benerificiarie) {
      this.editedBeneficiaries = { ...Benerificiarie };
      this.editDialog = true;
    },
    closeAddDialog() {
      this.addDialog = false;
      this.$refs.form.reset();
    },
    closeExportDialog() {
      this.exportDialog = false;
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
    this.showBeneficiaries();
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