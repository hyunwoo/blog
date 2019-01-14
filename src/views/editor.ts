import CKEditor from '@ckeditor/ckeditor5-vue';
import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
import { Component, Vue, Watch } from 'vue-property-decorator';
import UploadAdapter from '../lib/uploadAdapter';
import Board from '../lib/api/board';
import { UiBoardIcon, UiConfiguration } from '../lib/configuration/ui';
import { debounce } from 'lodash';

console.log(UiConfiguration.getUICategoryNameFromValue('notice'));
@Component({
  components: {
    ckeditor: CKEditor.component
  }
})
export default class Editor extends Vue {
  public title: string = '';
  public fab: boolean = false;
  public boardIcon: number = 0;
  public boardIcons: UiBoardIcon[] = UiConfiguration.uiBoardIcons;
  public category: string = UiConfiguration.uiCategoryNames[0];
  public dropdownCategory: string[] = UiConfiguration.uiCategoryNames;
  public saveContent: (() => Promise<void>);
  // @ts-ignore : Mounted에 호출됨.
  private board: Board;
  private editor: CKClassicEditor;
  private id: string = '';

  constructor() {
    super();
    this.saveContent = debounce(this.saveImmediate, 1000);
  }

  public onChangeCateogory(e) {
    console.log('changed', e);
  }

  public getEditor() {
    return this.editor;
  }
  public getBoard() {
    return this.board;
  }
  public async saveImmediate() {
    this.board.title = this.title;
    this.board.icon = this.boardIcon;
    this.board.category = UiConfiguration.getUiCategoryValueFromName(
      this.category
    );
    await this.board.save();
  }

  // private methods Vue Watch
  @Watch('category')
  private onCategoryChanged(value: string, oldValue: string): void {
    this.saveContent();
  }

  @Watch('boardIcon')
  private onBoardIconChanged(value: string, oldValue: string): void {
    this.saveContent();
  }

  @Watch('title')
  private onTitleChanged(value: string, oldValue: string): void {
    this.saveContent();
  }

  // private methods Vue Default Methods
  private async mounted() {
    this.progressDialog.open();
    this.progressDialog.updateMessage('페이지를 로딩중입니다.');
    const isExist = (await Board.exist(this.id)).data;
    this.editor = await CKClassicEditor.create(this.$refs.editorField, {
      toolbal: {
        viewportTopOffset: 30
      }
    });
    this.editor.plugins.get('FileRepository').createUploadAdapter = (
      loader
    ) => {
      return new UploadAdapter(loader, this.board);
    };

    if (isExist) {
      this.progressDialog.updateMessage('작성된 게시글을 로딩중 입니다.');
      this.board = (await Board.load(this.id)).data;
      this.title = this.board.title;
      this.editor.setData(this.board.content);
      console.log('loaded', this.board);
    } else {
      this.progressDialog.updateMessage('새로운 게시글을 생성중 입니다.');
      // not exist! create content
      this.board = (await Board.create(this.id)).data;
    }

    this.editor.model.document.on('change:data', this.saveContent);
    this.progressDialog.close();
  }
  private created() {
    console.log('created!');
    this.id = this.$route.params.id;
  }
}
