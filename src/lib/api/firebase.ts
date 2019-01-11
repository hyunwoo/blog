import config from './certification';
import firebase from 'firebase';
import Board from './board';
import { v1 as uuid } from 'uuid';
import Response from './response';

firebase.initializeApp(config);

const storage = firebase.storage();
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

const BoardApi = {
  collection: 'board',
  boardName: 'name',
  exist(id: string): Promise<Response<boolean>> {
    return new Promise<Response<boolean>>((resolve, reject) => {
      db.collection(this.collection)
        .doc(id)
        .get()
        .then((doc) => {
          const isExist: boolean = doc.exists;
          resolve(new Response<boolean>(true).setData(isExist));
        });
    });
  },
  get(id: string): Promise<Response<object>> {
    return new Promise((resolve, reject) => {
      db.collection(this.collection)
        .doc(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            resolve(new Response(true).setData(data as object));
          } else {
            reject(
              new Response(false).setError(
                new Error(`not exist document at ${id}`)
              )
            );
          }
        })
        .catch((e) => {
          reject(new Response(false).setError(e));
        });
    });
  },
  set(board: Board): Promise<Response<void>> {
    return new Promise(async (resolve, reject) => {
      console.log('here save', board);
      try {
        const responseSaveBoard = await this.createPage(board);
        db.collection(this.collection)
          .doc(board.getId())
          .set(board.getSaveContent(responseSaveBoard.data))
          .then(() => resolve(new Response(true)))
          .catch((e) => reject(new Response(false).setError(e)));
      } catch (e) {
        reject(new Response(false).setError(e));
      }
    });
  },
  createPage(board: Board): Promise<Response<string>> {
    return new Promise((resolve, reject) => {
      const content = board.content;
      const id = board.getId();
      const ref = storage.ref(`board/${board.getId()}.html`);
      ref
        .putString(content)
        .then(() => ref)
        .then((reference) => {
          reference
            .getDownloadURL()
            .then((downloadUrl: string) => {
              resolve(new Response<string>(false).setData(downloadUrl));
            })
            .catch((e) => reject(new Response(false).setError(e)));
        })
        .catch((e) => {
          reject(new Response(false).setError(e));
        });
    });
  },
  createMedia(file: File, board: Board): Promise<Response<string>> {
    return new Promise((resolve, reject) => {
      const id: string = uuid();
      const ref = storage.ref(`board/${board.getId()}/${id}`);
      ref
        .put(file)
        .then((s) => {
          return ref;
        })
        .then((reference) => {
          reference
            .getDownloadURL()
            .then((downloadUrl: string) =>
              resolve(new Response<string>(false).setData(downloadUrl))
            )
            .catch((e) => reject(new Response(false).setError(e)));
        })
        .catch((e) => {
          reject(new Response(false).setError(e));
        });
    });
  }
};

export { BoardApi };
