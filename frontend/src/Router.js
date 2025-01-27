import { createMemoryHistory, createRouter } from 'vue-router'

import LandingAdmin from './components/pages/LandingAdmin.vue'
import UsersPage from './components/pages/UsersPage.vue'
import AdminCatalog from './components/pages/AdminCatalog.vue'
import BeneficiariesApp from './components/pages/BeneficiariesApp.vue'
import CliensPage from './components/pages/CliensPage.vue'
import PayloadsComisions from './components/pages/PayloadsComisions.vue'
import ProvidersPage from './components/pages/ProvidersPage.vue'
import LogIn from './LogIn.vue'
import SellPoint from './components/pages/SellPoint.vue'
import PassForgot from './PassForgot.vue'
import PassReset from './PassReset.vue'

const routes = [
  { path: '/', component: LogIn },
  { path: '/Landing', component: LandingAdmin },
  { path: '/Usuarios', component: UsersPage },
  { path: '/Catalogo', component: AdminCatalog },
  { path: '/Beneficiarios', component: BeneficiariesApp },
  { path: '/Clientes', component: CliensPage },
  { path: '/Pagos', component: PayloadsComisions },
  { path: '/Proveedores', component: ProvidersPage },
  { path: '/PuntoDeVenta', component: SellPoint },
  { path: '/PassForgot', component: PassForgot },
  { path: '/PassReset', component: PassReset },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
export default router