<template>
  <NavigationBar></NavigationBar>
  <v-container
  class="mt-15">
      <v-row
      class=" align-center">
        
        <v-col
          class="formItems">
            <v-form>

              <v-row>
                  <v-text-field
                  label="Start der Route"
                  type="email"
                  variant="solo-filled"
                  ></v-text-field>
              </v-row>

              <v-row>
                  <v-text-field
                  label="Ziel der Route"
                  type="email"
                  variant="solo-filled"
                  ></v-text-field>
              </v-row>

              <v-row>
                  <v-col
                  class="pl-0">
                      <v-text-field
                      label="Datum"
                      type="date"
                      variant="solo-filled"
                      ></v-text-field>
                  </v-col>
                  <v-col
                  class="pr-0">
                      <v-text-field
                      label="Uhrzeit"
                      type="time"
                      variant="solo-filled"
                      ></v-text-field>
                  </v-col>
              </v-row>


              <v-row>
                  <v-col
                  class="pl-0">
                      <v-text-field
                      label="Sitzplätze"
                      type="number"
                      variant="solo-filled"
                      ></v-text-field>
                  </v-col>

                  <v-col
                  class="pr-0 align-items-center">
                      <v-btn
                      color="#009260"
                      @click="dialog = !dialog; overlay = !overlay"
                      size="x-large"
                      class="rounded submit-button"
                      block>
                      Anbieten
                      </v-btn>
                  </v-col>
              </v-row>
            </v-form> 
              
          </v-col>
        
          <v-col
          class="map-column v-col-sm-6 v-col-12 ml-6">
            <div id="map" class="independent-map"></div>
          </v-col>

      </v-row>

  </v-container>
     
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

.map-column {
  justify-content: center;
}

/* Karte: Quadratisch und responsiv */
/* Karte quadratisch machen */
.independent-map {
    width: 100%;
    max-width: 500px;
    max-height: 500px;
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
.rounded{
  border-radius: 10px;
}

  </style>