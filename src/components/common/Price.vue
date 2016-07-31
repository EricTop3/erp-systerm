<template>
  <input type="text" class="form-control text-center price" v-model="price"
         @input="priceValidate()">
</template>
<script>
  export default{
    name: 'price',
    props: {
      price: {
        required: true
      },
    },
    methods: {
      priceValidate: function () {
//        价格正则
        var re = /^\d{0,8}\.{0,1}(\d{1,2})?$/
        if (!re.test(this.price)) {
          this.price =  ''
        }
      }
    }
  }
</script>
<style scoped>
  .price {
    display: inline-block;
    width:70px;
    text-align: center;
    margin-right: 10px;
  }
</style>
