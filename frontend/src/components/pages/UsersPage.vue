<!-- PAGINA DE USUARIOS -->
<template>
  <div class="custom-background">
    <v-container fluid class="pa-0"><!-- tab bar -->
      <v-toolbar dense class="flex-wrap">
        <v-toolbar-title class="text-center text-h6 flex-grow-1 mb-2 mb-sm-0">
          Usuarios
        </v-toolbar-title>
        
        <v-spacer class="d-none d-sm-block"></v-spacer>
        
        <div class="d-flex flex-wrap justify-center justify-sm-end">
          <!-- ROLES -->
          <v-dialog max-width="600">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn color="primary" class="ma-1 action-btn" small v-bind="activatorProps" title="roles">
              <v-icon left small class="d-sm-none" >mdi-account-question</v-icon>
              <span class="d-none d-sm-inline">Roles</span>
              <v-icon right small class="d-none d-sm-inline">mdi-account-question</v-icon>
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card title="Roles">
              <v-card-text class="user-info">
                <p><strong>ADMINISTRADOR:</strong> este tipo de usuario tiene todos los permisos, y puede acceder al 
            panel de administracion</p>
            <p><strong>VENDEDOR:</strong> este tipo de usuario solo puede acceder al panel de venta
            y no puede hacer cambios en usuarios, pagos, pero si en el catalogo indirectamente</p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Cerrar" @click="isActive.value = false"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <!-- AÑADIR -->
        <v-dialog v-model="dialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn color="primary" class="ma-1 action-btn" small v-bind="activatorProps" title="añadir usuario">
            <v-icon left small class="d-sm-none">mdi-account-plus</v-icon>
            <span class="d-none d-sm-inline">Añadir</span>
            <v-icon right small class="d-none d-sm-inline">mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Añadir Usuario</v-card-title>
          <v-card-text class="user-info">
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="newUser.name"
                label="Nombre"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="newUser.email"
                label="Correo Electrónico"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                v-model="newUser.password"
                label="Contraseña"
                :rules="[rules.required, rules.password]"
                required
              ></v-text-field>
              <v-text-field
                v-model="newUser.number"
                label="Teléfono"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-select
                v-model="newUser.administrator"
                :items="roles"
                label="Rol"
                :rules="[rules.required]"
                required
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialog">Cerrar</v-btn>
            <v-btn color="primary" @click="addUser">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        </div>
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
            'items-per-page-text': 'Users per page',
          }"
          :loading="loading"
          loading-text="Loading users... Please wait"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td class="text-center">
                <v-chip
                  :color="item.administrator ? 'success' : 'error'"
                  small
                  label
                >
                  {{ item.administrator ? 'Si' : 'No' }}
                </v-chip>
              </td>
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
              <td>{{ item.password }}</td>
              <td>
                <v-btn  small @click="editUser(item)" title="Edit user" class="mx-1">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>

      <!-- Edit User Dialog -->
      <v-dialog v-model="editDialog" max-width="600">
        <v-card>
          <v-card-title>Editar usuario</v-card-title>
          <v-card-text class="user-info">
            <v-form ref="editForm" v-model="editValid">
              <v-text-field
                v-model="editedUser.name"
                label="Nombre"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedUser.email"
                label="Correo Electrónico"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedUser.number"
                label="Teléfono"
                :rules="[rules.required, rules.number]"
                required
              ></v-text-field>
              <v-select
                v-model="editedUser.administrator"
                :items="roles"
                label="Rol"
                :rules="[rules.required]"
                required
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeEditDialog">Cerrar</v-btn>
            <v-btn color="primary" @click="updateUser">Guardar</v-btn>
            <v-btn color="error" @click="deleteUser">Eliminar</v-btn>
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
  name: 'UsersPage',
  data() {
    return {
      search: '',
      newUser: {
        name: '',
        email: '',
        number: '',
        password: '',
        administrator: '',
      },
      dialog: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      roles: ['ADMINISTRADOR', 'VENDEDOR'],
      rules: {
        required: (value) => !!value || 'Requerido.',
        email: (value) => { const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/
          return pattern.test(value) || 'Correo electrónico inválido.'
        },
        password: (value) => value.length >= 6 || 'Contraseña debe de tener al menos 6 caracteres.',
        number: (value) => /^\d+$/.test(value) || 'Solo se permiten números.',
      },
      editDialog: false,
      editValid: true,
      editedUser: {
        id: Int8Array,
        name: '',
        email: '',
        number: '',
        administrator: '',
        password: '',
      },
      headers: [
        { title: 'ID', align: 'start', sortable: true, value: 'id' },
        { title: 'Name', align: 'start', sortable: true, value: 'name' },
        { title: 'Administrador', align: 'center', sortable: true, value: 'administrator' },
        { title: 'Email', align: 'start', sortable: false, value: 'email' },
        { title: 'Cellphone', align: 'start', sortable: false, value: 'number' },
        { title: 'Contraseña', align: 'start', sortable: false, value: 'number' },
      ],
      items: [],
      loading: false,
    };
  },
  methods: {
    async showUsers() {
      this.loading = true;
      try {
        const response = await axios.get(`http://${hostname}:3000/users`);
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        this.$emit('show-snackbar', {
          color: 'error',
          message: 'Error al buscar usuarios.',
        });
      } finally {
        this.loading = false;
      }
    },
    async addUser() {
      if (this.$refs.form.validate()) {
        //verificar si existe el usuario con el correo2
        this.newUser.administrator = this.newUser.administrator === 'ADMINISTRADOR';
        this.newUser.number = parseInt(this.newUser.number, 10);
        try {
          await axios.post(`http://${hostname}:3000/users`, this.newUser);
          this.showSnackbar('success', 'Usuario añadido!');
          this.closeDialog();
          this.showUsers();
        } catch (error) {
          this.showSnackbar('error', 'Error al añadir.');
          this.showUsers();
        }
      }
    },
    async deleteUser() {
      if (confirm('Esta seguro que quiere eliminar este usuario?')) {
        try {
          await axios.delete(`http://${hostname}:3000/users/${this.editedUser.id}`);
          this.showSnackbar('success', 'Usuario eliminado');
          this.closeEditDialog();
          this.showUsers();
        } catch (error) {
          console.error('Error deleting user:', error);
          this.showSnackbar('error', 'Error al eliminar.');
        }
      }
    },
    async updateUser() {
        if (this.$refs.editForm.validate()) {
          try {
            this.editedUser.administrator = this.editedUser.administrator === 'ADMINISTRADOR';
            this.editUser.number = parseInt(this.editUser.number, 10);
            await axios.post(`http://${hostname}:3000/users/editUser/${this.editedUser.id}`, this.editedUser);
            this.showSnackbar('success', 'User updated successfully');
            this.closeEditDialog();
            this.showUsers();
          } catch (error) {
            console.error('Error updating user:', error);
            this.showSnackbar('error', 'Error al editar usuario.');
            this.closeDialog();
          }
        }
      },
    editUser(user) {
      this.editedUser = { ...user };
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
    this.showUsers();
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
.user-info {
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.user-info p {
  margin: 0 0 10px;
  line-height: 1.5;
}

.user-info strong {
  color: #3f51b5;
}
</style>