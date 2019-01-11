<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank">
        <span class="mr-2">Latest</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container>
        <v-layout>
          <v-flex lg1></v-flex>
          <v-flex lg10>
            <router-view></router-view>
          </v-flex>
          <v-flex lg1></v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang='ts'>
import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import store from './store';

Vue.use(Vuex);

export default {
  name: 'App',
  components: {},
  data() {
    return {
      //
    };
  }
};
</script>
