import { createRouter, createWebHistory } from 'vue-router'
import Login from '../view/sign.vue'
import Signup from '../view/signup.vue'
import Dashboard from '../view/dashboard.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user'); // You can store your authentication status here
  
  // Check if the route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to the login page if not authenticated
    next('/login');
  } else {
    // Allow the navigation to continue
    next();
  }
});

export default router