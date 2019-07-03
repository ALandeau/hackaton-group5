<template>
  <div id="login">
    <h2>Votre nom d'utilisateur</h2>
    <form @submit.prevent="submitUsername">
      <input type="text" v-model="username">
      <input type="submit" value="submit">
    </form>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {
        username: ''
      }
    },
    methods: {
      submitUsername () {
        if (this.username === '') return

        console.log('Username : ', this.username)
        this.$store.dispatch('submitUsername', this.username).then(() => this.$router.push('Users'))
      }
    }
  }
</script>

<style scoped>

</style>
