<template >
  <v-container>
    <p class="headline pa-1 mt-4">게시글 작성</p>
    <v-layout pa-1
              wrap>
      <v-flex xs12
              md8
              class="pt-3 pr-5">
        <p>Category</p>
        <v-overflow-btn :items="dropdownCategory"
                        label="Select Category"
                        hide-details
                        class="pa-0 elevation-1"></v-overflow-btn>
      </v-flex>
      <v-flex></v-flex>
      <v-flex xs12
              md4
              class="pt-3">
        <p>Icons</p>
        <v-btn-toggle v-model="toggleIcon"
                      class="transparent mt-1 elevation-1">
          <v-btn :value="1"
                 color="red"
                 flat>
            <v-icon>favorite</v-icon>
          </v-btn>

          <v-btn :value="2"
                 color="indigo"
                 flat>
            <v-icon>star</v-icon>
          </v-btn>

          <v-btn :value="3"
                 color="indigo"
                 flat>
            <v-icon>thumb_up</v-icon>
          </v-btn>

          <v-btn :value="4"
                 color="indigo"
                 flat>
            <v-icon>thumb_down</v-icon>
          </v-btn>

          <v-btn :value="5"
                 color="orange"
                 flat>
            <v-icon>face</v-icon>
          </v-btn>
          <v-btn :value="6"
                 color="orange"
                 flat>
            <v-icon>help</v-icon>
          </v-btn>
          <v-btn :value="7"
                 color="pink"
                 flat>
            <v-icon>pets</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
    </v-layout>
    <v-layout pa-1
              mt-3>

      <v-text-field label="제목"
                    pa-3
                    v-model="title"></v-text-field>

    </v-layout>

    <v-layout class="editor-field"
              pa-1>
      <v-flex xs12>
        <div ref="editorField"></div>
      </v-flex>
    </v-layout>
    <v-flex lg1></v-flex>
    <v-speed-dial v-model="fab"
                  :top="false"
                  :bottom="true"
                  :right="true"
                  :left="false"
                  :direction="'top'"
                  :open-on-hover="false"
                  :transition="'slide-y-reverse-transition'">
      <v-btn slot="activator"
             v-model="fab"
             color="blue darken-2"
             dark
             fab>
        <v-icon>edit</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn fab
             dark
             small
             color="green"
             @click="save">
        <v-icon>send</v-icon>
      </v-btn>
      <v-btn fab
             dark
             small
             color="indigo">
        <v-icon>save</v-icon>
      </v-btn>
      <v-btn fab
             dark
             small
             color="red">
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
</style>
