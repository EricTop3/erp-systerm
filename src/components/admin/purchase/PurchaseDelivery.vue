<template>
  <admin-nav></admin-nav>
  <left-purchase></left-purchase>
  <h2>this is retail body</h2>
</template>
<style>
</style>
<script>
  import AdminNav from '../AdminNav'
  import LeftPurchase from '../common/LeftPurchase'
  export default{
    components:{
      AdminNav: AdminNav,
      LeftPurchase: LeftPurchase
    }
  }
</script>
