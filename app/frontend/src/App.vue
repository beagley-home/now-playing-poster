<template>
  <div id="app">
    <SlideShow/>
  </div>
</template>

<script>
import SlideShow from './components/slideshow.vue'

export default {
  name: 'App',
  components: {
    SlideShow
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
