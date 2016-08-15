<template>
  <div class="container-fluid admin-header">
    <div class="row">
      <div class="col-md-2 text-center">
        <h2>{{store.info}}</h2>
        <h3>{{store.storeName}}</h3>
        <span @click="exit" class="exit">[退出]</span></div>
      <div class="col-md-9">
        <ul class="nav nav-pills navbar-right">
          <li><a v-link="{ path: '/site/order'}" >点单</a></li>
          <li><a v-link="{ path: '/site/member'}">会员</a></li>
          <li><a v-link="{path: '/site/instock' }">库存</a></li>
          <li><a v-link="{path: '/site/billing'}">结算</a></li>
          <li><a v-link="{path: '/site/tranquery'}">交易查询</a></li>
          <li><a href='#'>微商城订单</a></li>
          <!--<li><a v-link="{path: '/site/microshoporder'}">微商城订单</a></li>-->
        </ul>
      </div>
      <div class="col-md-1"></div>
    </div>
  </div>
</template>
<script>
  import {storeName,storeAccount,storeInfo} from '../../publicFunction/index'
  export default{
    name: 'site-nav',
    methods: {
      exit: function () {
//         TODO 未来可能有接口，暂时如此
        window.localStorage.setItem('token',null)
        window.localStorage.setItem('storeName',null)
        window.localStorage.setItem('storeAccount',null)
        window.location.href ='#!/site/login'
        window.location.reload()
      }
    },
    data: function () {
      return {
        store: {
          name: storeName,
          account: storeAccount,
          info: storeInfo
        }
      }
    }
  }
</script>
<style scoped>
  a.active{
    color: #000;
    border-top: 6px solid #ff500b;
    border-bottom: 3px solid #c3c3c3;
    background-color: #fff;
    padding-top: 24px;
  }
  .exit{
    cursor: pointer;
  }
</style>
