<template>
  <div>
    <v-card height="33vh">
      <v-card-title class="text-h4 text-center mb-6">Rezerwacje</v-card-title>
      <v-card-text class="text-h5 text-center">Posiadasz aktywną rezerwację</v-card-text>
      <v-row>
      <v-col cols="8">
      <v-card-text class="text-h6">Miejsce parkingowe: {{ reservationData.parkingSpot }}</v-card-text>
      <v-card-text class="text-h6 mt-n6">Tablica rejestracyjna: {{ reservationData.carPlate }}</v-card-text>
      <v-card-text class="text-h6 mt-n6">Czas wjazdu: {{ reservationData.entryTime }}</v-card-text>
      <v-card-text class="text-h6 mt-n6" @click="calculateCost()">Koszt: {{ reservationData.cost }} <v-icon icon="mdi-refresh" size="x-small" class="cursor-pointer"></v-icon></v-card-text>
    </v-col>
    <v-col cols="4">
      <vue-qrcode :value=url :options="{ width: 150 }" @click="openQRCodeUrl()"></vue-qrcode>
    </v-col>
  </v-row>
      <v-card-actions>
        <v-btn size="x-large" class="justify-center mx-auto mt-n10" color="green"
        variant="outlined" @click="endReservation">Wyjazd</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { watch, computed, onUpdated, ref } from "vue";
import { useStore } from "vuex";
import { useBalanceDeduction } from "@/composables/useBalanceDeduction";
import VueQrcode from '@chenfengyuan/vue-qrcode';
import moment from "moment";
export default {
  components: {
    VueQrcode
  },
  emits: ["showAlert"],
  name: "ActiveReservation",
  setup(props, {emit}) {
    const store = useStore();
    const reservationRef = computed(() => store.state.userReservationDoc);
    const reservationData = ref({
      id: computed(() => reservationRef.value.id),
      entryTime: computed(() =>
        moment(reservationRef.value.entryTime).format("HH:mm:ss DD-MM-YYYY")
      ),
      carPlate: computed(() => reservationRef.value.carPlate),
      parkingSpot: computed(() => reservationRef.value.parkingId),
      cost: -1,
      exitTime: "",
    });
    const url = computed(() => window.location.origin + "/qr/" + reservationData.value.id);

    const openQRCodeUrl = () => {
      window.open(url.value, '_blank');
    }
  

    const retrieveReservation = async () => {
      if (!store.state.userActiveReservation) {
        return;
      }
      const result = await store.dispatch("getReservation", {
        userId: store.state.user.uid,
      });
      if (result.success) {
        console.log("Wczytano rezerwację");
      } else {
        console.log(result.error);
      }
    };
    const endReservation = async () => {
      if (!store.state.userActiveReservation) {
        return;
      }
      calculateCost();
      console.log("Zakończono rezerwację");
      const result = await store.dispatch("endReservation", {
        userId: store.state.user.uid,
        cost: reservationData.value.cost,
      });
      if (result.success) {
        console.log("Zakończono rezerwację");
        emit('showAlert', "success", 'Rezerwacja została zakończona. Koszt: ' + reservationData.value.cost + ' zł')
      } else {
        console.log(result.error);
        emit('showAlert', "error", result.error)
      }
    };
    const calculateCost = () => {
      reservationData.value.cost = useBalanceDeduction().calculateParkingCost(reservationRef.value.entryTime*1, (Date.now()*1))
    }
    onUpdated(() => {
      if (store.state.userActiveReservation) {
        retrieveReservation();
        calculateCost();
      }
      
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
    return {
      url,
      store,
      reservationRef,
      reservationData,
      retrieveReservation,
      endReservation,
      calculateCost,
      openQRCodeUrl
    };
  },
};
</script>

<style></style>