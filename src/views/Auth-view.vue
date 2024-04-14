<template>
  <div class="auth-view">
  <v-container align="center">
    <!-- <h1>{{ isSignUp }}</h1> -->
    <h1 v-if="user">Currently logged as {{ user.email }}</h1>
    <h1 v-if="userRole">{{ userRole }}</h1>
    <p class="text-h1 logo pb-10" style="color: #CCFE04;">Parking+</p>
    <div class="login" v-if="!isSignUp">
      <v-form @submit.prevent>
        <v-text-field
          type="email"
          name="email"
          v-model="email"
          label="Email"
          variant="solo-filled"
          required
        ></v-text-field>

        <v-text-field
          type="password"
          name="password"
          label="Password"
          v-model="password"
          variant="solo-filled"
          required
        ></v-text-field>
        <v-btn @click="handleLogin" class="logo">Zaloguj się</v-btn>
      </v-form>

      <h3 class="pt-6 logo" style="color: #CCFE04">Nie masz jeszcze konta?</h3>
      <h3 class="logo text-white text-decoration-underline cursor-pointer" @click="toggleSignUp()">Zarejestruj się</h3>
    </div>
    <div class="signup" v-else>
    <v-form @submit.prevent>
      <v-text-field
        type="email"
        name="email"
        label="Email"
        v-model="email"
        variant="solo-filled"
        required
      ></v-text-field>

      <v-text-field
        type="password"
        name="password"
        label="Password"
        v-model="password"
        variant="solo-filled"
        required
      ></v-text-field>
      <v-btn @click="handleSignUp" class="logo">Zarejestruj się</v-btn>
    </v-form>
    <h3 class="pt-6 logo" style="color: #CCFE04">Masz już konto?</h3>
      <h3 class="logo text-white text-decoration-underline cursor-pointer" @click="toggleSignUp()">Zaloguj się</h3>
    </div>
    <!-- <v-btn @click="handleLogout">Logout</v-btn> -->
    <h1 class="text-white" v-if="error">{{ error }}</h1>
  </v-container>
</div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
// import { useRouter } from "vue-router";

export default {
  setup() {
    const isSignUp = ref(false);

    const email = ref("");
    const password = ref("");
    const error = ref(null);

    const store = useStore();
    //const router = useRouter();

    const handleLogin = async () => {
      try {
        await store.dispatch("login", {
          email: email.value,
          password: password.value,
        });
      } catch (err) {
        error.value = err.message;
      }
    };

    const handleSignUp = async () => {
      try {
        await store.dispatch("signup", {
          email: email.value,
          password: password.value,
        });
      } catch (err) {
        error.value = err.message;
      }
    };

    const handleLogout = () => {
      store.dispatch("logout");
    };

    const toggleSignUp = () => {
      isSignUp.value = !isSignUp.value;
      email.value = "";
      password.value = "";
    };

    return {
      user: computed(() => store.state.user),
      userRole: computed(() => store.state.userRole),
      handleLogout,
      handleLogin,
      handleSignUp,
      toggleSignUp,
      email,
      password,
      error,
      isSignUp,
    };
  },
};
</script>
<style scoped>
.auth-view {
  height: 100vh;
  width: 100vw;
  background-color: #03045E;
}
.v-text-field {
  width: auto;
  max-width: 33%;
}
.v-container{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>