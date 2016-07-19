<template>
  <ul class="nav nav-stacked sidebar">
    <li class="active"><a v-link="{ path: '/admin/purchase'}">采购订单</a></li>
    <li><a v-link="{ path: '/admin/purchase/delivery'}">采购收货</a></li>
  </ul>
</template>
<script>
  export default{
    name: 'left-purchase',
  }
</script>
