import Vue from 'vue';
import Popup from './components/Popup.vue';
import Vuetify from 'vuetify/lib';
import Vuelidate from 'vuelidate';
import axios from 'axios';

axios.defaults.baseURL = `${process.env.VUE_APP_ROOT_API}`;
const bkg = chrome.extension.getBackgroundPage();

if (bkg) {
  bkg.console.log('url', process.env.VUE_APP_ROOT_API);
}


Vue.use(Vuetify);
Vue.use(Vuelidate);
new Vue({
  vuetify: new Vuetify(),
  render: h => h(Popup)
}).$mount('#app');
