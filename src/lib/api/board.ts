import { BoardApi } from './firebase';
import uuid from 'uuid';
import { Promise } from 'q';
import Response from './response';
import axios from 'axios';
import _ from 'lodash';

interface BoardMeta {
  title: string;
  content: string;
  createAt: string;
  modifiedAt: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  unlikeCount: number;
  icon?: string;
  category?: string;
}

type AsyncFunction<I, O> = (inputs: I) => Promise<O>;
export default class Board {
  public static exist(id: string): Promise<Response<boolean>> {
    // @ts-ignore
    return new Promise<Response<boolean>>((resolve, reject) => {
      BoardApi.exist(id)
        .then((result) => {
          const isExist = result.data;
          const response = new Response<boolean>(true).setData(isExist);
          resolve(response);
        })
        .catch((e) => {
          reject(new Response<boolean>(false));
        });
    });
  }
  public static create(id: string): Promise<Response<Board>> {
    // @ts-ignore
    return new Promise<Response<Board>>((resolve, reject) => {
      const board = new Board(id);
      const response = new Response<Board>(true).setData(board);
      resolve(response);
    });
  }

  public static load(id: string): Promise<Response<Board>> {
    // @ts-ignore
    return new Promise<Response<Board>>(async (resolve, reject) => {
      try {
        const board = new Board(id);
        const r = await BoardApi.get(id);
        await board.inject(r.data);

        const response = new Response<Board>(true).setData(board);
        resolve(response);
      } catch (e) {
        reject(new Response<Board>(false).setError(e));
      }
    });
  }
  public static loadFromData(id: string, data: object): Board {
    const board = new Board(id);
    board.inject(data);
    return board;
  }

  public title: string = '';
  public content: string = '';
  public savedContentURL: string = '';
  public icon: number = 0;
  public category: string = '';
  private id: string = '';
  private createdAt: string = '';
  private modifiedAt: string = '';
  private publishedAt: string = '';
  private viewCount: number = 0;
  private likeCount: number = 0;
  private unlikeCount: number = 0;

  private constructor(id: string) {
    this.id = id;
  }

  public save(): Promise<null> {
    // @ts-ignore
    return new Promise((resolve, reject) => {
      BoardApi.set(this)
        .then(() => resolve())
        .catch((e) => reject(e));
    });
  }

  public getSaveContent(downloadUrl: string): object {
    const object = JSON.parse(JSON.stringify(this));
    delete object.content;
    object.savedContentURL = downloadUrl;
    return object;
  }
  // getters
  public getId(): string {
    return this.id;
  }
  public getContent(): string {
    return this.content;
  }
  public getCreatedAt(): string {
    return this.createdAt;
  }
  public getModifiedAt(): string {
    return this.modifiedAt;
  }
  public getPublishedAt(): string {
    return this.publishedAt;
  }
  public getViewCount(): number {
    return this.viewCount;
  }
  public getLikeCount(): number {
    return this.likeCount;
  }
  public getUnlikeCount(): number {
    return this.unlikeCount;
  }
  public setOption(key: string, value: string | number) {
    this[key] = value;
  }
  public getOptionValue(key: string): string | number {
    return this[key];
  }
  private async inject(object: any) {
    Object.assign(this, object);
    try {
      if (
        !_.isNil(object.savedContentURL) &&
        !_.isEmpty(object.savedContentURL)
      ) {
        const content = await axios.get(object.savedContentURL);
        this.content = content.data;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
