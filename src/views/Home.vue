<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>

    <table>
      <tr>
        <th>access_token</th>
        <th>token_type</th>
        <th>expires_in</th>
      </tr>
      <tr>
        <td>{{auth.access_token}}</td>
        <td>{{auth.token_type}}</td>
        <td>{{auth.expires_in}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import { mapState } from 'vuex';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },

  created() {
    this.$store.dispatch('login');
  },
  computed: mapState(['auth']),
};
</script>
<style scoped lang="scss">
table {
  width:100%;
  table-layout: fixed;
  overflow-wrap: break-word;
}
</style>
