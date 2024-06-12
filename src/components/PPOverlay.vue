<template>
    <v-overlay class="centered-overlay" v-model="showOverlay" :opacity="0.99" @click:outside="store.dispatch('showPPOverlay')">
      <v-card class="pa-16">
      <v-card-text>
        <div class="font-weight-bold text-h3 text-center mb-6">Polityka prywatności</div>
        <div class="text-justify">
            <b>Administrator Danych</b>
            <br>
Administratorem danych osobowych przetwarzanych w ramach aplikacji Parking+ jest zespół Parking+.
<br>

<b>Zakres przetwarzania danych</b>
<br>

Przetwarzane dane obejmują: imię, nazwisko, adres e-mail, numer telefonu oraz informacje dotyczące rezerwacji miejsc parkingowych.
<br>
<b>Cele przetwarzania danych</b>
<br>

Dane osobowe są przetwarzane w celu realizacji usług rezerwacji miejsc parkingowych, obsługi klienta oraz w celach marketingowych za zgodą użytkownika.
<br>
<b>Prawa użytkownika</b>
<br>

Użytkownik ma prawo do dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz przenoszenia danych.
<br>
<b>Okres przechowywania danych</b>
<br>

Dane osobowe będą przechowywane przez okres niezbędny do realizacji usług oraz zgodnie z obowiązującymi przepisami prawa.
<br>
<b>Bezpieczeństwo danych</b>
<br>

Administrator stosuje odpowiednie środki techniczne i organizacyjne, aby chronić dane osobowe przed nieautoryzowanym dostępem, utratą lub zniszczeniem.
<br>

<b>Polityka Prywatności:</b>
<br>

Parking+ szanuje Twoją prywatność i zobowiązuje się do ochrony Twoich danych osobowych. Niniejsza Polityka Prywatności wyjaśnia, jakie dane zbieramy, w jaki sposób je przetwarzamy oraz jakie masz prawa w związku z ich przetwarzaniem.
<br>

<b>Jakie dane zbieramy?</b>
<br>

Informacje podane podczas rejestracji: imię, nazwisko, adres e-mail, numer telefonu.
Informacje dotyczące rezerwacji: szczegóły dotyczące zarezerwowanego miejsca parkingowego, czas trwania rezerwacji.
Dane dotyczące korzystania z aplikacji: adres IP, dane dotyczące przeglądania aplikacji, preferencje użytkownika.
<br>

<b>W jaki sposób wykorzystujemy Twoje dane?</b>
<br>

Realizacja usług: Przetwarzamy Twoje dane, aby umożliwić rezerwację miejsc parkingowych i obsługę klienta.
Personalizacja usług: Używamy Twoich danych do dostosowania naszych usług do Twoich potrzeb i preferencji.
Komunikacja: Kontaktujemy się z Tobą w sprawach związanych z Twoimi rezerwacjami oraz informujemy o aktualizacjach aplikacji.
Marketing: Za Twoją zgodą możemy przesyłać informacje o promocjach i ofertach specjalnych.
<br>

<b>Udostępnianie danych osobowych</b>
<br>

Twoje dane mogą być udostępniane naszym partnerom, którzy zarządzają miejscami parkingowymi, ale tylko w zakresie niezbędnym do realizacji rezerwacji.
Nie sprzedajemy, nie wynajmujemy ani w żaden inny sposób nie udostępniamy Twoich danych osobowych stronom trzecim bez Twojej wyraźnej zgody, chyba że wymaga tego prawo.
<br>

<b>Bezpieczeństwo danych</b>
<br>

Stosujemy zaawansowane środki techniczne i organizacyjne, aby zapewnić bezpieczeństwo Twoich danych osobowych i chronić je przed nieautoryzowanym dostępem, zmianą, ujawnieniem lub zniszczeniem.
<br>

<b>Twoje prawa</b>
<br>

Masz prawo do dostępu do swoich danych osobowych oraz do ich sprostowania, usunięcia, ograniczenia przetwarzania i przenoszenia.
Możesz w każdej chwili wycofać swoją zgodę na przetwarzanie danych osobowych w celach marketingowych.
<br>

<b>Cookies i technologie śledzące</b>
<br>

Parking+ używa plików cookies i podobnych technologii do śledzenia Twoich działań w aplikacji, co pozwala nam na poprawę jakości usług i dostosowanie ich do Twoich preferencji.
<br>

<b>Zmiany w Polityce Prywatności</b>
<br>

Zastrzegamy sobie prawo do aktualizacji niniejszej Polityki Prywatności w dowolnym czasie. Wszelkie zmiany będą publikowane w aplikacji oraz na naszej stronie internetowej.
<br>

<b>Kontakt</b>
<br>

W razie pytań dotyczących Polityki Prywatności lub przetwarzania Twoich danych osobowych, skontaktuj się z nami pod adresem: privacy@parkingplus.com.    
        </div>
<div class="text-center">
    <v-btn @click="store.dispatch('showPPOverlay')">Zamknij</v-btn>

</div>        
      </v-card-text>
    </v-card>
    </v-overlay>
  </template>
  
  <script setup>
  import { useStore } from 'vuex';
  import { watch, computed, ref } from 'vue';
  const store = useStore();
  
  
  const showOverlay = computed(() => store.state.showPPOverlay);
  </script>
  
  <style scoped>
  .centered-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
  }
  </style>