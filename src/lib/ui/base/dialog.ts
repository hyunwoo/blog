import { Vue } from 'vue-property-decorator';

declare module 'vue/types/vue' {
  interface Dialog {
    open(): Dialog;
    updateProgress(progress: number): Dialog;
    updateMessage(message: string): Dialog;
    close(): Dialog;
  }
}

export abstract class Dialog extends Vue {
  public header: string | undefined = '';
  public message: string | undefined = '';
  public progress: number | undefined = 0;
  public use: boolean = false;

  public constructor() {
    super();
    console.log('BaseDialog Created');
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
