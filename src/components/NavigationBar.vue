<template> 
  <v-app-bar density="compact" class="navbar" color="#009260">
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
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

  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-list :items="items"></v-list>
  </v-navigation-drawer>
</template>


<script>
export default {
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
        this.$router.push('/registrationpage');
      }
    },

    logout() {
      localStorage.removeItem('authToken'); 
      this.$router.push('/loginpage'); 
    },
  },

  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
