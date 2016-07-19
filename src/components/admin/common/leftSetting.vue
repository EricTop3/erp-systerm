<template>
  <ul class="nav nav-stacked sidebar">
    <li class="active"><a v-link="{ path: '/admin/setting'}">商品设置</a></li>
    <li><a v-link="{ path: '/admin/setting/category'}">商品分类</a></li>
    <li><a v-link="{ path: '/admin/setting/coupon'}">优惠设置</a></li>
    <li><a v-link="{ path: '/admin/setting/partner'}">合作方设置</a></li>
    <li><a v-link="{ path: '/admin/setting/userAccount'}">门店账号</a></li>
    <li><a v-link="{ path: '/admin/setting/adminAccount'}">系统账号</a></li>
  </ul>
</template>
<script>
  export default{
    name: 'left-setting',
  }
</script>
