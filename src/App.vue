<template>
    <div class="container-fluid admin-header" v-if="font===true">
      <div class="row">
        <div class="col-md-2 text-center">
          <h2>中渝爱都会店</h2>
          <h3>营业员：张筱雨</h3>
          <span>[退出]</span></div>
        <div class="col-md-9">
          <ul class="nav nav-pills navbar-right">
            <li><a v-link="{ path: '/order'}" >点单</a></li>
            <li><a v-link="{ path: '/member'}">会员</a></li>
            <li><a v-link="{path: '/instock' }">库存</a></li>
            <li><a v-link="{path: '/billing'}">结算</a></li>
            <li><a v-link="{path: '/tranquery' }">交易查询</a></li>
            <li><a v-link="{path: '/microshoporder'}">微商城订单</a></li>
          </ul>
        </div>
        <div class="col-md-1"></div>
      </div>
    <router-view></router-view>
  </div>
</template>
<script>
  export default{
    data: function () {
      return {
        font: true,
        admin: true
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
</style>
