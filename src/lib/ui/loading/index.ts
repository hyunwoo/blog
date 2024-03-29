import Vue from 'vue';
import LoadingDialog from './loadingDialog.vue';
import { Dialog } from '../base/dialog';

declare module 'vue/types/vue' {
  interface Vue {
    $loadingDialog: LoadingDialog;
  }
  interface LoadingDialog extends Dialog {
    open(backgroundColor?: string, color?: string): LoadingDialog;
  }
}

export default {
  install(vue: typeof Vue, opts: any) {
    if (Vue.prototype.$loadingDialog !== undefined) {
      Vue.prototype.$loadingDialog.$destory();
    }
    const loadingDialogInstance = new LoadingDialog();
    Vue.prototype.$loadingDialog = loadingDialogInstance;
    loadingDialogInstance.$mount(
      document.body.appendChild(document.createElement('div'))
    );
  }
};
