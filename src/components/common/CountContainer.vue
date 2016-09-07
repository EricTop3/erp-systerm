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
      },
      isValidate: false,
      maxCount: 1
    },
    methods: {
      countValidate: function () {
        var numberRe = /\D/
        if (numberRe.test(this.count) && !isValidate) {
          this.count = 1
        }
        if(Number( this.count)>=  Math.floor(Number(this.maxCount))  && !this.isValidate){
         this.count =  Math.floor(Number(this.maxCount))
        }
        this.$dispatch('inputCount')
      },
      addCount: function () {
        if(Number( this.count)>= Math.floor(Number(this.maxCount)) && !this.isValidate){
          this.count = Math.floor(Number(this.maxCount))
        }else{
          ++this.count
          this.$dispatch('countIncrease')
        }
      },
      lessCount: function () {
        if (this.count <= 1) {
          this.count = 1
        } else {
          this.count--
          this.$dispatch('countDuce')
        }
      }
    }
  }
</script>
<style scoped>
</style>
