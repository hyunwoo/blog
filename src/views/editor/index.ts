import Editor from '@ckeditor/ckeditor5-build-classic/';
// import template from './editor.html';

import template from './index.html';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  template,
  data() {
    return {
      editor: Editor
    };
  }
})
export default class BlogEditor extends Vue {
  public editorData: string;
  public editorConfig;

  constructor() {
    super();
    this.editorData = '';
    this.editorConfig = {};
  }

  public mounted() {
    console.log('mounted template is\n', template);
  }
}
