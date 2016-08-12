<template>
  <input type="text" class="form-control text-center count" v-model="count"
         @input="countValidate" @blur="moveEdit">
</template>
<script>
  export default{
    name: 'count',
    props: {
      count: '',
      flag: false,
    },
    methods: {
//      验证规则
      countValidate: function () {
        var numberRe = /\D/
        if (numberRe.test(this.count)) {
          this.count = ""
        }
        this.$dispatch('countEmmit',this.count)
      },
//    取消编辑
      moveEdit: function () {
        this.flag = false
        this.$dispatch('saveDataToApi')
        this.$dispatch('countEmmit',this.count)
      }
    }
  }
</script>
<style scoped>
  .count {
    display: inline-block;
    width:70px;
    text-align: center;
    margin-right: 10px;
  }
</style>
