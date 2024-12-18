<template>
    <div>
      <NavigationBar></NavigationBar>
      <v-container
        class="d-flex flex-column justify-center pt-5"
        style="margin-top: 100px; height: 70vh;"
      >
        <v-row class="mb-1">
          <v-col>
            <v-text-field label="Vorname" variant="outlined" style="font-size: 1.2em;"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Nachname" variant="outlined" style="font-size: 1.2em;"></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mb-1">
          <v-col>
            <v-text-field label="Rolle" variant="outlined" style="font-size: 1.2em;"></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mb-1">
          <v-col>
            <v-text-field label="Mail" variant="outlined" style="font-size: 1.2em;"></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mb-1">
          <v-col>
            <v-text-field label="Mail bestätigen" variant="outlined" style="font-size: 1.2em;"></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mb-1">
          <v-col>
            <v-text-field label="Passwort" variant="outlined" style="font-size: 1.2em;"></v-text-field>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-center">
          <v-btn variant="tonal" style="font-size: 1em; width: 200px; height: 60px; background-color: #009260; font-weight: bold;" @click="$router.push('/loginpage')">
            Konto erstellen
          </v-btn>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  import NavigationBar from './NavigationBar.vue';
  
  export default {
    components: {
      NavigationBar,
    },
  };
  </script>
