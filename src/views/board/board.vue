<template >
  <div>
    
    <v-container class="section py-5">
      <div v-if="boardItem !== null" class="title-group">
        <p class="display-1 px-1 font-weight-regular">{{boardItem.data.title}}</p>
        <p class="headline px-1 font-weight-thin">{{boardItem.data.description}}</p>
      </div>
      <v-layout class="editor-field" row wrap>
        <v-flex xs12 md8 pl-1 pr-3>
          <div class="board-content" v-html="boardContent"></div>
          <div ref="editorField"></div>
        </v-flex>
        <v-flex xs12 md4 pl-3 pr-1 class="relateboard-list">
          <p class="subheading font-weight-medium">RELATE BLOGS</p>
          <div class="board-item">
            <board-item-previewer v-if="boardItem !== null" :boardItem="boardItem"></board-item-previewer>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script src='./board.ts' />
<style lang='scss'>
@import './board.scss';
</style>
