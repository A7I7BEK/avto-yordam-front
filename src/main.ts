import './assets/main.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { useThemeStore } from './stores/theme';

const app = createApp(App);

app.use(createPinia());

// Apply the persisted theme before mounting so the first render is correct.
useThemeStore().init();

app.use(router);

app.mount('#app');
