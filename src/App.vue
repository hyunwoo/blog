<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>HANU</span>
        <span class="font-weight-light">BLOG</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat
             href="https://github.com/vuetifyjs/vuetify/releases/latest"
             target="_blank">
        <span class="mr-2">Latest</span>
      </v-btn>
    </v-toolbar>
    <v-content class="section-outer">
      <section>
        <router-view></router-view>
      </section>
    </v-content>
  </v-app>
</template>
<style lang="scss">
section {
  max-width: 960px;
  margin: auto;
  height: 100%;
}
.section-outer {
}
</style>

<script src='./app.ts'/>

