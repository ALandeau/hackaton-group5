<template>
  <div id="incoming-call">
    <div id="banner">
      <p>{{user.username}}Michel vous appelle</p>
      <button>Refuser</button>
      <button @click="acceptCall">Accepter</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'IncomingCall',
    props: {
      user: Object
    },
    methods: {
      acceptCall () {
        this.$store.dispatch('acceptCall').then(() => {
          this.$router.push({
            name: 'Call',
            params: {
              user_id: this.user.room_id
            }
          })
        })
      }
    }
  }
</script>

<style scoped>
  #incoming-call {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
  }

  #banner {
    color:black;
    background-color: white;
    border-radius: 5px;
    padding: 30px;
    font-weight: bold;
  }

  button {
    width: 150px;
    padding: 15px;
    border: none;
    border-radius: 5px;
  }
  button:nth-of-type(1) {
    background-color: white;
    color: black;
  }
  button:nth-of-type(2) {
    background-color: #3742fa;
    color: white;
  }
</style>
