<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：结算首页</li>
      <li class="active">结算历史</li>
    </ol>
    <div class="repertory-home">
      <div class="repertory-box">
        <div class="repertory-item itemPosition1 text-center">
          <a v-link="{path: '/site/instock/GoodsApply'}"><img src="/static/assets/images/icon-1.png" alt="要货申请单"></a>
          <h4>要货申请单</h4>
          <div class="repertory-arrow position-horizontal"></div>
        </div>
        <div class="repertory-item itemPosition2 text-center">
          <a v-link="{path: '/site/instock/GoodsApplyNum'}"><img src="/static/assets/images/icon-2.png" alt="要货单汇总"></a>
          <h4>要货单汇总</h4>
          <div class="repertory-arrow position-horizontal rotate-rightBottom"></div>
        </div>
        <div class="repertory-item itemPosition3 text-center">
          <a v-link="{path: '/site/instock/Allot'}"><img src="/static/assets/images/icon-3.png" alt="调拨收货单"></a>
          <h4>收货单</h4>
          <div class="repertory-arrow position-horizontal"></div>
        </div>
        <div class="repertory-item itemPosition4 text-center">
          <a v-link="{path: '/site/instock/AllotNum'}"><img src="/static/assets/images/icon-4.png" alt="调拨收货单汇总"></a>
          <h4>收货单汇总</h4>
          <div class="repertory-arrow position-horizontal"></div>
        </div>
        <div class="repertory-item itemPosition5 text-center">
          <a v-link="{path: '/site/instock/Differences'}"><img src="/static/assets/images/icon-5.png" alt="盘点差异汇总"></a>
          <h4>盘点差异汇总</h4>
          <div class="repertory-arrow position-horizontal rotate-rightTop"></div>
        </div>
        <div class="repertory-item itemPosition6 text-center">
          <a v-link="{path: '/site/instock/Inventory'}"><img src="/static/assets/images/icon-6.png" alt="库存盘点"></a>
          <h4>库存盘点</h4>
          <div class="repertory-arrow position-horizontal"></div>
        </div>
        <div class="repertory-item itemPosition7 text-center">
          <a v-link="{path: '/site/instock/InventoryQuery'}"><img src="/static/assets/images/icon-7.png" alt="库存查询"></a>
          <h4>库存查询</h4>
          <div class="repertory-arrow position-horizontal"></div>
        </div>
        <div class="repertory-item itemPosition8 text-center">
          <a v-link="{path: '/site/instock/ProductionOutBills'}"><img src="/static/assets/images/icon-8.png" alt="生产出库汇总"></a>
          <h4>生产出库汇总</h4>
          <div class="repertory-arrow position-horizontal rotate-rightBottom"></div>
        </div>
        <div class="repertory-item itemPosition9 text-center">
          <a v-link="{path: '/site/instock/AllotOutBills'}"><img src="/static/assets/images/icon-9.png" alt="调拨出库汇总"></a>
          <h4>调拨出库汇总</h4>
          <div class="repertory-arrow position-horizontal"></div>
        </div>
        <div class="repertory-item itemPosition10 text-center">
          <a v-link="{path: '/site/instock/SaleOutBills'}"><img src="/static/assets/images/icon-10.png" alt="销售出库汇总"></a>
          <h4>销售出库汇总</h4>
          <div class="repertory-arrow position-horizontal rotate-rightTop"></div>
        </div>
        <div class="repertory-item itemPosition11 text-center">
          <a v-link="{path: '/site/instock/AllotOut'}"><img src="/static/assets/images/icon-11.png" alt="调拨出库单"></a>
          <h4>调拨出库单</h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import AdminNav from '../AdminNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      AdminNav: AdminNav
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
//        this.detailListData(currentpage)
        console.log(currentpage)
      }
    },
    ready: function () {
    },
    methods: {},
    data: function () {
      return {}
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }
</style>

