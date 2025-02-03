<template>
  <div class="container1">
    <!--Renders and adds the navigation bar-->
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col></v-col>
      <v-col></v-col>
    </v-row>

    <!--Adds two buttons used to route the user to the corresponding page for
    either booking or offering a ride-->
    
    <v-row class="buttons-row">
      <v-col class="d-flex justify-end">
        <v-btn @click="handleButtonClick('/bookride')" class="btn">
          Fahrt buchen
        </v-btn>
      </v-col>

      <v-col class="d-flex justify-start">
        <v-btn @click="handleButtonClick('/offerride')" class="btn">
          Fahrt anbieten
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col></v-col>
      <v-col></v-col>
    </v-row>
  </div>
</template>

<style scoped>
/*Styling for the main container of HomePage*/
.container1 {
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
}

/*Keeps the two buttons centered*/
.buttons-row {
  display: flex;
  justify-content: center; 
  align-items: center;
}

/*Adds spacing to the buttons*/
.buttons-row .v-col {
  margin: 0 6rem; 
}

/*Styling and hover effect for the two buttons*/
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
    /*Method used to route the user according to which button is clicked and
    whether there is an authentication token available, i.e. user is logged in*/
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
