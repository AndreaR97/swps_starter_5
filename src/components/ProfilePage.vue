<template>
  <div class="profilepage">
    <img src="/assets/profilpage.png" alt="ProfilePageBackground" class="profilebackground" />
    
    <v-app-bar density="compact" style="background-color:#E9E9ED;">
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
      <v-list :items="items"></v-list>
    </v-navigation-drawer>
    
    <div class="profilepicture">
      <img src="/assets/profilbild.png" alt="ProfilePicture" class="profilepicture-img" />
      <div class="greenrectangle1"></div>
      <div class="greenrectangle2">
        <label style="position: absolute; top: 65px; left: 70px; font-size: 28px; font-family:Minion Pro Regular">Rolle:</label>
        <v-text-field
          v-model="rolle"
          variant="solo"
          readonly
          style=" position: absolute; top: 50px; left: 250px; width: 800px; height: 100px "
        ></v-text-field>
        <label style="position: absolute; top: 165px; left: 70px; font-size: 28px; font-family:Minion Pro Regular">Eingespartes Co2:</label>
        <v-text-field 
          v-model="co2score"
          variant="solo"
          readonly
          style=" position: absolute; top: 150px; left: 350px; width: 150px; height: 100px;"
        ></v-text-field>
        <v-textarea 
          label="Über mich" 
          variant="outlined"
          style=" position: absolute; top: 275px; left: 50px; width: 1000px; height: 400px; "
        ></v-textarea>
      </div>
      <label style="position: absolute; top: 225px; left: 90px; font-size: 50px; font-family:Minion Pro Regular; font-weight: bold;">Max Mustermann</label>
    </div>
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
    co2score: '5002 L',
    rolle: 'Student',
  }),
  watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>

<style scoped>
.profilepage {
  position: relative;
  width: 100%;
  height: 100%;
}

.profilebackground {
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  position: absolute; 
}

.profilepicture {
  position: relative;
  z-index: 1000;
}

.profilepicture-img {
  width: 150px;
  height: 150px;
  position: absolute;
  left: 200px;
  top: 50px;
  z-index: 1001;
}

.greenrectangle1 {
  position: absolute;
  left: 550px; 
  top: 150px; 
  width: 10000px; 
  height: 650px; 
  background-color: #c2c2c2ad;
  z-index: 1000;
}

.greenrectangle2 {
  position: absolute;
  left: 600px; 
  top: 200px; 
  width: 10000px; 
  height: 600px; 
  background-color: #ffffffde;
  z-index: 1000;
}
</style>
