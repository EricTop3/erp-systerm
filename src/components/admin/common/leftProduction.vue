<template>
  <ul class="nav nav-stacked sidebar">
    <li class="active"><a v-link="{ path: '/admin/production/factoryCreat'}">工厂生产单</a></li>
    <li><a v-link="{ path: '/admin/production/delegationCreat'}">委外生产单</a></li>
    <li><a v-link="{ path: '/admin/production/getSupplies'}">领料单</a></li>
    <li><a v-link="{ path: '/admin/production/creatInstock'}">生产入库单</a></li>
    <li><a v-link="{ path: '/admin/production/delegationInstock'}">委外生产入库单</a></li>
    <li><a v-link="{ path: '/admin/production/creatOrder'}">生产预约单</a></li>
  </ul>
</template>
<script>
  export default{
    name: 'left-production',
  }
</script>
