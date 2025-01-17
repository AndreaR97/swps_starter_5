<template>
  <div class="container1">
    <NavigationBar></NavigationBar>

    <v-row>
      <v-col></v-col>
      <v-col></v-col>
    </v-row>
    <v-row class="buttons-row">
      <v-col class="d-flex justify-end"> <!-- Align left button to the left -->
        <v-btn @click="handleButtonClick('/bookride')" class="btn">Fahrt buchen</v-btn>
      </v-col>

      <v-col class="d-flex justify-start"> <!-- Align right button to the right -->
        <v-btn @click="handleButtonClick('/offerride')" class="btn">Fahrt anbieten</v-btn>
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

.buttons-row .v-col {
  margin: 0 6rem; 
}

.btn {
  padding: 2rem 4rem; 
  background-color: #008557;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.5rem; 
  cursor: pointer;
  width: 100%;
  max-width: 400px; 
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

  methods: {
    handleButtonClick(route) {
      if (localStorage.getItem('authToken')) {
        this.$router.push(route);
      } else {
        localStorage.setItem('redirectTo', route);
        this.$router.push('/loginpage');
      }
    }
  },

};
</script>
