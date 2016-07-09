<template>
  <input type="text" class="form-control text-center count" style="width:70px;" v-model="count"
         @input="countValidate(amount)">
</template>
<script>
  export default{
    name: 'count',
    props: {
      count: {
        required: true
      },
      amount: {
        type: Number
      }
    },
    methods: {
      countValidate: function (amount) {
        var numberRe = /\D/
        if (numberRe.test(this.count)) {
          this.count = ''
        }
        this.$dispatch('calc', this.count, amount)
      }
    },
    events: {
//      判断退货数量是否大于销售数量
      calc: function (count, amount) {
        if (count > amount) {
          this.count = 0
          /*countValidate(count)
           console.log(count + ',' + amount)*/
        }
      }
    }
  }
</script>
<style scoped>
  .count{
    margin: 0 auto;
  }
</style>
