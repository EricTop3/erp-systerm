<template>
  <input type="text" class="form-control text-center" style="width:70px;" v-model="count" @input="countValidate">
</template>
<script>
  export default{
    name: 'count',
    props: {
      count: {
        required: true
      }
    },
    methods: {
      countValidate: function () {
        var numberRe = /\D/
        if (numberRe.test(this.count)) {
          this.count = ''
        }
        this.$dispatch('calc', this.count)
      }
    }
  }
</script>
<style scoped>
</style>
