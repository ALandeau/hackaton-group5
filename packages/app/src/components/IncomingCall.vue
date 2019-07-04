<template>
  <div id="incoming-call">
    <div id="banner">
      <p>{{user.username}} is calling you</p>
      <button @click="acceptCall">Accept</button>
      <button>Reject</button>
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
    color: #ffffff;
  }
</style>
