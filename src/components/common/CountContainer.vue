<template>
  <div class="btn-group" role="group" id="countContainer">
    <button type="button" class="btn btn-default" @click="lessCount">-</button>
    <input type="text" class="btn btn-default col-lg-4" v-model="count" @input="countValidate"/>
    <button type="button" class="btn btn-default" @click="addCount">+</button>
  </div>
</template>
<script>
  export default{
    name: 'count-container',
    props: {
      count: {
        required: true,
        default: 1
      }
    },
    methods: {
      countValidate: function () {
        var numberRe = /\D/
        if (numberRe.test(this.count)) {
          this.count = 1
        }
      },
      addCount: function () {
        this.count++
      },
      lessCount: function () {
        if (this.count <= 1) {
          this.count = 1
        } else {
          this.count--
        }
      }
    }
  }
</script>
<style scoped>
</style>
