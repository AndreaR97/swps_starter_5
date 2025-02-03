<template> 
  <v-app-bar density="compact" class="navbar" color="#009260">
    <v-btn icon @click="this.$router.push('/')">
      <!--Button that leads a user back to the homepage-->
      <v-icon>mdi-home</v-icon>
      <!--Tooltip holding information when hovered on-->
      <v-tooltip
        activator="parent"
        location="bottom"
      >Zurück zur Startseite</v-tooltip>
    </v-btn>
    <v-toolbar-title>CampusConnect</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-message-text</v-icon>     <!--Button reserved for future chat function-->
    </v-btn>

    <v-btn icon @click="handleAccountClick">
      <v-icon>mdi-account</v-icon>          <!--Button leads the user to their profile page-->
    </v-btn>

    <v-btn icon v-if="isLoggedIn" @click="logout">
      <v-icon>mdi-logout</v-icon>           <!--Button holds logout function-->
    </v-btn>
  </v-app-bar>

</template>


<script>
export default {

  computed: {
    isLoggedIn() {
      return Boolean(localStorage.getItem('authToken'));
    },
  },

  methods: {
    //Routes the user depending on whether logged in or not
    handleAccountClick() {
      if (this.isLoggedIn) {
        this.$router.push('/profilepage');
      } else {
        this.$router.push('/loginpage');
      }
    },

    //Routes a user back to the homepage upon logging out
    logout() {
      if (window.location.pathname === '/') { 
        localStorage.removeItem('authToken'); 
        window.location.reload(true); 
      }else{
      localStorage.removeItem('authToken'); 
      this.$router.push('/');
      } 
    },

    //Routes to the page specified in the string @param value 
    navigate(value) { 
      this.$router.push(value); }
  },

};
</script>

<style scoped>
/*Customizes the styling of the navigation bar */
.navbar .v-toolbar-title {
  font-size: 1.5rem;
  font-family: Arial, sans-serif;
}
</style>
