<template>
  <v-container>
    <v-list-tile>게시글 카운트 {{boards.length}}</v-list-tile>
    <template v-for="(boardItem, i) in boards">
      <h4 :key="i">{{boardItem.title}} {{boardItem.icon}}</h4>
    </template>
  </v-container>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { v1 as uuid } from 'uuid';
import { UiCategory, UiConfiguration } from '@/lib/configuration/ui';
import { FirebaseCommon } from '@/lib/api/firebase';
import Board from '@/lib/api/board';
@Component({})
export default class Home extends Vue {
  private boards: Board[] = [];
  private categories: UiCategory[] = UiConfiguration.uiCategories;
  public toEditor() {
    this.$router.push(`/editor/${uuid()}`);
  }
  private async created() {
    console.log('article created');
  }
  private async mounted() {
    try {
      this.boards = (await FirebaseCommon.getBoards(
        this.$route.params.category
      )).data;
      console.log(this.boards);
    } catch (e) {
      console.log(e);
    }
  }
  // computed
  public get boardList() {
    return this.boards;
  }
}
</script>

<style scoped lang='scss'>
</style>