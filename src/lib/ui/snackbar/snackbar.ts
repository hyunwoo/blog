import { Vue, Component } from 'vue-property-decorator';

declare module 'vue/types/vue' {
  interface SnackBar {
    show(text: string, multiline?: boolean): void;
    showWithAction(
      text: string,
      actionName: string,
      action: () => void,
      multiline?: boolean
    ): void;
  }
}

@Component({})
export default class SnackBar extends Vue {
  private name: string = 'snackbar';
  private appear: boolean = false;
  private multiline: boolean = false;
  private timeout: number = 5000;
  private text: string = 'Hello, I\'m a snackbar';
  private actionName: string = 'close';
  // @ts-ignore show 에서 초기화됨
  private action: () => void;

  public show(text: string, multiline?: boolean): void {
    this.appear = true;
    this.multiline = multiline ? multiline : false;
    this.text = text;
    this.action = () => {
      this.appear = false;
    };
  }
  public showWithAction(
    text: string,
    actionName: string,
    action: () => void,
    multiline?: boolean
  ) {
    this.appear = true;
    this.text = text;
    this.actionName = actionName;
    this.action = action;
  }

  private close() {
    this.appear = false;
    this.action();
  }
}
