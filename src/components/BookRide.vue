<template>
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
                    <v-col cols="6">
                      <div class="seats-and-submit">
                        <v-text-field
                          v-model="freeSeats"
                          label="Freie Plätze"
                          outlined
                          class="seats-field"
                          type="number"
                        ></v-text-field>
                      </div>
                    </v-col>
                    </div>
                  </v-col>

                <div class="col">
                      <div id="map" class="independent-map"></div> <!-- Karte -->
                </div>

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
          <v-item-group>
          <v-list-item
            v-for="(person, n) in rideOffers"
            :key="n"
            :title="person.name"
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
        </v-item-group>
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