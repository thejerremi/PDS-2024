import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../views/Auth-view.vue'
import UserView from '@/views/User-view.vue'
import AdminView from '@/views/Admin-view.vue'
import Reservation from '@/views/Reservation-view.vue'
import AboutUs from '@/views/AboutUs-view.vue'
// import Signup from '../views/Signup.vue'
// import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/user',
    name: 'UserView',
    component: UserView
  },
  {
    path: '/admin',
    name: 'AdminView',
    component: AdminView
  },
  { path: '/qr/:reservationId', 
    component: Reservation, 
    props: true 
  },
  { path: '/aboutus', 
    component: AboutUs, 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router
