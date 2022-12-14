<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="newSong(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none">
          <i :class="{'fas fa-play': !playing, 'fas fa-pause': playing}"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1, 'currency') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{
            $tc('song.comment_count', song.comment_count, {
              count: song.commentCount,
            })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="commentShowAlert"
            :class="commentAlertVariant">
            {{ commentAlertMessage }}
          </div>
          <VeeForm
            :validation-schema="schema"
            @submit="addComment"
            v-if="userLoggedIn">
            <VeeField
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."></VeeField>
            <ErrorMessage name="comment" class="text-red-600 text-xs" />
            <button
              :disabled="commentInSubmission"
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block">
              Submit
            </button>
          </VeeForm>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort">
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docID">
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import {
  collection,
  getFirestore,
  doc,
  getDoc,
  addDoc,
  where,
  query,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import {auth} from '@/includes/firebase';
import {mapState, mapActions} from 'pinia';
import useUserStore from '@/stores/user.js';
import usePlayerStore from '@/stores/player.js';

const db = getFirestore();

const songsCollection = collection(db, 'songs');
const commentsCollection = collection(db, 'comments');

export default {
  name: 'SongView',
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3',
      },
      commentInSubmission: false,
      commentShowAlert: false,
      commentAlertVariant: 'bg-blue-500',
      commentAlertMessage: 'Please wait! Your comment is being submitted',
      comments: [],
      sort: '1',
    };
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(usePlayerStore, ['playing']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }

        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async beforeRouteEnter(to, from, next) {
    console.log(to.params.id);
    const docRef = await doc(songsCollection, to.params.id);
    const docSnapshot = await getDoc(docRef);
    console.log(docRef);

    next((vm) => {
      if (!docSnapshot.exists()) {
        vm.$router.push({name: 'home'});
        return;
      }

      const {sort} = vm.$route.query;

      vm.sort = sort === '1' || sort === '2' ? sort : '1';

      vm.song = docSnapshot.data();
      vm.getComments();
    });
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong']),
    async addComment(values, {resetForm}) {
      this.commentInSubmission = true;
      this.commentShowAlert = true;
      this.commentAlertVariant = 'bg-blue-500';
      this.commentAlertMessage = 'Please wait! Your comment is being submitted';

      console.log(values);
      const comment = {
        content: values.comment,
        datePosted: new Date().toDateString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };

      await addDoc(commentsCollection, comment);

      this.song.commentCount += 1;
      const updateCommentCount = doc(songsCollection, this.$route.params.id);

      await updateDoc(updateCommentCount, {
        commentCount: this.song.commentCount,
      });

      await this.getComments();
      this.commentInSubmission = false;
      this.commentShowAlert = false;
      this.commentAlertVariant = 'bg-green-500';
      this.commentAlertMessage = 'Comment added!';

      resetForm();
    },
    async getComments() {
      const q = query(
        commentsCollection,
        where('sid', '==', this.$route.params.id)
      );
      const snapshots = await getDocs(q);

      this.comments = [];

      snapshots.forEach((doc) => {
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>
