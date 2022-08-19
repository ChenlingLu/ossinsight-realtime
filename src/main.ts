import './style.css';
import stats from "./engine/debug";
import { createApp } from "vue";
import App from './app.vue';
import store from "./store";
import { visible } from "@/plugins/visible";

const app = createApp(App);
app
  .use(store)
  .use(visible)
  .mount('#app');

if (stats !== undefined) {
  document.body.append(stats.dom);
}
