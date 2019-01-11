import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import { LoadingDialog } from './lib/ui/dialongLoading';
import { Dialog } from './lib/ui/dialog';

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    console.log('created');
  },
  mounted() {
    console.log('App Start');
  }
}).$mount('#app');
