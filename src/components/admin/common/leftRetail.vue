<template>
  <ul class="nav nav-stacked sidebar">
    <li class="active"><a v-link="{ path: '/admin/retail'}">结算统计</a></li>
    <li><a v-link="{ path: '/admin/retail/manage'}">结算管理</a></li>
  </ul>
</template>
<script>
  export default{
    name: 'left-retail',
  }
</script>
