import Vue from 'vue';
import ProgressDialog from './progressDialog.vue';
import { Dialog } from '../base/dialog';

declare module 'vue/types/vue' {
  interface Vue {
    $progressDialog: ProgressDialog;
  }
}

declare module 'vue/types/vue' {
  interface ProgressDialog extends Dialog {
    open(): ProgressDialog;
  }
}

export default {
  progressDialogInstance: new ProgressDialog(),
  install(vue: typeof Vue, opts: any) {
    console.log('call install');
    Vue.prototype.$progressDialog = this.progressDialogInstance;

    this.progressDialogInstance.$mount(
      document.body.appendChild(document.createElement('div'))
    );
  }
};
