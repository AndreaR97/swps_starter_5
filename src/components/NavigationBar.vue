<template> 
  <v-app-bar density="compact" class="navbar" color="#009260">
    <v-btn icon @click="this.$router.push('/')">
      <v-icon>mdi-home</v-icon>
      <v-tooltip
        activator="parent"
        location="bottom"
      >Zurück zur Startseite</v-tooltip>
    </v-btn>
    <v-toolbar-title>Title</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-message-text</v-icon>
    </v-btn>

    <v-btn icon @click="handleAccountClick">
      <v-icon>mdi-account</v-icon>
    </v-btn>

    <v-btn icon v-if="isLoggedIn" @click="logout">
      <v-icon>mdi-logout</v-icon>
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

    handleAccountClick() {
      if (this.isLoggedIn) {
        this.$router.push('/profilepage');
      } else {
        this.$router.push('/loginpage');
      }
    },

    logout() {
      localStorage.removeItem('authToken'); 
      this.$router.push('/'); 
    },

    navigate(value) { 
      this.$router.push(value); }

  },

};
</script>
