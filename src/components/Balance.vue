<template>
  <v-card height="33vh">
    <v-card-title class="text-h4 text-center mb-12">Saldo</v-card-title>
    <v-card-text class="text-h2 text-center mb-12">{{ balance }} PLN</v-card-text>
    <v-card-actions>
      <v-btn @click="reveal = true" size="x-large" class="justify-center mx-auto" color="green"
        variant="outlined">Doładuj</v-btn>
    </v-card-actions>

    <v-expand-transition>
      <v-card v-if="reveal" class="v-card--reveal" style="height: 100%">
        <v-card-text class="text-h4 text-center mtb-6">
          Wybierz kwotę doładowania: {{ selectedAmount }}
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-container>
            <v-row v-for="(row, index) in amounts" :key="index" style="height: 150px" class="pl-12 pt-6 mb-n12">
              <v-col v-for="(item, colIndex) in row" :key="colIndex">
                <template v-if="colIndex !== 2 || index !== 1">
                  <v-btn @click="selectedAmount = item">{{ item }} PLN</v-btn>
                </template>
                <template v-else>
                  <v-text-field class="ml-n10 mt-n3" style="width: 150px" label="Inna kwota"
                    variant="outlined" v-model="selectedAmount"></v-text-field>
                </template>
              </v-col>
            </v-row>
          </v-container>
          <v-btn color="green" variant="outlined" @click="reveal = false; addBalance()" :disabled="selectedAmount <= 0">
            Zatwierdź
          </v-btn>
          <v-btn color="red" variant="outlined" @click="reveal = false">
            Anuluj
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
export default {
  emits: ["showAlert"],
  name: "Balance",
  setup(props , { emit }) {
    const reveal = ref(false);
    const store = useStore();
    const balance = computed(() => store.state.userBalance);
    const selectedAmount = ref(0);
    const amounts = ref([
      [10, 25, 50],
      [100, 250, null],
    ]);

    const addBalance = async () => {
            const result = await store.dispatch("addBalance", {
                userId: store.state.user.uid,
                amount: Number(selectedAmount.value)
            });
            if (result.success) {
                emit('showAlert', "success", 'Doładowanie zakończone pomyślnie!')
            } else {
                emit('showAlert', "error", result.error)
            }
        };
    return {
      addBalance,
      balance,
      reveal,
      amounts,
      selectedAmount
    };
  },
};
</script>
<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>