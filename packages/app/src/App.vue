<template>
  <div id="app">
    <header>
      <span>COCO</span>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <IncomingCall v-if="hasIncomingCall" :user="caller"/>
  </div>
</template>

<script>
  import IncomingCall from './components/IncomingCall'

  export default {
    name: 'app',
    components: {IncomingCall},
    computed: {
      hasIncomingCall () {
        return this.$store.state.incomingCall
      },
      caller () {
        return this.$store.state.caller
      }
    }
  }
</script>

<style>
  body {
    margin: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  main {
    height: calc(100vh - 56px);
    width: 100vw;
  }

  header {
    margin: 0;
    height: 56px;
    padding: 0 16px 0 24px;
    background-color: #35495E;
    color: #ffffff;
  }

  header span {
    display: block;
    position: relative;
    font-size: 20px;
    line-height: 1;
    letter-spacing: .02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
  }
</style>
