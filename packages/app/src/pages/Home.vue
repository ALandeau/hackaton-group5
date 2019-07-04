<template>
  <div id="login">
    <h2>Votre nom d'utilisateur</h2>
    <form @submit.prevent="submitUsername">
      <input type="text" v-model="username">
      <button type="submit">Envoyer</button>
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
        this.$store.dispatch('submitUsername', this.username).then(() => this.$router.push({
          name: 'Users'
        }))
      }
    }
  }
</script>

<style scoped>
input {
  border-radius: 5px;
  border: 1px solid whitesmoke;
  width: 250px;
  padding: 15px;
  font-size: 18px;
}

  button {
    width: 150px;
    padding: 15px;
    border: none;
    border-radius: 5px;
    background-color: #3742fa;
    color: white;
    font-size: 18px;
  }
</style>
