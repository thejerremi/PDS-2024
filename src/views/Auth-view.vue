<template>
    <TosOverlay v-if="showTos"></TosOverlay>
    <PPOverlay v-if="showPP"></PPOverlay>
    <v-dialog
          transition="dialog-top-transition"
          width="auto"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              text="Aktualne taryfy"
              class="pr-6 font-weight-bold"
              height="5vh"
            ></v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card>
              <v-toolbar title="Aktualne taryfy"></v-toolbar>

              <v-card-text class="text-h6 pa-12" @click="test()">
                <v-row>
                  <v-col cols="6" class="mt-4">Godzina</v-col>
                  <v-col cols="6">Cena za godzinę</v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">0-7</v-col>
                  <v-col cols="6">2 zł</v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">7-18</v-col>
                  <v-col cols="6">3 zł</v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">18-24</v-col>
                  <v-col cols="6">2.5 zł</v-col>
                </v-row>
                
              </v-card-text>

              <v-card-actions class="justify-end">
                <v-btn
                  text="Close"
                  @click="isActive.value = false"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
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
      <v-btn class="mt-4" prepend-icon="mdi-google" @click="handleLoginWithGoogle()">Zaloguj się przez Google</v-btn>

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
      <v-row class="text-white" style="max-width: fit-content;">
        <v-checkbox label="Zgadzam się z" required></v-checkbox>  
        <v-btn variant="text" class="mt-3" @click="store.dispatch('showTosOverlay');">regulaminem</v-btn> 
        <v-btn variant="text" class="mt-3" @click="store.dispatch('showPPOverlay');">polityką prywatności</v-btn>
      </v-row>
      <v-btn @click="handleSignUp" class="logo">Zarejestruj się</v-btn>
    </v-form>
      <v-btn class="mt-4" prepend-icon="mdi-google" @click="handleSignUpWithGoogle()">Zarejestruj się przez Google</v-btn>
    <h3 class="pt-6 logo" style="color: #CCFE04">Masz już konto?</h3>
      <h3 class="logo text-white text-decoration-underline cursor-pointer" @click="toggleSignUp()">Zaloguj się</h3>
    </div>
    <!-- <v-btn @click="handleLogout">Logout</v-btn> -->
    <h1 class="text-white" v-if="error">{{ error }}</h1>
    <v-btn class="mt-12" text to="/aboutus">O nas</v-btn>

  </v-container>
  
</div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import TosOverlay from "@/components/TosOverlay.vue";
import PPOverlay from "@/components/PPOverlay.vue";
// import { useRouter } from "vue-router";

export default {
  components: {
    TosOverlay,
    PPOverlay,
  },
  setup() {
    const isSignUp = ref(false);

    const email = ref("");
    const password = ref("");
    const error = ref(null);

    const store = useStore();
    //const router = useRouter();

    const showTos = computed(() => store.state.showTosOverlay);
    const showPP = computed(() => store.state.showPPOverlay);
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

    const handleSignUpWithGoogle = async () => {
      try {
        await store.dispatch("signupWithGoogle");
      } catch (err) {
        error.value = err.message;
      }
    };
    const handleLoginWithGoogle = async () => {
      try {
        await store.dispatch("loginWithGoogle");
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
      handleSignUpWithGoogle,
      handleLoginWithGoogle,
      toggleSignUp,
      email,
      password,
      error,
      isSignUp,
      showTos,
      showPP,
      store
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