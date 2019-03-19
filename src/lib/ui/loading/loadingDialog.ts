import { Dialog } from '../base/dialog';
import { Component } from 'vue-property-decorator';

@Component({})
export default class LoadingDialog extends Dialog {
  private name: string = 'loadingDialog';
  private opacity: number = 1;

  public open(opacity?: number): LoadingDialog {
    this.opacity = opacity ? opacity : 1;
    console.log(opacity, this.opacity);
    return super.open() as LoadingDialog;
  }
}
