<template>
  <div class="loginpage">
    <!-- Hintergrundbild -->
    <img src="/assets/anmeldepage.png" alt="LoginScreen" class="loginbackground" />
  </div>
</template>

<script>
export default {
  name: "LoginPage",
};
</script>

<style scoped>


.loginpage {
  background-color: brown;
}

.loginbackground {
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  position: absolute; 

}

</style>
