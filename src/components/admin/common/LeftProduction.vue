<template>
  <div class="col-lg-2" role="navigation">
    <ul class="nav nav-stacked sidebar">
      <li><a v-link="{ path: '/admin/production'}">工厂生产单</a></li>
      <li><a v-link="{ path: '/admin/production/delegationCreat'}">委外生产单</a></li>
      <li><a v-link="{ path: '/admin/production/getSupplies'}">领料单</a></li>
      <li><a v-link="{ path: '/admin/production/factoryInstock'}">生产入库单</a></li>
      <li><a v-link="{ path: '/admin/production/delegationInstock'}">委外生产入库单</a></li>
      <li><a v-link="{ path: '/admin/production/creatOrder'}">生产预约单</a></li>
    </ul>
  </div>
</template>
<script>
  export default{
    name: 'left-production',
  }
</script>
<style scoped>
  a.active{
    color: #f96062;
    background-color: #fff;
  }
</style>
