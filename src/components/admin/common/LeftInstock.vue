<template>
  <div class="col-lg-2" role="navigation" style="padding:0;">
    <ul class="nav nav-stacked sidebar">
      <li v-if="authorityStock.look"><a v-link="{ path: '/admin/instock/query'}">库存查询</a></li>
      <li v-if="authorityStock.check"><a v-link="{ path: '/admin/instock/inventory'}">库存盘点</a></li>
      <li v-if="authorityStock.difference"><a v-link="{ path: '/admin/instock/difference'}">差异汇总</a></li>
      <li v-if="authorityStock.distributionOut"><a v-link="{ path: '/admin/instock/dispatching'}">库存配送出库</a></li>
      <li v-if="authorityStock.saleOut"><a v-link="{ path: '/admin/instock/sale'}">销售出库</a></li>
      <li v-if="authorityStock.produceOut"><a v-link="{ path: '/admin/instock/production'}">生产出库</a></li>
      <li v-if="authorityStock.requisitionTotal"><a v-link="{ path: '/admin/instock/apply'}">要货汇总</a></li>
    </ul>
  </div>
</template>
<script>
  import {systermAuthority} from '../../../publicFunction/index'
  export default{
    name: 'left-instock',
    ready: function () {
      if(systermAuthority.indexOf("stock-look-list")>-1){
        this.authorityStock.look = true
      }
      if(systermAuthority.indexOf("stock-check-list")>-1){
        this.authorityStock.check = true
      }
      if(systermAuthority.indexOf("stock-difference-list")>-1){
        this.authorityStock.difference = true
      }
      if(systermAuthority.indexOf("distribution-out-list")>-1){
        this.authorityStock.distributionOut = true
      }
      if(systermAuthority.indexOf("sale-out-list")>-1){
        this.authorityStock.saleOut = true
      }
      if(systermAuthority.indexOf("produce-out-list")>-1){
        this.authorityStock.produceOut = true
      }
      if(systermAuthority.indexOf("requisition-total-list")>-1){
        this.authorityStock.requisitionTotal = true
      }
    },
    data: function() {
      return {
        authorityStock: {
          look: false,
          check: false,
          difference: false,
          distributionOut: false,
          saleOut: false,
          produceOut: false,
          requisitionTotal: false
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

