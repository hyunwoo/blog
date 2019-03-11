<template>
  <div class="board-item-previewer">
    <div class="image-field">
      <div v-if="boardItem === undefined" class="image-loading"></div>
      <v-img v-else :src="boardItem.data.mainImageURL" width="100%" height="100%"></v-img>
    </div>
    <div class="previewer-share-area"></div>
    <div class="grad-overlay"></div>

    <div class="previewer-title-area" v-if="boardItem !== undefined">
      <div class="previewer-title-container py-2 px-3">
        <div
          class="previewer-title mb-1 description subheading font-weight-bold"
        >{{boardItem.data.title}}</div>
        <div class="previewer-description body-1 font-weight-medium">{{boardItem.data.description}}</div>
      </div>
      <div class="description"></div>
      <v-layout v-if="boardItem !== undefined" class="meta-area px-1 pr-3">
        <v-chip label class="chip" text-color="white">
          <v-icon small left class="mr-2">polymer</v-icon>
          {{boardItem.data.category.name}}
        </v-chip>
        <v-spacer></v-spacer>
        <v-icon small class="meta-icon">share</v-icon>
        <div class="pl-2 font-weight-regular caption meta-text pr-3">10</div>
        <v-icon small class="meta-icon">star</v-icon>
        <div class="pl-2 font-weight-regular caption meta-text">10</div>
      </v-layout>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { BoardItem } from '@/lib/forms';
import { FirestoreDocument } from '@/lib/firebase';

@Component({})
export default class BoardItemPreviewer extends Vue {
  @Prop()
  public boardItem: FirestoreDocument<BoardItem> | undefined;
  public name: string = 'board-item-previewer';

  public mounted() {
    console.log('mounted', this.boardItem);
  }
}
</script>
<style scoped lang='scss'>
.board-item-previewer {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  .image-field {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
  }
  &:hover {
    .previewer-title-area {
      bottom: 0;
    }
  }
  .grad-overlay {
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    position: absolute;
    background: rgba(0, 0, 0, 0.3);
    $gradColor: rgba(0, 0, 0, 0.4);
    background: -moz-linear-gradient(top, rgba(0, 0, 0, 0) 0%, $gradColor 100%);
    background: -webkit-linear-gradient(
      top,
      rgba(0, 0, 0, 0) 0%,
      $gradColor 100%
    );
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      $gradColor 100%
    );
  }
  .previewer-share-area {
    width: 25px;
    border-radius: 12.5px;
    height: 100px;
    position: absolute;
    right: 16px;
    top: 16px;
    background: #fff;
  }

  .previewer-title-area {
    z-index: 2;
    position: absolute;
    width: 100%;
    bottom: -50px;
    transition: bottom 0.3s;
    // pointer-events: none;
    .previewer-title-container {
      .previewer-title {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        white-space: normal;
        line-height: 1.2;
        color: #fff;
      }
      .previewer-description {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #fff;
      }
    }
    .meta-area {
      height: 48px;
      padding: 4px 0;
      line-height: 40px;
      background: rgba(0, 0, 0, 0.5);
      .meta-icon,
      .meta-text {
        color: #fff;
      }
      .chip {
        background: rgba(255, 255, 255, 0.1);
      }
      .meta-icon-container {
        $icon-container-size: 30px;
        width: $icon-container-size;
        height: $icon-container-size;
        margin: (40px - $icon-container-size)/2 0;
        line-height: $icon-container-size !important;
        text-align: center;
        border-radius: 50%;
        .v-icon {
          line-height: inherit;
        }
      }
    }
  }
}
</style>