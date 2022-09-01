import './style.less';
import { createApp } from "vue";
import App from './app.vue';
import store, { installResize } from "./store";
import { SYMBOL_VISIBLE, SYMBOL_VISIBLE_INSTANT, visible, VISIBLE_THROTTLE } from "@/plugins/visible";
import router from "@/router";

const app = createApp(App);
app
  .use(store)
  .use(router)
  .use(visible({ throttle: VISIBLE_THROTTLE, injectionKey: SYMBOL_VISIBLE }))
  .use(visible({ throttle: 0, injectionKey: SYMBOL_VISIBLE_INSTANT }))
  .mount('#app');

installResize();
