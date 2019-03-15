// import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { Component, Vue, Watch } from 'vue-property-decorator';
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
      min_height: 500,
      // menubar: false,
      quickbars_selection_toolbar:
        'blocks font bold italic | h1 h2 h3 blockquote ',
      plugins:
        'wordcount fullscreen code quickbars searchreplace ' + // system
        'image imagetools media autolink codesample link ' + // embed
        'anchor code lists table ',
      toolbar:
        'fontselect bold italic underline strikethrough blockquote | forecolor backcolor | ' +
        'alignleft aligncenter alignright alignjustify | outdent indent | ' +
        'codesample image media | ' +
        'numlist bullist link anchor | ' +
        'fullscreen ',
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

  public $refs!: {
    boardItemPreview: HTMLElement;
    tm: any;
  };

  public editorContent: string = '';
  public title: string = '';
  public fab: boolean = false;
  public editor = ClassicEditor;
  public editorConfig = config;
  public boardItem: FirestoreDocument<BoardItem> | null = null;
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

  public uiCategoryDialog = {
    visible: false,
    inProgress: false
  };
  public boardCategoryModel = new BoardCategory();
  public collectionBoardCategory = new FirestoreCollection<BoardCategory>(
    '/boardCategory'
  );
  public boardCategories: Array<FirestoreDocument<BoardCategory>> = [];

  // @ts-ignore : Mounted에 호출됨.

  private id: string = '';

  constructor() {
    super();
    this.saveContent = debounce(this.saveImmediate, 1000);
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
    if (this.boardItem === null) {
      return;
    }

    if (isPublish !== undefined && !(isPublish instanceof MouseEvent)) {
      this.boardItem.data.state = isPublish ? 'editing' : 'published';
    } else {
      if (this.boardItem.data.state === 'editing') {
        this.boardItem.data.state = 'published';
      } else {
        this.boardItem.data.state = 'editing';
      }
    }
    await this.saveImmediate();
  }
  public async createCategory() {
    this.uiCategoryDialog.inProgress = true;
    this.boardCategoryModel.createdAt = new Date().toUTCString();
    const item = this.collectionBoardCategory.generate(this.boardCategoryModel);
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
    console.log(e);
    const found = this.boardCategories.find((cat) => cat.data.name === e);
    console.log(found);
    if (this.boardItem === null || found === undefined) {
      return;
    }
    this.boardItem.data.category = found.data;
    await this.boardItem.saveSync();
  }

  public getEditor() {
    return this.editor;
  }
  public getBoard() {
    // TODO
  }
  public async saveImmediate() {
    if (this.boardItem === null) {
      return;
    }
    this.uiOptions.saving = true;
    const storage = new Storage(`/board/${this.id}/index.html`);
    await storage.uploadString(this.editorContent);
    const url = await storage.getDownloadURL();
    const content = url;
    this.boardItem.data.content = content;
    this.boardItem.data.modifiedAt = new Date().toUTCString();
    await this.boardItem.saveSync();
    this.uiOptions.saving = false;
  }
  public onChangeTitle() {
    console.log('change title');
  }
  public async uploadHtml() {
    // TODO
  }
  public async uploadMD() {
    // TODO
  }

  private created() {
    this.id = this.$route.params.id;
    this.$loadingDialog.open();
    if (!this.$store.getters.isAuth) {
      this.$snackbar.show('작성 권한이 없습니다.');
      this.$router.push('/');
      this.$loadingDialog.close();
      return;
    }

    auth.addChangeListener(
      'editor',
      async (user) => {
        if (user === null) {
          this.$loadingDialog.close();
          this.$snackbar.show('작성 권한이 없습니다.');
          this.$router.push('/');
          return;
        }
      },
      true
    );
  }

  private async mounted() {
    // Board Categories 데이터 로드

    this.boardCategories = await this.collectionBoardCategory.get(
      BoardCategory
    );
    // Board 데이터베이스 데이터 로드 or 초기화
    const collection = new FirestoreCollection<BoardItem>('/board');

    try {
      // exist
      this.boardItem = await collection.load(BoardItem, this.id);
      console.log(`board ${this.id} loaded`);
      const response = await axios.get(this.boardItem.data.content);
      this.editorContent = response.data;
      this.uiOptions.selectedCategory = this.boardItem.data.category.name;
      console.log(response);
    } catch (e) {
      this.boardItem = collection.generate(new BoardItem(), this.id);
      this.boardItem.data.createdAt = this.boardItem.data.modifiedAt = new Date().toUTCString();
      this.boardItem.data.category = new BoardCategory();
      console.log(`board ${this.id} generated`);
    }
  }

  private onEditorInitailized() {
    this.$loadingDialog.close();
    this.$snackbar.show('에디터가 로드 되었습니다.');
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
