import CKEditor from '@ckeditor/ckeditor5-vue';
import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
import { Component, Vue, Watch } from 'vue-property-decorator';
import UploadAdapter from '@/lib/uploadAdapter';
import { UiBoardIcon, UiConfiguration } from '@/lib/configuration/ui';
import { debounce, isNil } from 'lodash';
import axios from 'axios';
import { isNullOrUndefined } from 'util';
import { readFile } from 'fs';
import marked from 'marked';
import FileUtil from '@/util/file';
import { BoardItem, BoardCategory } from '@/lib/forms';
import {
  FirestoreCollection,
  FirestoreDocument,
  Storage
} from '@/lib/firebase';

// CKEditor Plugins
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
// import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
// import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
// import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
// import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';

// import Image from '@ckeditor/ckeditor5-image/src/image';
// import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
// import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
// import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
// import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
// import Heading from '@ckeditor/ckeditor5-heading/src/heading';

// // current
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

@Component({
  components: {
    ckeditor: CKEditor.component
  }
})
export default class Editor extends Vue {
  public $refs!: {
    boardItemPreview: HTMLElement;
    editorField: HTMLElement;
  };

  public title: string = '';
  public fab: boolean = false;

  public boardItem: FirestoreDocument<BoardItem> | null = null;
  public boardIcon: number | undefined = 0;
  public boardIcons: UiBoardIcon[] = UiConfiguration.uiBoardIcons;
  public category: string = UiConfiguration.uiCategoryNames[0];
  public dropdownCategory: string[] = UiConfiguration.uiCategoryNames;
  public saveContent: (() => Promise<void>);
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
  private editor: CKClassicEditor;
  private id: string = '';

  constructor() {
    super();
    this.saveContent = debounce(this.saveImmediate, 1000);
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
    // let html: string = (await FileUtil.readInputFileAsString('.html')).data;
    // html = html
    //   .replace(/<pre>/gi, '<blockquote>')
    //   .replace(/<\/pre>/gi, '</blockquote>');
    // this.editor.setData(html);
  }
  public async uploadMD() {
    // let html: string = marked(
    //   (await FileUtil.readInputFileAsString('.md')).data
    // );
    // html = html
    //   .replace(/<pre>/gi, '<blockquote>')
    //   .replace(/<\/pre>/gi, '</blockquote>');
    // this.editor.setData(html);
  }
  // private methods Vue Watch

  private async onPublishChanged(state?: boolean) {
    // try {
    //   if (isNil(state)) {
    //     this.board.publish(this.isPublish);
    //   } else {
    //     this.board.publish(state);
    //     this.isPublish = true;
    //   }
    //   this.isPublishIndeterminate = true;
    //   this.progressDialog.open();
    //   this.progressDialog.updateMessage('게시상태를 변경하고있습니다...');
    //   await this.saveImmediate();
    //   this.isPublishIndeterminate = false;
    //   this.progressDialog.close();
    // } catch (e) {
    //   alert('저장에 실패하였습니다.');
    //   this.isPublish = !this.isPublish;
    //   this.board.publish(this.isPublish);
    // }
  }

  // private methods Vue Default Methods
  private async mounted() {
    this.progressDialog.open();
    this.progressDialog.updateMessage('페이지를 로딩중입니다.');

    // CK Editor init
    // TODO If ie not build this
    this.editor = await CKClassicEditor.create(this.$refs.editorField, {});
    const repo = this.editor.plugins.get('FileRepository');
    repo.createUploadAdapter = (loader: any) => {
      return new UploadAdapter(loader, this.id);
    };

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
      const content = await axios.get(this.boardItem.data.content);
      this.editor.setData(content.data);
      this.uiOptions.selectedCategory = this.boardItem.data.category.name;
      console.log(content);
    } catch (e) {
      this.boardItem = collection.generate(new BoardItem(), this.id);
      this.boardItem.data.createdAt = this.boardItem.data.modifiedAt = new Date().toUTCString();
      this.boardItem.data.category = new BoardCategory();
      console.log(`board ${this.id} generated`);
    }
    this.editor.model.document.on('change:data', this.saveContent);

    this.progressDialog.close();
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
