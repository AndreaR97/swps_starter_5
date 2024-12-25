<template>
  <div class="profilepage">
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
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="right-area">
            <div style="text-align: left; font-size: 22px;"> 
              <p style="font-weight: bold;">Vorname: Max</p>
              <p style="font-weight: bold;">Nachname: Mustermann</p>
              <p style="margin-top: 5px;">Rolle: Student</p>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row class="rides-overview mt-10"> 
        <v-col cols="12" md="6">
          <v-card class="overflow-y-auto" max-height="300px">
            <div class="fixed-title">
              <span
                style="font-weight: bold; font-size: 24px; color: #009260; padding:10px;"
                >Geplante Fahrten als Mitfahrer:</span
              >
            </div>
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
                          fontSize: '20px',
                          fontWeight: 'bold'
                        }"
                        >{{ ride.from }} - {{ ride.to }}</span
                      >
                      <br />
                      <span
                        :style="{
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
          <v-card class="overflow-y-auto" max-height="300px">
            <div class="fixed-title">
              <span
                style="font-weight: bold; font-size: 24px; color: #009260; padding:10px;"
                >Geplante Fahrten als Fahrer:</span
              >
            </div>
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
                          fontSize: '20px',
                          fontWeight: 'bold'
                        }"
                        >{{ ride.from }} - {{ ride.to }}</span
                      >
                      <br />
                      <span
                        :style="{
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

      <v-row style="height: 50px;"></v-row>
      <v-row justify="center"> 
        <v-btn class="big-button" color="#009260" @click="$router.push('/')">
          Weitere Fahrten planen
        </v-btn> 
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
      { from: 'Bayreuth', to: 'Nürnberg', date: '2023-10-15', time: '10:30' },
      { from: 'Bayreuth', to: 'Nürnberg', date: '2023-10-15', time: '10:30' },
      { from: 'Bayreuth', to: 'Nürnberg', date: '2023-10-15', time: '10:30' },

    ],
    driverRides: [
      { from: 'Berlin', to: 'Hamburg', date: '2023-10-18', time: '09:00' },
      { from: 'Berlin', to: 'Hamburg', date: '2023-10-18', time: '09:00' },
      { from: 'Berlin', to: 'Hamburg', date: '2023-10-18', time: '09:00' },
      { from: 'Berlin', to: 'Hamburg', date: '2023-10-18', time: '09:00' },
      { from: 'Berlin', to: 'Hamburg', date: '2023-10-18', time: '09:00' },
      { from: 'Berlin', to: 'Hamburg', date: '2023-10-18', time: '09:00' },
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
  font-family: 'Arial', sans-serif; 
}

.main-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
}

.left-area {
  background-color: #ff000000; 
  padding: 20px;
  border-radius: 10px;
}

.right-area {
  background-color: #f0f0f0; 
  padding: 20px;
  border-radius: 10px;
  color: #000000;
  margin-top: 25px;
}

.rides-overview {
  margin-top: 150px;
}

.v-card {
  background-color: #f0f0f0; 
  overflow-y: auto;
  max-height: 300px;
  position: relative;
}

.v-list, .v-list-item {
  background-color: #f0f0f0; 
}

.big-button {
  font-size: 20px;
  line-height: 5px;
  padding: 30px 40px;
}

.fixed-title {
  position: sticky;
  top: 0;
  background-color: #f0f0f0; 
  z-index: 1;
}
</style>
