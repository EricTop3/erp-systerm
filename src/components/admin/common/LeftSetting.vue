<template>
  <div class="col-lg-2" role="navigation" style="padding:0;">
    <ul class="nav nav-stacked sidebar">
      <li v-if="authoritySetting.goods"><a v-link="{ path: '/admin/setting/commodity'}">商品设置</a></li>
      <li v-if="authoritySetting.category"><a v-link="{ path: '/admin/setting/category',exact: true}">商品分类</a></li>
      <li v-if="authoritySetting.discount"><a v-link="{ path: '/admin/setting/coupon',exact: true}">优惠设置</a></li>
      <li v-if="authoritySetting.cooperation"><a v-link="{ path: '/admin/setting/partner',exact: true}">合作方设置</a></li>
      <li v-if="authoritySetting.storeAccount"><a v-link="{ path: '/admin/setting/userAccount',exact: true}">门店账号</a></li>
      <li v-if="authoritySetting.systermAccount"><a v-link="{ path: '/admin/setting/adminAccount',exact: true}">系统账号</a></li>
    </ul>
  </div>
</template>
<script>
  import {systermAuthority} from '../../../publicFunction/index'
  export default{
    name: 'left-setting',
    ready: function () {
      if(systermAuthority.indexOf('goods-setting-list')>-1){
        this.authoritySetting.goods = true
      }
      if(systermAuthority.indexOf('goods-category-list')>-1){
        this.authoritySetting.category = true
      }
      if(systermAuthority.indexOf('discount-setting-list')>-1){
        this.authoritySetting.discount = true
      }
      if(systermAuthority.indexOf('cooperation-setting-list')>-1){
        this.authoritySetting.cooperation = true
      }
      if(systermAuthority.indexOf('store-account-list')>-1){
        this.authoritySetting.storeAccount = true
      }
      if(systermAuthority.indexOf('manage-account-list')>-1){
        this.authoritySetting.systermAccount = true
      }
    },
    methods: {},
    data: function() {
      return {
        authoritySetting: {
          goods: false,
          category: false,
          discount: false,
          cooperation: false,
          storeAccount: false,
          systermAccount: false,
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
  .custom-active-class{
    color:blue
  }
</style>
