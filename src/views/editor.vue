<template >
  <v-container>
    <v-layout class="editor-field">
      <v-flex xs12>
        <div ref="editorField"></div>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex sm4 md6 lg8 pa-1></v-flex>
      <v-flex xs12 sm4 md3 lg2 pa-1>
        <div>
          <v-btn depressed block color="primary">저장하기</v-btn>
        </div>
      </v-flex>
      <v-flex xs12 sm4 md3 lg2 pa-1>
        <div>
          <v-btn depressed block color="primary" @click="save">게시하기</v-btn>
        </div>
      </v-flex>
    </v-layout>
    <v-flex lg1></v-flex>
  </v-container>
</template>
<script src='./editor.ts' />
<style lang='scss'>
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
