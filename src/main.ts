import './style.less';
import { createApp } from "vue";
import App from './app.vue';
import store, { installResize } from "./store";
import { visible } from "@/plugins/visible";
import router from "@/router";

const app = createApp(App);
app
  .use(store)
  .use(router)
  .use(visible)
  .mount('#app');

installResize()
