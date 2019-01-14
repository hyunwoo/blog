import { Component, Vue, Watch } from 'vue-property-decorator';
import UploadAdapter from '../lib/uploadAdapter';
import Board from '../lib/api/board';
import { UiConfiguration } from '@/lib/configuration/ui';
import _ from 'lodash';
import { watch } from 'fs';

console.log('asdf');
@Component({
  components: {}
})
export default class Articles extends Vue {
  private mounted() {
    console.log(this.$route.params.category);
  }
}
