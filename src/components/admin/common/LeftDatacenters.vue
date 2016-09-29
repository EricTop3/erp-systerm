<template>
  <div class="col-lg-2"  role="navigation" style="padding:0;">
    <ul class="nav nav-stacked sidebar">
      <li><a v-link="{ path: '/admin/dataCenter/purchase'}">采购</a></li>
      <li><a v-link="{ path: '/admin/dataCenter/instock'}">库存</a></li>
      <li><a v-link="{ path: '/admin/dataCenter/production'}">生产</a></li>
      <li><a v-link="{ path: '/admin/dataCenter/sale'}">零售</a></li>
      <li><a v-link="{ path: '/admin/dataCenter/member'}">会员</a></li>
    </ul>
  </div>
</template>
<script>
//  import {systermAuthority} from '../../../publicFunction/index'
  export default{
    name: 'left-datacenter'
  }
</script>
<style scoped>
  a.active{
    color: #f96062;
    background-color: #fff;
  }
</style>
