import FirestoreDocumentData from '@/lib/firebase/firestore/documentData';

export type UserType = 'supervisor' | 'authur' | 'guest';
export default class User extends FirestoreDocumentData {
  public displayName: string = '';
  public email: string = '';
  public photoURL: string = '';
  public uid: string = '';
  public lastSignInTime: string = '';
  public creationTime: string = '';
  public userType: UserType = 'guest';
  public inject(user: firebase.User) {
    this.displayName = user.displayName ? user.displayName : '';
    this.photoURL = user.photoURL ? user.photoURL : '';
    this.email = user.email ? user.email : '';
    this.uid = user.uid ? user.uid : '';
    this.lastSignInTime = user.metadata.lastSignInTime
      ? user.metadata.lastSignInTime
      : '';
    this.creationTime = user.metadata.creationTime
      ? user.metadata.creationTime
      : '';
  }
  public init(): void {
    // init
  }

  public toObject(): object {
    return JSON.parse(JSON.stringify(this));
  }
}
