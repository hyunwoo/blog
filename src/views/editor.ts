import CKEditor from '@ckeditor/ckeditor5-vue';
import CKClassicEditor from '@ckeditor/ckeditor5-build-classic/';
// import template from './editor.html';
import { Component, Vue } from 'vue-property-decorator';
import UploadAdapter from '@/lib/uploadAdapter';

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

  constructor() {
    super();
  }

  public async mounted(): Promise<void> {
    this.editor = await CKClassicEditor.create(this.$refs.editorField, {
      extraPlugins: [UploadAdapter.Inject]
    });
    console.log(this.editor);

    // this.editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    //   // Configure the URL to the upload script in your back-end here!
    //   // return new MyUploadAdapter(loader, 'http://example.com/image/upload/path');
    //   return new UploadAdapter(loader);
    // };
  }
  public async save(): Promise<void> {
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
