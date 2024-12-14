<template>
  <div class="bookride">
    <img src="/assets/profilpage.png" alt="ProfilePageBackground" class="profilebackground" />
    <v-app-bar density="compact" style="background-color:#009260;">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-message-text</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon @click="$router.push('/loginpage')">mdi-account</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon @click="$router.push('/testpage')">mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
    >
      <v-list :items="items"></v-list>
    </v-navigation-drawer>

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
            editable
            @click="setStep(1)"
          ></v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item
            title="Details zur Fahrt"
            value="3"
            editable
            @click="setStep(2)"
          ></v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item
            title="Fertig"
            value="4"
          ></v-stepper-item>
        </v-stepper-header>

        <v-stepper-items>
          <div v-if="step === 0">
            <v-stepper-window>
              <div>
                <div class="map-container">
                  <v-container fluid>
                    <v-row>
                      <!--overall row-container-->
                      <v-col cols="6">
                        <!--overall column left side-->
                        <v-row>
                          <v-text-field
                            v-model="startLocation"
                            label="Start der Route"
                            outlined
                            class="Startlocation"
                          ></v-text-field>
                        </v-row>

                        <v-row>
                          <v-text-field
                            v-model="endLocation"
                            label="Ziel der Route"
                            outlined
                            class="Endlocation"
                          ></v-text-field>
                        </v-row>

                        <v-btn icon @click="swapLocations" class="SwapButton">
                          <v-icon>mdi-swap-horizontal</v-icon>
                        </v-btn>

                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="date"
                              label="Datum"
                              outlined
                              class="Date"
                              type="date"
                              :rules="[dateRule]"
                            ></v-text-field>
                          </v-col>

                          <v-col>
                            <v-text-field
                              v-model="time"
                              label="Uhrzeit"
                              outlined
                              class="Time"
                              type="time"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="6">
                            <v-text-field
                              v-model="freeSeats"
                              label="Benötigte Plätze"
                              outlined
                              class="Neededseats"
                              type="number"
                              :rules="[freeSeatsRule]"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="6">
                        <v-sheet height="200px" class="pa-2 ma-2">
                          <div id="map" class="independent-map"></div>
                        </v-sheet>
                      </v-col>
                    </v-row>
                  </v-container>
                  <!---&& Suchfunktion mit Datenbank in den Button einfügen--->
                </div>
              </div>
            </v-stepper-window>
          </div>

          <div v-if="step === 1">
            <p>Inhalt für Schritt 2: Wähle eine Fahrt aus</p>
            <v-stepper-content step="2">
              <v-list lines="two">
                <v-list-item
                  v-for="n in 3"
                  :key="n"
                  :title="'Item ' + n"
                  subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
                >
                  <template v-slot:prepend>
                    <img src="/assets/unibayreuthlogo.png" />
                  </template>
                </v-list-item>
              </v-list>
            </v-stepper-content>
          </div>

          <div v-if="step === 2">
            <v-stepper-content step="3">
              <v-container fluid>
                <v-row>
                  <v-col cols="6" class="left-column">
                    <div style="display: flex; flex-direction: column; align-items: flex-start;">
                      <span style="font-family: 'Arial'; font-weight: bold; font-size: 30px; color: #009260;">Fahrer:</span>
                      <div style="display: flex; align-items: center; margin-top: 10px;">
                        <img src="/assets/Profilbild.png" alt="Profilbild" style="width: 100px; height: 100px; border-radius: 50%; margin-right: 25px;">
                        <div>
                          <span style="font-family: 'Minion Pro Regular'; font-weight: bold; font-size: 30px;">Max Mustermann</span><br>
                          <span style="font-family: 'Minion Pro Regular'; font-size: 20px;">Rolle: Student</span><br>
                          <span style="font-family: 'Minion Pro Regular'; font-size: 20px;">Freie Plätze(mir mir): 3</span>
                        </div>
                      </div>
                    </div>
                    <v-divider class="my-4"></v-divider>
                    <div style="display: flex; flex-direction: column; align-items: flex-start;">
                      <span style="font-family: 'Arial'; font-weight: bold; font-size: 30px; color: #009260;">Mitfahrer:</span>
                      <div style="display: flex; align-items: center; margin-top: 10px;">
                        <img src="/assets/Profilbild.png" alt="Profilbild" style="width: 100px; height: 100px; border-radius: 50%; margin-right: 25px;">
                        <div>
                          <span style="font-family: 'Minion Pro Regular'; font-weight: bold; font-size: 30px;">Erika Mustermann</span><br>
                          <span style="font-family: 'Minion Pro Regular'; font-size: 20px;">Rolle: Mitarbeiter</span><br>
                        </div>
                      </div>
                    </div>

                    <v-divider class="my-4"></v-divider>
                    <div style="display: flex; flex-direction: column; align-items: flex-start;">
                      <div style="display: flex; align-items: center; margin-top: 10px;">
                        <img src="/assets/Profilbild.png" alt="Profilbild" style="width: 100px; height: 100px; border-radius: 50%; margin-right: 25px;">
                        <div>
                          <span style="font-family: 'Minion Pro Regular'; font-weight: bold; font-size: 30px;">leandor</span><br>
                          <span style="font-family: 'Minion Pro Regular'; font-size: 20px;">Rolle: ahhhhh</span><br>
                        </div>
                      </div>
                    </div>

                    <v-divider class="my-4"></v-divider>
                    <div style="display: flex; flex-direction: column; align-items: flex-start;">
                      <div style="display: flex; align-items: center; margin-top: 10px;">
                        <img src="/assets/Profilbild.png" alt="Profilbild" style="width: 100px; height: 100px; border-radius: 50%; margin-right: 25px;">
                        <div>
                          <span style="font-family: 'Minion Pro Regular'; font-weight: bold; font-size: 30px;">leandor</span><br>
                          <span style="font-family: 'Minion Pro Regular'; font-size: 20px;">Rolle: ahhhhh</span><br>
                        </div>
                      </div>
                    </div>
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
          @click:prev="setStep(this.step-1)"
          @click:next="setStep(this.step+1)"
        ></v-stepper-actions>
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
import { ref } from 'vue'

const dialog = ref(false) //dient dem Öffnen und Schließen des Popup-Dialogs
const overlay = ref(false)  //dient dem Overlay für den Popup-Dialog
</script>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export default {
  data() {
    return {
      drawer: false,
      group: null,
      step: 0,
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
    setStep(a) { this.step = a; },
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
  }
};
</script>

<style scoped>
.bookride {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1; /* Ensure it does not cover other components */
}

.profilebackground {
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover;
  position: absolute;
}

.map-container {
  display: flex;
  justify-content: flex-end;
  align-items: start;
  height: calc(100vh - 64px); /* damit man nicht scrollen kann */
  padding-right: 100px;
}
.independent-map {
  width: 600px;
  height: 600px;
  border-radius: 15px;
  z-index: 500;
}

.v-text-field input {
  font-size: 1.4em;
  font-weight: 100;
  text-transform: capitalize;
}

.v-text-field label {
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
  font-size: 30px;
}

.Endlocation {
  position: absolute;
  top: 390px;
  left: 100px;
  width: 700px;
  height: 150px;
  z-index: 1000;
  font-family: 'Minion Pro Italic';
  font-size: 30px;
}

.Date {
  position: absolute;
  top: 540px;
  left: 100px;
  width: 275px;
  height: 150px;
  z-index: 1000;
  font-family: 'Minion Pro Italic';
  font-size: 30px;
}

.Time {
  position: absolute;
  top: 540px;
  left: 525px;
  width: 275px;
  height: 150px;
  z-index: 1000;
  font-family: 'Minion Pro Italic';
  font-size: 30px;
}

.Freeseats {
  position: absolute;
  top: 690px;
  left: 100px;
  width: 250px;
  height: 150px;
  z-index: 1000;
  font-family: 'Minion Pro Italic';
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