<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="loginShowAlert"
    :class="loginAlertVariant">
    {{ loginAlertMsg }}
  </div>
  <VeeForm :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
      <ErrorMessage class="text-red-600 text-xs" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password" />
      <ErrorMessage class="text-red-600 text-xs" name="password" />
    </div>
    <button
      :disabled="loginInSubmission"
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700">
      Submit
    </button>
  </VeeForm>
</template>

<script>
import {mapActions} from 'pinia';
import useUserStore from '@/stores/user';

export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required|min:6|max:100',
      },
      loginInSubmission: false,
      loginShowAlert: false,
      loginAlertVariant: 'bg-blue-500',
      loginAlertMsg: 'Please wait! We are logging you in. ',
    };
  },
  methods: {
    ...mapActions(useUserStore, {
      loginUser: 'login',
    }),
    async login(values) {
      this.loginShowAlert = true;
      this.loginInSubmission = true;
      this.loginAlertVariant = 'bg-blue-500';
      this.loginAlertMsg = 'Please wait! We are logging you in.';

      try {
        await this.loginUser(values);
      } catch (err) {
        this.loginInSubmission = false;
        this.loginAlertVariant = 'bg-red-500';
        this.loginAlertMsg = 'Invalid login details';
        return;
      }

      this.loginAlertVariant = 'bg-green-500';
      this.loginAlertMsg = 'Success! Your login';
      window.location.reload();
    },
  },
};
</script>
