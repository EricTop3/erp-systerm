<template>
  <div class="col-lg-2"  role="navigation">
    <ul class="nav nav-stacked sidebar">
      <li><a v-link="{ path: '/admin/retail',exact: true}">结算统计</a></li>
      <li><a v-link="{ path: '/admin/retail/manage',exact: true}">结算管理</a></li>
    </ul>
  </div>
</template>
<script>
  export default{
    name: 'left-retail',
  }
</script>
<style scoped>
  a.active{
    color: #f96062;
    background-color: #fff;
  }
</style>
