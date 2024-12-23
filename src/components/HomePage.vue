<template>
  <div class="container1">
    <NavigationBar></NavigationBar>
    <!-- Navigation Bar -->
    <!-- Removed old navigation bar code -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list :items="items"></v-list>
    </v-navigation-drawer>

    <!-- First Empty Row -->
    <v-row>
      <v-col></v-col>
      <v-col></v-col>
    </v-row>

    <!-- Second Row mit Buttons (Book Ride und Offer Ride) -->
    <v-row class="buttons-row">
      <!-- Book Ride Button in Column 1 -->
      <v-col class="d-flex justify-center">
        <v-btn @click="$router.push('/bookride')" class="btn">Book Ride</v-btn>
      </v-col>

      <!-- Offer Ride Button in Column 2 -->
      <v-col class="d-flex justify-center">
        <v-btn @click="$router.push('/offerride')" class="btn">Offer Ride</v-btn>
      </v-col>
    </v-row>

    <!-- Third Empty Row -->
    <v-row>
      <v-col></v-col>
      <v-col></v-col>
    </v-row>
  </div>
</template>

<style scoped>
/* Container-Layout */
.container1 {
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.buttons-row {
  display: flex;
  justify-content: center; /* Buttons zentrieren */
  align-items: center;
}

.btn {
  padding: 1rem 2rem;
  background-color: #008557;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  max-width: 400px; /* Maximale Breite */
  height: auto;
}

.btn:hover {
  background-color: #006946;
}
</style>

<script>
import NavigationBar from './NavigationBar.vue';

export default {
  name: 'HomePage',
  components: {
    NavigationBar,
  },
  data: () => ({
    drawer: false,
    group: null,
    items: [
      {
        title: 'Foo',
        value: 'foo',
      },
      {
        title: 'Bar',
        value: 'bar',
      }
    ],
  }),

  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
