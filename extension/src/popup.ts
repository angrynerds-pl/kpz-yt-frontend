import Vue from 'vue';
import Popup from './components/Popup.vue';
import Vuetify from 'vuetify/lib';
import Vuelidate from 'vuelidate';
import axios from 'axios';

axios.defaults.baseURL = `${process.env.API_URL}`;

Vue.use(Vuetify);
Vue.use(Vuelidate);
new Vue({
  vuetify: new Vuetify(),
  render: h => h(Popup)
}).$mount('#app');
