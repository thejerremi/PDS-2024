<template>
    <div v-if="skeletonVisible">
        <v-skeleton-loader type="card"></v-skeleton-loader>
    </div>
  <div class="user-view bg-grey-lighten-2" v-else>
    <v-card v-if="!correctId">
      <v-card-title class="text-h4 text-center mb-6">Szczegóły rezerwacji</v-card-title>
      <v-card-text class="text-h5 text-center">Posiadasz aktywną rezerwację</v-card-text>
      <v-card-text class="text-h6">Miejsce parkingowe: {{ reservationData.parkingSpot }}</v-card-text>
      <v-card-text class="text-h6 mt-n6">Tablica rejestracyjna: {{ reservationData.carPlate }}</v-card-text>
      <v-card-text class="text-h6 mt-n6">Czas wjazdu: {{ reservationData.entryTime }}</v-card-text>
      <v-card-text class="text-h6 mt-n6" @click="refreshCost()">Aktualny koszt: {{ reservationData.cost }} <v-icon icon="mdi-refresh" size="x-small" class="cursor-pointer"></v-icon></v-card-text>
    <v-card-text class="text-h6 text-center text-green" v-if="refreshVisible" color="green">Aktualny koszt został odświeżony</v-card-text>
    </v-card>
    <v-card v-else>
        <v-card-title class="text-h4 text-center mb-6">404</v-card-title>
        <v-card-text class="text-h5 text-center">Nie znaleziono rezerwacji o id:</v-card-text>
        <v-card-text class="text-h5 text-center">{{ reservationId }}</v-card-text>
    </v-card>
  </div>
</template>

<script>
import { watch, ref, computed, onBeforeMount, onMounted, onUpdated } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useDisplay } from 'vuetify'
import { useBalanceDeduction } from "@/composables/useBalanceDeduction";

import moment from "moment";
export default {
  props: ["reservationId"],

  setup(props) {
    const store = useStore();
    const router = useRouter();
    const { mobile } = useDisplay()
    const refreshVisible = ref(false);
    const skeletonVisible = ref(true);
    const correctId = computed(() => reservationData.value.cost == -1 && !reservationRef.value.entryTime);
    router.beforeEach((to, from) => {
      console.log(from.fullPath, to.fullPath);
      return false;
    });
    onMounted(() => {
      store.commit("setUserRole", "visitor");
      store.dispatch("getReservationById", { reservationId: props.reservationId })
      setTimeout(() => {
        skeletonVisible.value = false;
    }, 1500);
    })
    
    const reservationRef = computed(() => store.state.userReservationDoc);
    const reservationData = ref({
      entryTime: computed(() =>
        moment(reservationRef.value.entryTime).format("HH:mm:ss DD-MM-YYYY")
      ),
      carPlate: computed(() => reservationRef.value.carPlate),
      parkingSpot: computed(() => reservationRef.value.parkingId),
      cost: -1,
      exitTime: "",
    });
    watch(
      () => reservationRef.value?.entryTime,
      (newEntryTime) => {
        if (newEntryTime) {
          console.log('Entry time:', newEntryTime);
          calculateCost();
        }
      }
    );
    const calculateCost = () => {
      reservationData.value.cost = useBalanceDeduction().calculateParkingCost(reservationRef.value.entryTime*1, (Date.now()*1))
    }
    const refreshCost = () => {
        calculateCost();
        refreshVisible.value = true;
        setTimeout(() => {
      refreshVisible.value = false;
    }, 5000);
    }
    return {
        skeletonVisible,
        refreshCost,
        calculateCost,
        reservationData,
        mobile,
        refreshVisible,
        correctId
    };
  },
};
</script>

<style scoped>
.user-view {
  height: 100%;
  
}
</style>