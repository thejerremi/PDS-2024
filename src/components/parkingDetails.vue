<template>
  <v-dialog v-model="show" max-width="500px">
  <v-card v-if="parkingSpot">
    <v-card-title class="headline">Miejsce parkingowe nr {{ parkingSpot.id }}</v-card-title>
    <v-row>
    <v-col cols="6">
      <v-img :src="'/src/assets/carPhotos/' + photoId + '.jpg'" class="pl-10"></v-img>
    </v-col>
<v-col cols="6">
    <v-card-text>Tablica rejestracyjna:</v-card-text>
    <v-card-text class="mt-n8">{{ parkingSpot.carPlate }}</v-card-text>
    <v-card-text class="mr-12">Czas wjazdu:</v-card-text>
    <v-card-text class="mt-n8">{{ parkingSpot.entryTime }}</v-card-text>
  </v-col>
</v-row>
    <v-card-actions>
      <v-btn color="primary" flat @click.stop="handleClose()">Zamknij</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script lang="ts">
import { ref, computed, onUpdated } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'parkingDetails',
  props: {
    value: Boolean,
    spotId: Number
  },
  setup(props, { emit }) {
    const store = useStore();
    const show = ref(props.value);
    const setShow = (value:any) => {
      show.value = value;
      emit('update:modelValue', value);
    };
    const handleClose = () => {
      emit('update:modelValue', false);
    };

    const parkingSpots = computed(() => store.state.parkingSpots);
    const parkingSpot = ref()
    onUpdated(() => {
      if(props.spotId == -1)
        return;
      parkingSpot.value = parkingSpots.value.find((spot:any) => spot.id == props.spotId);
      const randomNumber = Math.floor(Math.random() * 3) + 1;
      photoId.value = randomNumber;
    });
    const photoId = ref(-1);

    return {
      handleClose,
      show: computed({
        get: () => show.value,
        set: setShow
      }),
      parkingSpot,
      photoId
    };
  }
}
</script>

<style>
headline {
  font-size: 24px;
}
</style>