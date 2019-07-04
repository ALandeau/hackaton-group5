<template>
  <div id="app">
    <header>
      <img src="/static/img/coco.png" alt="Toucan">
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
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  main {
    height: calc(100vh - 56px);
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 10px;
  }

  header {
    margin: 0;
    height: 50px;
    padding: 15px;
    /* background-color: #fc8c2c; */
    box-shadow: 0 3px 6px rgba(72,69,121,.16);
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  header img {
    display: block;
    position: relative;
    height: 70px;
    box-sizing: border-box;
  }

  /* @media only screen and (max-width: 600px) {
    header {
      box-shadow: 0 3px 6px rgba(72,69,121,.16);
    }
  } */
</style>
