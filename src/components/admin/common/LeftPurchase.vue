<template>
  <div class="col-lg-2"  role="navigation" style="padding:0;">
    <ul class="nav nav-stacked sidebar">
      <li v-if="authorityPurchase.order"><a v-link="{ path: '/admin/purchase/order'}">采购订单</a></li>
      <li v-if="authorityPurchase.delivery"><a v-link="{ path: '/admin/purchase/delivery'}">采购收货</a></li>
    </ul>
  </div>
</template>
<script>
  import {systermAuthority} from '../../../publicFunction/index'
  export default{
    name: 'left-purchase',
    ready: function () {
      if(systermAuthority.indexOf('purchase-order-list') > -1){
        this.authorityPurchase.order = true
      }
      if(systermAuthority.indexOf('purchase-receipt-list') > -1){
        this.authorityPurchase.delivery = true
      }
    },
    data: function(){
      return {
        authorityPurchase:{
          order: false,
          delivery: false,
        }
      }
    }
  }
</script>
<style scoped>
  a.active{
    color: #f96062;
    background-color: #fff;
  }
</style>
