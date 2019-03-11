import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
import { v1 as uuid } from 'uuid';
import { Storage } from './firebase';
export default class UploadAdapter {
  private loader: any;
  private boardId: string;

  constructor(loader, boardId: string) {
    this.loader = loader;
    this.boardId = boardId;
    console.error('upload adapter created');
  }
  public upload() {
    console.log('upload!');
    return new Promise(async (resolve, reject) => {
      console.log('upload!');
      try {
        const mediaId = uuid();
        const storage = new Storage(`board/${this.boardId}/${mediaId}`);
        await storage.upload(this.loader.file);
        const url = await storage.getDownloadURL();
        resolve({ default: url });
      } catch (e) {
        reject(e);
      }
    });
  }
  public abort() {
    // todo abort
  }
}
