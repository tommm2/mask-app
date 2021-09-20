import { createApp } from 'vue'
import App from '/@/App.vue'
import router from '/@/router'
import store from '/@/store'
import VueAxios from 'vue-axios'
import axios from 'axios'
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)
app.mount('#app')
