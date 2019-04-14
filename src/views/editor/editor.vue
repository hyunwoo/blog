<template >
  <v-container class="section">
    <v-dialog v-model="uiCategoryDialog.visible" persistent max-width="480px">
      <v-card>
        <v-card-title>
          <span class="headline pl-2 font-weight-medium">CATEGORY SETTING</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-layout px-3 mt-3>
          <v-text-field v-model="boardCategoryModel.group" label="Category Group"></v-text-field>
          <v-text-field class="ml-2" v-model="boardCategoryModel.name" label="Category Name"></v-text-field>
          <v-btn
            icon
            color="primary"
            @click="createCategory"
            :loading="uiCategoryDialog.inProgress"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-layout>
        <v-divider></v-divider>
        <div class="category-list-container">
          <v-list three-line subheader class="pa-0">
            <v-list-tile v-for="(item,i) in boardCategories" :key="i" class="bb category-list-tile">
              <v-list-tile-content>
                <v-list-tile-title>{{item.data.name}}</v-list-tile-title>
                <v-list-tile-sub-title>{{item.data.group}}</v-list-tile-sub-title>
                <v-list-tile-sub-title>
                  <div class="caption">{{item.data.createdAt}}</div>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn
                  :disabled="uiCategoryDialog.inProgress"
                  icon
                  ripple
                  @click="deleteCategory(item)"
                  class="delete-icon"
                >
                  <v-icon color="red lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </div>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            flat
            @click="uiCategoryDialog.visible = false"
            :disabled="uiCategoryDialog.inProgress"
          >close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="save-indicator" :active="uiOptions.saving">
      <v-progress-circular
        color="green"
        indeterminate
        :value="0"
        size="14"
        class="ml-2 mb-2"
        width="2"
      ></v-progress-circular>
      <span class="save-indicator-text">저장중 ...</span>
    </div>
    <p class="headline pa-1 mt-4">게시글 작성</p>
    <p>{{boardItem === undefined}}</p>
    <template v-if="boardItem !== undefined">
      <v-layout pa-1 wrap class="options-container pa-3">
        <v-flex xs12 sm8 class="pt-3 pr-2">
          <v-layout>
            <v-overflow-btn
              d-flex
              :items="boardCategories.map(cat => cat.data.name)"
              v-model="uiOptions.selectedCategory"
              @change="onChangeCateogory"
            ></v-overflow-btn>
            <v-btn
              icon
              class="mt-3 ml-4"
              flat
              color="accent"
              @click="uiCategoryDialog.visible = true"
            >
              <v-icon>settings</v-icon>
            </v-btn>
          </v-layout>
          <v-text-field
            label="제목"
            @change="saveContent"
            v-model="boardItem.data.title"
            :rules="getDefaultRules('제목')"
            required
            counter="40"
          ></v-text-field>
          <v-text-field
            label="부제목"
            @change="saveContent"
            v-model="boardItem.data.description"
            :rules="getDefaultRules('부제목')"
            required
            counter="40"
          ></v-text-field>
          <v-btn
            color="primary"
            @click="uploadMainImage"
            class="mt-4 mb-2 elevation-0"
            block
            :disabled="isPublish"
          >Upload Main Image</v-btn>
        </v-flex>
        <v-flex xs12 sm4 class="pa-3">
          <div class="elevation-0 board-item-card-preview elevation-1">
            <board-item-previewer
              ref="boardItemPreviewer"
              :boardItem="boardItem"
              @click-preview="onClickPreview"
            ></board-item-previewer>
          </div>
        </v-flex>
      </v-layout>

      <v-layout class="editor-field">
        <v-flex xs12>
          <!-- <ckeditor :editor="editor" :config="editorConfig"></ckeditor> -->
          <tiny-editor
            ref="tm"
            v-model="editorContent"
            api-key="w9nga9ek5y1h1cc4j8pyh859z90cwqara2za3ob3hrnymla3"
            :init="tinyEditorConfiguration"
          ></tiny-editor>
        </v-flex>
      </v-layout>
      <v-layout class="action-container bt-none">
        <v-btn flat @click="uploadHtml">Html Upload</v-btn>
        <v-divider vertical></v-divider>
        <v-btn flat @click="uploadMD">MD Upload</v-btn>
        <v-divider vertical></v-divider>
        <v-spacer></v-spacer>
        <v-divider vertical></v-divider>
        <v-btn
          class="mx-2"
          block
          color="error"
          @click="changeBoardState"
          :loading="uiOptions.saving"
        >{{boardItem.data.published ?'포스트 게시 취소':'포스트 게시'}}</v-btn>
      </v-layout>
      <v-layout>
        <v-spacer></v-spacer>
      </v-layout>
      <div class="my-5"></div>
      <v-speed-dial
        v-model="fab"
        :top="false"
        :bottom="true"
        :right="true"
        :left="false"
        :direction="'top'"
        :open-on-hover="false"
        :transition="'slide-y-reverse-transition'"
      >
        <v-btn slot="activator" v-model="fab" color="blue darken-2" dark fab>
          <v-icon>settings</v-icon>
          <v-icon>close</v-icon>
        </v-btn>

        <v-btn fab dark small color="green" @click="changeBoardState(true)">
          <v-icon>send</v-icon>
          <span>Tooltip</span>
        </v-btn>

        <v-btn fab dark small color="indigo" @click="saveImmediate">
          <v-icon>save</v-icon>
        </v-btn>
        <v-btn fab dark small color="pink" @click="changeBoardState">
          <v-icon>code</v-icon>
        </v-btn>
        <v-btn fab dark small color="red" @click="deleteBoard">
          <v-icon>delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </template>
  </v-container>
</template>
<script src='./editor.ts' />
<style lang='scss'>
@import '../../style/_common.scss';

$border-color: #ccc;
.tox.tox-fullscreen {
  background: #fff;
  .tox-editor-container {
    border: solid 1px $border-color;
    margin: auto;
    max-width: 940px;
  }
}

.section {
  max-width: 940px;
  padding: 0;
}

pre {
  background: #333;
  color: #fff;
  padding: 16px;
}
// TODO h1 -> to vuetify typo
.options-container-wrap {
  padding: 1px;
}

.category-list-tile {
  .delete-icon {
    opacity: 0;
    pointer-events: none;
  }
  &:hover {
    .delete-icon {
      opacity: 1;
      pointer-events: all;
    }
  }
}
.options-container {
  min-height: 360px;
  background: #fff;
  border: solid 1px $border-color;
  border-bottom: none;
  &.loading {
    background: #eee;
  }
}

.board-item-card-preview {
  height: 280px;
  position: relative;
}

.v-speed-dial {
  position: fixed;
}
.ck.ck-sticky-panel__content_sticky {
  @media screen and (max-width: 600px) {
    margin-top: 0px;
    width: 100vw !important;
    left: 0 !important;
  }
  margin-top: 66px;
}
.category-list-container {
  background: #eee;
  height: 300px;
  overflow-y: scroll;
}

.action-container {
  border: solid 1px $border-color;
}
.save-indicator {
  position: fixed;
  left: 4px;
  bottom: 4px;
  z-index: 3;
  height: 22px;
  padding: 3px 0;
  background: rgba(255, 255, 255, 0.6);
  border: solid 1px rgba(0, 0, 0, 0.1);

  .save-indicator-text {
    padding: 0;
    margin: 0;
    color: #aaa;
    line-height: 14px;
    vertical-align: top;
    padding-left: 6px;
    padding-right: 6px;
    font-size: 10px;
  }
  transition: opacity 0.3s;
  opacity: 0;
  &[active] {
    opacity: 1;
  }
}
</style>
