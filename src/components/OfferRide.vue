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

    <v-container fluid class="d-flex align-center justify-center" style="height: 100vh;">
      <v-row>
        <v-col cols="12" md="6">
          <v-textarea
            label="Start"
            row-height="15"
            rows="2"
            variant="outlined"
            auto-grow
            class="mb-4 text-field"
            v-model="startText"
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="6">
          <div></div> 
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea
            label="Ziel"
            row-height="15"
            rows="2"
            variant="outlined"
            auto-grow
            class="mb-4 text-field"
            v-model="zielText"
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="6">
          <div></div> 
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            label="Uhrzeit"
            variant="outlined"
            class="mb-4 text-field"
            v-model="time"
            :rules="[timeRule]"
            placeholder="HH:MM"
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            label="Datum"
            variant="outlined"
            class="mb-4 text-field"
            v-model="date"
            :rules="[dateRule]"
            placeholder="YYYY-MM-DD"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <div></div> 
        </v-col>
        <v-col cols="9" md="2">
          <v-select
            :items="[1, 2, 3, 4, 5, 6, 7, 8, 9]"
            label="Sitzplätze"
            variant="outlined"
            class="mb-4 text-field"
          ></v-select>
        </v-col>
        <v-col cols="3" md="4"></v-col>
      </v-row>
    </v-container>

    
    <v-btn
      absolute
      bottom
      left
      color="#009260"
      class="swap-button"
      @click="swapStartAndZiel"
    >
      Tausche Start & Ziel
    </v-btn>

    
    <v-btn
      fixed
      bottom
      right
      color="#009260"
      class="weiter-button"
      @click="navigateToHome"
    >
      Weiter
    </v-btn>
    <div id="map" class="independent-map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export default {
  setup() {

    const navigateToHome = () => {

    };

    return { navigateToHome };
  },
  data() {
    return {
      drawer: false,
      step: 1,
      items: ["Anfrage", "Bestätigung"],
      map: null, 
      time: "",
      date: "",
      startText: "", 
      zielText: "", 
    };
  },
  methods: {
    swapStartAndZiel() {
      const temp = this.startText;
      this.startText = this.zielText;
      this.zielText = temp;
    },
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

      L.marker(uniBayreuthCoords).addTo(this.map).bindPopup("Universität Bayreuth").openPopup();
    },
    timeRule(value) {
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
      return timePattern.test(value) || "Ungültige Uhrzeit. Format: HH:MM";
    },
    dateRule(value) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(value)) {
        return "Ungültiges Datum. Format: YYYY-MM-DD";
      }
      const inputDate = new Date(value);
      const today = new Date();
      const fourWeeksFromNow = new Date();
      fourWeeksFromNow.setDate(today.getDate() + 28);
      return (
        (inputDate >= today && inputDate <= fourWeeksFromNow) ||
        "Datum muss innerhalb der nächsten 4 Wochen liegen"
      );
    },
  },
  mounted() {
    this.initMap();
  },
};
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
.text-field {
  margin-left: 16px;
  margin-right: 50px;
}
.swap-button {
  position: absolute;
  bottom: 620px;
  right: 1015px;
  z-index: 5000;
}
.weiter-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 5000;
}
.independent-map {
  position: absolute;
  top: 200px;
  left: 1000px;
  width: 800px;
  height: 600px;
  border: 1px solid hwb(0 0% 100%);
  z-index: 500;
}
</style>