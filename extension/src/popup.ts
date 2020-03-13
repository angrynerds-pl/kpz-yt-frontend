import Vue from 'vue';
import Popup from './components/Popup.vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

new Vue({
  vuetify: new Vuetify(),
  render: h => h(Popup)
}).$mount('#app');
