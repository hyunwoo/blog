import CKEditor from '@ckeditor/ckeditor5-vue';
import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
// import template from './editor.html';
import { Component, Vue } from 'vue-property-decorator';
import Router from 'vue-router';
import UploadAdapter from '../lib/uploadAdapter';
import Board from '../lib/api/board';
import { v1 as uuid } from 'uuid';
import _ from 'lodash';

console.log(CKEditor);
@Component({
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    return {};
  }
})
export default class Editor extends Vue {
  public editor: CKClassicEditor;
  // @ts-ignore
  public board: Board;
  private id: string = '';

  constructor() {
    super();
  }

  public created() {
    this.id = this.$route.params.id;
  }
  public async mounted() {
    const isExist = await Board.exist(this.id);
    this.editor = await CKClassicEditor.create(this.$refs.editorField);
    this.editor.plugins.get('FileRepository').createUploadAdapter = (
      loader
    ) => {
      return new UploadAdapter(loader, this.board);
    };

    if (isExist) {
      // Exist! load content
      this.board = (await Board.load(this.id)).data;
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
  }
  public async save() {
    console.log('editor', this.editor.getData());
    console.log('save');
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
