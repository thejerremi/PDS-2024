<template>
  <AppBar v-if="!alertVisible"/>
  
  <div class="user-view bg-grey-lighten-2">
    <v-container fluid style="height: 100%">
      <v-alert v-if="alertVisible" :type="alertType" :text="alertMessage" class="mb-6" />
    <v-row class="ptb-6">
      <v-col>
        <div class="text-h2">Twoje konto</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <Reservation v-show="!userActiveReservation" @showAlert="handleAlertShow"/>
        <ActiveReservation v-show="userActiveReservation" @showAlert="handleAlertShow"/>
      </v-col>

      <v-col cols="6">
        <Balance @showAlert="handleAlertShow"/>
      </v-col>

      <v-col cols="12" style="overflow-y:auto">
        <ReservationHistory/>
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<script lang="ts">
import AppBar from "@/components/AppBar.vue";
import Reservation from "@/components/Reservation.vue";
import ReservationHistory from "@/components/ReservationHistory.vue";
import ActiveReservation from "@/components/ActiveReservation.vue";
import Balance from "@/components/Balance.vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";
import { useAlert } from '@/composables/useAlert';
export default {
  components: {
    AppBar,
    ActiveReservation,
    Reservation,
    ReservationHistory,
    Balance,
  },
  setup() {
    const store = useStore();
    const userRole = computed(() => store.state.userRole);
    const router = useRouter();
    const userActiveReservation = computed(() => store.state.userActiveReservation);
    const unsubscribeReservation = ref();
    const { alertVisible, alertType, alertMessage, showAlert } = useAlert();
    const handleAlertShow = (type: "success" | "error", message: string) => {
      showAlert(type, message);
    };
    router.beforeEach((to, from, next) => {
      if (userRole.value === "user") {
        next(false);
      } else {
        next();
      }
    });


    
    onMounted(() => {
      unsubscribeReservation.value = onSnapshot(doc(getFirestore(), "users", store.state.user.uid), (doc) => {
        store.commit("setUserActiveReservation", doc.data()?.activeReservation)
        store.commit("setUserBalance", doc.data()?.balance)
      });
    })
    onBeforeUnmount(() => {
      unsubscribeReservation.value();
    })
    return {
      alertVisible,
      alertType,
      alertMessage,
      userActiveReservation,
      handleAlertShow
    };
  },
};


</script>

<style scoped>
.user-view {
  height: 100%;
  width: 100vw;
}
</style>