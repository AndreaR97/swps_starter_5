<template>
  <v-card
    color=""
    height="200px"
    rounded="0"
    flat>

  <v-app-bar density="compact"
    style="background-color:#E9E9ED;">
    
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Title</v-toolbar-title>

      <v-spacer></v-spacer>
          <v-btn icon>
              <v-icon>mdi-message-text</v-icon>
          </v-btn>

          <v-btn icon>
               <v-icon @click="$router.push('/loginpage')">mdi-account</v-icon>
          </v-btn>

          <v-btn icon>
              <v-icon>mdi-logout</v-icon>
          </v-btn>
  </v-app-bar>
  //alternativ kann auch v-toolbar eingesetzt werden, dann erscheint das Menü und die Toolbar liegt im Hintergrund
    
    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
    >
      <v-list
        :items="items"
      ></v-list>
    </v-navigation-drawer>
  </v-card>

  <v-container>
    <v-row justify=center>
      <v-col cols="12" md="4" sm="6">
              <v-btn rounded="lg" size="x-large"  height="200" color="#008557" @click="$router.push('/bookride')" block>Ich suche eine Fahrt</v-btn> 
      </v-col>

      <v-col cols="12" md="4" sm="6">
        <v-btn rounded="lg" size="x-large"  height="200" color="#008557" @click="$router.push('/offerride')" block>Ich biete eine Fahrt</v-btn>
      </v-col>
     </v-row>
      
     <v-row justify=center>
        </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'HomePage',

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