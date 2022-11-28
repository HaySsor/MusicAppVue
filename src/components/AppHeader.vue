<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{name: 'home'}"
        exact-active-class="no-active"
        >Music</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link :to="{name: 'about'}" class="px-2 text-white"
              >About</router-link
            >
          </li>
          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="singOut"
                >Logout</a
              >
            </li>
            <li>
              <router-link class="px-2 text-white" :to="{name: 'manage'}"
                >Manage</router-link
              >
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a class="px-2 text-white" href="#" @click.prevent="changeLocale">
              {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import {mapStores} from 'pinia';
import useModalStore from '@/stores/modal';
import useUserStore from '@/stores/user';

export default {
  name: 'AppHeader',
  computed: {
    // mapuje się po wszystkich wartościach tu np Store  i po . uzyskuje się wartość do danego parametru
    ...mapStores(useModalStore, useUserStore),
    currentLocale() {
      return this.$i18n.locale === 'pl' ? 'Poland' : 'English';
    },
  },
  methods: {
    toggleAuthModal() {
      //  w this.modalStore ( modal jest to nazwa ta sama co w plikus store defineStore("modal"....))
      this.modalStore.isOpen = !this.modalStore.isOpen;
    },
    singOut() {
      this.userStore.singOutUser();

      if (this.$route.meta.requiresAuth) {
        this.$router.push({name: 'home'});
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === 'pl' ? 'en' : 'pl';
    },
  },
};
</script>
