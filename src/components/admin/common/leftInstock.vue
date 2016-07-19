<template>
  <ul class="nav nav-stacked sidebar">
    <li class="active"><a v-link="{ path: '/admin/instock'}">库存查询</a></li>
    <li><a v-link="{ path: '/admin/instock/inventory'}">库存盘点</a></li>
    <li><a v-link="{ path: '/admin/instock/difference'}">差异汇总</a></li>
    <li><a v-link="{ path: '/admin/instock/dispatching'}">库存配送出库</a></li>
    <li><a v-link="{ path: '/admin/instock/sale'}">销售出库</a></li>
    <li><a v-link="{ path: '/admin/instock/production'}">生产出库</a></li>
    <li><a v-link="{ path: '/admin/instock/apply'}">要货汇总</a></li>
  </ul>
</template>
<script>
  export default{
    name: 'left-instock',
  }
</script>
