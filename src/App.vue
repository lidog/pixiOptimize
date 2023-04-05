<template>
  <div id="app">
    <Pixi/>
  </div>
</template>

<script>
import Pixi from "@/components/Pixi4.vue";
export default {
  name: 'App',
  components: {
    Pixi,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
