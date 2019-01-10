import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
export default class UploadAdapter {
  public static Inject(editor: CKClassicEditor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader);
    };
  }

  private loader: any;
  constructor(loader) {
    this.loader = loader;
  }
  public upload() {
    return new Promise((reslove, reject) => {
      reslove({});
    });
  }
  public abort() {
    // todo abort
  }
}
