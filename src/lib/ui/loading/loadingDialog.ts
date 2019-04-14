import { Dialog } from '../base/dialog';
import { Component } from 'vue-property-decorator';

@Component({})
export default class LoadingDialog extends Dialog {
  public name: string = 'loadingDialog';
  private backgroundColor: string = '#ffffff';
  private color: string = '#f00000';

  public open(backgroundColor?: string, color?: string): LoadingDialog {
    this.backgroundColor = backgroundColor ? backgroundColor : '#ffffff';
    this.color = color ? color : this.$vuetify.theme.primary.toString();
    return super.open() as LoadingDialog;
  }
  public mounted() {
    this.color = this.$vuetify.theme.primary.toString();
  }
}
