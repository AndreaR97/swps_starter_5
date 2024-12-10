<template>
  <div class="container">
    <input type="text" v-model="inputValue" class="centered-textfield" placeholder="Enter text" />
    <button class="centered-button" @click="submitData">Submit</button>
  </div>
</template>

<script>
import { supabase } from '../lib/supabaseClient';

export default {
  name: 'TestPage',
  data() {
    return {
      inputValue: '', // Eingabewert
    };
  },
  methods: {
    async submitData() {
      // Einfügen der Daten in die Datenbank
      await supabase
        .from('test_table') // Tabellenname
        .insert([{ eingabe: this.inputValue }]); // Spalte und Wert

      // Eingabewert zurücksetzen
      this.inputValue = '';
    },
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: green;
}

.centered-textfield {
  width: 200px;
  height: 50px;
  font-size: 20px;
  text-align: center;
  background-color: white;
}

.centered-button {
  margin-left: 100px;
  width: 100px;
  height: 40px;
  font-size: 16px;
  text-align: center;
  background-color: white;
}
</style>
