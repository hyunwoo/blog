<template >
  <v-container>
    <v-layout class="editor-field">
      <v-flex xs12>
        <textarea ref='editorField'>
        </textarea>
      </v-flex>
    </v-layout>
    <v-layout>
      <div>
        <v-btn depressed>B</v-btn>
      </div>
      <div>
        <v-btn depressed
               color="primary">Primary</v-btn>
      </div>
    </v-layout>
  </v-container>
</template>
<script src='./editor.ts' />
<style lang='scss'>
h3 {
  background: #f00;
}
.editor-field {
}
.ck.ck-editor {
}
.ck.ck-editor__main {
}
.ck.ck-editor__editable {
  min-height: 480px;
}
</style>
