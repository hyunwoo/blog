<template>
  <v-app>
    <v-toolbar app class="elevation-0">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title
        @click="$router.push('/')"
        class="cursor--pointer headline font--cursive"
      >H.hyunwoo</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content class="section-outer">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Dancing+Script:700');
@import url('https://fonts.googleapis.com/css?family=Nanum+Myeongjo:400,700|Noto+Sans+KR:400,700&subset=korean');
@import './style/_common.scss';
.font--cursive {
  font-family: 'Dancing Script', cursive !important;
}
.container {
}
.search-area {
  width: 300px;
  height: 52px;
}
section {
  max-width: 960px;
  margin: auto;
  height: 100%;
}

.section-outer {
}
</style>

<script src='./app.ts'/>

