import { FirestoreDocument } from '../lib/firebase';
import { User } from '../lib/forms';
export default class State {
  public user: FirestoreDocument<User> | null = null;
}
