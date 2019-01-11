<template>
  <div class="mt-5">
    <v-layout align-center
              wrap>
      <v-flex xs12
              text-xs-center>
        <v-btn large
               color="info">
          <h3>BOARD</h3>
        </v-btn>
        <v-btn large
               color="info">
          <h3>NOTICE</h3>
        </v-btn>
      </v-flex>
      <v-flex xs12
              class="mt-5"
              text-xs-center>
        <v-btn large
               color="info"
               to="/editor/test">
          <h3>업로드</h3>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {}
</script>
