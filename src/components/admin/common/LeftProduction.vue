<template>
  <div class="col-lg-2" role="navigation" style="padding:0;">
    <ul class="nav nav-stacked sidebar">
      <li v-if="authorityProduct.factoryProduce"><a v-link="{ path: '/admin/production/factoryProduction'}">工厂生产单</a></li>
      <li v-if="authorityProduct.outsourceProduce"><a v-link="{ path: '/admin/production/delegationCreat'}">委外生产单</a></li>
      <li v-if="authorityProduct.pickTotal"><a v-link="{ path: '/admin/production/getSupplies'}">领料单</a></li>
      <li v-if="authorityProduct.factoryProduceIn"><a v-link="{ path: '/admin/production/factoryInstock'}">工厂生产入库单</a></li>
      <li v-if="authorityProduct.outsourceProduceIn"><a v-link="{ path: '/admin/production/delegationInstock'}">委外生产入库单</a></li>
      <li v-if="authorityProduct.produceAppointment"><a v-link="{ path: '/admin/production/creatOrder'}">生产预约单</a></li>
    </ul>
  </div>
</template>
<script>
  import {systermAuthority} from '../../../publicFunction/index'
  export default{
    name: 'left-production',
    ready: function () {
      if(systermAuthority.indexOf('factory-produce-list') > -1){
        this.authorityProduct.factoryProduce = true
      }
      if(systermAuthority.indexOf('outsource-produce-list') > -1){
        this.authorityProduct.outsourceProduce = true
      }
      if(systermAuthority.indexOf('pick-total-list') > -1){
        this.authorityProduct.pickTotal = true
      }
      if(systermAuthority.indexOf('factory-produce-in-list') > -1){
        this.authorityProduct.factoryProduceIn = true
      }
      if(systermAuthority.indexOf('outsource-produce-in-list') > -1){
        this.authorityProduct.outsourceProduceIn = true
      }
      if(systermAuthority.indexOf('produce-appointment-list') > -1){
        this.authorityProduct.produceAppointment = true
      }
    },
    data: function () {
      return {
        authorityProduct: {
          factoryProduce: false,
          outsourceProduce: false,
          pickTotal: false,
          factoryProduceIn: false,
          outsourceProduceIn: false,
          produceAppointment: false
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
