import Vue from 'vue';
import YtButton from './components/YtButton.vue';
import Vuetify from 'vuetify/lib';
import axios from 'axios';
import 'arrive';
document.head.innerHTML+='<link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">'
Vue.use(Vuetify);
axios.defaults.baseURL = `${process.env.VUE_APP_ROOT_API}`;
const path: string =
  'ytd-video-primary-info-renderer #top-level-buttons';

let buttonApp: Vue | undefined = undefined;
window.addEventListener(
  'yt-navigate-finish',
  () => {
    console.log(
      document.querySelector(path) as HTMLElement
    );

    (document as any).arrive(
      path,
      { existing: true },
      function() {
        const element: HTMLElement = document.querySelector(
          path
        ) as HTMLElement;
        console.log(
          document.querySelector(
            path
          ) as HTMLElement,
          '1'
        );
        const buttonAppDiv = document.createElement(
          'div'
        );
        buttonAppDiv.id = 'buttonAppDiv';
        element.appendChild(buttonAppDiv);

        if (buttonApp) {
          buttonApp.$destroy();
        }
        buttonApp = new Vue({
          vuetify: new Vuetify(),
          render: h => h(YtButton)
        }).$mount('#buttonAppDiv');
      }
    );
  }
);
