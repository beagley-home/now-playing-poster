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
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  min-height: 100vh; /* Full viewport height */
}
</style>