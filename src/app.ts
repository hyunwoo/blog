import { Component, Vue } from 'vue-property-decorator';
import Vuex, { StoreOptions } from 'vuex';
import BoardItemPreviewer from '@/components/boardItemPreviewer';
import { v1 as uuid } from 'uuid';
import store from '@/store';

// firebase libraries
import { auth, FirestoreCollection, FirestoreDocument } from '@/lib/firebase';
import { SignInMethod } from '@/lib/firebase/auth';
import { User, BoardItem, BoardCategory } from '@/lib/forms';
// custom plugins
import ProgressDialog from '@/lib/ui/progress';
import LoadingDialog from './lib/ui/loading';
import SnackBar from './lib/ui/snackbar';

Vue.use(Vuex);
Vue.use(SnackBar);
Vue.use(ProgressDialog);
Vue.use(LoadingDialog);

interface CollectionContainer {
  user: FirestoreCollection<User>;
  board: FirestoreCollection<BoardItem>;
  boardCategory: FirestoreCollection<BoardCategory>;
}

declare module 'vue/types/vue' {
  interface Vue {
    $collection: CollectionContainer;
  }
}
Vue.prototype.$collection = {
  user: new FirestoreCollection('/user'),
  board: new FirestoreCollection('/board'),
  boardCategory: new FirestoreCollection('/boardCategory')
};

Vue.component(BoardItemPreviewer.name, BoardItemPreviewer);

@Component({
  components: {}
})
export default class App extends Vue {
  public writers: Array<FirestoreDocument<User>> = [];
  public uuid = uuid;
  public miniDrawer: boolean = false;
  public useDrawer: boolean = true;
  public signIn() {
    auth.signIn(SignInMethod.Google);
  }
  public signOut() {
    auth.signOut();
  }
  public created() {
    console.log('app Created');
    this.$loadingDialog.open('#fff', this.$vuetify.theme.primary.toString());
    auth.addChangeListener('app', async (user) => {
      console.warn('App User Status Listener ', user);
      this.$loadingDialog.close();
      if (user === null) {
        this.$store.commit('user', null);
        return;
      } else {
        const userForm = new User();
        userForm.inject(user);
        try {
          const u = await this.$collection.user.load(User, user.uid);
          u.data.inject(user);
          await u.saveSync();
          this.$store.commit('user', u);
          console.log('user loaded');
          console.log(this.$store.getters.user);
        } catch (e) {
          // not exist
          const u = this.$collection.user.generate(userForm, user.uid);
          await u.saveSync();
          this.$store.commit('user', u);
          console.log('user generated');
          console.log(this.$store.getters.user);
        }
      }
    });
  }
  public async mounted() {
    console.log('app mounted');
    this.writers = await this.$collection.user
      .createQuery('userType', '==', 'writer')
      .exec(User);

    // console.log('app Mounted');
    // this.$progressDialog
  }
}
