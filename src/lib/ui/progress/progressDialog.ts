import { Dialog } from '../base/dialog';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class ProgressDialog extends Vue implements Dialog {
  public header: string | undefined = '';
  public message: string | undefined = '';
  public progress: number | undefined = 0;
  public use: boolean = false;

  public constructor() {
    super();
    console.log('Progress Dialog Created');
  }
  public updateHeader(header: string): Dialog {
    this.header = header;
    this.use = false;
    return this;
  }
  public open(): Dialog {
    console.log('open!');
    this.use = true;
    return this;
  }
  public updateProgress(progress: number): Dialog {
    this.progress = progress;
    return this;
  }
  public updateMessage(message: string): Dialog {
    this.message = message;
    return this;
  }
  public close(): Dialog {
    this.use = false;
    return this;
  }
}
