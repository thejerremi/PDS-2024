<template>
  <v-app>
    <router-view/>
    <CookieBanner />
  </v-app>
</template>

<script lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
import CookieBanner from './components/CookieBanner.vue'

export default {
  components: {
    CookieBanner
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    let redirecting = false;

router.beforeEach((to, from, next) => {
  if (redirecting) {
    next();
    return;
  }

  if (to.path.startsWith('/qr/') || to.path.startsWith('/aboutus')) {
    next();
  } else {
    switch (store.state.userRole) {
      case 'admin':
        console.log('Redirecting to admin panel');
        redirecting = true; 
        router.push('/admin').catch(() => {}); 
        break;
      case 'user':
        console.log('Redirecting to user panel');
        redirecting = true;
        router.push('/user').catch(() => {});
        break;
      case 'visitor':
        next();
        break;
      default:
        console.log('Redirecting to login page');
        redirecting = true;
        router.push('/').catch(() => {});
        break;
    }
  }
});
    watch(
      () => store.state.userRole,
      (newUserRole) => {
        console.log('User role changed to: ', newUserRole)
        switch (newUserRole) {
          case 'admin':
            console.log('Redirecting to admin panel')
            router.push('/admin');
            break;
          case 'user':
            console.log('Redirecting to user panel')
            router.push('/user');
            break;
          case 'visitor':
            break;
          default:
            console.log('Redirecting to login page')
            router.push('/');
            break;
        }
      }
    );
  }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

.logo{
  font-family: "Righteous", sans-serif;
  font-weight: 400;
  font-style: normal;
}
html { overflow-y: auto }

</style>