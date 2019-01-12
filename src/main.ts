import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

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
