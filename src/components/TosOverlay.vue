<template>
  <v-overlay class="centered-overlay" v-model="showOverlay" :opacity="0.99" @click:outside="store.dispatch('showTosOverlay')">
    <v-card class="pa-16">
    <v-card-text>
      <div class="font-weight-bold text-h3 text-center mb-6">Regulamin</div>
      <div class="text-justify">
<b>Definicje</b>
<br>
Użytkownik: Osoba fizyczna lub prawna korzystająca z usług oferowanych przez aplikację Parking+.
Usługodawca: Zespół Parking+ dostarczający platformę rezerwacji miejsc parkingowych.
Miejsce parkingowe: Określona przestrzeń parkingowa dostępna do rezerwacji przez aplikację Parking+.
<br>

<b>Postanowienia ogólne</b>
<br>

Aplikacja Parking+ umożliwia rezerwację miejsc parkingowych w partnerujących obiektach.
Korzystanie z aplikacji jest równoznaczne z akceptacją niniejszego regulaminu.
<br>
<b>Warunki korzystania</b>
<br>

Rejestracja w aplikacji jest dobrowolna, ale niezbędna do korzystania z pełnych funkcji serwisu.
Użytkownik zobowiązuje się do podania prawdziwych danych podczas rejestracji i aktualizacji swojego konta.
<b>Rezerwacje i płatności</b>
<br>

Użytkownik może rezerwować miejsca parkingowe za pomocą aplikacji.
Płatność za rezerwację odbywa się z góry za pośrednictwem akceptowanych metod płatności.
Usługodawca zastrzega sobie prawo do anulowania rezerwacji w przypadku braku płatności.
<br>

<b>Odpowiedzialność</b>
<br>

Usługodawca nie ponosi odpowiedzialności za jakiekolwiek szkody wynikające z korzystania z miejsc parkingowych.
Użytkownik zobowiązuje się do przestrzegania regulaminu obiektu, w którym dokonał rezerwacji.
<br>

<b>Polityka prywatności i RODO</b>
<br>

Dane osobowe użytkowników są przetwarzane zgodnie z obowiązującymi przepisami prawa, w tym z Rozporządzeniem o Ochronie Danych Osobowych (RODO).
Użytkownik ma prawo do wglądu, zmiany i usunięcia swoich danych osobowych.
<br>
<b>Postanowienia końcowe</b>
<br>

Usługodawca zastrzega sobie prawo do wprowadzania zmian w regulaminie.
Wszelkie spory wynikłe na tle niniejszego regulaminu będą rozstrzygane przez sąd właściwy dla siedziby Usługodawcy.
      </div>

      <div class="text-center">
        <v-btn @click="store.dispatch('showTosOverlay')">Zamknij</v-btn>
      </div>
    </v-card-text>
  </v-card>
  </v-overlay>
</template>

<script setup>
import { useStore } from 'vuex';
import { watch, computed, ref } from 'vue';
const store = useStore();


const showOverlay = computed(() => store.state.showTosOverlay);
</script>

<style scoped>
.centered-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>