import { v1 as uuid } from 'uuid';
import { Storage } from '@/lib/firebase';
import Editor from '.';
class UploadAdapter {
  private loader: any;
  private boardId: string;

  constructor(loader, boardId: string) {
    this.loader = loader;
    console.log(this.loader);
    this.boardId = boardId;
  }
  public upload() {
    console.log('upload!');
    return new Promise(async (resolve, reject) => {
      try {
        const mediaId = uuid();
        const storageRef = `board/${this.boardId}/${mediaId}`;
        const file = await this.loader.file;
        const storage = new Storage(storageRef);
        this.loader.uploadTital = 100;
        this.loader.uploaded = 50;
        await storage.upload(file);
        const url = await storage.getDownloadURL();
        const result = { default: url };
        console.log('upload complete', result);
        resolve({ default: url });
      } catch (e) {
        console.error(e);
        reject('upload failed');
      }
    });
  }
  public abort() {
    // todo abort
  }
}

function UploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader, b, c) => {
    console.log('File Repo Loader', loader.file.name, b, c);
    // @ts-ignore
    return new UploadAdapter(loader, Editor.mountedId);
  };
}

export default UploadAdapterPlugin;
