
<template> 
    <v-stepper
      v-model="step"
      :items="items"
      show-actions
    >

    <template v-slot:item="{ step }">
      <div v-if="step === 1">
      <template>
        <br>
        <h3 class="text-h6">Fahrtdaten</h3>
      </template>
    </div>
  
     <div v-if="step === 2">
      <template> 
        <br>
        <h3 class="text-h6">Bestätigung</h3>
      </template>
        </div>

          
       
    </template>
    </v-stepper>
  </template>

<script>
export default {
  data: () => ({
    step: 1,
    items: [
      'Fahrtdaten',
      'Bestätigung',
      
    ],
    
  }),

}
</script>