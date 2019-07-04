<template>
  <div id="users">
    <p>Hello {{$store.state.username}}</p>
    <p>utilisateurs connectés : </p>
    <ul>
      <li v-for="user in userWithoutMe">{{user.username}} {{user.socket_id}}
        <button @click="callUser(user)">Appeller</button>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Users',
    computed: {
      userWithoutMe () {
        return this.$store.state.users.filter(user => user.username !== this.$store.state.username)
      }
    },
    methods: {
      callUser (user) {
        this.$router.push({
          name: 'Call',
          params: {user_id: user.room_id}
        })
      }
    }
  }
</script>

<style scoped>

</style>
