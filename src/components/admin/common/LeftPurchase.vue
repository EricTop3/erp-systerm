<template>
  <div class="col-lg-2"  role="navigation">
    <ul class="nav nav-stacked sidebar">
      <li><a v-link="{ path: '/admin/purchase',exact: true}">采购订单</a></li>
      <li><a v-link="{ path: '/admin/purchase/delivery'}">采购收货</a></li>
    </ul>
  </div>
</template>
<script>
  export default{
    name: 'left-purchase',
  }
</script>
<style scoped>
  a.active{
    color: #f96062;
    background-color: #fff;
  }
</style>
