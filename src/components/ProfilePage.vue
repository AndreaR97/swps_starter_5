<template>
  <v-card
    color=""
    height="20px"
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
  
  <div class="profilepicture">
    <img src="/assets/profilbild.png" alt="Profile Image">
    <div class="greenrectangle1"></div>
    <div class="greenrectangle2"></div>
    <v-text-field
      v-model="name"
      label="Name"
      append-icon="mdi-pencil"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
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
    name: 'Max Mustermann', 
  }),
  watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>

<style scoped>
.profilepicture img {
  width: 150px;
  height: 150px;
  position: absolute;
  left: 100px;
  top: 150px;
}

.greenrectangle1 {
  position: absolute;
  left: 350px; 
  top: 150px; 
  width: 10000px; 
  height: 700px; 
  background-color: #00925f3b;
  z-index: 0;
}

.greenrectangle2 {
  position: absolute;
  left: 400px; 
  top: 150px; 
  width: 10000px; 
  height: 650px; 
  background-color: #00925f98;
  z-index: 0;
}

.v-text-field {
  position: absolute;
  top: 320px; 
  left: 50px; 
  width: 300px; 
}
</style>
