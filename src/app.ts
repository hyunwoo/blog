import { Component, Vue } from 'vue-property-decorator';
import Vuex, { StoreOptions } from 'vuex';
import store from './store';
import DialogPlugin from './lib/ui/dialog';

Vue.use(Vuex);
Vue.use(DialogPlugin);
console.log('Here App');

@Component({
  components: {}
})
export default class App extends Vue {
  // @ts-ignore
  public created() {
    console.log('app Created');
  }
  public mounted() {
    console.log('app Mounted');
  }
}
