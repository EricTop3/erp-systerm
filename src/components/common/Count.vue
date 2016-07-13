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
        required: true
      },
      flag: false,
    },
    methods: {
      countValidate: function (amount) {
        var numberRe = /\D/
        if (numberRe.test(this.count)) {
          this.count = ""
        }
        if(this.count === '0') {
          this.flag = true
        }else{
          this.flag = false
        }
        this.$dispatch('calc', this.count, amount)
      }
    },
    events: {
//      判断退货数量是否大于销售数量
      calc: function (count, amount) {
        if (Number(count) > amount) {
          this.count = "0"
          this.countValidate(count)
          console.log(count + ',' + amount)
        }
      }
    }
  }
</script>
<style scoped>
  .count {
    margin: 0 auto;
  }
</style>
