import { Component, Vue } from 'vue-property-decorator';
import Vuex, { StoreOptions } from 'vuex';
import BoardItemPreviewer from '@/components/BoardItemPreviewer.vue';
import { v1 as uuid } from 'uuid';
import store from '@/store';

// firebase libraries
import { auth, FirestoreCollection } from '@/lib/firebase';
import { SignInMethod } from '@/lib/firebase/auth';
import { User } from '@/lib/forms';
// custom plugins
import ProgressDialog from '@/lib/ui/progress';
import LoadingDialog from './lib/ui/loading';
import SnackBar from './lib/ui/snackbar';

Vue.use(Vuex);
Vue.use(SnackBar);
Vue.use(ProgressDialog);
Vue.use(LoadingDialog);

Vue.component(BoardItemPreviewer.name, BoardItemPreviewer);

@Component({
  components: {}
})
export default class App extends Vue {
  public uuid = uuid;
  public miniDrawer: boolean = false;
  public useDrawer: boolean = true;
  public collectionUser: FirestoreCollection<User> = new FirestoreCollection(
    '/user'
  );
  public signIn() {
    auth.signIn(SignInMethod.Google);
  }
  public signOut() {
    auth.signOut();
  }
  public created() {
    console.log('app Created');
    auth.addChangeListener('app', async (user) => {
      console.warn('App User Status Listener ', user);
      if (user === null) {
        this.$store.commit('user', null);
        return;
      } else {
        const userForm = new User();
        userForm.inject(user);
        try {
          const u = await this.collectionUser.load(User, user.uid);
          u.data.inject(user);
          await u.saveSync();
          this.$store.commit('user', u);
          console.log('user loaded');

          console.log(this.$store.getters.user);
        } catch (e) {
          // not exist
          const u = this.collectionUser.generate(userForm, user.uid);
          await u.saveSync();
          this.$store.commit('user', u);
          console.log('user generated');
          console.log(this.$store.getters.user);
        }
      }
      console.log(this.$store.getters.isAuth);
    });
  }
  public mounted() {
    console.log('app Mounted');
    // this.$progressDialog
  }
}
