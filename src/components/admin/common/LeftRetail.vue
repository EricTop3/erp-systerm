<template>
  <div class="col-lg-2"  role="navigation" style="padding:0;">
    <ul class="nav nav-stacked sidebar">
      <li v-if="authorityRetail.settlementTotal"><a v-link="{ path: '/admin/retail/statistics'}">结算统计</a></li>
      <li v-if="authorityRetail.settlementAdministration"><a v-link="{ path: '/admin/retail/manage'}">结算管理</a></li>
    </ul>
  </div>
</template>
<script>
  import {systermAuthority} from '../../../publicFunction/index'
  export default{
    name: 'left-retail',
    ready: function () {
      if(systermAuthority.indexOf('settlement-total-list')>-1){
        this.authorityRetail.settlementTotal = true
      }
      if(systermAuthority.indexOf('settlement-administration-list')>-1){
        this.authorityRetail.settlementAdministration = true
      }
    },
    data: function () {
      return {
        authorityRetail:  {
          settlementTotal: false,
          settlementAdministration: false
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
