// components/CookieBanner.vue
<template>
    <v-overlay class="centered-overlay" v-model="showBanner"><div class="banner flex-inline" >
    <p>
      We use tracking cookies to understand how you use the product 
      and help us improve it.
      <br>
      Please accept cookies to help us improve.
    </p>
    <v-btn color="green" class="mr-6" @click="store.dispatch('showCookiesBanner')">Zaakceptuj ciasteczka</v-btn>
    <v-btn color="red" @click="store.dispatch('showCookiesBanner')">Odrzuć ciasteczka</v-btn>
  </div></v-overlay>
  
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  name: "CookieBanner",
  setup() {
    const store = useStore();
    const showBanner = computed(() => store.state.showCookiesBanner);
    return {showBanner, store};
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