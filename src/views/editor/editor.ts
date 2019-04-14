// import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { Component, Vue, Watch, Emit } from 'vue-property-decorator';
import { UiBoardIcon, UiConfiguration } from '@/lib/configuration/ui';
import { debounce, isNil } from 'lodash';
import axios from 'axios';
import marked from 'marked';
import FileUtil from '@/util/file';
import _ from 'lodash';
import { BoardItem, BoardCategory } from '@/lib/forms';
import uuid from 'uuid/v1';
import {
  FirestoreCollection,
  FirestoreDocument,
  Storage
} from '@/lib/firebase';

import config from './configration';
import TinyEditor from '@tinymce/tinymce-vue';

import '@/lib/prism/prism.css';
import { auth } from '@/lib/firebase';
import { BoardItemPreviewer } from '@/components/boardItemPreviewer';

// commonjs require
// NOTE: default needed after require

@Component({
  components: {
    'tiny-editor': TinyEditor
  }
})
export default class Editor extends Vue {
  get tinyEditorConfiguration() {
    return {
      branding: false,
      max_width: 800,
      min_height: 680,
      // menubar: false,
      quickbars_selection_toolbar:
        'blocks font bold italic | h1 h2 h3 blockquote | forecolor ',
      plugins:
        'wordcount fullscreen code quickbars searchreplace ' + // system
        'image imagetools media autolink codesample link ' + // embed
        'anchor code lists table advcode',
      toolbar:
        'fontselect bold italic underline strikethrough blockquote | forecolor backcolor | ' +
        'alignleft aligncenter alignright alignjustify | outdent indent | ' +
        'codesample image media | ' +
        'numlist bullist link anchor | ' +
        'fullscreen',
      contextmenu: 'image link',
      images_upload_handler: this.onUploadImage,
      automatic_uploads: false,
      resize: false,
      autoresize: 'off',
      codesample_languages: [
        { text: 'HTML/XML', value: 'markup' },
        { text: 'JavaScript', value: 'javascript' },
        { text: 'TypeScript', value: 'javascript' },
        { text: 'CSS', value: 'css' },
        { text: 'scss', value: 'css' },
        { text: 'sass', value: 'css' },
        { text: 'C#', value: 'csharp' }
      ],
      setup: (editor) => {
        editor.on('init', this.onEditorInitailized);
      }
    };
  }

  public $refs!: Vue['$refs'] & {
    boardItemPreviewer: BoardItemPreviewer;
    tm: any;
  };

  public editorContent: string = '';
  public title: string = '';
  public fab: boolean = false;
  public editor = ClassicEditor;
  public editorConfig = config;
  public boardItem!: FirestoreDocument<BoardItem>;
  public boardIcon: number | undefined = 0;
  public boardIcons: UiBoardIcon[] = UiConfiguration.uiBoardIcons;
  public category: string = UiConfiguration.uiCategoryNames[0];
  public dropdownCategory: string[] = UiConfiguration.uiCategoryNames;
  public saveContent: () => Promise<void>;
  public isPublish: boolean = false;
  public isPublishIndeterminate: boolean = false;
  public isSaving: boolean = false;
  public uiOptions = {
    saving: false,
    selectedCategory: ''
  };
  public loaded = {
    editor: false,
    auth: false
  };

  public uiCategoryDialog = {
    visible: false,
    inProgress: false
  };
  public boardCategoryModel = new BoardCategory();
  public boardCategories: Array<FirestoreDocument<BoardCategory>> = [];

  private id: string = '';

  constructor() {
    super();
    this.saveContent = debounce(this.saveImmediate, 1000);
  }

  public onRefreshPreview() {
    this.$refs.boardItemPreviewer.refresh();
  }
  public onClickPreview(id: string) {
    console.log('??');
    this.$snackbar.showWithAction(
      'VIEW 버튼을 클릭하여 게시글을 확인 할 수 있습니다.',
      'VIEW',
      () => {
        this.$router.push(`/board/${id}`);
      },
      true
    );
    console.log(this.$refs);
  }

  public async onUploadImage(info, success, failure) {
    try {
      const mediaId = uuid();
      const storageRef = `board/${this.id}/${mediaId}`;
      const blob = info.blob();
      const storage = new Storage(storageRef);
      await storage.upload(blob);
      const url = await storage.getDownloadURL();
      const result = { default: url };
      success(url);
    } catch (e) {
      failure(e);
    }
  }

  public async changeBoardState(isPublish?: boolean | MouseEvent) {
    if (isPublish !== undefined && !(isPublish instanceof MouseEvent)) {
      this.boardItem.data.published = isPublish;
    } else {
      this.boardItem.data.published = !this.boardItem.data.published;
    }
    await this.saveImmediate();
  }
  public async deleteBoard() {
    this.$progressDialog.open();
    this.$progressDialog.updateMessage('포스트를 삭제중입니다..');
    await this.boardItem.delete();
    this.$snackbar.show('포스트의 삭제가 완료되었습니다.');
    this.$router.push('/my');
    this.$progressDialog.close();
  }

  public async createCategory() {
    this.uiCategoryDialog.inProgress = true;
    this.boardCategoryModel.createdAt = new Date().toUTCString();
    const item = this.$collection.boardCategory.generate(
      this.boardCategoryModel
    );
    this.boardCategoryModel = new BoardCategory();
    await item.saveSync();
    this.boardCategories.push(item);
    this.uiCategoryDialog.inProgress = false;
  }
  public async deleteCategory(item: FirestoreDocument<BoardCategory>) {
    this.uiCategoryDialog.inProgress = true;
    await item.delete();
    const index = this.boardCategories.indexOf(item);
    this.boardCategories.splice(index, 1);
    this.uiCategoryDialog.inProgress = false;
  }
  public async onChangeCateogory(e) {
    const found = this.boardCategories.find((cat) => cat.data.name === e);
    if (this.boardItem === null || found === undefined) {
      return;
    }
    this.boardItem.data.category = found.data;
    this.saveContent();
  }

  public getEditor() {
    return this.editor;
  }
  public getBoard() {
    // TODO
  }
  public async saveImmediate() {
    this.$refs.boardItemPreviewer.refresh();
    this.uiOptions.saving = true;
    const storage = new Storage(`/board/${this.id}/index.html`);
    await storage.uploadString(this.editorContent);
    const url = await storage.getDownloadURL();
    const content = url;
    this.boardItem.data.content = content;
    this.boardItem.data.modifiedAt = new Date().toUTCString();
    await this.boardItem.saveSync();
    this.uiOptions.saving = false;
    this.$snackbar.show('저장이 완료되었습니다.');
  }
  public onChangeTitle() {
    console.log('change title');
  }
  public async uploadHtml() {
    try {
      this.editorContent = await FileUtil.readInputFileAsString('.html');
    } catch (e) {
      // TODO
    }
  }
  public async uploadMD() {
    try {
      const mdString = await FileUtil.readInputFileAsString('.md');
      const html = marked(mdString);
      this.editorContent = html;
    } catch (e) {
      // TODO
    }
  }

  @Watch('$route.params')
  private onChangeRoute() {
    console.log('route Changed', this);
    this.id = this.$route.params.id;
    this.$loadingDialog.open();
    this.init();
  }
  private created() {
    this.id = this.$route.params.id;
    this.boardItem = this.$collection.board.generate(new BoardItem(), this.id);
    this.$loadingDialog.open();
  }
  private async init() {
    // @ts-ignore
    this.boardItem = this.$collection.board.generate(new BoardItem(), this.id);
    if (_.isEmpty(this.$store.getters.user)) {
      this.$loadingDialog.close();
      this.$snackbar.show('작성 권한이 없습니다.');
      this.$router.push('/');
      return;
    }

    this.boardCategories = await this.$collection.boardCategory.get(
      BoardCategory
    );
    // Board 데이터베이스 데이터 로드 or 초기화
    const collection = this.$collection.board;

    try {
      // exist

      const item = await collection.load(BoardItem, this.id);
      _.assign(this.boardItem, item);
      const response = await axios.get(this.boardItem.data.content);
      this.editorContent = response.data;
      this.uiOptions.selectedCategory = this.boardItem.data.category.name;
      console.log(response);
    } catch (e) {
      this.boardItem.data.createdAt = this.boardItem.data.modifiedAt = new Date().toUTCString();
      this.boardItem.data.category = new BoardCategory();
      this.boardItem.data.id = this.id;
      this.boardItem.data.userId = this.$store.getters.user.id;
      this.boardItem.data.userInfo = this.$store.getters.user.data;
      this.editorContent = '';
      console.log(`board ${this.id} generated`, this.boardItem.data);
    }
    this.loaded.auth = true;
    console.log('current boardItem', this.boardItem);
    this.$forceUpdate();
    this.onLoadCheck();

    console.log(this.$refs);
    this.$refs.boardItemPreviewer.refresh();
  }

  private async mounted() {
    this.init();
  }

  private onLoadCheck() {
    if (this.loaded.editor && this.loaded.auth) {
      this.$snackbar.show('에디터 로딩이 완료되었습니다.');
      this.$loadingDialog.close();
    }
  }

  private onEditorInitailized() {
    this.loaded.editor = true;
    this.onLoadCheck();
  }

  private async uploadMainImage() {
    if (this.boardItem === null) {
      return;
    }
    try {
      const file = await FileUtil.readInputFile('.jpg,.jpeg,.png');
      this.$progressDialog.open();
      this.$progressDialog.updateMessage(
        '이미지를 업로드하고 프리뷰를 생성합니다.'
      );

      const storage = new Storage(`/board/${this.id}/mainImage`);
      await storage.upload(file);
      const url = await storage.getDownloadURL();
      this.boardItem.data.mainImageURL = url;
      await this.saveImmediate();
      this.$progressDialog.close();
    } catch (e) {
      this.$progressDialog.close();
    }
    // todo Upload File
  }
  private getDefaultRules(name) {
    return [
      (v: string) => !!v || `${name}이 필요합니다.`,
      (v: string) => v.length <= 40 || `${name}은 40글자가 넘을 수 없습니다.`
    ];
  }
}
