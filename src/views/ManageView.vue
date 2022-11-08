<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <AppUpload />
      <!-- add ref='upload' to AppUploads to work with beforeRouteLeave -->
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItem
              v-for="(song, i) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSongs"
              :index="i" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppUpload from '../components/AppUpload.vue';
import CompositionItem from '../components/CompositionItem.vue';
import {auth} from '@/includes/firebase';
import {
  collection,
  getFirestore,
  where,
  query,
  getDocs,
} from 'firebase/firestore';

const db = getFirestore();
const songsCollection = collection(db, 'songs');

export default {
  name: 'ManageView',
  components: {AppUpload, CompositionItem},
  data() {
    return {
      songs: [],
    };
  },
  async created() {
    const q = query(songsCollection, where('uid', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const song = {
        ...doc.data(),
        docID: doc.id,
      };
      this.songs.push(song);
    });
  },
  methods: {
    updateSongs(i, values) {
      this.songs[i].modifiedName = values.modifiedName;
      this.songs[i].genre = values.genre;
    },
  },
  // beforeRouteLeave(to,from,next){
  //   this.$refs.upload.cancelUploads()
  //   next()
  // }
};
</script>
