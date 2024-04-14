<template>
    <v-card height="33vh">
        <v-card-title class="text-h4 text-center mb-12">Rezerwacje</v-card-title>
        <v-card-text class="text-h5 text-center mb-12">Nie posiadasz aktywnej rezerwacji</v-card-text>
        <v-card-actions>
            <v-btn size="x-large" class="justify-center mx-auto" color="green" variant="outlined"
                @click="reveal = true">Zarezerwuj</v-btn>
        </v-card-actions>

        <v-expand-transition>
            <v-card v-if="reveal" class="v-card--reveal" style="height: 100%">
                <v-card-text class="mtb-6">
                    <v-text-field label="Rejestracja samochodu" v-model="carPlate"
                        :rules="[(value) => !!value || 'Należy wpisać rejestrację']" />
                </v-card-text>
                <v-card-actions class="pb-6">
                    <v-btn class="justify-center mx-auto" color="green" variant="outlined" :disabled="!carPlate" @click="
                        reveal = false;
                    createReservation(carPlate);
                    carPlate = '';
                    ">
                        Zarezerwuj
                    </v-btn>
                    <v-btn class="justify-center mx-auto" color="red" variant="outlined" @click="reveal = false; carPlate = '';">
                        Anuluj
                    </v-btn>
                </v-card-actions>
                <v-card-text align="center">Uwaga! Opłata zaczyna się od każdej rozpoczętej godziny!</v-card-text>
            </v-card>
        </v-expand-transition>
    </v-card>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useAlert } from "@/composables/useAlert";
export default {
    emits: ["showAlert"],
    name: "Reservation",
    setup(props, { emit }) {
        const store = useStore();
        const { showAlert } = useAlert();

        const reveal = ref(false);
        const carPlate = ref("");

        const createReservation = async (carPlate) => {
            const result = await store.dispatch("addReservation", {
                userId: store.state.user.uid,
                carPlate: carPlate,
            });
            if (result.success) {
                emit('showAlert', "success", 'Rezerwacja została utworzona!')
            } else {
                emit('showAlert', "error", result.error)
            }
        };
        return {
            createReservation,
            reveal,
            carPlate,
            showAlert
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