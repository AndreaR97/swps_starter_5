<template>
  <div class="profilepage">
    <img
      src="/assets/profilpage.png"
      alt="ProfilePageBackground"
      class="profilebackground"
    />
    <NavigationBar />
    <v-container fluid class="pa-5 main-container">
      <div style="height: 100px;"></div>
      <v-row class="first-row mt-20">
        <v-col cols="12" md="6">
          <div class="left-area">
            <div style="text-align: center;">
              <img
                src="/assets/profilbild.png"
                alt="ProfilePicture"
                style="width: 150px; height: 150px;"
              />
              <p style="margin-top: 10px; font-size: 24px;">Max Mustermann</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="right-area">
            <div style="text-align: center; font-size: 25px;">
              <p style="font-weight: bold;">Rolle: Student</p>
              <p style="margin-top: 5px;">Eingespartes CO2: 5002 L</p>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row class="rides-overview mt-20">
        <v-col cols="12" md="6">
          <v-card class="overflow-y-auto" max-height="400px">
            <span
              style="font-family: 'Arial'; font-weight: bold; font-size: 24px; color: #009260; padding:10px;"
              >Geplante Fahrten als Mitfahrer:</span
            >
            <v-list lines="two">
              <v-item-group>
                <v-list-item
                  v-for="(ride, index) in passengerRides"
                  :key="index"
                  link
                >
                  <template v-slot:title>
                    <div>
                      <span
                        :style="{
                          fontFamily: 'Minion Pro Regular',
                          fontSize: '20px',
                          fontWeight: 'bold'
                        }"
                        >{{ ride.from }} - {{ ride.to }}</span
                      >
                      <br />
                      <span
                        :style="{
                          fontFamily: 'Minion Pro Regular',
                          fontSize: '16px'
                        }"
                        >{{ ride.date }} um {{ ride.time }}</span
                      >
                    </div>
                  </template>
                </v-list-item>
              </v-item-group>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="overflow-y-auto" max-height="400px">
            <span
              style="font-family: 'Arial'; font-weight: bold; font-size: 24px; color: #009260; padding:10px;"
              >Geplante Fahrten als Fahrer:</span
            >
            <v-list lines="two">
              <v-item-group>
                <v-list-item
                  v-for="(ride, index) in driverRides"
                  :key="index"
                  link
                >
                  <template v-slot:title>
                    <div>
                      <span
                        :style="{
                          fontFamily: 'Minion Pro Regular',
                          fontSize: '20px',
                          fontWeight: 'bold'
                        }"
                        >{{ ride.from }} - {{ ride.to }}</span
                      >
                      <br />
                      <span
                        :style="{
                          fontFamily: 'Minion Pro Regular',
                          fontSize: '16px'
                        }"
                        >{{ ride.date }} um {{ ride.time }}</span
                      >
                    </div>
                  </template>
                </v-list-item>
              </v-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import NavigationBar from './NavigationBar.vue';

export default {
  name: 'ProfilePage',
  components: {
    NavigationBar
  },
  data: () => ({
    passengerRides: [
      { from: 'Bayreuth', to: 'Nürnberg', date: '2023-10-15', time: '10:30' },
    ],
    driverRides: [
      { from: 'Berlin', to: 'Hamburg', date: '2023-10-18', time: '09:00' },
      { from: 'Berlin', to: 'Hamburg', date: '2023-10-18', time: '09:00' },
    ]
  }),
};
</script>

<style scoped>
.profilepage {
  position: relative;
  width: 100%;
  height: calc(100vh - 48px);
  overflow: hidden;
  z-index: 1;
}

.profilebackground {
  width: 100%;
  height: calc(100vh - 48px);
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.main-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
}

.left-area {
  background-color: rgba(255, 255, 255, 0.0);
  padding: 20px;
  border-radius: 10px;
}

.right-area {
  background-color: rgba(255, 255, 255, 0.815);
  padding: 20px;
  border-radius: 10px;
  color: #000000;
  margin-top: 50px;
}

.rides-overview {
  margin-top: 150px;
}

.v-card {
  overflow-y: auto;
  max-height: 400px;
}
</style>
