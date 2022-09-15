import './style.less';
import { createApp } from "vue";
import App from './app.vue';
import store, { installResize } from "./store";
import { SYMBOL_VISIBLE, SYMBOL_VISIBLE_INSTANT, visible, VISIBLE_THROTTLE } from "@/plugins/visible";
import router from "@/router";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import scopePlugin from "@/plugins/scope";

const app = createApp(App);
Sentry.init({
  app,
  dsn: import.meta.env.PROD ? "https://d326eccb0d414397a2cbfbc4f7271823@o226447.ingest.sentry.io/6726051" : undefined,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ["live.ossinsight.io"],
    }),
  ],
  tracesSampleRate: 1.0,
});

app
  .use(store)
  .use(router)
  .use(visible({ throttle: VISIBLE_THROTTLE, injectionKey: SYMBOL_VISIBLE }))
  .use(visible({ throttle: 0, injectionKey: SYMBOL_VISIBLE_INSTANT }))
  .use(scopePlugin)
  .mount('#app');

installResize();
