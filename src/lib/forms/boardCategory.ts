import FirestoreDocumentData from '@/lib/firebase/firestore/documentData';

export default class BoardCategory extends FirestoreDocumentData {
  public name: string = '';
  public group: string = '';
  public createdAt: string = '';
  public init(): void {
    // init
  }

  public toObject(): object {
    return JSON.parse(JSON.stringify(this));
  }
}
