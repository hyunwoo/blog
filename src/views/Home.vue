<template>
  <div class="mt-5">
    <v-layout align-center wrap>
      <v-flex xs12 text-xs-center>
        <v-btn
          large
          color="info"
          v-for="(category, i) in categories"
          :key="i"
          :to="'/articles/' + category.value"
        >
          <h3>{{category.name}}</h3>
        </v-btn>
      </v-flex>
      <v-flex xs12 class="mt-5" text-xs-center>
        <v-btn large color="info" @click="toEditor">
          <h3>업로드</h3>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { v1 as uuid } from 'uuid';
import { UiCategory, UiConfiguration } from '@/lib/configuration/ui';

@Component({})
export default class Home extends Vue {
  private categories: UiCategory[] = UiConfiguration.uiCategories;
  public toEditor() {
    this.$router.push(`/editor/${uuid()}`);
  }
}
</script>
