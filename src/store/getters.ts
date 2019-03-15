import { FirestoreDocument } from '@/lib/firebase';
import { User } from '@/lib/forms';
import State from './state';
import { GetterTree } from 'vuex';

export const getters: GetterTree<State, any> = {
  user: (state: State): FirestoreDocument<User> | null => {
    return state.user;
  },
  isAuth: (state: State): boolean => {
    return state.user !== null;
  }
};

// export default class Getters {
//   public user = (state: State): FirestoreDocument<User> | null => {
//     return null;
//   }
//   public isAuth = (state: State): boolean => {
//     return state.user !== null;
//   }
// }
