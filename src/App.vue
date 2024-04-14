<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from "vuex";

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    let redirecting = false;

router.beforeEach((to, from, next) => {
  // Sprawdzamy, czy już nie jesteśmy w trakcie przekierowania
  if (redirecting) {
    next();
    return;
  }

  // Jeśli próbujemy zmienić stronę na ścieżkę /qr/{reservationId}
  // to zezwól na zmianę strony, niezależnie od roli użytkownika
  if (to.path.startsWith('/qr/')) {
    next();
  } else {
    // W innym przypadku wykonaj swoją logikę na podstawie roli użytkownika
    switch (store.state.userRole) {
      case 'admin':
        console.log('Redirecting to admin panel');
        redirecting = true; // Ustawiamy flagę, żeby uniknąć ponownego przekierowania
        router.push('/admin').catch(() => {}); // catch() ignoruje błędy nawigacji
        break;
      case 'user':
        console.log('Redirecting to user panel');
        redirecting = true;
        router.push('/user').catch(() => {});
        break;
      case 'visitor':
        // Jeśli użytkownik jest gościem, pozwól mu na dostęp do innych stron, jeśli jest zalogowany
        // Tutaj możesz dodać dodatkową logikę, jeśli to konieczne
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