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
import { LoadingDialog } from './dialongLoading';
import ProgressDialog from './vue/progressDialog';
import NormalDialog from './vue/dialog.vue';

export function DialogPlugin(vue: typeof Vue): void {
  const data = new LoadingDialog();
  const instance = new NormalDialog();
  instance.$mount(document.body.appendChild(document.createElement('div')));
  // todo set directive

  // Vue.prototype.$loadingDialog.open();
  // console.log('wt?');
}
