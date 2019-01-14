import firebase from 'firebase';
import { v1 as uuid } from 'uuid';
import config from './certification';
import Board from '@/lib/api/board';
import Response from '@/lib/api/response';
import { map, isNil } from 'lodash';

firebase.initializeApp(config);

const storage = firebase.storage();
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

const BoardApi = {
  collection: 'board',
  getBoards(
    category?: string,
    page?: number,
    count?: number
  ): Promise<Response<Board[]>> {
    return new Promise<Response<Board[]>>((resolve, reject) => {
      console.log('request collection', this.collection);
      const collection = db.collection(this.collection);
      let queryCollection;
      if (!isNil(category)) {
        queryCollection = collection.where('category', '==', category);
      } else {
        queryCollection = collection;
      }
      const items: Board[] = [];
      queryCollection
        .get()
        .then((querySnapShot) => {
          querySnapShot.forEach((doc) => {
            const board = Board.loadFromData(doc.id, doc.data());
            items.push(board);
          });
          resolve(new Response<Board[]>(true).setData(items));
        })
        .catch((e: Error) => {
          reject(new Response<Board[]>(false).setError(e));
        });
    });
  },
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
  createMedia(
    file: File,
    board: Board,
    onProgress?: (state: string, progress: number) => void
  ): Promise<Response<string>> {
    return new Promise((resolve, reject) => {
      const id: string = uuid();
      const ref = storage.ref(`board/${board.getId()}/${id}`);
      const task = ref.put(file);
      task.on('state_changed', (snapshot: any) => {
        if (onProgress !== undefined) {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(snapshot.state, progress);
        }
      });
      task
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
const FirebaseCommon = BoardApi;

export { FirebaseCommon };
export { BoardApi };
export default { BoardApi };
