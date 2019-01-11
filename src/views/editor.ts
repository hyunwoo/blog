import CKEditor from '@ckeditor/ckeditor5-vue';
import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
// import template from './editor.html';
import { Component, Vue } from 'vue-property-decorator';
import Router from 'vue-router';
import UploadAdapter from '../lib/uploadAdapter';
import Board from '../lib/api/board';
import { v1 as uuid } from 'uuid';
import _ from 'lodash';

@Component({
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    return {
      title: '',
      ui: {
        button: {
          fab: false
        }
      }
    };
  }
})
export default class Editor extends Vue {
  public title: string = '';
  public fab: boolean = false;
  public editor: CKClassicEditor;
  public toggleIcon: number = 0;
  // @ts-ignore
  public board: Board;
  public dropdownCategory: string[] = ['NOTICE', 'BOARD', 'Q&A'];
  private id: string = '';

  constructor() {
    super();
  }
  public created() {
    this.id = this.$route.params.id;
  }
  public async mounted() {
    console.log('mounted!');
    const isExist = (await Board.exist(this.id)).data;
    this.editor = await CKClassicEditor.create(this.$refs.editorField, {
      toolbal: {
        viewportTopOffset: 30
      }
    });
    this.editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader, this.board);
    };

    if (isExist) {
      // Exist! load content
      this.board = (await Board.load(this.id)).data;
      this.title = this.board.title;
      this.editor.setData(this.board.content);
      console.log('loaded', this.board);
    } else {
      // not exist! create content
      this.board = (await Board.create(this.id)).data;
    }

    console.log(this.board.getId());

    this.editor.model.document.on(
      'change:data',
      _.debounce(async (e) => {
        this.board.content = this.editor.getData();
        const ret = await this.board.save();
        console.log('save over');
      }, 1000)
    );
    // this.loadingDialog.close();
  }
  public async save() {
    console.log('on Save');
    this.board.title = this.title;
    const ret = await this.board.save();
    // console.log(ret);
    // todo save
  }
}

// export default {
//   data() {
//     return {
//       editor: Editor,
//       editorConfig: {},
//       editorData: ''
//     };
//   },
//   methods: {
//     save() {
//       console.log(this);
//     }
//   },
//   mounted() {
//     console.log('default mounted');

//   }
// };
