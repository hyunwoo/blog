<template>
  <v-container fluid>
    <p class="title mt-4">asdf</p>
    <v-layout fill-height>
      <v-flex xs6 xl4 class="board-item-block pa-1">
        <div class="board-item">
          <board-item-previewer :boardItem="boardItems[0]"></board-item-previewer>
        </div>
      </v-flex>
      <v-flex xs6 xl8>
        <v-layout row wrap>
          <v-flex xs6 xl4 class="board-item-block small pr-1 pb-1">
            <div class="board-item">
              <board-item-previewer :boardItem="boardItems[1]"></board-item-previewer>
            </div>
          </v-flex>
          <v-flex xs6 xl4 class="board-item-block small pr-1 pb-1">
            <div class="board-item">
              <board-item-previewer :boardItem="boardItems[2]"></board-item-previewer>
            </div>
          </v-flex>
          <v-flex xs6 xl4 class="board-item-block small pr-1 pb-1">
            <div class="board-item">
              <board-item-previewer :boardItem="boardItems[3]"></board-item-previewer>
            </div>
          </v-flex>
          <v-flex xs6 xl4 class="board-item-block small pr-1 pb-1">
            <div class="board-item">
              <board-item-previewer :boardItem="boardItems[4]"></board-item-previewer>
            </div>
          </v-flex>
          <v-flex v-if="$vuetify.breakpoint.xl" xs6 xl4 class="board-item-block small pr-1 pb-1">
            <div class="board-item">
              <board-item-previewer :boardItem="boardItems[5]"></board-item-previewer>
            </div>
          </v-flex>
          <v-flex v-if="$vuetify.breakpoint.xl" xs6 xl4 class="board-item-block small pr-1 pb-1">
            <div class="board-item">
              <board-item-previewer :boardItem="boardItems[6]"></board-item-previewer>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout>
      <div class="mt-5">
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
      </div>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { v1 as uuid } from 'uuid';
import { UiCategory, UiConfiguration } from '@/lib/configuration/ui';
import { FirestoreCollection, FirestoreDocument } from '@/lib/firebase';
import { BoardItem } from '@/lib/forms';

@Component({})
export default class Index extends Vue {
  public colBoardItem: FirestoreCollection<BoardItem> = new FirestoreCollection(
    '/board'
  );

  private categories: UiCategory[] = UiConfiguration.uiCategories;
  private boardItems: FirestoreDocument<BoardItem> | undefined[] = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ];

  public async mounted() {
    console.log('mounted!');
    const query = this.colBoardItem
      .createQuery('state', '==', 'editing')
      .limit(6);
    // const boards = await query.exec(BoardItem);
    const boards = await this.colBoardItem.get(BoardItem);
    console.log(boards);

    boards.forEach((board, i) => {
      console.log('add', board, i);
      Vue.set(this.boardItems, i, board);
    });
  }
  public toEditor() {
    this.$router.push(`/editor/${uuid()}`);
  }
}
</script>


<style lang="scss">
.board-item-block {
  height: 36vw;

  &.small {
    height: 18vw;
  }
}

.board-item {
  border-radius: 0;
  height: 100%;
  position: relative;
}
</style>
