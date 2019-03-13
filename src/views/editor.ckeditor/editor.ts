// import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { Component, Vue, Watch } from 'vue-property-decorator';
import UploadAdapter from './uploadAdapter';
import { UiBoardIcon, UiConfiguration } from '@/lib/configuration/ui';
import { debounce, isNil } from 'lodash';
import axios from 'axios';
import marked from 'marked';
import FileUtil from '@/util/file';
import _ from 'lodash';
import { BoardItem, BoardCategory } from '@/lib/forms';
import {
  FirestoreCollection,
  FirestoreDocument,
  Storage
} from '@/lib/firebase';

import config from './configration';
import TinyEditor from '@tinymce/tinymce-vue';
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
      plugins: 'wordcount codesample advlist autoresize',
      toolbar: 'codesample forecolor backcolor',
      advlist_bullet_styles: 'square',
      min_height: 500,
      autoresize_bottom_margin: 50
    };
  }
  public static mountedId: string = '';

  public $refs!: {
    boardItemPreview: HTMLElement;
    editorField: HTMLElement;
  };

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

  public onUploadImage(callback, value, meta) {
    console.log(callback, value, meta);
  }

  public async mounted() {
    // Editor.mountedId = this.$route.params.id;
    // this.progressDialog.open();
    // this.progressDialog.updateMessage('페이지를 로딩중입니다.');
    // this.editor = await ClassicEditor.create(this.$refs.editorField, config);
    // console.log(this.editor);
    // const repo = this.editor.plugins.get('FileRepository');
    // repo.createUploadAdapter = (loader: any) => {
    //   const adapter = new UploadAdapter(loader, this.id);
    //   console.log(adapter);
    //   return adapter;
    // };
    // this.progressDialog.close();
    return;
    // this.editor = await CKClassicEditor.create(this.$refs.editorField, {});
    // const repo = this.editor.plugins.get('FileRepository');
    // repo.createUploadAdapter = (loader: any) => {
    //   return new UploadAdapter(loader, this.id);
    // };

    // // Board Categories 데이터 로드
    // this.boardCategories = await this.collectionBoardCategory.get(
    //   BoardCategory
    // );

    // // Board 데이터베이스 데이터 로드 or 초기화
    // const collection = new FirestoreCollection<BoardItem>('/board');
    // try {
    //   // exist
    //   this.boardItem = await collection.load(BoardItem, this.id);
    //   console.log(`board ${this.id} loaded`);
    //   const content = await axios.get(this.boardItem.data.content);
    //   this.editor.setData(content.data);
    //   this.uiOptions.selectedCategory = this.boardItem.data.category.name;
    //   console.log(content);
    // } catch (e) {
    //   this.boardItem = collection.generate(new BoardItem(), this.id);
    //   this.boardItem.data.createdAt = this.boardItem.data.modifiedAt = new Date().toUTCString();
    //   this.boardItem.data.category = new BoardCategory();
    //   console.log(`board ${this.id} generated`);
    // }
    // this.editor.model.document.on('change:data', this.saveContent);

    // this.progressDialog.close();
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
    await storage.uploadString(this.editor.getData());
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
    console.log('created!');
    this.id = this.$route.params.id;
  }

  private async uploadMainImage() {
    if (this.boardItem === null) {
      return;
    }
    try {
      const file = await FileUtil.readInputFile('.jpg,.jpeg,.png');
      this.progressDialog.open();
      this.progressDialog.updateMessage(
        '이미지를 업로드하고 프리뷰를 생성합니다.'
      );
      const storage = new Storage(`/board/${this.id}/mainImage`);
      await storage.upload(file);
      const url = await storage.getDownloadURL();
      this.boardItem.data.mainImageURL = url;
      await this.saveImmediate();
      this.progressDialog.close();
    } catch (e) {
      this.progressDialog.close();
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
