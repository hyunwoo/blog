<template >
  <v-container>
    <div class="save-indicator" :active="isSaving">
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
    <v-layout pa-1 wrap>
      <v-flex xs12 md8 class="pt-3 pr-5">
        <v-text-field label="제목" v-model="title" :rules="getTitleRules()" required counter="40"></v-text-field>
        <p class="subheading pt-3">Board Header Icon</p>
        <v-btn-toggle v-model="boardIcon" class="transparent mt-1 mb-5">
          <template v-for="(icon,i) in boardIcons">
            <v-btn :value="icon.value" :color="icon.color" :key="i" flat>
              <v-icon>{{icon.icon}}</v-icon>
            </v-btn>
          </template>
        </v-btn-toggle>
      </v-flex>
      <v-flex xs12 md4>
        <v-card class="pa-3 elevation-3">
          <p class="subheading">Article Settings</p>
          <v-overflow-btn :items="dropdownCategory" v-model="category" @change="onChangeCateogory"></v-overflow-btn>
          <v-switch
            class="mt-2"
            color="success"
            :rules="[()=>{return title === ''}, ]"
            v-model="isPublish"
            @change="onPublishChanged"
          >
            <template slot="label">
              {{`${isPublish ? '게시 상태 입니다' : '편집 상태 입니다.'}`}}
              <v-progress-circular
                color="green"
                :indeterminate="isPublishIndeterminate"
                :value="0"
                size="20"
                class="ml-4"
                width="3"
              ></v-progress-circular>
            </template>
          </v-switch>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout pa-1 mt-3 wrap row justify-center>
      <v-flex xs12 sm12 md9 class="pr-4"></v-flex>
      <v-flex xs12 sm12 md3 align-center class="text-sm-right"></v-flex>
    </v-layout>

    <v-layout class="editor-field" pa-1>
      <v-flex xs12>
        <div ref="editorField"></div>
      </v-flex>
    </v-layout>
    <v-flex lg1></v-flex>
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
        <v-icon>edit</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn fab dark small color="green" @click="saveImmediate">
        <v-icon>send</v-icon>
      </v-btn>
      <v-btn fab dark small color="indigo">
        <v-icon>save</v-icon>
      </v-btn>
      <v-btn fab dark small color="red">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-speed-dial>
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
  max-height: 100%;
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
