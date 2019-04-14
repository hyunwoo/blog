import FirestoreDocumentData from '@/lib/firebase/firestore/documentData';
import { BoardCategory, User } from '.';

type BoardItemState = 'published' | 'editing';

export default class BoardItem extends FirestoreDocumentData {
  public title: string = '';
  public description: string = '';
  public mainImageURL: string = '';
  public content: string = '';
  public published: boolean = false;
  public state: BoardItemState = 'editing';
  public category: BoardCategory = new BoardCategory();
  public convertStatusChangeTime: string = new Date().toUTCString();

  public id: string = '';
  public userInfo: User = new User();
  public userId: string = '';
  public createdAt: string = '';
  public modifiedAt: string = '';
  public publishedAt: string = '';
  public viewCount: number = 0;
  public likeCount: number = 0;
  public unlikeCount: number = 0;
  public init(): void {
    // init
  }

  public toObject(): object {
    return JSON.parse(JSON.stringify(this));
  }
}
