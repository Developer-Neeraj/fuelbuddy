import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import { initializeAuthListener } from './firebase/firebase';
// Create Pinia store instance
const pinia = createPinia();
const statepinia = pinia.use(piniaPersist);
const app = createApp(App);
app.use(statepinia);
initializeAuthListener();
app.use(router)
app.mount('#app')
