import { Component, Vue } from 'vue-property-decorator';
import { v1 as uuid } from 'uuid';
import { UiCategory, UiConfiguration } from '@/lib/configuration/ui';
import { FirestoreCollection, FirestoreDocument } from '@/lib/firebase';
import { BoardItem } from '@/lib/forms';

@Component({})
export default class Main extends Vue {
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
      .createQuery('published', '==', true)
      .orderBy('publishedAt', 'desc')
      .limit(6);
    const boards = await query.exec(BoardItem);
    // const boards = await this.colBoardItem.get(BoardItem);

    boards.forEach((board, i) => {
      Vue.set(this.boardItems, i, board);
    });
  }
  public toEditor() {
    this.$router.push(`/editor/${uuid()}`);
  }
}
