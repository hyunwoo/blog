import { BoardApi } from './firebase';
import uuid from 'uuid';
import { Promise } from 'q';
import Response from './response';
import axios from 'axios';
import _ from 'lodash';

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
      board.createdAt = new Date().getTime();
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
  public icon: number | undefined = 0;
  public category: string = '';
  public published: boolean = false;
  private id: string = '';
  private createdAt: number = 0;
  private modifiedAt: number = 0;
  private publishedAt: number = 0;
  private viewCount: number = 0;
  private likeCount: number = 0;
  private unlikeCount: number = 0;

  private constructor(id: string) {
    this.id = id;
  }

  public publish(state: boolean): void {
    this.published = state;
    if (state) {
      this.publishedAt = new Date().getTime();
    } else {
      this.publishedAt = 0;
    }
  }
  public save(): Promise<null> {
    // @ts-ignore
    return new Promise((resolve, reject) => {
      this.modifiedAt = new Date().getTime();
      BoardApi.set(this)
        .then(() => resolve())
        .catch((e) => reject(e));
    });
  }

  public getSaveStructure(downloadUrl: string): object {
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
    return new Date(this.createdAt).toLocaleString();
  }
  public getModifiedAt(): string {
    return new Date(this.modifiedAt).toLocaleString();
  }
  public getPublishedAt(): string {
    return new Date(this.publishedAt).toLocaleString();
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
  public get contentDownloadURL(): string {
    return this.savedContentURL;
  }
  public setOption(key: string, value: string | number) {
    this[key] = value;
  }
  public getOptionValue(key: string): string | number {
    return this[key];
  }

  public loadContent(): Promise<Response<void>> {
    // @ts-ignore :: New Lint Off
    return new Promise<Response<void>>(async (resolve, reject) => {
      try {
        if (
          !_.isNil(this.savedContentURL) &&
          !_.isEmpty(this.savedContentURL)
        ) {
          const content = await axios.get(this.savedContentURL);
          this.content = content.data;
        }
        resolve(new Response<void>(true));
      } catch (e) {
        resolve(new Response<void>(false).setError(e));
      }
    });
  }
  private async inject(object: any) {
    Object.assign(this, object);
  }
}
