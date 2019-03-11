import { Component, Vue } from 'vue-property-decorator';
import UploadAdapter from '@/lib/uploadAdapter';
import { UiBoardIcon, UiConfiguration } from '@/lib/configuration/ui';
import axios from 'axios';
import FileUtil from '@/util/file';
import { BoardItem, BoardCategory } from '@/lib/forms';
import {
  FirestoreCollection,
  FirestoreDocument,
  Storage
} from '@/lib/firebase';

import '@ckeditor/ckeditor5-theme-lark';
@Component({})
export default class Board extends Vue {
  public $refs!: {
    boardItemPreview: HTMLElement;
    editorField: HTMLElement;
  };

  public title: string = '';
  public fab: boolean = false;

  public boardItem: FirestoreDocument<BoardItem> | null = null;
  public boardContent: string = '';
  public boardIcon: number | undefined = 0;
  public boardIcons: UiBoardIcon[] = UiConfiguration.uiBoardIcons;
  public category: string = UiConfiguration.uiCategoryNames[0];
  public dropdownCategory: string[] = UiConfiguration.uiCategoryNames;

  // @ts-ignore created에서 초기화
  private id: string;

  // private methods Vue Default Methods
  private async mounted() {
    this.progressDialog.open();
    this.progressDialog.updateMessage('페이지를 로딩중입니다.');

    // Board 데이터베이스 데이터 로드 or 초기화
    const collection = new FirestoreCollection<BoardItem>('/board');
    try {
      // exist
      this.boardItem = await collection.load(BoardItem, this.id);
      console.log(`board ${this.id} loaded`);
      this.boardContent = (await axios.get(this.boardItem.data.content)).data;
      console.log(this.boardContent);
    } catch (e) {
      console.error('not exist content');
    }

    this.progressDialog.close();
  }
  private created() {
    console.log('created!');
    this.id = this.$route.params.id;
  }
}
