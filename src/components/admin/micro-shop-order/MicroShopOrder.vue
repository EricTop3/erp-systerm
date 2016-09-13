<template>
  <admin-nav></admin-nav>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>
<script>
  import AdminNav from '../AdminNav'
  export default {
    components: {
      AdminNav: AdminNav
    },
    data: function () {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.
        msg: 'this is microshoporder vue'
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }
</style>

