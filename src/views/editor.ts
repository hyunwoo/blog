import CKEditor from '@ckeditor/ckeditor5-vue';
import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
import { Component, Vue, Watch } from 'vue-property-decorator';
import UploadAdapter from '../lib/uploadAdapter';
import Board from '../lib/api/board';
import { UiBoardIcon, UiConfiguration } from '../lib/configuration/ui';
import { debounce } from 'lodash';
import Axios from 'axios';

console.log(UiConfiguration.getUICategoryNameFromValue('notice'));
@Component({
  components: {
    ckeditor: CKEditor.component
  }
})
export default class Editor extends Vue {
  public title: string = '';
  public fab: boolean = false;
  public boardIcon: number | undefined = 0;
  public boardIcons: UiBoardIcon[] = UiConfiguration.uiBoardIcons;
  public category: string = UiConfiguration.uiCategoryNames[0];
  public dropdownCategory: string[] = UiConfiguration.uiCategoryNames;
  public saveContent: (() => Promise<void>);
  public isPublish: boolean = false;
  public isPublishIndeterminate: boolean = false;
  public isSaving: boolean = false;
  // @ts-ignore : Mounted에 호출됨.
  private board: Board;
  private editor: CKClassicEditor;
  private id: string = '';

  constructor() {
    super();
    this.saveContent = debounce(this.saveImmediate, 500);
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
    this.isSaving = true;
    this.board.title = this.title;
    this.board.icon = this.boardIcon;
    this.board.category = UiConfiguration.getUiCategoryValueFromName(
      this.category
    );
    this.board.content = this.editor.getData();
    await this.board.save();
    this.isSaving = false;
  }

  // private methods Vue Watch
  @Watch('category')
  private onCategoryChanged(value: string, oldValue: string) {
    this.saveContent();
  }

  @Watch('boardIcon')
  private onBoardIconChanged(value: string, oldValue: string) {
    this.saveContent();
  }

  @Watch('title')
  private onTitleChanged(value: string, oldValue: string) {
    this.saveContent();
  }
  private async onPublishChanged() {
    try {
      this.board.publish(this.isPublish);
      this.isPublishIndeterminate = true;
      this.progressDialog.open();
      this.progressDialog.updateMessage('게시상태를 변경하고있습니다...');
      await this.saveImmediate();
      this.isPublishIndeterminate = false;
      this.progressDialog.close();
    } catch (e) {
      alert('저장에 실패하였습니다.');
      this.isPublish = !this.isPublish;
      this.board.publish(this.isPublish);
    }
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
      await this.board.loadContent();
      this.title = this.board.title;
      this.editor.setData(this.board.content);
      this.boardIcon = this.board.icon;
      this.category = this.board.category;
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

  private getTitleRules() {
    return [
      (v: string) => !!v || 'Title is required',
      (v: string) => v.length <= 40 || 'Title must be less than 40 characters'
    ];
  }
}
