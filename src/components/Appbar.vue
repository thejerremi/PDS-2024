<template>
  <v-toolbar :elevation="8" app>
    <v-toolbar-title class="logo">Parking+</v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-if="userActiveReservation === true" class="pr-6">Masz aktywną rezerwację.</div>
    <v-dialog
          transition="dialog-top-transition"
          width="auto"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              text="Aktualne taryfy"
              class="pr-6"
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
    <div v-if="userRole === 'user'" class="pr-6">{{ user.email }}</div>
    <div v-else>Tryb admina</div>
    <v-btn text @click="handleLogout" append-icon="mdi-export">Wyloguj się</v-btn>
  </v-toolbar>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "AppBar",
  setup(){
    const store = useStore();
    const router = useRouter();
    const user = computed(() => store.state.user)
    const userRole = computed(() => store.state.userRole);
    const userActiveReservation = computed(() => store.state.userActiveReservation);
    const handleLogout = () => {
        store.commit("setUserRole", null);
      store.dispatch("logout");
      router.push({ name: '' });
    };
    
    return {
      handleLogout,
      userRole,
      user,
      userActiveReservation,
    }
  
  }
};
</script>

<style scoped>
.v-toolbar {
  background-color: #03045E;
  color: white;
}
</style>