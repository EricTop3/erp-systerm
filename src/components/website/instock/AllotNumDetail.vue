<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">收货单汇总</li>
      <li class="active">查看收货单</li>
    </ol>
    <!--详情页面-->
    <summary-detail :tab-flag='tabFlag' :detail-list="detailList" :table-header="gridColumns" :table-data="list" :second-table-header='gridColumns2' :grid-operate="gridOperate" :page.sync="page"></summary-detail>
  </div>
  <!--模态框HTML-->
</template>

<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import Modal from '../../common/Modal'
  import ListValidate from '../../common/ListValidate'
  import SummaryDetail from '../../common/SummaryDetail'
  import {requestUrl, token,searchRequest,exchangeData,error } from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      ListValidate: ListValidate,
      SummaryDetail: SummaryDetail,
      SiteNav: SiteNav
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
//        this.detailListData(currentpage)
        console.log(currentpage)
      }
    },
    ready: function () {
      var str = window.location.href
      var num = str.indexOf('AllotNum') + 9
      var id = str.substr(num)
      this.id = id
//      单条数据渲染
      this.thisOneData()
//      明细列表渲染
      this.listData(1)
    },
    methods: {
//      当前id的一条数据
      thisOneData: function () {
        this.$http({
          url: requestUrl + '/front-system/stock/recipient/' + this.id,
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.list = response.data.body
          exchangeData(this.list)
        }, function (err) {
          error(err)
        })
      },
//      明细列表渲染 /front-system/stock/products/{id}/detail
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/recipient/' + this.id + '/detail',
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.detailList = response.data.body.list
        }, function (err) {
          error(err)
        })
      },
//    审核
      inventory: function () {
        this.inventoryAuditModal = true
        console.log(this.dataId)
      },
//     确认审核
      sureInventory: function () {
        console.log(this.dataId)
        this.$http.put(requestUrl + '/front-system/stock/inventory/' + this.dataId,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Overpowered-Token': token
            }
          }).then(function (response) {
          this.inventoryAuditModal = false
          this.checked = '已审核'

        }, function (err) {
          error(err)
        })
      }
    },
    data: function () {
      return {
        id: 0,
        tabFlag: true,
        page: [],
        inventoryAuditModal: false,
        inventoryAuditModalSize: 'modal-sm',
        dataId: '',
        checked: '',
        list: [],
        detailList: [],
        gridOperate: true,
        gridColumns: {
          order_number: '单号',
          checked: '审核状态',
          creator: '制单人',
          auditor: '审核人',
          date: '收货日期',
          amount: '收货数量'
        },
        gridOperate2: false,
        gridColumns2: {
          goods_code: '货号',
          goods_name: '品名',
          recipient_amount: '要货数量',
          distribution_amount: '配送数量',
          current_amount: '实际入库量',
          unit: '单位',
          unit_specification: '单位规格',
          order_source_code: '来源单号'
        },
        page3: [],
        gridOperate3: false,
        gridColumns3: {
          goods_code: '货号',
          goods_name: '品名',
          recipient_amount: '要货数量',
          distribution_amount: '配送数量',
          current_amount: '实际入库量',
          unit: '单位',
          unit_specification: '单位规格'
        }
      }
    }
  }
</script>
<style scoped>
  table thead tr th {
    text-align: center
  }

  table thead tr th:first-child {
    text-align: left;
  }

  table tbody tr td:first-child {
    text-align: left;
  }
</style>
