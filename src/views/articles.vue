<template>
  <v-container>
    <v-list-tile>게시글 카운트 {{boards.length}}</v-list-tile>
    <v-data-table :headers="headers" :items="boards" class="elevation-2">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.icon }}</td>
        <td>{{ props.item.title }}</td>
        <td class="text-xs-right">{{ props.item.viewCount }}</td>
        <td class="text-xs-right">{{ props.item.createdAt }}</td>
        <td class="text-xs-right">{{ props.item.id }}</td>
      </template>
    </v-data-table>
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
  private headers = [
    {
      text: 'Icon',
      align: 'left',
      value: 'name'
    },
    { text: '제목', value: 'title' },
    { text: '조회수', value: 'viewCount' },
    { text: '생성일', value: 'createdAt' },
    { text: 'ID', value: 'id' }
  ];
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