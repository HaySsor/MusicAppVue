<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="regShowAlert"
    :class="regAlertVariant">
    {{ regAlertMsg }}
  </div>
  <VeeForm
    :validation-schema="schema"
    @submit="register"
    :initial-values="userData">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <VeeField
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name" />
      <ErrorMessage class="text-red-600 text-xs" name="name" />
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <VeeField
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" />
      <ErrorMessage class="text-red-600 text-xs" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField name="password" :bails="false" v-slot="{field, errors}">
        <input
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
          type="password"
          v-bind="field" />
        <div class="text-red-600 text-xs" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </VeeField>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <VeeField
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password" />
      <ErrorMessage class="text-red-600 text-xs" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antarctica">Antarctica</option>
      </VeeField>
      <ErrorMessage class="text-red-600 text-xs" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <VeeField
        name="tos"
        value="1"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
      <label class="inline-block">Accept terms of service</label>
      <ErrorMessage class="text-red-600 text-xs block" name="tos" />
    </div>
    <button
      type="submit"
      :disabled="regInSubmission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700">
      Submit
    </button>
  </VeeForm>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alphaSpaces',
        email: 'required|email',
        age: 'required|minVal:18|maxVal:120',
        password: 'required|min:9|max:100|excluded:password',
        confirm_password: 'passwordMismatch:@password',
        country: 'required|countryExcluded:Antarctica',
        tos: 'tos',
      },
      // use default values in VeeForm  jak tu z krajami  "userData"
      userData: {
        country: 'USA',
      },
      regInSubmission: false,
      regShowAlert: false,
      regAlertVariant: 'bg-blue-500',
      regAlertMsg: 'Please wait! Your account is being created.',
    };
  },
  methods: {
    register(values) {
      (this.regShowAlert = true), (this.regInSubmission = true);
      this.regAlertVariant = 'bg-blue-500';
      this.regAlertMsg = 'Please wait! Your account is being created.';

      setTimeout(() => {
        this.regAlertVariant = 'bg-green-500';
        this.regAlertMsg = 'Success! Your account has been created.';
        console.log(values);
      }, 3000);
    },
  },
};
</script>
