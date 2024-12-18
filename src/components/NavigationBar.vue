<template> 
<v-app-bar density="compact" class="navbar" color="#009260"> <!-- Farbe könnt ihr wieder weiß machen wenn ihr das besser findet -->
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title>Title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-message-text</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon @click="$router.push('/registrationpage')">mdi-account</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>

  <!-- Navigation Drawer -->
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

watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>
