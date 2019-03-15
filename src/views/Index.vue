<template>
  <v-container>
    <div class="title mt-4 pa-1 text-uppercase text--red lighten-3">Recent Posts</div>
    <v-layout fill-height wrap row class="board-item-layout" :class="getBreakPoints">
      <v-flex xs12 sm8 md6 class="board-item-block pa-1">
        <div class="board-item">
          <board-item-previewer :boardItem="boardItems[0]"></board-item-previewer>
        </div>
      </v-flex>
      <v-flex xs12 sm4 md6>
        <v-layout row wrap class="board-item-layout" :class="getBreakPoints">
          <v-flex xs6 sm12 md6 class="board-item-block small pr-1 pb-1">
            <div class="board-item">
              <board-item-previewer :boardItem="boardItems[1]"></board-item-previewer>
            </div>
          </v-flex>
          <v-flex xs6 sm12 md6 class="board-item-block small pr-1 pb-1">
            <div class="board-item">
              <board-item-previewer :boardItem="boardItems[2]"></board-item-previewer>
            </div>
          </v-flex>
          <v-flex xs6 v-if="!$vuetify.breakpoint.sm" class="board-item-block small pr-1 pb-1">
            <div class="board-item">
              <board-item-previewer :boardItem="boardItems[3]"></board-item-previewer>
            </div>
          </v-flex>
          <v-flex xs6 v-if="!$vuetify.breakpoint.sm" class="board-item-block small pr-1 pb-1">
            <div class="board-item">
              <board-item-previewer :boardItem="boardItems[4]"></board-item-previewer>
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

  public get getBreakPoints() {
    const breakPoints = {
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false
    };
    if (this.$vuetify.breakpoint.xs) {
      breakPoints.xs = true;
    } else if (this.$vuetify.breakpoint.sm) {
      breakPoints.sm = true;
    } else if (this.$vuetify.breakpoint.md) {
      breakPoints.md = true;
    } else if (this.$vuetify.breakpoint.lg) {
      breakPoints.lg = true;
    } else if (this.$vuetify.breakpoint.xl) {
      breakPoints.xl = true;
    }

    return breakPoints;
  }
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

    boards.forEach((board, i) => {
      Vue.set(this.boardItems, i, board);
    });
  }
  public toEditor() {
    this.$router.push(`/editor/${uuid()}`);
  }
}
</script>


<style lang="scss">
.board-item-layout {
  .board-item-block {
    height: 480px;
    &.small {
      height: 240px;
    }
  }
  &.xs {
    .board-item-block {
      height: 80vw;
    }
    .board-item-block.small {
      height: 40vw;
    }
  }
  &.sm {
    .board-item-block {
      height: 45vw;
    }
    .board-item-block.small {
      height: 22.5vw;
    }
  }
  &.md {
    .board-item-block {
      height: 360px;
    }
    .board-item-block.small {
      height: 180px;
    }
  }
  &.xl {
    .board-item-block {
      height: 600px;
    }
    .board-item-block.small {
      height: 300px;
    }
  }
}

.board-item {
  border-radius: 0;
  height: 100%;
  position: relative;
}
</style>
