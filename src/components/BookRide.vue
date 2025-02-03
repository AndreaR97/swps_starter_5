<template>
  <div class="bookride">
    <!--Adds and renders the navigation bar-->
    <NavigationBar></NavigationBar>
    <v-container fluid>

      <!--This is the v-stepper component that builds the frame for visualizing and 
      dividing the process of booking a ride into 4 steps-->
      <v-stepper fluid v-model="step">
        <!--Builds the header section of the stepper and shows the 4 steps 
        (stepper-items) in a line-->
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

        <!--This section specifies the content of each step in the stepper-->
        <v-stepper-items>
          <!--The first step-->         
          <div v-if="step === 0">
            <v-stepper-window>
              <div>
                <v-row>
                  <v-container class="mt-2">
                    <!--Row that contains the form for entering ride specific data and the map-->
                    <v-row class=" align-center">
                      <v-col>

                        <!--The v-form that a user enters the data in for a ride-->
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

                          <!--Extra overlapping row for the swap button-->
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

                          <!--Row containing input fields for Datum and Uhrzeit-->
                          <v-row class="pb-1 align-center">
                            <v-col class="pl-0">
                              <v-text-field
                                label="Datum"
                                type="date"
                                v-model="date"
                                variant="solo-filled"
                                :rules="[dateRule]"
                              ></v-text-field>
                            </v-col>

                            <v-col class="pr-0">
                              <v-text-field
                                label="Uhrzeit"
                                type="time"
                                v-model="time"
                                variant="solo-filled"
                                :rules="[timeRule]"
                              ></v-text-field>
                            </v-col>
                          </v-row>

                          <!--Row for choosing the amount of Sitzplätze-->
                          <v-row class="pb-3">
                            <v-col cols="6 pl-0">
                              <v-select
                                label="Sitzplätze"
                                variant="solo-filled"
                                v-model="neededSeats"
                                :items="seats"
                                :rules="[seatRule]"
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-form> 
                      </v-col>

                      <!--Column for the map component-->
                      <v-col class="map-column v-col-sm-6 v-col-12 ml-6">
                        <!--Renders and adds the map component-->
                        <Map_Component></Map_Component>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-row>
              </div>  
            </v-stepper-window>
          </div>
          
          <!--Specifies content for step 2-->
          <div v-if="step === 1"> 
            <v-stepper-content step="2">
              <v-container fluid>
                <v-row dense>

                  <!--Holds the list of rides pulled from the database that match the 
                  specifics entered by the user in step 1-->
                  <v-col cols="6">
                    <v-card class="overflow-y-auto" max-height="600px">
                      <div v-if="rideOffers.length === 0" text-align="center" class="no-offer-container"> 
                        <h2 class="headline font-weight-bold mb-5"> 
                          Für die ausgewählten Daten gibt es leider kein Fahrtangebot. 
                        </h2>
                        <!--Button offering the option to offer a ride if there is no match-->
                        <v-btn
                          class="offer-ride-button"
                          color="#008557"
                          size="x-large"
                          @click="navigateToOfferRide"
                        >
                          Eine Fahrt anbieten
                        </v-btn>
                      </div> 

                      <!--Case for if there are matching rides in the database-->
                      <div v-else>  
                        <v-list lines="two">
                          <v-list-item
                            v-for="(person, n) in rideOffers"
                            :key="n"
                            :title="person.name"
                            :value="n"
                            color="#008557"
                            link
                          >
                            <v-divider class="mb-2"></v-divider>

                            <!--Prepends user icon and appends the button "Auswählen" to each item in the list-->
                            <template v-slot:prepend>
                              <v-avatar color="info">
                                <v-icon icon="mdi-account-circle"></v-icon>
                              </v-avatar>
                            </template>
                            <template v-slot:append>

                              <!--The click on the button triggers the slicing of the chosen ride and its properties 
                              into the initially empty selected array for further use of the specific data.-->
                              <v-list-item-action>
                                <v-btn @click="selected = rideOffers.slice(n, n+1)">
                                  Auswählen
                                </v-btn>
                              </v-list-item-action>
                            </template>

                            <!--Adds Preis and Abfahrtszeit to each item in the list-->
                            <v-card> 
                              <div class="ma-1">
                                <v-row no-gutters>
                                  <v-sheet elevation="1" height="40" class="pa-2 ma-2" border rounded>
                                    Abfahrtszeit: {{ person.time }} Uhr
                                  </v-sheet>

                                  <!--Info tag for price information-->
                                  <v-sheet elevation="1" height="40" class="pa-2 ma-2" border rounded stacked>
                                    {{ person.price}}
                                    <v-icon></v-icon>
                                    <v-badge color="dark grey" content="?" inline><v-tooltip
                                      activator="parent"
                                      location="end"
                                    >Preis, den dich die Fahrt voraussichtlich kostet.</v-tooltip></v-badge>
                                  </v-sheet>
                                </v-row>
                              </div>
                            </v-card>
                          </v-list-item>

                        </v-list>
                      </div>
                    </v-card>
                  </v-col>

                  <!--Column holding the map component-->
                  <v-col class="map-column v-col-sm-5 v-col-12 ml-6">
                    <!--Map component with properties to subscribe to changes in
                    startLocation and endLocation entered by the user as well as distance and time
                    emitted from the Map_Component itself to show the route-->
                    <Map_Component :start-location="startLocation" :end-location="endLocation" @distance-changed="handleDistanceChange" @ttime-changed="handleTimeChange"
                      />
                  </v-col>

                  <!--Icon button in top right corner that triggers a bottom sheet with price information-->
                  <v-col>
                    <v-btn
                        color="#009260"
                        rounded
                        class="ms-4"
                        size="40"
                        absolute
                        app
                        appear
                        @click="sheet = !sheet"
                      ><v-icon icon="mdi-help"></v-icon>
                      <v-tooltip
                          activator="parent"
                          location="bottom"
                        >Mehr Informationen zum Preis</v-tooltip>
                    </v-btn>
                  </v-col>
                </v-row>

                <!--Corresponding bottom sheet-->
                <v-bottom-sheet v-model="sheet">
                  <v-card class="text-center" height="200">
                    <v-card-text>
                      <v-btn variant="text" @click="sheet = !sheet"> Preisinformation schließen </v-btn>
                      <br />
                      <div>
                        Der Preis berechnet sich aus einem Durchschnittsverbrauch von 7,7l/100km, multipliziert mit einem am derzeitigen Literpreis orientierten Wert von 1,78€ und wird auf die Fahrtteilnehmer aufgeteilt. Pro Person (außer für den Fahrer) wird eine Nutzungspauschale von 0,90€ für den Fahrzeugsteller berechnet.
                        Wenn du mehr als einen Sitzplatz buchst, wird dir in der Liste der Preis für alle gebuchten Sitzplätze zusammen angezeigt. 
                        Der Benzinpreis wird am 15. Tag eines jeden Monats aktualisiert.
                      </div>
                    </v-card-text>
                  </v-card>
                </v-bottom-sheet>
              </v-container>
            </v-stepper-content>
          </div>

          <!--Specifies content of step 3-->
          <div v-if="step === 2">
            <v-stepper-content step="3">
              <v-container fluid>
                <v-row>

                  <!--Column containing the list of the picked ride's Fahrer and Mitfahrer-->
                  <v-col cols="6" class="left-column">

                    <!--Adds information about Fahrer: Name, Rolle, freie Sitzplätze-->
                    <v-card class="overflow-y-auto" max-height="490px">
                      <span
                        style="font-weight: bold; font-size: 30px; color: #009260; padding:10px"
                      >Fahrer
                      </span>
                      <div style="display: flex; align-items: center; margin-top: 10px;">
                        <img
                          src="/assets/Profilbild.png"
                          alt="Profilbild"
                          style="width: 100px; height: 100px; border-radius: 50%; margin-right: 25px; margin-left: 20px;"
                        >
                        <div>
                          <span
                            style="font-weight: bold; font-size: 28px;"
                          >
                            {{ selected[0] ? selected[0].name: selected.name}}
                          </span>
                          <br>
                          <span style="font-size: 18px;">
                             {{ selected[0] ? selected[0].role: selected.role}}
                          </span>
                          <br>
                          <span style="font-size: 18px;">
                            Freie Plätze: {{selected[0] ? selected[0].seats: selected.seats}}
                          </span>
                        </div>
                      </div>
                      <v-divider class="my-4"></v-divider>

                      <!--Adds the list of Mitfahrer and their corresponding information: Name, Rolle-->
                      <span
                        style="font-weight: bold; font-size: 30px; color: #009260; padding:10px;"
                      >Mitfahrer
                      </span>

                      <!--Placeholder for the list of Mitfahrer if there are no other people 
                      taking this ride so far-->
                      <div v-if="ridePassengers.length === 0">
                        <div class="ma-4" style="font-size: 20px; font-weight: 500;">
                          Du bist bisher der einzige Mitfahrer.
                        </div>
                      </div>
                      
                      <v-list lines="two" v-else>
                        <v-item-group>
                          <v-list-item
                            v-for="(person, n) in ridePassengers"
                            :key="n"
                            link
                          >
                            <template v-slot:title>
                              <div>
                                <span
                                  :style="{
                                    fontSize: '20px',
                                    fontWeight: 'bold'
                                  }"
                                >
                                  {{`${person.name} ${person.surname}`}}
                                </span>
                                <br>
                              </div>
                            </template>
                            <!--Prepends the profile icon/profile picture of each person on the ride-->
                            <template v-slot:prepend>
                              <img
                                src="/assets/Profilbild.png"
                                alt="Profilbild"
                                style="width: 100px; height: 100px; border-radius: 50%; margin-right: 25px;"
                              >
                            </template>
                            <div>
                              <span
                                style="font-family: 'Arial'; font-size: 20px;"
                              >
                                 {{ person.role}}
                              </span>
                              <br>
                            </div>
                          </v-list-item>
                        </v-item-group>
                      </v-list>
                    </v-card>
                  </v-col>

                  <!--This columns holds a card that shows an overview over the ride's
                  data: Startort, Zielort, Abfahrtszeit, Ankunftszeit-->
                  <v-col cols="6" class="right-column">
                    <v-card class="mx-auto" max-width="500" max-height="490px">
                      <v-toolbar color="#E5E1E1">
                        <v-toolbar-title class="text-h6" text="Verlauf der Fahrt">
                        </v-toolbar-title>
                      </v-toolbar>

                      <!--Specifying how each location is added to the overview card.
                      Data is taken from the array fahrtverlauf-->
                      <v-card-text>
                        <div class="font-weight-bold ms-1 mb-2">Abfahrt</div>
                        <v-timeline align="start" density="compact">
                          <v-timeline-item
                            v-for="halt in fahrtverlauf"
                            :key="halt.location"
                            :dot-color="halt.color"
                            size="x-small"
                          >
                            <div class="mb-10">
                              <div style="font-weight: normal; font-size: 20px">
                                <strong>{{ halt.location }}</strong>
                              </div>
                              <div style="font-size:15px">
                                um {{ halt.time }} Uhr
                              </div>
                            </div>
                          </v-timeline-item>
                        </v-timeline>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-stepper-content>
          </div>
          
          <!--Specifies the content for step 4-->
          <div v-if="step === 3">
            <v-stepper-content step="4">
              <v-stepper-window>

                <!--Puts in the center a request for confirmation by the user
                whether or not they wish to book the ride.-->
                <v-container align="center" justify="center">
                  <h2>Diese Fahrt jetzt buchen?</h2>
                </v-container>

                <!--Opens this dialog by clicking yes-->
                <v-card-actions>
                  <v-row align="center" justify="center">
                    <v-col cols="auto">
                      <v-btn
                        variant="tonal"
                        rounded="sm"
                        density="default"
                        size="large"
                        color="#008557"
                        @click="dialog = !dialog; overlay = !overlay"
                        block
                      >
                        Ja
                      </v-btn>
                    </v-col>

                    <!--Abbrechen button that cancels the process and routes the user 
                    back to the homepage-->
                    <v-col cols="auto">
                      <v-btn
                        rounded="sm"
                        density="default"
                        size="large"
                        color="#008557"
                        @click="$router.push('/homepage')"
                        block
                      >
                        Abbrechen
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>

              </v-stepper-window>
            </v-stepper-content>
          </div>
        </v-stepper-items>

        <!--Calls the corresponding method to specify what happens for each 
        step by clicking next or prev and when a button should be disabled-->
        <v-stepper-actions
          :disabled="disabled"
          @click:prev="setStep(this.step-1)"
          @click:next="setNextStep()"
        >
        </v-stepper-actions>
      </v-stepper>
    </v-container>

    <!--This is the dialog popping up when a user clicks 'Ja' in step 4-->
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
                <!--When a user clicks on OK the participation in the ride is inserted 
                into the database by calling insertBook() and the user is routed to their profile page-->
                <v-btn
                  class="text-none"
                  color="medium-emphasis"
                  min-width="92"
                  variant="outlined"
                  @click="insertBook(selected[0].id); $router.push('/profilepage') "
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
import { ref } from 'vue';      /* Imports the ref function from Vue to declare reactive variables and track component changes*/
/*Declares variables that are reactive to being changed by the user. Used in BookRide*/
const dialog = ref(false);
const overlay = ref(false);
const sheet = ref(false);
</script>

<script>
import "leaflet/dist/leaflet.css";
import Map_Component from './Map_Component.vue';
import NavigationBar from './NavigationBar.vue';
import { supabase } from '../lib/supabaseClient';
//Imports Map_Component and NavigationBar
//Imports the supabase client for connection to the database and the leaftlet API for the map use

export default {
  component:{
    Map_Component,
    NavigationBar
  },
  data() {
    return {
      /*Declares the variables used for BookRide that a user will specify 
      by filling the form in step 1*/
      startLocation: '',
      endLocation: '',
      date: '',
      time: '',
      neededSeats: '',
      seats: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      orte: [],                       /*Empty array the locations from the database relation Ort are transfered into after request. Several methods draw from this.*/
      
      step: 0,                       /*Counter for the steps in the stepper*/
      completeStep1: false,          /*Boolean to check if step 1 is completed*/
      completeStep2: false,          /*Boolean to check if step 2 is completed*/

      selected: null,                /*Initially empty variable that is being filled/overwritten by slicing a ride's data from the rides offered in step 2*/
      dialog: false,                 /*Boolean to check if the dialog is open or closed*/
      overlay: false,                /*Boolean to check if the overlay is activated or not*/
      sheet: false,                  /*Boolean to check if the sheet is open or closed*/
      rideOffers: [],                /*Array that the data of offered rides matching the user's entered details is transfered into after the request to the database */
      ridePassengers: [],            /*Array that the data of Mitfahrer in the selected ride is entered into.*/           
      fahrtverlauf: [],              /*Array that the ride's route and time details are entered into in step 3*/
      passengerCountArray: {},       /*Initially empty object that will hold the number of Mitfahrer in a ride to calculate the price*/
      
      //Variables containing distance in km and driving time in hours and minutes of a route that the user chose in step 1
      tdistance: 0,
      ttime: 0
    };
  },
  computed: {
    
    /*This section contains a set of rules that are checked whenever the user enters
    something into the form in step 1 to make sure the required format is given as well 
    as there are no empty input fields remaining*/

    //each field in the form is required so this is applied to all input fields
    requiredRule() {
      return v => !!v || 'Dieses Feld ist erforderlich';
    },

    /*The following rules are specific to each input field and show a hint of the error 
    to the user so they can correct it*/

    //Makes sure the startLocation and endLocation are not the same
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

    /*This rule makes sure the entered date is not already in the past by retrieving the exact 
    time at this moment (today) and is no further than four weeks in the future (maxDate)*/
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

    /*This method compares the exact time of this moment (now) to the chosen time to make 
    sure it is in the future */
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
    This is used to for example allow the process to continue*/
    isFormValid() {
      return (
        this.requiredRule &&
        this.startLocation &&
        this.endLocation &&
        this.dateRule(this.date) === true &&
        this.timeRule(this.time) === true &&
        this.seatRule(this.neededSeats) === true
      );
    },

    /*Makes changes to the disabled property depending on step, completeness of a step 
    and whether isFormValid is true or not */

    disabled() {
      return this.step === 0
        ? 'prev'
        : this.step === 1 && !this.completeStep2 || !this.isFormValid
          ? 'next'
          : undefined;
    },
  },
  watch: {
     //Observes changes startLocation and endLocation
    startLocation() {
      this.$refs.endLocInput && this.$refs.endLocInput.validate();
    },
    endLocation() {
      this.$refs.startLocInput && this.$refs.startLocInput.validate();
    },

      /*Observes changes to selected array and changes the status of completeness
       of a step accordingly*/
    selected() {
      if (this.selected === null) {
        this.completeStep2 = false;
      }
      else {
        this.completeStep2 = true;
      }
    }
  },

    /*Allows the BookRide component to provide the two functions to the Map_Component
    to make startLocation and endLocation available to show the route on the map */
    provide() {
      return {
        getStartLocation: () => this.startLocation,
        getEndLocation: () => this.endLocation
      };
    }, 

  methods: {

    /*Is called by clicking on the Next-button in the stepper to call the needed 
    methods accordingly*/
    async setNextStep() {
        if (this.step === 0 && this.isFormValid) {
        await this.getRidesFromDatabase();
      } else if (this.step === 1 && this.selected) {
        await this.fetchRideDetails();
        this.step++;
        return;
      } else if(this.step === 0 && !this.isFormValid){
        this.step = 0;
        return;
      }
      this.step++;
    },

    /*Is called to set the step to @param a when clicking the prev-Button 
      in the stepper or on a step title in the header */
    setStep(a) {
      this.step = a;
    },

    //Returns the time and date of Berlin at this exact moment
    getBerlinNow() {
      return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
    },

    //Called by clicking on swap button in step 1. Swaps entered values of startLocation and endLocation. 
    swapLocations() {
      const temp = this.startLocation;
      this.startLocation = this.endLocation;
      this.endLocation = temp;
    },

    /*These two methods are setting the variables tdistance and ttime in BookRide to the 
    updated values of tdistance and ttime that are being emitted from Map_Component. 
    This way the distance and time between start and end location as well as the needed 
    driving time can be used in various methods in BookRide */

    handleDistanceChange(distance) {
      this.tdistance = distance;
      console.log('Distance in bookride' + this.tdistance);

      /*this line calculates the price a user expectedly will have to pay for a ride taking
      into account the current amount of people on the ride. 
      7.7/100 - is the amount of petrol a car on average needs per km.
      1.78 - is the continuously updated monthly average of petrol cost/litre in Germany.
      0.90 are charged per passenger and further needed seats (except for the driver)*/ 
      this.rideOffers.forEach(ride => {
        ride.price = parseFloat(((this.tdistance*(7.7/100)*1.78)/((this.passengerCountArray[ride.id] || 0 ) + this.neededSeats+1))*this.neededSeats+0.90*this.neededSeats).toFixed(2) + '€';
      });
    },
    handleTimeChange(time) {
      this.ttime = time;
      console.log('TTime in bookride' + this.ttime);
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
      //enters each location ort into the orte array
      locations.forEach((ort) => {
        this.orte.push(ort.Adresse);
      });
    },

    //Is called after entering all details into the form in step one and clicking next.
    /*Applies all entered constraints and enters the matching rides from the database
    into the */
    async getRidesFromDatabase() {
      //Selects all matching rides from the database relation Fahrt
      try {
        const { data: rides, error } = await supabase
          .from('Fahrt')
          .select('Fahrt_ID, Fahrer, Abfahrtszeit, Datum, Startort, Zielort, Sitzplaetze')
          .eq('Startort', this.startLocation)
          .eq('Zielort', this.endLocation)
          .eq('Datum', this.date)
          .gte('Sitzplaetze', this.neededSeats)
          .gte('Abfahrtszeit', this.time)
          .order('Abfahrtszeit', { ascending: true });

        console.log('Fetched rides:', rides);
        
        //Selects all tuples from the relation ist_mitfahrer 
        const { data: passengerData } = await supabase
          .from('ist_mitfahrer')
          .select('*');

        /*Counts the number of all passengers of a ride that already has at least one
        passenger and adds the amount of further seats each passenger booked*/
        const passengerCount = {};
          passengerData.forEach(row => {
            passengerCount[row.Fahrt_ID] = (passengerCount[row.Fahrt_ID] || 1) + row.anzahl_weitere_platzbuchungen;
          });
          //The number of passengers and further seats is entered into the passengerCountArray object
          this.passengerCountArray = passengerCount;
          console.log('Passenger counts as array:', this.passengerCountArray);
  
         /*Filters the constraint-matching rides retrieved from the database by checking whether
         there are still enough seats left*/ 
        const filteredRides = rides.filter(ride => {
          const matchedCount = passengerCount[ride.Fahrt_ID] || 0;
          return matchedCount <= ride.Sitzplaetze && (matchedCount + this.neededSeats) <= ride.Sitzplaetze;
        });
        console.log('Filtered rides:', filteredRides);

        //Retrieves the driver's full name for each ride that matches all constraints and has enough seats
        for (const ride of filteredRides) {
          const { data: driverData, error: driverError } = await supabase
            .from('Person')
            .select('Vorname, Nachname')
            .eq('E_Mail_Adresse', ride.Fahrer)
            .single();
          ride.driverFullName = (!driverError && driverData)
            ? (driverData.Vorname + ' ' + driverData.Nachname)
            : ride.Fahrer;
        }
        if (error) {
          console.error('Error fetching rides:', error);
          return;
        } 
        
        /*Puts the necessary details of the filtered rides into the rideOffers array to be 
          displayed in the list to choose from in step 2 */
        this.rideOffers = filteredRides.map(r => ({
          id: r.Fahrt_ID,
          driverEmail: r.Fahrer,
          name: r.driverFullName,
          role: r.Fahrer,
          time: this.formatTime(r.Abfahrtszeit),
          price: '0.00€',
          seats: r.Sitzplaetze
        }));
      } catch (err) {
        console.error('Error:', err);
      }
      console.log('Ride offers:', this.rideOffers);
    },

    //Method being called by setNextStep() after selecting a ride and clicking on next in step 2
    //It fetches all the details about the driver and passengers of the selected ride 
    async fetchRideDetails() {
      try {
        //retrieves the ID-number of a ride from the array that holds the properties of the selected ride
        const selectedRideId = this.selected[0]?.id;
        console.log('Selected ride ID:', selectedRideId);

        if (!selectedRideId) return;

        /*Calls the method with @param selectedRideId to get the time and 
        location details for the Fahrtverlauf overview*/
        await this.fetchFahrtverlauf(selectedRideId);
        console.log('Fahrtverlauf', this.fahrtverlauf);

        /*Retrieves information about the driver from the database relation Person to
        further complete the data stored in the selected array*/
        const {data: driverData } = await supabase
          .from('Person')
          .select('Vorname, Nachname, Rolle, E_Mail_Adresse')
          .eq('E_Mail_Adresse', this.selected[0]?.driverEmail)
          .single();

        if (driverData) {
          this.selected[0].name = driverData.Vorname + ' ' + driverData.Nachname;
          this.selected[0].role = driverData.Rolle;
        }
        console.log('Driver data:', driverData);
        console.log(this.selected[0]);

        //Requests all data of the selected ride's passengers from the relation ist_mitfahrer
        const { data: passengers, error } = await supabase
          .from('ist_mitfahrer')
          .select('*')
          .eq('Fahrt_ID', selectedRideId);

        if (error) {
          console.error('Error fetching passengers:', error);
          return;
        }

        //Enters the passengers' details into the array ridePassengers if there are any
        if (!passengers || passengers.length === 0) {
          console.warn('No passengers found for this Fahrt_ID');
          this.ridePassengers = [];
          return;
        }
        const newRide = [];
        for (const pass of passengers) {
          const { data: personData, error: personError } = await supabase
            .from('Person')
            .select('Vorname, Nachname, Rolle')
            .eq('E_Mail_Adresse', pass.Person)
            .single();
          if (!personError && personData) {
            newRide.push({
              name: personData.Vorname,
              surname: personData.Nachname,
              role: personData.Rolle
            });
          }
        }
        console.log('newRide data:', newRide);
        this.ridePassengers = newRide;
        
      } catch (err) {
        console.error('Error fetching ride details:', err);
      }
    },

    /*Requests from the database relation Fahrt and the relation Ort the ride's details 
    about the start location and end location as well as the timestamp Ankunftszeit */
    //Is called from the method fetchRideDetails()
    
    async fetchFahrtverlauf(fahrtId) {
      try {
        const { data: fahrtData } = await supabase
          .from('Fahrt')
          .select('Startort, Zielort, Abfahrtszeit, Fahrt_ID')
          .eq('Fahrt_ID', fahrtId)
          .single();
        console.log('Fahrt data:', fahrtData);

        if (!fahrtData) return;
    
        //adds the start details
        const newVerlauf = [{
          location: fahrtData.Startort,
          time: this.formatTime(fahrtData.Abfahrtszeit),
          color: '#03B276',
        }];

        /*const { data: stops } = await supabase
          .from('hält_in')
          .select('Adresse, Ankunftszeit')
          .eq('Fahrt_ID', fahrtId)
          .order('Ankunftszeit', { ascending: true });

        console.log('Stops data:', stops);
        stops?.forEach(stop => {
          newVerlauf.push({
            location: stop.Adresse,
            time: this.formatTime(stop.Ankunftszeit),
            color: 'blue',
          });
        }); */

        //adds the arrival details
        newVerlauf.push({
          location: fahrtData.Zielort,
          time: this.addToTime(fahrtData.Abfahrtszeit, this.ttime),
          color: 'info',
        });

        console.log('newVerlauf:', newVerlauf);
        this.fahrtverlauf = newVerlauf;
      } catch (err) {
        console.error('Error fetching fahrtverlauf:', err);
      }
    },

    /*This method is called to insert the booking into the ist_mitfahrer relation in the
    database as soon a user clicks the confirmation at the end of the booking process*/
    async insertBook(fahrtId){
          //checks for the user's email in the localStorage, needed as a persons unique id
          const userEmail = localStorage.getItem('userEmail');
          if (!userEmail) {
            console.error('No user email found in localStorage.');
            return;
          }
      const {  error } = await supabase
        .from('ist_mitfahrer')
        .insert([
          { Fahrt_ID: fahrtId, Person: userEmail, anzahl_weitere_platzbuchungen: this.neededSeats - 1, Preis: parseFloat(this.selected[0].price) }
          ])

        if(error) {
              console.error('Unexpected error:', error);
              this.errorMessage = 'Fehler beim Buchen der Fahrt';
        }
          this.updatePrices(fahrtId);
      },
      
    //Is called at the end of insertBook(). 
    /*Reevaluates the price each passenger has to pay for the ride depending on the
      the new amount of passengers.*/
    async updatePrices(fahrtId){
      try {
        //Requests from the database the amount of passengers and further seats for the specific ride
        const { data, err } = await supabase
          .from('ist_mitfahrer')
          .select('Fahrt_ID, Person, anzahl_weitere_platzbuchungen, Preis')
          .eq('Fahrt_ID', fahrtId)
          console.log('Daten der Mitfahrer mit Preis', data);
        
          if(err){
            console.error('Fehler beim Abrufen der Mitfahrer: ', err);
          } 

        const mitfahrer = (this.passengerCountArray[fahrtId] || 0 )   //the number of passengers+seats counted
        console.log('Mitfahrer: ', mitfahrer)

        //calculates the part of the price each person on the ride as well as the driver has to pay
        const gesamtpreis = parseFloat(((this.tdistance*(7.7/100)*1.78)/(1+mitfahrer+this.neededSeats)));
        console.log('Gesamtpreis: ', gesamtpreis);
        
        //Calculates sum of the price each passenger and their companions have to pay altogether
        for (const passenger of data) {
            console.log('Aktueller Passagier:', passenger);
          const neuerPreis = parseFloat((gesamtpreis+0.90) * (passenger.anzahl_weitere_platzbuchungen + 1));
            console.log('neuerpreis: ', neuerPreis);

            //enters the updatet fees into the database
          const {error: updateError} = await supabase
            .from('ist_mitfahrer')
            .update({ Preis: neuerPreis})
            .eq('Fahrt_ID', fahrtId)
            .eq('Person', passenger.Person);
            if(updateError){
              console.error('Fehler beim Anpassen der Preise: ', updateError);
            }
        }
      }catch (err) {
        console.error('Fehler beim Anpassen der Preise: ', err);
      }
        console.log('Preise wurden angepasst');
      },
    
    navigateToOfferRide() {
      console.log('Navigating to Offer Ride');
      this.$router.push({
        path: '/offerRide',
        query: {
          startLocation: this.startLocation,
          endLocation: this.endLocation,
          date: this.date,
          time: this.time,
          seats: this.neededSeats
        }
      });
    },
    formatTime(timeString) {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    },

    addToTime(timeString, timeToAdd) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const [hoursA, minutesA] = timeToAdd.split(':').map(Number);

      const depart = new Date();
      const arrive = new Date();
      depart.setHours(hours, minutes);
      arrive.setHours(depart.getHours() + hoursA);
      arrive.setMinutes(depart.getMinutes() + minutesA);

      // Format the new time back to a string
      const newHours = String(arrive.getHours()).padStart(2, '0');
      const newMinutes = String(arrive.getMinutes()).padStart(2, '0');
      return `${newHours}:${newMinutes}`;
    }
  
  },
  async mounted() {
    await this.getLocations();
  }
};
</script>

<style scoped>
/*Applies Arial to the entire component*/
body {
  font-family: Arial, sans-serif;
}

/*styling and dimensions for the stepper component */
.v-sheet.v-theme-light--v-stepper {
  height: 100vh !important;
  min-height: 100vh !important;
  width: 100vw !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  align-items: center !important;
  padding: 20px;
  box-sizing: border-box;
}

/*Dimensions for the entire component */
.bookride {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/*Styling and positioning of the map */
.map-column {
  justify-content: center;
}

.independent-map > * {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.rounded {
  border-radius: 10px;
}

/*Applies styling to the swap button */
.SwapButton {
  z-index: 1000;
  width: 60px;
  height: 60px;
  color: "#26874E";
}

/*Animation for the fade-in of the checkmark in the confirmation dialog*/
.icon-container {
  animation: fadeIn 0.4s;
}

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

/*Padding for the left and right column in step 3*/
.left-column {
  padding: 50px;
}

.right-column {
  padding: 50px;
}

/*Styling of the two options and their containers in step 2*/
.no-offer-container {
  position: relative;
  width: 100%;
  height: 150px; 
}
.offer-ride-button {
  position: absolute;
  z-index: 9999;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
