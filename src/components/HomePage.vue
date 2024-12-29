<template>
  <div class="container1">
    <NavigationBar></NavigationBar>>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list :items="items"></v-list>
    </v-navigation-drawer>

    <v-row>
      <v-col></v-col>
      <v-col></v-col>
    </v-row>
    <v-row class="buttons-row">
      <v-col class="d-flex justify-center">
        <v-btn @click="handleButtonClick('/bookride')" class="btn">Book Ride</v-btn>
      </v-col>

      <v-col class="d-flex justify-center">
        <v-btn @click="handleButtonClick('/offerride')" class="btn">Offer Ride</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col></v-col>
      <v-col></v-col>
    </v-row>
  </div>
</template>

<style scoped>

.container1 {
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.buttons-row {
  display: flex;
  justify-content: center; 
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

  methods: {
    handleButtonClick(route) {
      if (localStorage.getItem('authToken')) {
        this.$router.push(route);
      } else {
        this.$router.push({ path: '/loginpage', query: { redirectTo: route } });
      }
    }
  },

  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
