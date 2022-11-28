<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button
        @click.prevent="delateSong"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="toggleShow">
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text center font-bold p-4 mb-4"
        v-if="showAlert"
        :class="alertVariant">
        {{ alertMessage }}
      </div>
      <VeeForm
        :validation-schema="schema"
        :initial-values="song"
        @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField
            @input="updateUnsavedFlag(true)"
            name="modifiedName"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title" />
          <ErrorMessage class="text-red-600" name="modifiedName" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            @input="updateUnsavedFlag(true)"
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre" />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="inSubmission">
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="inSubmission"
          @click.prevent="showForm = false">
          Go Back
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script>
import {storage} from '@/includes/firebase';
import {getFirestore, doc, updateDoc, deleteDoc,} from 'firebase/firestore';
import {ref, deleteObject} from 'firebase/storage';

const db = getFirestore();


export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modifiedName: 'required',
        genre: 'alphaSpaces',
      },
      inSubmission: false,
      showAlert: false,
      alertVariant: 'bg-blue-500',
      alertMessage: 'Please wait! Updating song info',
    };
  },
  methods: {
    toggleShow() {
      this.showForm = !this.showForm;
    },
    async edit(values) {
      console.log(values);
      this.inSubmission = true;
      this.showAlert = true;
      this.alertVariant = 'bg-blue-500';
      this.alertMessage = 'Please wait! Updating song info';

      const washingtonRef = doc(db, 'songs', this.song.docID);
      try {
        await updateDoc(washingtonRef, values);
      } catch (error) {
        this.inSubmission = false;
        this.alertVariant = 'bg-red-500';
        this.alertMessage = 'Something went wrong! Try again later';
        return;
      }
      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false)

      this.inSubmission = false;
      this.alertVariant = 'bg-green-500';
      this.alertMessage = 'Success';
    },
    async delateSong() {
      const songRef = ref(storage, `songs/${this.song.originalName}`);

      await deleteObject(songRef);

      await deleteDoc(doc(db, 'songs', this.song.docID));
      this.removeSong(this.index);
    },
  },
};
</script>
