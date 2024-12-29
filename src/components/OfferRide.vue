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
                <v-autocomplete
                  label="Start der Route"
                  clearable
                  type="email"
                  v-model="startLocation"
                  variant="solo-filled"
                  :items="orte"
                  :rules="[startLocationRule]"
                  ></v-autocomplete>
              </v-row>

              <v-row>
                <v-autocomplete
                  label="Ziel der Route"
                  clearable
                  type="email"
                  v-model="endLocation"
                  variant="solo-filled"
                  :items="orte"
                  :rules="[endLocationRule]"
                  ></v-autocomplete>
              </v-row>

              <v-row>
                  <v-col
                  class="pl-0">
                      <v-text-field
                      label="Datum"
                      type="date"
                      v-model="date"
                      variant="solo-filled"
                      :rules="[dateRule]"
                      ></v-text-field>
                  </v-col>
                  <v-col
                  class="pr-0">
                      <v-text-field
                      label="Uhrzeit"
                      type="time"
                      v-model="time"
                      variant="solo-filled"
                      :rules="[timeRule]"
                      ></v-text-field>
                  </v-col>
              </v-row>


              <v-row>
                  <v-col
                  class="pl-0">
                      <v-select
                      label="Sitzplätze"
                      variant="solo-filled"
                      v-model="freeSeats"
                      :items="seats"
                      :rules="[seatRule]"
                      ></v-select>
                  </v-col>

                  <v-col
                  class="pr-0 align-items-center">
                      <v-btn
                      color="#009260"
                      @click="offerRide; dialog = !dialog; overlay = !overlay"
                      size="x-large"
                      class="rounded submit-button"
                      block
                      :disabled="!isFormValid">
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
  import { supabase } from '../lib/supabaseClient';
  
  export default {
    data() {
      return {
        map: null,
        startLocation: {required: true},
        endLocation: '',
        date: '',
        time: '',
        freeSeats: '',
        seats: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      
      orte: []
      }
    },
    computed: {
      startLocationRule() {
        return v => !!v || 'Startort ist erforderlich';
      },
      endLocationRule() {
        return v => !!v || 'Zielort ist erforderlich';
      },
      dateRule() {
        return v => {
          if (!v) return 'Datum ist erforderlich';
          const today = this.getBerlinNow();
          today.setHours(0,0,0,0);
          const maxDate = new Date(today);
          maxDate.setDate(today.getDate() + 28);
          const selectedDate = new Date(v);
          selectedDate.setHours(0,0,0,0);
          return (selectedDate >= today && selectedDate <= maxDate)
            || 'Datum muss in den nächsten 4 Wochen liegen';
        };
      },
      timeRule() {
        return v => {
          if (!v) return 'Uhrzeit ist erforderlich';
          const now = this.getBerlinNow();
          const selectedDate = new Date(this.date);
          if (selectedDate.toDateString() === now.toDateString()) {
            const [hours, minutes] = v.split(':');
            const chosenTime = this.getBerlinNow();
            chosenTime.setHours(hours, minutes);
            if (chosenTime <= now) {
              return 'Uhrzeit muss in der Zukunft liegen';
            }
          }
          return true;
        };
      },
      seatRule() {
        return v => {
          if (!v) return 'Sitzplätze sind erforderlich';
          return (v >= 1 && v <= 9) || 'Sitzplätze müssen zwischen 1 und 9 sein';
        };
      },
      isFormValid() {
        return (
          this.startLocation &&
          this.endLocation &&
          this.dateRule(this.date) === true &&
          this.timeRule(this.time) === true &&
          this.seatRule(this.freeSeats) === true
        );
      }
    },

    methods: {
      getBerlinNow() {
        return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
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
  
        L.marker(uniBayreuthCoords).addTo(this.map);
      },

      async getLocations() {
        const { data: locations, error } = await supabase
          .from('Ort')
          .select('Adresse');
  
        if (error) {
          console.error('Error fetching data from Supabase:', error);
          return;
        }

        locations.forEach((ort) => {
        
          this.orte.push(ort.Adresse);
        });
      },
      async offerRide() {
        try {
          const { error } = await supabase
            .from('Fahrt')
            .insert([{
              Farht_ID: 33,
              Fahrer: "max.mustermann@uni-bayreuth.de",
              Startort: this.startLocation,
              Zielort: this.endLocation,
              Abfahrtszeit: this.time,
              Datum: this.date,
              Sitzplätze: this.freeSeats
            }]);
          if (error) {
            console.error('Error inserting data:', error);
            this.errorMessage = 'Fehler beim Erstellen eines Fahrtangebots';
          } else {
            console.log('Data inserted successfully');
          }
        } catch (error) {
          console.error('Unexpected error:', error);
          this.errorMessage = 'Fehler beim Erstellen eines Fahrtangebots';
        }
      }
    },
    async mounted() {
      this.initMap();
      await this.getLocations();
    }
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

.icon-container {
  animation: fadeIn 0.4s;
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