import Vue from 'vue';
import SnackBar from './snackbar.vue';

declare module 'vue/types/vue' {
  interface Vue {
    $snackbar: SnackBar;
  }
}

export default {
  install(vue: typeof Vue, opts: any) {
    console.log('call install');
    if (Vue.prototype.$snackbar !== undefined) {
      Vue.prototype.$snackbar.$destory();
    }
    const instance = new SnackBar();
    Vue.prototype.$snackbar = instance;
    instance.$mount(document.body.appendChild(document.createElement('div')));
  }
};
