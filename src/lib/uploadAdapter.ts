import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
import Board from '@/lib/api/board';
import { BoardApi } from '@/lib/api/firebase';
export default class UploadAdapter {
  // public static Inject(editor: CKClassicEditor) {
  //   editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
  //     return new UploadAdapter(loader);
  //   };
  // }

  private loader: any;
  private board: Board;
  constructor(loader, board: Board) {
    this.loader = loader;
    this.board = board;
  }
  public upload() {
    return new Promise(async (resolve, reject) => {
      let url = '';
      try {
        console.log(this.loader.file);
        console.log(this.board);
        const ret = await BoardApi.createMedia(this.loader.file, this.board);
        url = ret.data;
      } catch (e) {
        // here add 404
      }
      resolve({ default: url });
    });
  }
  public abort() {
    // todo abort
  }
}
