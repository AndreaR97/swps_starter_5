<template>
  <div>
    <v-app-bar density="compact" style="background-color:#E9E9ED;">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-message-text</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
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
      <v-btn
        color="#009260"
        class="Submitbutton"
      >
        Anbieten
      </v-btn>
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

.Startlocation {
  position: absolute;
  top: 200px; 
  left: 100px; 
  width: 700px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Endlocation {
  position: absolute;
  top: 350px; 
  left: 100px; 
  width: 700px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Date {
  position: absolute;
  top: 500px; 
  left: 100px; 
  width: 275px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Time {
  position: absolute;
  top: 500px; 
  left: 525px; 
  width: 275px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Freeseats {
  position: absolute;
  top: 650px; 
  left: 100px; 
  width: 250px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Submitbutton {
  position: absolute;
  top: 650px; 
  left: 500px; 
  width: 300px;
  height: 100px;
  z-index: 1000;
  font-family: 'Minion Pro Italic';
  font-size: 20px;
  color: #48535A;
}
</style>