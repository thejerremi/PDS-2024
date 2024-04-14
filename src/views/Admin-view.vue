<template>
  <Appbar />
  <parkingDetails v-model="detailsVisible" :spotId="spotId"></parkingDetails>
  <div class="admin-view bg-grey-lighten-2">
    <v-skeleton-loader class="bg-grey-lighten-2" v-if="!rectanglesLoaded" width="1200" type="image"></v-skeleton-loader>
    <div class="mt-12 pt-6 `elevation-${0}`" style="position: relative;" v-else>
      <v-img class="image-container ml-6" src="../assets/parking.png" :width="1200"></v-img>
      <div v-for="(rectangle, index) in rectangles" :key="index"
        :class="['rectangle', rectangle.class, rectangle.cursor]"
        @click="updateDetails((currentPage - 1) * 10 + index + 1)" :style="{
          top: rectangle.top,
          left: rectangle.left,
          width: rectangle.width,
          height: rectangle.height

        }">
        <span class="rectangle-text logo">{{ rectangle.text }}</span>
      </div>
      <v-pagination class="mt-6" :length="5" v-model="currentPage"></v-pagination>

    </div>
    <v-card class="ma-6" width="37%">
      <v-card-title class="text-h4 text-center">Statystyki parkingu</v-card-title>
      <v-card-text class="text-h4 text-center mt-12">Ilość zajętych miejsc:</v-card-text>
      <v-card-text class="text-h5 text-center">{{ occupiedSpots }}/50</v-card-text>
      <v-card-text><v-progress-linear :model-value="occupiedSpots"></v-progress-linear></v-card-text>
      <v-card-text class="text-h4 text-center">Ilość rezerwacji w ostatnich 7 dniach:</v-card-text>
      <v-card-text v-for="(reservation, index) in weeklyHistory" :key="index" class="text-h5 text-center">{{ reservation.date }}: {{ reservation.count }}</v-card-text>
    </v-card>

  </div>
</template>

<script lang="ts">
import { getFirestore, onSnapshot, collection } from "firebase/firestore";
import { ref, watch, onMounted, computed, onBeforeUnmount, toRaw } from 'vue';
import { useStore } from 'vuex';
import Appbar from '@/components/Appbar.vue';
import parkingDetails from '@/components/parkingDetails.vue';
export default {
  components: {
    Appbar,
    parkingDetails,
  },
  setup() {
    const store = useStore();
    const rectanglesLoaded = ref(false)
    const unsub = ref();
    onMounted(() => {
      const db = getFirestore();
      unsub.value = onSnapshot(collection(db, "parking"), (snapshot) => {
        store.dispatch('getParkingSpots')
        setTimeout(() => {
        updateRectangles(currentPage.value);
      }, 1500);
      });
      setTimeout(() => {
        rectanglesLoaded.value = true;
        updateRectangles(1);
      }, 1500);
      store.dispatch('getReservationCountByDate');
      console.log(weeklyHistory.value)   
    });
    onBeforeUnmount(() => {
      unsub.value();
    });


    const detailsVisible = ref(false);
    const spotId = ref(-1);
    const occupiedSpots = ref(0);

    const weeklyHistory = computed(() => toRaw(store.state.weeklyReservationHistory))
  
    const parkingSpots = computed(() => store.state.parkingSpots);
    const rectangles = ref([
      { cursor: '', class: '', top: '5%', left: '8.75%', width: '12%', height: '25%', text: '1' },
      { top: '5%', left: '27%', width: '12%', height: '25%', text: '2' },
      { top: '5%', left: '45.75%', width: '12%', height: '25%', text: '3' },
      { top: '5%', left: '64.5%', width: '12%', height: '25%', text: '4' },
      { top: '5%', left: '82.3%', width: '12%', height: '25%', text: '5' },
      { top: '59%', left: '8.75%', width: '12%', height: '25%', text: '6' },
      { top: '59%', left: '27%', width: '12%', height: '25%', text: '7' },
      { top: '59%', left: '45.75%', width: '12%', height: '25%', text: '8' },
      { top: '59%', left: '64.5%', width: '12%', height: '25%', text: '9' },
      { top: '59%', left: '82.3%', width: '12%', height: '25%', text: '10' },

    ]);
    const currentPage = ref(1);
    watch(currentPage, (newPage) => {
      updateRectangles(newPage);
    });
    const updateRectangles = (newPage: number) => {
      store.commit('sortParkingSpots');
      occupiedSpots.value = 0;
      parkingSpots.value.forEach((spot:any) => {
        if (spot.status === 'occupied') {
          occupiedSpots.value++;
        }
      });
      rectangles.value.forEach((rectangle, index) => {
        rectangle.text = String((newPage - 1) * 10 + index + 1);
        rectangle.class = parkingSpots.value[(newPage - 1) * 10 + index]?.status === 'free' ? 'free' : 'occupied';
        if (rectangle.class === 'occupied') {
          rectangle.cursor = 'cursor-pointer'
        }
      });
    };
    const updateDetails = (id: number) => {
      if (rectangles.value[(id - 1) % 10].class === 'occupied') {
        detailsVisible.value = true;
        spotId.value = id;
      }
    }
    return {
      parkingSpots,
      unsub,
      rectangles,
      currentPage,
      updateRectangles,
      updateDetails,
      rectanglesLoaded,
      detailsVisible,
      spotId,
      occupiedSpots,
      weeklyHistory,
      
    };
  },
}
</script>

<style scoped>
.admin-view {
  width: 100vw;
  height: 93vh;
  overflow: hidden;
  display: flex;
}

.image-container {
  position: relative;
}

.rectangle {
  position: absolute;
}

.free {
  background-color: green;
}

.occupied {
  background-color: red;
}

.rectangle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 32px;
}
</style>
