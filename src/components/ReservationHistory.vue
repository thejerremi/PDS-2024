<template>
    <div>
        <v-card height="40vh">
            <v-card-title class="text-black">Historia rezerwacji</v-card-title>
            <v-data-table :headers="headers" :items="userReservationHistory" :items-per-page="4" :items-per-page-options="options"
                items-per-page-text="Rezerwacji na stronę"></v-data-table>
            <v-card-text v-if="!userReservationHistory">Nie masz jeszcze żadnych rezerwacji</v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import {
    onSnapshot,
    doc,
    getFirestore,
    query,
    where,
    collection,
} from "firebase/firestore";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";
export default {
    name: "ReservationHistory",
    setup() {
        const store = useStore();
        const userReservationHistory = store.state.userReservationHistory;
        const unsubscribe = ref();
        const options = [4];
        const headers = [
            { title: "Data wejścia", value: "entryTime" },
            { title: "Data wyjścia", value: "exitTime" },
            { title: "Numer rejestracyjny", value: "carPlate" },
            { title: "Miejsce parkingowe", value: "parkingId" },
            { title: "Koszt", value: "cost" },
        ];
        onMounted(async () => {
            try {
                // await store.dispatch('getReservations', { userId: store.state.user.uid });
                const db = getFirestore();
                const reservationCollection = collection(db, "reservations");
                const q = query(
                    reservationCollection,
                    where("userId", "==", doc(db, "users", store.state.user.uid))
                );
                unsubscribe.value = onSnapshot(q, () => {
                    store.dispatch("getReservations", { userId: store.state.user.uid });
                });
            } catch (error) {
                console.error("Error fetching reservation history:", error);
            }
        });
        onBeforeUnmount(() => {
            unsubscribe.value();
        });
        return {
            headers,
            userReservationHistory,
            options,
        };
    },
};
</script>

<style></style>