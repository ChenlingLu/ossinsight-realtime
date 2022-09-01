import './style.less';
import stats from "./engine/debug";
import { createApp } from "vue";
import App from './app.vue';
import store from "./store";
import { visible } from "@/plugins/visible";
import router from "@/router";

const app = createApp(App);
app
  .use(store)
  .use(router)
  .use(visible)
  .mount('#app');

if (stats !== undefined) {
  document.body.append(stats.dom);
}
