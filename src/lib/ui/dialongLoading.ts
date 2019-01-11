import { Dialog } from './dialog';
export class LoadingDialog implements Dialog {
  public header: string | undefined = '';
  public message: string | undefined = '';
  public progress: number | undefined = 0;
  public use: boolean = false;
  public updateHeader(header: string): Dialog {
    this.header = header;
    return this;
  }
  public open(): Dialog {
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
