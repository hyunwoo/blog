import { Component, Vue } from 'vue-property-decorator';
import Vuex, { StoreOptions } from 'vuex';
import store from './store';
import { DialogPlugin } from './lib/ui/dialog';

Vue.use(Vuex);
Vue.use(DialogPlugin);
console.log('Here App');
// export default {
//   name: 'App',
//   components: {},
//   data() {
//     return {
//       dialog: {
//         use: true,
//         message: 'Loading...'
//       }
//     };
//   },
//   created() {
//     console.log(this.$loadingDialog);
//   }
// };
@Component({
  components: {}
})
export default class Editor extends Vue {
  // @ts-ignore
  public created() {
    console.log('created');
  }
  public mounted() {
    console.log('mounted!!');
    // console.log(this.$loadingDialog);
    // setTimeout(() => {
    //   this.$loadingDialog.close();
    //   console.log('close!');
    // }, 2000);
  }
}
