import './style.css';
import stats from "./engine/debug";
import { createApp } from "vue";
import App from './app.vue';

const app = createApp(App);
app.mount('#app');

if (stats !== undefined) {
  document.body.append(stats.dom);
}
