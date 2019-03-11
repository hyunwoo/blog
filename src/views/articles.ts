import { Component, Vue, Watch } from 'vue-property-decorator';
import _ from 'lodash';

console.log('asdf');
@Component({
  components: {}
})
export default class Articles extends Vue {
  private mounted() {
    console.log(this.$route.params.category);
  }
}
