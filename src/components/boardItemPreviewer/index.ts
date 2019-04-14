import Component from './boardItemPreviewer.vue';
import { Vue } from 'vue-property-decorator';
export interface BoardItemPreviewer extends Vue {
  refresh();
}

export default Component;
