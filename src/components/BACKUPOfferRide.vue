<template>
  <div class="container1">
    <!-- Navigation Bar -->
    <NavigationBar></NavigationBar>

    <!-- Container mit zwei Spalten -->
    <v-row no-gutters>
      <!-- Spalte 1 (mit den Eingabefeldern) -->
      <v-col cols="12" md="6" class="input-column">
        <!-- Start der Route -->
        <v-row no-gutters class="input-row">
          <v-col cols="12">
            <v-text-field
              v-model="startLocation"
              label="Start der Route"
              outlined
              class="input-field1"
            ></v-text-field>
          </v-col>
        

        <!-- Ziel der Route -->
        
          <v-col cols="12">
            <v-text-field
              v-model="endLocation"
              label="Ziel der Route"
              outlined
              class="input-field1"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Datum und Uhrzeit -->
        <v-row no-gutters class="input-row">
          <v-col cols="6">
            <v-text-field
              v-model="date"
              label="Datum"
              outlined
              class="input-field2"
              type="date"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="time"
              label="Uhrzeit"
              outlined
              class="input-field2"
              type="time"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Sitzplätze und Button zum Anbieten -->
        <v-row no-gutters class="input-row">
          <v-col cols="6">
            <v-text-field
              v-model="freeSeats"
              label="Freie Plätze"
              outlined
              class="input-field3"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="#009260"
              class="submit-button"
              @click="dialog = !dialog; overlay = !overlay"
            >
              Anbieten
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <!-- Spalte 2 (Karte ohne Rows) -->
      <v-col cols="12" md="6" class="map-column">
        <div id="map" class="independent-map"></div>
      </v-col>
    </v-row>
  </div>

  <!-- Overlay und Dialogfenster für Bestätigung -->
  <v-fade-transition hide-on-leave>
    <v-overlay v-model="overlay">
      <div class="centered-container">
        <v-dialog v-model="dialog" max-width="600" persistent>
          <v-card>
            <div class="py-12 text-center">
              <v-icon
                class="icon-container"
                color="#009260"
                icon="mdi-check-circle-outline"
                size="128"
              ></v-icon>

              <div>
                <h3>Das Fahrtenangebot wurde übermittelt!</h3>
                <p>Du wirst nun weitergeleitet.</p>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="pa-4 text-end">
              <v-btn
                class="text-none"
                color="medium-emphasis"
                min-width="92"
                variant="outlined"
                @click="$router.push('/profilepage')"
              >
                OK
              </v-btn>
            </div>
          </v-card>
        </v-dialog>
      </div>
    </v-overlay>
  </v-fade-transition>
</template>

<script setup>
import { ref } from "vue";

const dialog = ref(false); // Dient dem Öffnen und Schließen des Popup-Dialogs
const overlay = ref(false);
</script>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import NavigationBar from "./NavigationBar.vue";

export default {
  data() {
    return {
      map: null,
      startLocation: "",
      endLocation: "",
      date: "",
      time: "",
      freeSeats: "",
    };
  },
  methods: {
    initMap() {
      const uniBayreuthCoords = [49.928809, 11.585835];
      this.map = L.map("map").setView(uniBayreuthCoords, 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      const defaultIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = defaultIcon;

      L.marker(uniBayreuthCoords).addTo(this.map);
    },
  },
  mounted() {
    this.initMap();
  },
};
</script>

<style scoped>
/* Container füllt den gesamten Bildschirm */
.container1 {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: white;
}

/* Container für die Spalten */
.v-row {
  display: flex;
  flex-direction: row;
  height: 100%;
}

/* Spalte 1 (mit den Eingabefeldern) */
.v-col.input-column {
  display: flex;
  flex-direction: column;
}

/* Jede Row in der ersten Spalte bekommt gleich viel Platz */
.input-row {
  display: flex;
  align-items: center;
  height: 25%; /* Jede Row erhält 25% der Containerhöhe */
  width: 100%;
  padding: 0 10px;
}

.map-column {
  justify-content: center;
}

/* Karte: Quadratisch und responsiv */
/* Karte quadratisch machen */
.independent-map {
    width: 100%;
    max-width: 500px;
    max-height: 500px;
    margin: 15%;
    aspect-ratio: 1 / 1; /* Hält die Karte quadratisch */
    background-color: #ccc; /* Platzhalterfarbe für die Karte */
}

.independent-map > * {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Overlay */
.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.icon-container {
  animation: fadeIn 0.4s;
}



.input-field1{
  margin-top: 10%;
  margin-left: 7.5%;
  margin-right: 5%;
}
.input-field2{
  margin-top: 20%;
  margin-left: 15%;
  margin-right: 5%;
  
}
.input-field3{
  margin-top: 15%;
  margin-left: 15%;
  max-width: 175px;
}

.submit-button{
  margin-top: 15%;
  max-width: 200px;
  margin-right: 5%;
}


@keyframes fadeIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>




 <!--

<template>
  <div>
    <div class="map-container">
      <div id="map" class="independent-map"></div>
      <v-text-field
        v-model="startLocation"
        label="Start der Route"
        outlined
        class="Startlocation"
      ></v-text-field>
      <v-text-field
        v-model="endLocation"
        label="Ziel der Route"
        outlined
        class="Endlocation"
      ></v-text-field>
      <v-btn icon @click="swapLocations" class="SwapButton">
        <v-icon>mdi-swap-horizontal</v-icon>
      </v-btn>
      <v-text-field
        v-model="date"
        label="Datum"
        outlined
        class="Date"
        type="date"
        :rules="[dateRule]"
      ></v-text-field>
      <v-text-field
        v-model="time"
        label="Uhrzeit"
        outlined
        class="Time"
        type="time"
      ></v-text-field>
      <v-text-field
        v-model="freeSeats"
        label="Freie Plätze"
        outlined
        class="Freeseats"
        type="number"
        :rules="[freeSeatsRule]"
      ></v-text-field>
    </div>
  </div>

  
</template>


<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export default {
  data() {
    return {
      drawer: false,
      items: [
        { title: 'Foo', value: 'foo' },
        { title: 'Bar', value: 'bar' },
      ],

      map: null,
      startLocation: '',
      endLocation: '',
      date: '',
      time: '',
      freeSeats: '',
      dateRule: value => {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 28); // das datum muss in den näschten 4 wochen liegen
        const selectedDate = new Date(value);
        return selectedDate >= today && selectedDate <= maxDate || 'Datum muss innerhalb der nächsten 4 Wochen liegen';
      },
      freeSeatsRule: value => {
        const number = parseInt(value, 10);
        return number >= 1 && number <= 9 || 'Freie Plätze müssen eine ganze Zahl zwischen 1 und 9 sein';
      },
    };
  },
  methods: {
    initMap() {
      const uniBayreuthCoords = [49.928809, 11.585835];
      this.map = L.map("map").setView(uniBayreuthCoords, 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      const defaultIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = defaultIcon;

      L.marker(uniBayreuthCoords).addTo(this.map);
    },
    swapLocations() {
      const temp = this.startLocation;
      this.startLocation = this.endLocation;
      this.endLocation = temp;
    },
  },
  mounted() {
    this.initMap();
  },
 
};
</script>

<style scoped>
.map-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: calc(100vh - 64px); /* damit man nicht scrollen kann */
  padding-right: 100px;
}
.independent-map {
  width: 800px;
  height: 600px;
  border-radius: 15px;
  z-index: 500;
}

.v-text-field input {
    font-size: 1.4em;
    font-weight: 100;
    text-transform: capitalize;
}

.v-text-field label{
    font-size: 1.1em;
    font-weight: 100;
}

.Startlocation {
  position: absolute;
  top: 240px; 
  left: 100px; 
  width: 700px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic';
  font-size: 30px; /* schriftgröße ändern geht irgendwie nicht :/ */
}

.Endlocation {
  position: absolute;
  top: 390px; 
  left: 100px; 
  width: 700px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Date {
  position: absolute;
  top: 540px; 
  left: 100px; 
  width: 275px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Time {
  position: absolute;
  top: 540px; 
  left: 525px; 
  width: 275px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Freeseats {
  position: absolute;
  top: 690px; 
  left: 100px; 
  width: 250px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Submitbutton {
  position: absolute;
  top: 690px; 
  left: 500px; 
  width: 300px;
  height: 100px;
  z-index: 1000;
  font-family: 'Minion Pro Italic';
  font-size: 20px;
  color: #48535A;
}

.SwapButton {
  position: absolute;
  top: 320px; 
  left: 650px;
  z-index: 1000;
  width: 80px;
  height: 80px;
}

}
</style>
-->