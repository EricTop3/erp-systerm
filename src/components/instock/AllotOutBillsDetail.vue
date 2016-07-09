<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">收货单汇总</li>
      <li class="active">查看收货单汇总</li>
    </ol>
    <summary-detail :detail-list="detailList" :table-header="gridColumns" :table-data="list" :second-table-header='gridColumns2' :grid-operate="gridOperate" :page="page">
    </summary-detail>
  </div>
</template>
<script>
  import SummaryDetail from '../common/SummaryDetail'
  import {requestUrl} from '../../publicFunction/index'
  export default {
    components: {
      SummaryDetail: SummaryDetail
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
      var num = str.indexOf('AllotOutBills') + 14
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
          url: requestUrl + '/front-system/stock/issue/' + this.id,
          method: 'get'
        }).then(function (response) {
          this.list = response.data.body
        }, function (err) {
          console.log(err)
        })
      },
//      明细列表渲染 /front-system/stock/products/{id}/detail
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/issue/' + this.id + '/detail',
          method: 'get'
        }).then(function (response) {
          this.page = response.data.body.pagination
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
        gridOperate: true,
        gridColumns: {
          order_code: '单号',
          check_status: '审核状态',
          receipts_store: '收货仓库',
          create_person: '制单人',
          check_person: '审核人',
          date: '出货日期',
          number: '要货数量'
        },
        gridOperate2: false,
        gridColumns2: {
          goods_code: '货号',
          goods_name: '品名',
          number: '出货数量',
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

