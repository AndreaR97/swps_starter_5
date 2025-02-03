<template>
  <!--Adds and renders the navigation bar-->
  <NavigationBar></NavigationBar>

  <!--Container holding the v-form for input of the user and the map-->
  <v-container
  class="mt-15">
      <v-row 
      class=" align-center"> 
      
        <!--Form the user enters the data detailing the ride to offer-->
        <v-col
          class="formItems">
            <v-form>
              <!--Two rows, each containing an autocomplete input field filled with all locations
              from the database relation Ort. The user can choose start and end location.-->
              <v-row class="align-center" style="margin-bottom: 20px;">
                <v-autocomplete
                  ref="startLocInput"
                  label="Start der Route"
                  clearable
                  type="email"
                  v-model="startLocation"
                  variant="solo-filled"
                  :items="orte"
                  :rules="[startLocationRule]"
                  ></v-autocomplete>
              </v-row>
                <!--Additional row for the swap-location button-->
              <v-row class="justify-end mt-n13 mb-n4">
                <v-btn icon @click="swapLocations" class="SwapButton">
                  <v-icon>mdi-swap-horizontal</v-icon>
                </v-btn>
              </v-row>

              <v-row class="align-center" style="margin-bottom: 20px;">
                <v-autocomplete
                  ref="endLocInput"
                  label="Ziel der Route"
                  clearable
                  type="email"
                  v-model="endLocation"
                  variant="solo-filled"
                  :items="orte"
                  :rules="[endLocationRule]"
                  ></v-autocomplete>
              </v-row>

              <!--Row containing input fields for date and departure time-->
              <v-row class="align-center" style="margin-bottom: 20px;">
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

              <!--Row containing input field for the number of seats the user can offer-->
              <v-row class="align-center" align="stretch" style="margin-bottom: 20px;">
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

                  <!--Button to submit the form. Disabled if the form is not correctly filled.
                  If the variable isFormValid is true the button is clickable which calls the method
                  offerRide() and inserts the offer into the database relation Fahrt-->
                  <v-col
                  class="pr-0 align-items-center">
                      <v-btn
                      color="#009260"
                      @click="offerRide"
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
        
          <!--Column containing the map-->
          <v-col
          class="map-column v-col-sm-6 v-col-12 ml-6">
            <div id="map" class="independent-map"></div>
        </v-col>
    </v-row>
  </v-container>
     
  <!-- Overlay and dialog for when a user clicks Anbieten-->
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
          </v-card>
        </v-dialog>
      </div>

    </v-overlay>
  </v-fade-transition>

</template>

<script>
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import markerIcon from "leaflet/dist/images/marker-icon.png";
  import markerShadow from "leaflet/dist/images/marker-shadow.png";
  import NavigationBar from "./NavigationBar.vue";
  import { supabase } from '../lib/supabaseClient';
  //Imports Map_Component and NavigationBar
  //Imports the supabase client for connection to the database and the leaftlet API for use of the map
  
  export default {
    components: { NavigationBar },
    data() {
      return {
        /*Declaration of the variables used for OfferRide that a user will specify 
        by filling in the form*/
        map: null,
        startLocation: '',
        endLocation: '',
        date: '',
        time: '',
        freeSeats: '',
        seats: [1, 2, 3, 4, 5, 6, 7, 8, 9], /*Array of the number of seats a user can choose from to offer*/
        orte: [],                           /*Empty array the locations from the database relation Ort are transfered into after request. Several methods draw from this.*/
        dialog: false,                      /*Boolean to check if dialog is opened*/
        overlay: false                      /*Boolean to check if dialog is active*/
      }
    },
    computed: {
      /*This section contains a set of rules that are checked whenever the user enters
        something into the form to check the required format is given as well as there 
        are no empty input fields remaining*/

      //Ensures the startLocation and endLocation are not the same 
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

      /*This rule makes sure the entered date is not already in the past and is no further 
      than four weeks in the future (maxDate)*/
      dateRule() {
        return v => {
          if (!v) return 'Datum ist erforderlich';
          const today = this.getBerlinNow();    //retrieves the exact date at this moment (today)
          today.setHours(0,0,0,0);
          const maxDate = new Date(today);      //maximum date
          maxDate.setDate(today.getDate() + 28);
          const selectedDate = new Date(v);
          selectedDate.setHours(0,0,0,0);
          return (selectedDate >= today && selectedDate <= maxDate)
            || 'Datum muss in den nächsten 4 Wochen liegen';
        };
      },

      //Compares exact time of this moment (now) to the chosen time to ensure it is in the future
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

      /*This property checks whether the input to each field is according to its rules.
      This is used to allow the ride offer to be submitted*/
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

    watch: {
      //Observes changes startLocation and endLocation
      startLocation() {
        this.$refs.endLocInput && this.$refs.endLocInput.validate();
      },
      endLocation() {
        this.$refs.startLocInput && this.$refs.startLocInput.validate();
      }
    },

    methods: {
      //Returns the time and date of Berlin at this exact moment
      getBerlinNow() {
        return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
      },

      //Initializes the map and centers the view to the Campus Universität Bayreuth
      initMap() {
        const uniBayreuthCoords = [49.928809, 11.585835];
        this.map = L.map("map").setView(uniBayreuthCoords, 15);
  
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(this.map);

        //specifies the marker
        const defaultIcon = L.icon({
          iconUrl: markerIcon,
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
        L.Marker.prototype.options.icon = defaultIcon;

        //adds the marker to the map
        L.marker(uniBayreuthCoords).addTo(this.map);
      },

      //Retrieves the address or name of all locations from the database relation Ort
      async getLocations() {
        const { data: locations, error } = await supabase
          .from('Ort')
          .select('Adresse');
  
        if (error) {
          console.error('Error fetching data from Supabase:', error);
          return;
        }

        //enters the locations into the orte array
        locations.forEach((ort) => {
          this.orte.push(ort.Adresse);
        });
      },

      //Method to submit the ride offer and insert it into the database relation Fahrt
      async offerRide() {
        try {
          //Checks for the userEmail in localStorage to use as the id for the Fahrer attritbute
          const userEmail = localStorage.getItem('userEmail');
          if (!userEmail) {
            console.error('No user email found in localStorage.');
            return;
          }
          const { error } = await supabase
            .from('Fahrt')
            .insert([{
              Fahrer: userEmail,
              Startort: this.startLocation,
              Zielort: this.endLocation,
              Abfahrtszeit: this.time,
              Datum: this.date,
              Sitzplaetze: this.freeSeats
            }]);

          //logs whether the data was inserted successfully or not
          if (error) {
            console.error('Error inserting data:', error);
            this.errorMessage = 'Fehler beim Erstellen eines Fahrtangebots';
          } else {
            console.log('Data inserted successfully');
            this.dialog = true;
            this.overlay = true;

            // automatically closes dialog after 2 seconds and redirects to profile page
            setTimeout(() => {
              this.$router.push('/profilepage');
            }, 2000);
          }
        } catch (error) {
          console.error('Unexpected error:', error);
          this.errorMessage = 'Fehler beim Erstellen eines Fahrtangebots';
        }
      },

      //Method to swap the startLocation and endLocation. Called by clicking the swap button in the form.
      swapLocations() {
        const temp = this.startLocation;
        this.startLocation = this.endLocation;
        this.endLocation = temp;
      }
    },

    async mounted() {
      //Initializes the map
      this.initMap();

      //Fetches the locations from the database
      await this.getLocations();

      //Sets local properties based on query params if provided
      this.startLocation = this.$route.query.startLocation || this.startLocation;
      this.endLocation = this.$route.query.endLocation || this.endLocation;
      this.date = this.$route.query.date || this.date;
      this.time = this.$route.query.time || this.time;
    }
  };
  
  </script>

  <style scoped>

.map-column {
  justify-content: center;
}

/*Styling for the map. */
.independent-map {
    width: 100%;
    max-width: 700px; /* Increase the max width */
    max-height: 700px; /* Increase the max height */
    aspect-ratio: 1 / 1; /* keeps map as a square */
    background-color: #ccc; /* Placeholder for map */
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

/*Animation for the fade-in of the checkmark in the confirmation dialog*/
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

.SwapButton {
  z-index: 1000;
  width: 60px;
  height: 60px;
  color: "#26874E";
}

  </style>