<template>
  <div class="col-lg-2" role="navigation">
    <ul class="nav nav-stacked sidebar">
      <li><a v-link="{ path: '/admin/instock',exact: true}">库存查询</a></li>
      <li><a v-link="{ path: '/admin/instock/inventory',exact: true}">库存盘点</a></li>
      <li><a v-link="{ path: '/admin/instock/difference',exact: true}">差异汇总</a></li>
      <li><a v-link="{ path: '/admin/instock/dispatching',exact: true}">库存配送出库</a></li>
      <li><a v-link="{ path: '/admin/instock/sale',exact: true}">销售出库</a></li>
      <li><a v-link="{ path: '/admin/instock/production',exact: true}">生产出库</a></li>
      <li><a v-link="{ path: '/admin/instock/apply',exact: true}">要货汇总</a></li>
    </ul>
  </div>
</template>
<script>
  export default{
    name: 'left-instock',
  }
</script>
<style scoped>
  a.active{
    color: #f96062;
    background-color: #fff;
  }
</style>

