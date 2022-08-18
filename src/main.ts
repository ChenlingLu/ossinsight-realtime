import './style.css';
import stats from "./engine/debug";
import { createApp } from "vue";
import App from './app.vue';
import store from "./store";

const app = createApp(App);
app.use(store)
app.mount('#app');

if (stats !== undefined) {
  document.body.append(stats.dom);
}
