<template>
  <div id="users">
    <h1>Hello {{$store.state.username}},</h1>
    <h2>Contacts (en ligne): </h2>
    <ul>
      <li v-for="(user, index) in userWithoutMe" :key="index"><span>🔵 {{user.username}} {{user.socket_id}}</span>
        <button @click="callUser(user)">Appeler</button>
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
#users {
  background-color: white;
  box-shadow: 0 3px 6px rgba(72,69,121,.16);
  border-radius: 5px;
  width: 600px;
  max-width: 100%;
  padding: 15px 30px;
}
#users h1 {
  font-size: 40px;
  font-weight: bold;
}
ul{
  list-style: none;
  padding-left: 10px;
}
li {
  padding-top: 15px;
  padding-bottom: 15px;
  width: auto;
  border-bottom: 1px solid whitesmoke;
  display: flex;
  justify-content: space-between;
}

li button {
  background-color: #fc8c2c;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
}

li:last-of-type {
  border-bottom: none;
}

@media only screen and (max-width: 600px) {
  #users {
    box-shadow: none;
  }
}
</style>
