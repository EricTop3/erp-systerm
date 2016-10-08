<template>
  <div class="container-fluid admin-header">
    <div class="row" style="height:97px; overflow:hidden">
      <div class="col-md-3 text-center mt10">
        <img src="/static/assets/images/admin_logo.png" class="fl ml20">
        <div class="fl mt10 ml20" style="width:150px; overflow:hidden;">
          <h2 class="mt0" style="text-align:left">{{systerm.name}}</h2>
          <h3 class="fl pt10"  style="text-align:left">您好：{{systerm.account}}</h3>
          <span @click="exit" class="exit">[退出]</span></div>
      </div>
      <div class="col-md-8">
        <ul class="nav nav-pills navbar-right">
          <li v-if="authority.setting"  :class="highLight.setting ? 'active' : ''"><a v-link="{ path: '/admin/setting/'+ authorityModule.setting[0] }">设置</a></li>
          <li v-if="authority.purchase" :class="highLight.purchase ? 'active' : ''"><a v-link="{ path: '/admin/purchase/' + authorityModule.purchase[0]}">采购</a></li>
          <li v-if="authority.instock"  :class="highLight.stock ? 'active' : ''"><a v-link="{ path: '/admin/instock/'+  authorityModule.stock[0]}" >库存</a></li>
          <li v-if="authority.product"  :class="highLight.product ? 'active' : ''"><a v-link="{ path: '/admin/production/' +  authorityModule.product[0]}">生产</a></li>
          <li v-if="authority.retail"   :class="highLight.retail ? 'active' : ''"><a v-link="{ path: '/admin/retail/'+ authorityModule.retail[0]}">零售</a></li>
          <li v-if="authority.member"   :class="highLight.member ? 'active' : ''"><a v-link="{ path: '/admin/member'}" >会员</a></li>
          <li :class="highLight.dataCenter ? 'active' : ''"><a v-link="{ path: '/admin/dataCenter/purchase' }" >数据中心</a></li>
          <!--<li><a v-link="{ path: '/admin/micromall'}">微商城</a></li>-->
        </ul>
      </div>
      <div class="col-md-1"></div>
      </div>
    </div>
</template>
<script>
   import {systermName,systermAccount,systermAuthority} from '../../publicFunction/index'
    export default{
       name: 'admin-nav',
       ready: function() {
//         根据路由判断导航栏是否高亮
         if(this.$route.path.indexOf('/admin/setting/')>-1){
           this.highLight.setting = true
         }
         if(this.$route.path.indexOf('/admin/purchase/')>-1){
           this.highLight.purchase = true
         }
         if(this.$route.path.indexOf('/admin/instock/')>-1){
           this.highLight.stock = true
         }
         if(this.$route.path.indexOf('/admin/production/')>-1){

           this.highLight.product = true
         }
         if(this.$route.path.indexOf('/admin/retail/')>-1){
           this.highLight.retail = true
         }
         if(this.$route.path.indexOf('/admin/member/')>-1){
           this.highLight.member = true
         }
//         第一类大权限
           if(systermAuthority.indexOf('settings')>-1){
             this.authority.setting = true
           }
           if(systermAuthority.indexOf('purchases')>-1 ) {
             this.authority.purchase = true
           }
           if(systermAuthority.indexOf('warehouses')>-1) {
             this.authority.instock = true
           }
           if(systermAuthority.indexOf('productions')>-1){
             this.authority.product = true
           }
           if(systermAuthority.indexOf('sales')>-1) {
             this.authority.retail = true
           }
           if(systermAuthority.indexOf('members')>-1) {
             this.authority.member = true
           }
//         商品设置权限
         if(systermAuthority.indexOf('goods-setting-list')>-1){
           this.authorityModule.setting.push('commodity')
         }
         if(systermAuthority.indexOf('goods-category-list')>-1){
           this.authorityModule.setting.push('category')
         }
         if(systermAuthority.indexOf('discount-setting-list')>-1){
           this.authorityModule.setting.push('coupon')
         }
         if(systermAuthority.indexOf('cooperation-setting-list')>-1){
           this.authorityModule.setting.push('partner')
         }
         if(systermAuthority.indexOf('store-account-list')>-1){
           this.authorityModule.setting.push('userAccount')
         }
         if(systermAuthority.indexOf('manage-account-list')>-1){
           this.authorityModule.setting.push('adminAccount')
         }
         if(this.authorityModule.setting.length === 0){
           this.authorityModule.setting[0] = ''
         }
//        采购权限处理
         if(systermAuthority.indexOf('purchase-order-list')>-1){
           this.authorityModule.purchase.push('order')
         }
         if(systermAuthority.indexOf('purchase-receipt-list')>-1){
           this.authorityModule.purchase.push('delivery')
         }
         if(this.authorityModule.purchase.length === 0){
           this.authorityModule.purchase[0] = ''
         }
//         库存权限处理
         if(systermAuthority.indexOf("stock-look-list")>-1){
           this.authorityModule.stock.push('query')
         }
         if(systermAuthority.indexOf("stock-check-list")>-1){
           this.authorityModule.stock.push('inventory')
         }
         if(systermAuthority.indexOf("stock-difference-list")>-1){
           this.authorityModule.stock.push('difference')
         }
         if(systermAuthority.indexOf("distribution-out-list")>-1){
           this.authorityModule.stock.push('dispatching')
         }
         if(systermAuthority.indexOf("sale-out-list")>-1){
           this.authorityModule.stock.push('sale')
         }
         if(systermAuthority.indexOf("produce-out-list")>-1){
           this.authorityModule.stock.push('production')
         }
         if(systermAuthority.indexOf("requisition-total-list")>-1){
           this.authorityModule.stock.push('apply')
         }
         if(this.authorityModule.stock.length === 0){
           this.authorityModule.stock[0] = ''
         }
//      生产权限处理
         if(systermAuthority.indexOf('factory-produce-list') > -1){
           this.authorityModule.product.push('factoryProduction')
         }
         if(systermAuthority.indexOf('outsource-produce-list') > -1){
           this.authorityModule.product.push('delegationCreat')
         }
         if(systermAuthority.indexOf('pick-total-list') > -1){
           this.authorityModule.product.push('getSupplies')
         }
         if(systermAuthority.indexOf('factory-produce-in-list') > -1){
           this.authorityModule.product.push('factoryInstock')
         }
         if(systermAuthority.indexOf('outsource-produce-in-list') > -1){
           this.authorityModule.product.push('delegationInstock')
         }
         if(systermAuthority.indexOf('produce-appointment-list') > -1){
           this.authorityModule.product.push('creatOrder')
         }
         if(this.authorityModule.product.length === 0){
           this.authorityModule.product[0] = ''
         }
//        零售权限
         if(systermAuthority.indexOf('settlement-total-list')>-1){
           this.authorityModule.retail.push('statistics')
         }
         if(systermAuthority.indexOf('settlement-administration-list')>-1){
           this.authorityModule.retail.push('manage')
         }
         if(this.authorityModule.retail.length === 0){
           this.authorityModule.retail[0] = ''
         }
         console.log("wang")
         console.log( this.authorityModule.setting[0])
       },
       methods: {
         exit: function () {
//         TODO 未来可能有接口，暂时如此
           window.localStorage.setItem('token',null)
           window.localStorage.setItem('systermName',null)
           window.localStorage.setItem('systermAccount',null)
           window.location.href ='#!/admin/login'
           window.location.reload()
         }
       },
      data: function () {
        return {
          authorityModule: {
            setting: [],
            purchase: [],
            stock: [],
            product: [],
            retail: [],
            member: []
          },
          highLight:{
            setting: false,
            purchase: false,
            stock: false,
            product: false,
            retail:false,
            member:false
          },
          systerm: {
            account: systermAccount,
            name: systermName
          },
          authority: {
            setting: false,
            purchase: false,
            instock: false,
            product: false,
            retail: false,
            member: false,
          }
        }
      }
    }
</script>
<style scoped>






  a.active{
    color: #000;
    border-top: 6px solid  #0d9ae2;
    border-bottom: 3px solid #c3c3c3;
    background-color: #fff;
    padding-top: 24px;
  }
  .exit{
    cursor: pointer;
  }
</style>
