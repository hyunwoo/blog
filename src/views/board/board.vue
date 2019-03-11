<template >
  <v-container class="section">
    <v-layout class="editor-field" row wrap>
      <v-flex xs12 md8 pa-3>
        <div class="board-content" v-html="boardContent"></div>
        <div ref="editorField"></div>
      </v-flex>
      <v-flex xs12 md4 pa-3>
        <div class="board-content" v-html="boardContent"></div>
        <div ref="editorField"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script src='./board.ts' />
<style lang='scss'>
@import './board.scss';
</style>
