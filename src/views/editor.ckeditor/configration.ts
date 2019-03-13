// current

import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import ClipboardPlugin from '@ckeditor/ckeditor5-clipboard/src/clipboard';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import FontFamilyPlugin from '@ckeditor/ckeditor5-font/src/fontfamily';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';

import FileRepositoryPlugin from '@ckeditor/ckeditor5-upload/src/filerepository';
import FileReaderPlugin from '@ckeditor/ckeditor5-upload/src/filereader';

// custom
import PreElement from 'ckeditor5-code-block/src/pre';
import UploadAdapterPlugin from './uploadAdapter';

export default {
  plugins: [
    EssentialsPlugin,
    ClipboardPlugin,
    // Essentials
    HeadingPlugin,
    BoldPlugin,
    ItalicPlugin,
    LinkPlugin,
    ParagraphPlugin,
    FontFamilyPlugin,
    PreElement,
    // Image Upload
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    FileReaderPlugin,
    FileRepositoryPlugin
  ],
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'fontfamily',
      'bulletedList',
      'numberedList',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'pre',
      'undo',
      'redo'
    ]
  },
  image: {
    // You need to configure the image toolbar too, so it uses the new style buttons.
    toolbar: [
      'imageTextAlternative',
      '|',
      'imageStyleAlignLeft',
      'imageStyleFull',
      'imageStyleAlignRight'
    ],

    styles: [
      // This option is equal to a situation where no style is applied.
      'imageStyleFull',

      // This represents an image aligned to left.
      'imageStyleAlignLeft',

      // This represents an image aligned to right.
      'imageStyleAlignRight'
    ]
  },
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      {
        model: 'heading1',
        view: 'h1',
        title: 'Heading 1',
        class: 'display-4'
      },
      {
        model: 'heading2',
        view: 'h2',
        title: 'Heading 2',
        class: 'display-3'
      }
    ]
  },

  extraPlugins: [UploadAdapterPlugin]
};
