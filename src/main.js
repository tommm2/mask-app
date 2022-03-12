import { createApp } from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.css";

import App from "/@/App.vue";
import "/@/index.css";

const app = createApp(App);

app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);
app.mount("#app");
