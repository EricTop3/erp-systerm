<template>
  <div class="container-fluid admin-header">
    <div class="row">
      <div class="col-md-3 text-center mt10">
        <img src="/static/assets/images/admin_logo.png" class="fl ml30">
        <div class="fl mt30 ml20">
          <h2 class="fl mt0">管理系统</h2>
          <h3 class="fl ml10 pt10">您好：张雨</h3>
          <span @click="exit" class="exit">[退出]</span></div>
      </div>
      <div class="col-md-8">
        <ul class="nav nav-pills navbar-right">
          <li><a v-link="{ path: '/admin/setting'}">设置</a></li>
          <li><a v-link="{ path: '/admin/purchase'}">采购</a></li>
          <li><a v-link="{ path: '/admin/instock'}">库存</a></li>
          <li><a v-link="{ path: '/admin/production'}">生产</a></li>
          <li><a v-link="{ path: '/admin/retail'}">零售</a></li>
          <li><a v-link="{ path: '/admin/member'}">会员</a></li>
          <!--<li><a v-link="{ path: '/admin/micromall'}">微商城</a></li>-->
        </ul>
      </div>
      <div class="col-md-1"></div>
      </div>
    </div>
</template>
<script>
    export default{
       name: 'admin-nav',
       methods: {
         exit: function () {
//         TODO 未来可能有接口，暂时如此
           window.localStorage.setItem('token',null)
           window.location.href ='#!/admin/login'
           window.location.reload()
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
