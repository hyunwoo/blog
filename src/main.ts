import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

// require('froala-editor/js/froala_editor.pkgd.min');
// require('froala-editor/css/froala_editor.pkgd.min.css');
// require('font-awesome/css/font-awesome.css');
// require('froala-editor/css/froala_style.min.css');

// import VueFroala from 'vue-froala-wysiwyg';
// Vue.use(VueFroala);

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
