<template>
  <div class="container-fluid admin-header">
    <div class="row" style="height:97px; overflow:hidden">
      <div class="col-md-3 text-center mt10">
        <img src="/static/assets/images/admin_logo.png" class="fl ml20">
        <div class="fl mt10 ml20" style="width:150px; overflow:hidden;">
          <h2 class="fl mt0">{{systerm.name}}</h2>
          <h3 class="fl pt10">您好：{{systerm.account}}</h3>
          <span @click="exit" class="exit">[退出]</span></div>
      </div>
      <div class="col-md-8">
        <ul class="nav nav-pills navbar-right">
          <li v-if="authority.setting"><a v-link="{ path: '/admin/setting'}">设置</a></li>
          <li v-if="authority.purchase"><a v-link="{ path: '/admin/purchase'}">采购</a></li>
          <li v-if="authority.instock"><a v-link="{ path: '/admin/instock'}" >库存</a></li>
          <li v-if="authority.product"><a v-link="{ path: '/admin/production'}">生产</a></li>
          <li v-if="authority.retail"><a v-link="{ path: '/admin/retail'}">零售</a></li>
          <li v-if="authority.member"><a v-link="{ path: '/admin/member'}" >会员</a></li>
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
           if(systermAuthority.indexOf('生产')>-1){
             this. authority.product = true
           }else if(systermAuthority.indexOf('设置')>-1){
             this. authority.setting = true
           }else if(systermAuthority.indexOf('采购')>-1) {
             this.authority.purchase = true
           }else if(systermAuthority.indexOf('零售')>-1) {
             this.authority.retail = true
           }else if(systermAuthority.indexOf('仓库')>-1) {
             this.authority.instock = true
           }else if(systermAuthority.indexOf('会员')>-1) {
             this.authority.member = true
           }
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
