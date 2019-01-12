export interface Dialog {
  header: string | undefined;
  message: string | undefined;
  progress: number | undefined;
  use: boolean;
  open(): Dialog;
  updateHeader(header: string): Dialog;
  updateProgress(progress: number): Dialog;
  updateMessage(message: string): Dialog;
  close(): Dialog;
}

import Vue from 'vue';
import ProgressDialog from './vue/progressDialog.vue';

declare module 'vue/types/vue' {
  interface Vue {
    progressDialog: Dialog;
  }
}

export default {
  progressDialogInstance: new ProgressDialog(),
  install(vue: typeof Vue, opts) {
    console.log('call install');
    Vue.prototype.progressDialog = this.progressDialogInstance;

    this.progressDialogInstance.$mount(
      document.body.appendChild(document.createElement('div'))
    );
  }
};
