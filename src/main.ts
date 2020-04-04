import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate';
import axios from 'axios';

Vue.config.productionTip = false;
Vue.use(Vuelidate);
axios.defaults.baseURL = `${process.env.VUE_APP_ROOT_API}`;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
