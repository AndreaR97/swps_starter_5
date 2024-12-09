<template>
  <div class="container">
    <input type="text" class="centered-textfield" />
    <button class="centered-button">Submit</button>
  </div>
</template>

<script>
export default {
  name: 'TestPage',
  data() {
    return {
    };
  }
}
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  z-index: 0;
  background-color: green;
}

.centered-textfield {
  width: 200px;
  height: 50px;
  font-size: 20px;
  z-index: 1000;
  text-align: center;
  background-color: white;
}

.centered-button {
  margin-left: 100px;
  width: 100px;
  height: 40px;
  font-size: 16px;
  z-index: 1000;
  text-align: center;
  background-color: white;
}
</style>
