import { Component, Vue } from 'vue-property-decorator';
import { auth, FirestoreCollection, FirestoreDocument } from '@/lib/firebase';
import { BoardItem } from '@/lib/forms';

@Component({})
export default class My extends Vue {
  public name: string = 'my';
  public boardItems: Array<FirestoreDocument<BoardItem>> = [];

  public mounted() {
    auth.addChangeListener(
      'my',
      async (user) => {
        console.log('mounted my', user);
        if (user === null) {
          this.$snackbar.show('접근 권한이 없습니다.');
          this.$router.push('/');
          return;
        }
        const query = this.$collection.board.createQuery(
          'userId',
          '==',
          user.uid
        );
        this.boardItems = await query.exec(BoardItem);
      },
      true
    );
  }
}
