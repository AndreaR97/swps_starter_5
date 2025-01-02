<template>
  <div class="bookride">
    <NavigationBar></NavigationBar>

    <!--<img src="/assets/profilpage.png" alt="ProfilePageBackground" class="profilebackground" />-->


    <!--Stepper für den Buchungsprozess-->
    <v-container fluid>
      <v-stepper fluid v-model="step">
        <v-stepper-header>
          <v-stepper-item
            title="Suche eine Fahrt"
            value="1"
            editable
            @click="setStep(0)"
          ></v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item
            title="Wähle eine Fahrt aus"
            value="2"
            @click="setStep(1)"
          ></v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item
            title="Details zur Fahrt"
            value="3"
            @click="setStep(2)"
          ></v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item
            title="Fertig"
            value="4"
          ></v-stepper-item>
        </v-stepper-header>

        <!--Inhalt der einzelnen Steps-->
        <v-stepper-items>         
          <div v-if="step === 0">
            <v-stepper-window>
              <div>
                <v-row>
                  <v-container
                      class="mt-2">
                          <v-row
                          class=" align-center">
                            <v-col
                              >
                                <v-form>
                                  <v-row class="pb-6 align-center">
                                    <v-autocomplete
                                      ref="startLocInput"
                                      label="Start der Route"
                                      clearable
                                      type="email"
                                      v-model="startLocation"
                                      variant="solo-filled"
                                      :items="orte"
                                      :rules="[startLocationRule, requiredRule]"
                                      ></v-autocomplete>
                                  </v-row>

                                  <v-row class="justify-end mt-n13 mb-n4">
                                    <v-btn icon @click="swapLocations" class="SwapButton">
                                      <v-icon>mdi-swap-horizontal</v-icon>
                                    </v-btn>
                                  </v-row>

                                  <v-row class="pb-4 align-center">
                                    <v-autocomplete
                                      ref="endLocInput"
                                      label="Ziel der Route"
                                      clearable
                                      type="email"
                                      v-model="endLocation"
                                      variant="solo-filled"
                                      :items="orte"
                                      :rules="[endLocationRule, requiredRule]"
                                      ></v-autocomplete>
                                  </v-row>

                                  <v-row class="pb-1 align-center">
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


                                  <v-row class="pb-3">
                                      <v-col
                                      cols="6 pl-0">
                                          <v-select
                                          label="Sitzplätze"
                                          variant="solo-filled"
                                          v-model="neededSeats"
                                          :items="seats"
                                          :rules="[seatRule]"
                                          ></v-select>
                                      </v-col>
                                      <v-col
                                      cols="6 pr-0">
                                          <v-btn
                                          color="#009260"
                                          @click="getRidesFromDatabase"
                                          size="x-large"
                                          class="rounded submit-button"
                                          block
                                          :disabled="!isFormValid">
                                          OK
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
              </v-row>
            </div>  
      </v-stepper-window>
          </div>

    <div v-if="step === 1"> 
      <v-stepper-content step="2">
        <v-container fluid>
          <v-row dense>
          <v-col cols="6">
            <v-card class="overflow-y-auto"
            max-height="600px">
        <v-list lines="two">
          <v-list-item
            v-for="(person, n) in rideOffers"
            :key="n"
            :title="person.name"
            :value="n"
            color= "#26874E"
            link
          >
          <v-divider class="mb-2"></v-divider>
          <template v-slot:prepend>
            <v-avatar color="info">
              <v-icon icon="mdi-account-circle"></v-icon>
            </v-avatar>
        </template>

        <template v-slot:append>
          <v-list-item-action>
            <v-btn @click="selected = rideOffers.slice(n, n+1)">Auswählen</v-btn>
          </v-list-item-action>
        </template>

          <v-card> 
              <div class="ma-1">
                  <v-row no-gutters>
                    <v-sheet elevation="1" height="40" class="pa-2 ma-2"  border rounded> {{ person.time}}</v-sheet>

                    <v-sheet elevation="1" height="40" class="pa-2 ma-2" border rounded> {{ person.price}}</v-sheet>
                  </v-row>
                </div>
            </v-card>
        </v-list-item>

        </v-list>
      </v-card>
      </v-col>
      <v-col>
        <MapComponent></MapComponent>
      </v-col>
    </v-row>
    </v-container>
      </v-stepper-content>
    </div>

    <!--Defines step 2-->
          <div v-if="step === 2">
            <v-stepper-content step="3">
              <v-container fluid>
                <v-row>
                  <!--Left column showing "Mitfahrer"-->
                  <v-col cols="6" class="left-column">
                    <v-card class="overflow-y-auto"
                          max-height="490px">
                      <!--design properties for the head section: Fahrer-->
                      <span style="font-family: 'Arial'; font-weight: bold; font-size: 30px; color: #009260; padding:10px">Fahrer:</span> 
                      <div style="display: flex; align-items: center; margin-top: 10px;">
                        <img src="/assets/Profilbild.png" alt="Profilbild" style="width: 100px; height: 100px; border-radius: 50%; margin-right: 25px; margin-left: 20px;">
                        <div>
                          <span style="font-family: 'Minion Pro Regular'; font-weight: bold; font-size: 30px; ">{{ selected[0] ? selected[0].name: selected.name}}</span><br>
                          <span style="font-family: 'Minion Pro Regular'; font-size: 20px; ">Rolle: {{ selected[0] ? selected[0].role: selected.role}}</span><br>
                          <span style="font-family: 'Minion Pro Regular'; font-size: 20px; ">Freie Plätze: {{selected[0] ? selected[0].seats: selected.seats}}</span>
                        </div>
                      </div>
                  
                      <!--section two: list of "Mitfahrer"-->
                    <v-divider class="my-4"></v-divider>
                      <span style="font-family: 'Arial'; font-weight: bold; font-size: 30px; color: #009260; padding:10px;">Mitfahrer:</span>

                      <v-list lines="two">
                        <v-item-group>
                        <v-list-item
                          v-for="(person, n) in ride"
                          :key="n"
                          link
                        >
                        <template v-slot:title>
                          <div>
                            <span :style="{ fontFamily: 'Minion Pro Regular', fontSize: '20px', fontWeight: 'bold' }">{{`${person.name} ${person.surname}`}}</span><br>
                          </div>
                        </template>
                        <!--design properties for the title of each item-->

                        <template v-slot:prepend>
                          <img src="/assets/Profilbild.png" alt="Profilbild" style="width: 100px; height: 100px; border-radius: 50%; margin-right: 25px;">
                        </template>
                          <div>
                            <span style="font-family: 'Minion Pro Regular'; font-size: 20px;">Rolle: {{ person.role}}</span><br>
                          </div>
                      </v-list-item>
                      <!-- <v-divider class="mb-4"></v-divider> -->
                      </v-item-group>
                    </v-list>
                  </v-card>
  
                  </v-col>
                  <v-col cols="6" class="right-column">
                    <div style="display: flex; justify-content: center; height: 100%; position: relative;">
                      <div style="border-left: 3px solid black; height: 100%; position: relative;">
                        <div style="position: absolute; top: 0; left: -6px; width: 10px; height: 10px; background-color: black; border-radius: 50%;"></div>
                        <span style="position: absolute; top: -15px; left: -70px; font-family: Arial; color: #7F8990; font-size: 25px;">Start</span>
                        <span style="position: absolute; top: -15px; left: 20px; font-family: Arial; color: #7F8990; font-size: 25px;">10:32</span>
                        <span style="position: absolute; top: 10px; left: 20px; font-family: Arial; color: #7F8990; font-size: 25px;">Bayreuth</span>
                        <div style="position: absolute; top: 33%; left: -6px; width: 10px; height: 10px; background-color: black; border-radius: 50%; transform: translateY(-50%);"></div>
                        <span style="position: absolute; top: 29%; left: -105px; font-family: Arial; color: #009260; font-size: 25px;">Einsteig</span>
                        <span style="position: absolute; top: 29%; left: 20px; font-family: Arial; color: #009260; font-size: 25px;">11:15</span>
                        <span style="position: absolute; top: 34%; left: 20px; font-family: Arial; color: #009260; font-size: 25px;">Nürnberg</span>
                        <div style="position: absolute; top: 66%; left: -6px; width: 10px; height: 10px; background-color: black; border-radius: 50%; transform: translateY(-50%);"></div>
                        <span style="position: absolute; top: 62%; left: -110px; font-family: Arial; color: #009260; font-size: 25px;">Ausstieg</span>
                        <span style="position: absolute; top: 62%; left: 20px; font-family: Arial; color: #009260; font-size: 25px;">12:45</span>
                        <span style="position: absolute; top: 67%; left: 20px; font-family: Arial; color: #009260; font-size: 25px;">Würzburg</span>
                        <div style="position: absolute; bottom: 0; left: -6px; width: 10px; height: 10px; background-color: black; border-radius: 50%;"></div>
                        <span style="position: absolute; top: 96%; left: -60px; font-family: Arial; color: #7F8990; font-size: 25px;">Ziel</span>
                        <span style="position: absolute; top: 96%; left: 20px; font-family: Arial; color: #7F8990; font-size: 25px;">14:00</span>
                        <span style="position: absolute; top: 101%; left: 20px; font-family: Arial; color: #7F8990; font-size: 25px;">Köln</span>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-stepper-content>
          </div>

          <div v-if="step === 3">
            <v-stepper-content step="4">
              <v-stepper-window>
                <v-container align="center" justify="center">
                  <h2>Diese Fahrt jetzt buchen?</h2>
                </v-container>

                <v-card-actions>
                  <v-row align="center" justify="center">
                    <v-col cols="auto">
                      <v-btn variant="tonal" rounded="sm" density="default" size="large" color="#008557" @click="dialog = !dialog; overlay = !overlay" block>Ja</v-btn>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn rounded="sm" density="default" size="large" color="#008557" @click="$router.push('/homepage')" block>Abbrechen</v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-stepper-window>
            </v-stepper-content>
          </div>
        </v-stepper-items>

        <v-stepper-actions
        :disabled="disabled"
          @click:prev="setStep(this.step-1)"
          @click:next="setNextStep()"
        >
      </v-stepper-actions>
      </v-stepper>
    </v-container>

    <v-fade-transition hide-on-leave>
      <v-overlay v-model="overlay">
        <div class="centered-container">
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
                  <h3>Deine Fahrt wurde gebucht!</h3>
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
                  @click="$router.push('/profilepage') "
                >
                  OK
                </v-btn>
              </div>
            </v-card>
          </v-dialog>
        </div>
      </v-overlay>
    </v-fade-transition>
  </div>
</template>


<script setup>
import { ref } from 'vue';
const dialog = ref(false) //dient dem Öffnen und Schließen des Popup-Dialogs
const overlay = ref(false)  //dient dem Overlay für den Popup-Dialog
</script>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import MapComponent from './MapComponent.vue';
import NavigationBar from './NavigationBar.vue';
import { supabase } from '../lib/supabaseClient';

export default {
 
  data() {
    return {
    map: null,
    startLocation: '',
    endLocation: '',
    date: '',
    time: '',
    neededSeats: '',
    seats: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    orte: [],

      step: 0,
      completeStep1: false,
      completeStep2: false,
      selected: null,
      dialog: false,
      overlay: false,

      rideOffers: [
      {
        name: 'Cara',
        role: 'Student',
        time: '10:30 Uhr',
        price: "5,00€",
        seats: "4",
        rideid: "4"
      },
      {
        name: 'Johannes',
        role: 'Student',
        time: '11:40 Uhr',
        price: "5,00€",
        seats: "4",
        rideid: "5"
      },
        {
        name: 'Maria',
        role: 'Student',
        time: '11:50 Uhr',
        price: "7,50€",
        seats: "4",
        rideid: "500"
      },
      {
        name: 'Sarah',
        role: 'Mitarbeiter',
        time: '11:50 Uhr',
        price: "2,50€",
        seats: "1",
        rideid: "1"
      },
      {
        name: 'Manuel',
        role: 'Mitarbeiter',
        time: '14:00 Uhr',
        price: "6,50€",
        seats: "4",
        rideid: "7"
      },
      {
        name: 'Noah',
        role: 'Student',
        time: '11:50 Uhr',
        price: "2,90€",
        seats: "3",
        rideid: "2"
      },
      {
        name: 'Manuel',
        role: 'Student',
        time: '12:10 Uhr',
        price: "6,50€",
        seats: "4",
        rideid: "9"
      },
      ],

      ride: [
      {
        name: 'Allison',
        surname: 'Peters',
        role: 'Student',
        rideid: "4"
      },
      {
        name: 'Thomas',
        surname: 'Meyer',
        role: 'Student',
        rideid: "4"
      },
      {
        name: 'Maria',
        surname: 'Bauer',
        role: 'Student',
        rideid: "4"
      }
      ],
    };
  },

  computed: {
    requiredRule() {
        return v => !!v || 'Dieses Feld ist erforderlich';
      },
      startLocationRule() {
        return v => {
          if (v === this.endLocation) return 'Start- und Zielort dürfen nicht gleich sein';
          return !!v || 'Startort ist erforderlich';
        };
      },
      endLocationRule() {
        return v => {
          if (v === this.startLocation) return 'Start- und Zielort dürfen nicht gleich sein';
          return !!v || 'Zielort ist erforderlich';
        };
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
          this.requiredRule &&
          this.startLocation &&
          this.endLocation &&
          this.dateRule(this.date) === true &&
          this.timeRule(this.time) === true &&
          this.seatRule(this.neededSeatsSeats) === true
        );
      },
      disabled() {
        return this.step === 0
          ? 'prev'
        : this.step === 1 && !this.completeStep2 || !this.isFormValid
          ? 'next'
        : undefined
      },

    },

    watch: {
      startLocation() {
        this.$refs.endLocInput && this.$refs.endLocInput.validate();
      },
      endLocation() {
        this.$refs.startLocInput && this.$refs.startLocInput.validate();
      },
      selected(){
        if(this.selected === null){
        this.completeStep2 = false;
        }
        else{
          this.completeStep2 = true;
        }
      }
    },

  methods: {
    setNextStep() { 
      if(!this.isFormValid &&this.step === 0){
        this.step = 0
      } else{this.step++}
    },

      setStep(a) { this.step = a; },

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

      swapLocations() {
      const temp = this.startLocation;
      this.startLocation = this.endLocation;
      this.endLocation = temp;
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
      


    async getDriver(email){
      const { data: driver, error } = await supabase
          .from('Person')
          .select('Vorname, Nachname, E_Mail_Adresse')
          .eq('E_Mail_Adresse', email)

        if (error) {
          console.error('Error fetching data from Supabase:', error);
          return;
        }
        return (driver.Vorname , driver.Nachname).toString()
    },

    async getRole(email){
      const { data: driRole, error } = await supabase
          .from('Person')
          .select('Rolle, E_Mail_Adresse')
          .eq('E_Mail_Adresse', email)

        if (error) {
          console.error('Error fetching data from Supabase:', error);
          return;
        }
        return (driRole.Rolle).toString()
    },

    
      async getRidesFromDatabase() {
        this.errorMessage = '';
        if (!this.isFormValid) {
          this.errorMessage = 'Bitte füllen Sie alle Felder korrekt aus';
          return;
        }
        try {
          const { data: rides, error } = await supabase
            .from('Fahrt')
            .select('Fahrt_ID, Fahrer, Abfahrtszeit, Datum, Startort, Zielort, Sitzplaetze')
            .eq('Startort', this.startLocation, 'Zielort', this.endLocation, 'Datum', this.date)
            .lte('Sitzplaetze', this.seats)
            .gte('Abfahrtszeit', this.time )
            .order('Abfahrtszeit', { ascending: true });

          if (error) {
            console.error('Error fetching data from Supabase:', error);
            return;
          }

          rides.forEach((ride) => {
            const addRide = {name: ride.Fahrer, role: ride.Fahrer, time: ride.Abfahrtszeit, seats: ride.Sitzplaetze}
            this.rideOffers.push(addRide);
          });
        }catch (error) {
          this.errorMessage = 'Fehler beim Suchen einer Fahrt';
        }
  },
},
async mounted() {
      this.initMap();
      await this.getLocations();
    }
}

</script>

<style scoped>

.v-sheet.v-theme-light--v-stepper {
  height: 100vh !important;       /* Mit !important erzwingt man die Anwendung der Regel */
  min-height: 100vh !important;
  width: 100vw !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  align-items: center !important;
  padding: 20px;
  box-sizing: border-box;
}

.bookride {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1; /* Ensure it does not cover other components */
}

.map-column {
  justify-content: center;
}

/* Karte: Quadratisch und responsiv */
/* Karte quadratisch machen */
.independent-map {
    width: 100%;
    max-width: 700px; /* Increase the max width */
    max-height: 700px; /* Increase the max height */
    aspect-ratio: 1 / 1; /* Hält die Karte quadratisch */
    background-color: #ccc; /* Platzhalterfarbe für die Karte */
    border-radius: 15px; 
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

.profilebackground {
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover;
  position: absolute;
}

.SwapButton{
  z-index: 1000;
  width: 60px;
  height: 60px;
  color: "#26874E";
  
}

.icon-container {
  animation: fadeIn 0.4s;
}

/*Icon animation */
@keyframes fadeIn {
  0% {
    transform: translateX(0) scale(0);
    opacity: 0;
  }
  45% {
    transform: translate(0) scale(1.3);
    opacity: 1;
  }
  75% {
    transform: translate(0) scale(.9);
  }
  100% {
    transform: translateX(0) scale(1, 1);
    opacity: 1;
  }
}

.thick-black-divider {
  border-left: 40px solid black;
}

.left-column {
  padding: 50px;
}

.right-column {
  padding: 50px;
}

</style>

//async getRidesFromDatabase() {
  const { data: rides, error } = await supabase
      .from('Fahrt')
      .select('Fahrt_ID, Fahrer, Abfahrtszeit, Datum, Startort, Zielort, Sitzplaetze')
      .eq('Startort', this.startLocation, 'Zielort', this.endLocation, 'Datum', this.date)
      .lte('Sitzplaetze', this.seats)
      .gte('Abfahrtszeit', this.time )
      .order('Abfahrtszeit', { ascending: true })

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      return;
    }

    rides.forEach((ride) => {
      const addRide = {name: ride.Fahrer, role: ride.Fahrer, time: ride.Abfahrtszeit, seats: ride.Sitzplaetze}
      this.rideOffers.push(addRide);
    });
  },

async getDriver(email){
  const { data: driver, error } = await supabase
      .from('Person')
      .select('Vorname, Nachname, E_Mail_Adresse')
      .eq('E_Mail_Adresse', email)

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      return;
    }

    const { Vorname} = driver;
    return Vorname
},

async getRole(email){
  const { data: driRole, error } = await supabase
      .from('Person')
      .select('Rolle, E_Mail_Adresse')
      .eq('E_Mail_Adresse', email)

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      return;
    }
    const { Rolle} = driRole;
    return Rolle
}
},
async mounted() {
await this.getDriver();
  await this.getRole();
  await this.getRidesFromDatabase();
}

isFormValid() {
  if(
    this.requiredRule &&
    this.startLocation &&
    this.endLocation &&
    this.dateRule(this.date) === true &&
    this.timeRule(this.time) === true &&
    this.seatRule(this.neededSeats) === true){
      this.completeStep1 = true;
      return true;
    } else{
      this.completeStep1 = false;
      return false;
    }
}