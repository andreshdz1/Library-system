<template>
  <div class="custom-background">
    <v-container fluid class="pa-0">
      <v-toolbar dense class="flex-wrap">
        <v-toolbar-title class="text-center text-h6 flex-grow-1 mb-2 mb-sm-0">
          Catalogo
        </v-toolbar-title>
        
        <v-spacer class="d-none d-sm-block"></v-spacer>
        <v-dialog v-model="QueueDialog" max-width="600" v-if="Queue && Queue.length">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn color="primary" class="ma-1 action-btn" small v-bind="activatorProps" title="Editar libros en cola">
            <v-icon left small class="d-sm-none">mdi-book-alert</v-icon>
              <span class="d-none d-sm-inline">Libros en cola</span>
            <v-icon right small class="d-none d-sm-inline">mdi-book-alert</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Libros en cola</v-card-title>
            <v-card-text class="Client-info">
              <v-data-table
                :headers="headers"
                :items="Queue"
                :search="search"
                :items-per-page="10"
                :footerProps="false"
              >
              <template v-slot:item="{ item }">
                  <tr>
                    <td :class="{ 'na-text': item.id === null }">{{ formatField(item.id) }}</td>
                    <td :class="{ 'na-text': item.isbn === null }">{{ formatField(item.isbn) }}</td>
                    <td :class="{ 'na-text': item.title === null }">{{ formatField(item.title) }}</td>
                    <td :class="{ 'na-text': item.author === null }">{{ formatField(item.author) }}</td>
                    <td :class="{ 'na-text': item.editorial === null }">{{ formatField(item.editorial) }}</td>
                    <td :class="{ 'na-text': item.edition === null }">{{ formatField(item.edition) }}</td>
                    <td :class="{ 'na-text': item.conditions === null }">{{ formatField(item.conditions) }}</td>
                    <td :class="{ 'na-text': item.clasification === null }">{{ formatField(item.clasification) }}</td>
                    <td :class="{ 'na-text': item.location === null }">{{ formatField(item.location) }}</td>
                    <td :class="{ 'na-text': item.amount === null }">{{ formatField(item.amount) }}</td>
                    <td :class="{ 'na-text': item.price === null }">{{ formatField(item.price) }}</td>
                    <td>
                      <v-btn  small @click="editCatalog(item)" title="Edit Benerificiarie" class="mx-1">
                        <v-icon small>mdi-pencil</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
            <v-btn text @click="closeQueue">Cerrar</v-btn>
        </v-card>
        </v-dialog>
        <!-- añadir libro button -->
        <v-dialog v-model="booksDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn color="primary" class="ma-1 action-btn" small v-bind="activatorProps" title="añadir libro">
            <v-icon left small class="d-sm-none">mdi-book-plus</v-icon>
            <span class="d-none d-sm-inline">Añadir libro</span>
            <v-icon right small class="d-none d-sm-inline">mdi-book-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Añadir libro</v-card-title>
          <v-card-text class="Client-info">
            <v-form ref="form" v-model="valid">
              <v-checkbox
                label="Asignar isbn"
                v-model="generateIsbn"
                @change="handleIsbnChange"
              ></v-checkbox>
              <v-text-field
                v-model="newBook.isbn"
                label="ISBN"
                :disabled="generateIsbn"
                :rules="[rules.number]"
                required
              ></v-text-field>
              <v-text-field
                v-model="newBook.title"
                label="Titulo"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="newBook.author"
                label="Autor"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="newBook.editorial"
                label="Editorial"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
              v-model="newBook.edition"
              label="Edicion"
              ></v-text-field>
              <v-select
              v-model="newBook.conditions"
              label="Condiciones"
              :items=condiciones
              ></v-select>
              <v-select
              v-model="newBook.clasification"
              label="clasificacion"
              :items="categoryClasses"
              ></v-select>
              <v-text-field
              v-model="newBook.location"
              label="Ubicacion"
              ></v-text-field>
              <v-text-field
              v-model="newBook.price"
              label="precio $"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeBooksDialog">Cerrar</v-btn>
            <v-btn color="primary" @click="addCatalog">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

       <!-- añadir categoria button -->
       <v-dialog v-model="catDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn color="primary" class="ma-1 action-btn" small v-bind="activatorProps" title="añadir libro">
            <v-icon left small class="d-sm-none">mdi-plus-minus-box</v-icon>
            <span class="d-none d-sm-inline">Categorias</span>
            <v-icon right small class="d-none d-sm-inline">mdi-plus-minus-box</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Categorias </v-card-title>
          <v-card-text class="Client-info">
            <v-form ref="form" v-model="valid">
              <v-select
                v-model="editedCategory.class"
                label="Categorias existentes"
                :items="categoryClasses"
              ></v-select>
              ¿Que desea hacer con esta categoria?
              <v-radio-group v-model="radioSelected">
                <v-radio label="Eliminar" value="eliminar"></v-radio>
              </v-radio-group>
            </v-form>
            <v-text-field
              v-if="categoryEdited && radioSelected === 'editar'"
              v-model="newCategory"
              label="Nuevo nombre de categoria"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-divider></v-divider>
            <div v-if="!categoryEdited && !radioSelected">
              Añadir nueva categoria:
              <v-text-field
                v-model="newCategory.class"
                label="Nombre de categoria"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="newCategory.location"
                label="Ubicacion"
                :rules="[rules.required]"
                required
              ></v-text-field>

            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeCatDialog">Cerrar</v-btn>
            <v-btn color="error" @click="deleteCategory"  v-if="radioSelected === 'eliminar'">Eliminar</v-btn>
            <v-btn color="primary" @click="addCategory" v-if="!radioSelected && newCategory">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
       <!-- Backup button -->
       <v-btn color="primary" class="ma-1 action-btn" small @click="createBackup" title="Crear Respaldo">
        <v-icon left small class="d-sm-none">mdi-database-export</v-icon>
        <span class="d-none d-sm-inline">Crear respaldo</span>
        <v-icon right small class="d-none d-sm-inline">mdi-database-export</v-icon>
      </v-btn>

      <!-- Restore button -->
      <v-btn color="primary" class="ma-1 action-btn" small @click="restoreBackup" title="Restaurar respaldo">
        <v-icon left small class="d-sm-none">mdi-database-import</v-icon>
        <span class="d-none d-sm-inline">Restaurar respaldo</span>
        <v-icon right small class="d-none d-sm-inline">mdi-database-import</v-icon>
      </v-btn>
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

        <!-- TABLE -->
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [5, 10, 15, 20],
            'items-per-page-text': 'articulos por pagina',
          }"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td :class="{ 'na-text': item.id === null }">{{ formatField(item.id) }}</td>
              <td :class="{ 'na-text': item.isbn === null }">{{ formatField(item.isbn) }}</td>
              <td :class="{ 'na-text': item.title === null }">{{ formatField(item.title) }}</td>
              <td :class="{ 'na-text': item.author === null }">{{ formatField(item.author) }}</td>
              <td :class="{ 'na-text': item.editorial === null }">{{ formatField(item.editorial) }}</td>
              <td :class="{ 'na-text': item.edition === null }">{{ formatField(item.edition) }}</td>
              <td :class="{ 'na-text': item.conditions === null }">{{ formatField(item.conditions) }}</td>
              <td :class="{ 'na-text': item.clasification === null }">{{ formatField(item.clasification) }}</td>
              <td :class="{ 'na-text': item.location === null }">{{ formatField(item.location) }}</td>
              <td :class="{ 'na-text': item.amount === null }">{{ formatField(item.amount) }}</td>
              <td :class="{ 'na-text': item.price === null }">{{ formatField(item.price) }}</td>
              <td>
                <v-btn  small @click="editCatalog(item)" title="Edit Benerificiarie" class="mx-1">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <!-- Edit Book Dialog -->
      <v-dialog v-model="editDialog" max-width="600">
        <v-card>
          <v-card-title>Editar libro</v-card-title>
          <v-card-text class="Client-info">
            <v-form ref="editForm" v-model="editValid">
              <v-text-field
                v-model="editedBook.isbn"
                label="ISBN"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedBook.title"
                label="Titulo"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedBook.author"
                label="Autor"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedBook.editorial"
                label="Editorial"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedBook.edition"
                label="Edicion"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-select
                v-model="editedBook.conditions"
                :items="condiciones"
                label="Condiciones"
                :rules="[rules.required]"
                required
              ></v-select>
              <v-select
                v-model="editedBook.clasification"
                :items="categoryClasses"
                label="Clasificacion"
                :rules="[rules.required]"
                required
              ></v-select>
              <v-text-field
                v-model="editedBook.location"
                label="Ubicacion"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedBook.amount"
                label="Stock"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedBook.price"
                label="Precio"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeEditDialog">Cerrar</v-btn>
            <v-btn color="primary" @click="updateCatalog">Guardar</v-btn>
            <v-btn color="error" @click="deleteCatalog">Eliminar</v-btn>
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
      newBook: {
        isbn: '',
        title: '',
        author: '',
        editorial: '',
        edition: '',
        conditions: '',
        clasification: '',
        location: '',
        amount: '1',
        price: '',
      },
      condiciones:['Excelentes Condiciones', 'Buena', 'Poco maltratado', 'Maltratado'],
      dialog: false,
      snackbar: false,
      radioSelected: false,
      booksDialog: false,
      QueueDialog: false,
      catDialog: false,
      snackbarText: '',
      snackbarColor: '',
      rules: {
        required: (value) => !!value || 'Requerido.',
        number: (value) => /^\d+$/.test(value) || 'Solo se permiten números.',
      },
      editDialog: false,
      editValid: true,
      editedBook: {
        isbn: '',
        title: '',
        author: '',
        editorial: '',
        edition: '',
        conditions: '',
        clasification: '',
        location: '',
        amount: '',
        price: '',
        queue: false,
      },
      newCategory: {
        id: '',
        class: '',
        location: '',
      },
      editedCategory: {
        id: '',
        class: '',
        location: '',
      },
      generateIsbn: false,
      headers: [
        { title: 'ID', align: 'start', sortable: true, value: 'id' },
        { title: 'ISBN', align: 'start', sortable: true, value: 'isbn' },
        { title: 'Titulo', align: 'start', sortable: false, value: 'title' },
        { title: 'Autor', align: 'start', sortable: false, value: 'author' },
        { title: 'Editorial', align: 'start', sortable: false, value: 'editorial' },
        { title: 'Edicion', align: 'center', sortable: true, value: 'edition' },
        { title: 'Condicion', align: 'center', sortable: true, value: 'conditions' },
        { title: 'Clasificacion', align: 'center', sortable: true, value: 'clasification' },
        { title: 'Ubicacion', align: 'center', sortable: true, value: 'location' },
        { title: 'Stock', align: 'center', sortable: true, value: 'amount' },
        { title: 'Precio', align: 'center', sortable: true, value: 'price' },

      ],
      items: [],
      Queue: [],
      loading: false,
      clasifications: [],
    };
  },
  methods: {
    async showCatalog() {
      this.loading = true;
      try {
        const response = await axios.get(`http://${hostname}:3000/Catalog`);
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching Catalog:', error);
        this.$emit('show-snackbar', {
          color: 'error',
          message: 'Error al buscar libros.',
        });
      } finally {
        this.loading = false;
      }
    },
    async getClasifications(){
      this.loading = true;
      try{
        const response = await axios.get(`http://${hostname}:3000/clasification`);
        this.clasifications = response.data;
        this.extractCategoryClasses(); // extract clases
      } catch (error) {
        console.error('Error fetching Clasifications:', error);
        this.$emit('show-snackbar', {
          color: 'error',
          message: 'Error al buscar clasificaciones.',
        });
      } finally {
        this.loading = false;
      }
    },
    getClassificationId(className) {
      const classification = this.clasifications.find(c => c.class === className);
      return classification ? classification.id : null;
    },
    extractCategoryClasses() {
      this.categoryClasses = this.clasifications.map(item => item.class);
    },
    async addCatalog() {
      if (this.$refs.form.validate()) {
        try {
          await axios.post(`http://${hostname}:3000/Catalog`, this.newBook);
          this.showSnackbar('success', 'Libro añadido!');
          this.closeBooksDialog();
          this.showCatalog();
        } catch (error) {
          this.showSnackbar('error', 'Error al añadir.');
          this.showCatalog();
        }
      }
    },
    async addCategory(){
      try{
        await axios.post(`http://${hostname}:3000/clasification`, this.newCategory);
        this.showSnackbar('success', 'Categoria añadida!');
        this.closeCatDialog();
        this.showCatalog();
      }
      catch (error) {
        this.showSnackbar('error', 'Error al añadir.');
        this.showCatalog();
      }
    },
    async deleteCatalog() {
        try {
          await axios.delete(`http://${hostname}:3000/Catalog/${this.editedBook.id}`);
          this.showSnackbar('success', 'Libro eliminado');
          this.closeEditDialog();
          this.showCatalog();
        } catch (error) {
          this.showSnackbar('error', 'Error al eliminar.');
        }
    },
    async deleteCategory() {
      try{
        const categoryId = this.getClassificationId(this.editedCategory.class)
        await axios.delete(`http://${hostname}:3000/clasification/${categoryId}`);
        console.log('Deleting category with id:', categoryId);
        this.showSnackbar('success', 'Categoria eliminada!');
        this.closeCatDialog();
        this.showCatalog();}
        catch(error){
          this.showSnackbar('error', 'error al eliminar');
        }
    },
    async updateCatalog() {
        if (this.$refs.editForm.validate()) {
          if(this.editedBook.queue === true){
            this.editedBook.queue = false
          }
          try {
            await axios.post(`http://${hostname}:3000/Catalog/editCatalog/${this.editedBook.id}`, this.editedBook);
            this.showSnackbar('success', 'libro editado!');
            this.closeEditDialog();
            this.showCatalog();
          } catch (error) {
            console.error('Error updating book:', error);
            this.showSnackbar('error', 'Error al editar libro.');
            this.closeDialog();
          }
        }
      },
    editCatalog(book) {
      this.editedBook = { ...book };
      this.editDialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    closeQueue(){
      this.QueueDialog = false;
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    showSnackbar(color, message) {
      this.snackbarColor = color;
      this.snackbarText = message;
      this.snackbar = true;
    },
    toggleSelectStatus(){
      if(this.radioSelected){
        this.isbnSelected = null // Updated: Reset isbnSelected
      }
    }, 
    closeBooksDialog(){
      this.booksDialog = false;
      this.$refs.form.reset();
    },
    closeCatDialog(){
      this.catDialog = false;
      this.$refs.form.reset();
      this.newCategory = {
        class: '',
        location: '',
      }
    },
    createIsbn(){
      let base = '97884001'
      let unique = false;
      while (!unique) {
        let sec = Math.floor(Math.random() * 1000000);
        let isbn = base + sec;
        if (!this.items.find(item => item.isbn === isbn)) {
          unique = true;
          return isbn;
        }
      }
    },
    handleIsbnChange() {
      if (this.generateIsbn) {
        this.newBook.isbn = this.createIsbn();
      } else {
        this.newBook.isbn = '';
      }
  },
  async booksInQueue(){
    try{
      const response = await axios.get(`http://${hostname}:3000/Catalog/queue`);
      this.Queue = response.data;
    } catch(error){
      console.error('Error fetching Catalog:', error);
      this.showSnackbar('error', 'Error al editar usuario.');
    }
  },
  async createBackup() {
      try {
        await axios.post(`http://${hostname}:3000/Catalog/backup`);
        this.showSnackbar('success', 'Backup created successfully');
      } catch (error) {
        console.error('Error creating backup:', error);
        this.showSnackbar('error', 'Error creating backup');
      }
    },
    async restoreBackup() {
      try {
        await axios.post(`http://${hostname}:3000/Catalog/restore`);
        this.showSnackbar('success', 'Backup restored successfully');
        this.showCatalog(); // Refresh the catalog after restore
      } catch (error) {
        console.error('Error restoring backup:', error);
        this.showSnackbar('error', 'Error restoring backup');
      }
    },
},

  mounted() {
    this.showCatalog();
    this.getClasifications();
    console.log("clasification: ", this.clasifications);
    this.booksInQueue();
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
  color: red; 
}
</style>