<template>
  <input type="text" class="form-control text-center count" v-model="count"
         @input="countValidate">
</template>
<script>
  export default{
    name: 'count',
    props: {
      count: '',
      flag: false,
      isFloat: false,
    },
    methods: {
//      验证规则
      countValidate: function () {
        var re = /^\d/
        if(this.isFloat){
          re = /^\d{0,8}\.{0,1}(\d{1,3})?$/
        }
        if(!re.test(this.count)){
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
