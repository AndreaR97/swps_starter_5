<template>
  <v-app>
    <v-main>
      <OfferRide/>
    </v-main>
  </v-app>
</template>

<script>

import OfferRide from './components/OfferRide.vue';

export default {
  name: 'App',

  components: {
    OfferRide
  },

  data: () => ({
    //
  }),
}
</script>
