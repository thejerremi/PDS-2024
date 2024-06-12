<template>
    <v-overlay class="centered-overlay" v-model="showBanner">
      <div class="banner flex-inline">
        <p>
          We use tracking cookies to understand how you use the product
          and help us improve it.
          <br>
          Please accept cookies to help us improve.
        </p>
        <v-btn color="green" class="mr-6" @click="acceptCookies">Zaakceptuj ciasteczka</v-btn>
        <v-btn color="red" @click="rejectCookies">Odrzuć ciasteczka</v-btn>
      </div>
    </v-overlay>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  import { useStore } from "vuex";
  
  export default {
    name: "CookieBanner",
    setup() {
      const store = useStore();
      const showBanner = ref(localStorage.getItem('showCookiesBanner') !== 'false');
      
      const acceptCookies = () => {
        localStorage.setItem('showCookiesBanner', 'false');
        store.dispatch('hideCookiesBanner');
        showBanner.value = false;
      };
      
      const rejectCookies = () => {
        localStorage.setItem('showCookiesBanner', 'false');
        store.dispatch('hideCookiesBanner');
        showBanner.value = false;
      };
  
      return { showBanner, acceptCookies, rejectCookies };
    },
  };
  </script>
  
  <style scoped>
  .banner {
    background-color: #f1f1f1;
    padding: 20px;
    text-align: center;
  }
  .centered-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  