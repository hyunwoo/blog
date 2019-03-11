<template>
  <v-app>
    <v-toolbar app class="elevation-0 bb">
      <v-toolbar-title class="headline text-uppercase">
        <span>HANU</span>
        <span class="font-weight-light">BLOG</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field class="search-area" append-outer-icon="place"></v-text-field>
    </v-toolbar>
    <v-content class="section-outer">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>
<style lang="scss">
@import './style/_common.scss';
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

