<template>
  <v-card height="33vh">
    <v-card-title class="text-h4 text-center mb-12">Saldo</v-card-title>
    <v-card-text class="text-h2 text-center mb-12">{{ balance }} PLN</v-card-text>
    <v-card-actions>
      <v-btn @click="reveal = true" size="x-large" class="justify-center mx-auto" color="green" variant="outlined">Doładuj</v-btn>
    </v-card-actions>

    <v-expand-transition>
      <v-card v-if="reveal" class="v-card--reveal" style="height: 100%">
      
        
        <v-card-actions class="text-center justify-center pt-16">
          <v-col>
            <v-text-field class="" style="width: 150px" label="Inna kwota"
            variant="outlined" v-model="selectedAmount"/>
          </v-col>
          <v-col v-show="selectedAmount && selectedAmount > 0">
            <div id="paypal-button-container" class="pb-3" />
          </v-col>
          <v-col v-if="!selectedAmount || selectedAmount < 0">Podaj poprawną kwotę by kontynuować</v-col>
          <v-col>
            <v-btn color="red" variant="outlined" @click="reveal = false"> Anuluj </v-btn>

          </v-col>
            
        
          
        
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";

export default {
  emits: ["showAlert"],
  name: "Balance",
  setup(props, { emit }) {
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
        amount: Number(selectedAmount.value),
      });
      if (result.success) {
        emit('showAlert', "success", 'Doładowanie zakończone pomyślnie!');
      } else {
        emit('showAlert', "error", result.error);
      }
    };

    const loadPayPalScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://www.paypal.com/sdk/js?client-id=" + import.meta.env.VITE_PAYPAL_SANDBOX_ID + "&currency=PLN&disable-funding=card,bancontact,blik,eps,giropay,ideal,mybank,p24,sepa,sofort,venmo";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    watch(reveal, async (newVal) => {
      if (newVal) {
        await loadPayPalScript();
        paypal.Buttons({
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: selectedAmount.value
                }
              }]
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
              addBalance();
              reveal.value = false;
            });
          }
        }).render('#paypal-button-container');
      }
    });

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
