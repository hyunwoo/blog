import { Component, Vue, Watch, Prop, Emit } from 'vue-property-decorator';
import { BoardItem } from '@/lib/forms';
import { FirestoreDocument } from '@/lib/firebase';

@Component({})
export default class BoardItemPreviewer extends Vue {
  @Prop()
  public boardItem: FirestoreDocument<BoardItem> | undefined;
  public name: string = 'board-item-previewer';

  public refresh(data: FirestoreDocument<BoardItem>) {
    console.log('changed!', this.boardItem, data);
    this.$forceUpdate();
  }

  @Emit('click-preview')
  public onClick() {
    if (this.boardItem === undefined) {
      return;
    }
    return this.boardItem.data.id;
  }

  public mounted() {
    console.log('mounted', this.boardItem);
  }

  @Watch('boardItem')
  private onChangeBoardItem() {
    console.log('change board Item');
  }
}
