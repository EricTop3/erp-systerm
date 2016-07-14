<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">要货汇总</li>
      <li class="active">查看要货单</li>
    </ol>
    <!--详情页面-->
    <summary-detail :detail-list="detailList" :table-header="gridColumns" :table-data="list" :second-table-header='gridColumns2' :grid-operate="gridOperate" :page.sync="page"></summary-detail>
  </div>
</template>

<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import Modal from '../common/Modal'
  import SummaryDetail from '../common/SummaryDetail'
  import {requestUrl,token,exchangeData} from '../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      SummaryDetail: SummaryDetail
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.listData(currentpage)
      }
    },
    ready: function () {
      console.log(this.list)
      var str = window.location.href
      var num = str.indexOf('GoodsApplyNum') + 14
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
          url: requestUrl + '/front-system/stock/enquiry/' + this.id,
          method: 'get',
          headers:{'X-Overpowered-Token':token}
        }).then(function (response) {
          this.list = response.data.body
          exchangeData(this.list)
        }, function (err) {
          console.log(err)
        })
      },
//      明细列表渲染 /front-system/stock/products/{id}/detail
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/enquiry/' + this.id + '/detail',
          method: 'get',
          headers:{ 'X-Overpowered-Token':token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          console.log(this.page.current_page)
          this.detailList = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      }
    },
    data: function () {
      return {
        id: 0,
        page: [],
        list: [],
        detailList: [],
        validateModal: false,
        validateFlag: false,
        validateModalSize: 'modal-sm',
        gridOperate: true,
        gridColumns: {
          order_number: '单号',
          checked: '审核状态',
          receipt_status: '单据状态',
          auditor: '制单人',
          creator: '审核人',
          created_at: '制单日期',
          delivery_date: '送货日期',
          amount: '要货数量'
        },
        gridOperate2: false,
        gridColumns2: {
          consumable_code: '货号',
          consumable_name: '品名',
          amount: '要货数量',
          unit: '单位',
          unit_specification: '单位规格'
        }
      }
    }
  }
</script>
