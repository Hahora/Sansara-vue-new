import { createApp } from "vue";
import { createPinia } from "pinia";
import persistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";

import "./assets/css/main.css";

const app = createApp(App);
const pinia = createPinia();
pinia.use(persistedstate);

app.use(pinia);
app.use(router);

app.directive("autoplay", {
  beforeMount(el) {
    el.setAttribute("muted", "");
    el.muted = true;
  },
  mounted(el) {
    el.setAttribute("muted", "");
    el.muted = true;
    el.play().catch(() => {});
  },
});

app.mount("#app");
