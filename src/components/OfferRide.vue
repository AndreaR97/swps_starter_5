<template>
  <div class="container1">
    <!-- Navigation Bar -->
   <NavigationBar></NavigationBar>

    <!-- 4 Rows mit jeweils 25% der Containerhöhe -->
    <!-- Row 1: Start der Route -->
    <v-row>
      <v-col>
        <div class="row">
        <v-text-field
          v-model="startLocation"
          label="Start der Route"
          outlined
          class="location-field"
        ></v-text-field>
        </div>

    <!-- Row 2: Ziel der Route und Karte -->
    <div class="row">
        <v-text-field
          v-model="endLocation"
          label="Ziel der Route"
          outlined
          class="location-field"
        ></v-text-field>
    </div>

    <!-- Row 3: Datum und Uhrzeit -->
    <div class="row">
      <v-col>
        <v-text-field
          v-model="date"
          label="Datum"
          outlined
          class="datetime-field"
          type="date"
        ></v-text-field>
        </v-col>
      <v-col>
        <v-text-field
          v-model="time"
          label="Uhrzeit"
          outlined
          class="datetime-field"
          type="time"
        ></v-text-field>
      </v-col>
    </div>

    <!-- Row 4: Sitzplätze und Bestätigen (Button zusammen mit den Sitzplätzen) -->
    <div class="row">
      <div class="col">
        <div class="seats-and-submit">
          <v-text-field
            v-model="freeSeats"
            label="Freie Plätze"
            outlined
            class="seats-field"
            type="number"
          ></v-text-field>
          <v-btn
            color="#009260"
            class="Submitbutton"
            @click="dialog = !dialog; overlay = !overlay" 
          >
            Anbieten
          </v-btn>
        </div>
      </div>
    </div>
  </v-col>

  <div class="col">
        <div id="map" class="independent-map"></div> <!-- Karte -->
  </div>

</v-row>
</div>  
  <!--Overlay und Dialogfenster für Bestätigung-->
  <v-fade-transition hide-on-leave> 
  <v-overlay v-model="overlay">
    <div class = "centered-container">
      <v-dialog
      v-model="dialog"
      max-width="600"
      persistent
      >

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
import { ref } from 'vue'

const dialog = ref(false) //dient dem Öffnen und Schließen des Popup-Dialogs
const overlay = ref(false)
</script>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import NavigationBar from './NavigationBar.vue';

export default {
  data() {
    return {
      map: null,
      startLocation: '',
      endLocation: '',
      date: '',
      time: '',
      freeSeats: '',
      dateRule: value => {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 28); // das datum muss in den nächsten 4 wochen liegen
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
  
  watch: {
      overlay (val) {
        val && setTimeout(() => {
          this.overlay = false
        }, 2000)
      },
    },
};
</script>

<style scoped>
/* Container-Layout */
.container1 {
  width: 90%; /* Container ist nun 90% der Bildschirmbreite */
  max-width: 1200px; /* Maximale Breite von 1200px */
  height: 80vh; /* Container nimmt 80% der Bildschirmhöhe ein */
  background-color: white;
  display: flex;
  flex-direction: column;
  margin: 0 auto; /* Zentriert den Container */
}

.row {
  display: flex;
  width: 100%;
  height: 25%; /* Jede Row nimmt 25% der Containerhöhe ein */
}

.col {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Styling der Eingabefelder und Buttons */
.location-field,
.datetime-field,
.seats-field {
  width: 80%; /* Eingabefelder sind 80% der Breite der Column */
  margin: 10px; /* Einheitlicher Abstand von 10px um alle Eingabefelder */
}

.Submitbutton {
  width: 40%; /* Button hat jetzt eine kleinere Breite */
  margin-top: 10px;
  height: 50px;
  font-size: 18px;
}

/* Styling für die Karte */
.independent-map {
  width: 100%;
  height: 100%;
  max-width: 600px; /* Karte ist maximal 600px in der Breite */
  max-height: 600px; /* Karte ist maximal 600px in der Höhe */
  margin-left: auto;
  margin-right: auto;
  border-radius: 15px;
  z-index: 500;
}

/* Sitzplätze und Button nebeneinander in der gleichen Row */
.seats-and-submit {
  display: flex;
  justify-content: space-between;
  width: 100%; /* Container für Sitzplätze und Button nimmt 100% der Breite */
}

.seats-and-submit > .v-text-field {
  width: 30%; /* Sitzplätze nehmen jetzt nur 30% der Breite */
}

.seats-and-submit > .v-btn {
  width: 60%; /* Button nimmt 60% der Breite */
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .row {
    flex-direction: column; /* Stacken der Rows auf mobilen Geräten */
    height: auto;
  }

  .location-field,
  .datetime-field,
  .seats-field,
  .Submitbutton {
    width: 90%; /* Eingabefelder und Buttons auf 90% der Breite setzen */
  }

  /* Karte passt sich der mobilen Ansicht an */
  .independent-map {
    width: 90%;
    height: auto;
  }
}

  /* Container für Bestätigung */
  .centered-container { 
    display: flex;
    justify-content: center; 
    align-items: center;
    position: fixed; 
    width: 90em;
    top: 3em;
  }

  /* Icon Animation */
  .icon-container { animation: fadeIn 0.4s;	}
  
  @keyframes fadeIn {
   0% {
		transform: translateX(0) scale(0);

		opacity: 0;
  }
  45% {
		transform: translate(0)
		scale(1.3);

		opacity: 1;
	}
  75% {
		transform: translate(0)
		scale(.9);
	}
  100% {
		transform: translateX(0) scale(1,1);

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