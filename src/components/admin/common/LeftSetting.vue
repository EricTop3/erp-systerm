<template>
  <div class="col-lg-2" role="navigation">
    <ul class="nav nav-stacked sidebar">
      <li><a v-link="{ path: '/admin/setting/commodity'}">商品设置</a></li>
      <li><a v-link="{ path: '/admin/setting/category',exact: true}">商品分类</a></li>
      <li><a v-link="{ path: '/admin/setting/coupon',exact: true}">优惠设置</a></li>
      <li><a v-link="{ path: '/admin/setting/partner',exact: true}">合作方设置</a></li>
      <li><a v-link="{ path: '/admin/setting/userAccount',exact: true}">门店账号</a></li>
      <li><a v-link="{ path: '/admin/setting/adminAccount',exact: true}">系统账号</a></li>
    </ul>
  </div>
</template>
<script>
  export default{
    name: 'left-setting',
    methods: {

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
