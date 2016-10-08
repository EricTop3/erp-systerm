<template>
  <div class="col-lg-2"  role="navigation" style="padding:0;">
    <ul class="nav nav-stacked sidebar">
      <li  v-if="authorityDataCenter.purchase"><a v-link="{ path: '/admin/dataCenter/purchase'}">采购</a></li>
      <li  v-if="authorityDataCenter.instock"><a v-link="{ path: '/admin/dataCenter/instock'}">库存</a></li>
      <li  v-if="authorityDataCenter.product"><a v-link="{ path: '/admin/dataCenter/production'}">生产</a></li>
      <li  v-if="authorityDataCenter.retail"><a v-link="{ path: '/admin/dataCenter/sale'}">零售</a></li>
      <li  v-if="authorityDataCenter.member"><a v-link="{ path: '/admin/dataCenter/member'}">会员</a></li>
    </ul>
  </div>
</template>
<script>
  import {systermAuthority} from '../../../publicFunction/index'
  export default{
    name: 'left-datacenter',
    ready: function () {
      if(systermAuthority.indexOf('purchase-list') > -1) {
        this.authorityDataCenter.purchase = true
      }
      if(systermAuthority.indexOf('stock-list') > -1) {
        this.authorityDataCenter.instock = true
      }
      if(systermAuthority.indexOf('produce-list') > -1) {
        this.authorityDataCenter.product = true
      }
      if(systermAuthority.indexOf('order-list') > -1) {
        this.authorityDataCenter.retail = true
      }
      if(systermAuthority.indexOf('member-list') > -1) {
        this.authorityDataCenter.member = true
      }
    },
    data: function () {
      return {
        authorityDataCenter: {
          purchase: false,
          instock: false,
          product: false,
          retail: false,
          member: false
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
