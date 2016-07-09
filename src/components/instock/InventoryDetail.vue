<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">盘点单汇总</li>
      <li class="active">查看盘点单</li>
    </ol>
<!--列表汇总-->
    <summary-detail :detail-list="detailList" :table-header="gridColumns" :table-data="list" :second-table-header='gridColumns2' :grid-operate="gridOperate" :page="page">
    </summary-detail>
  </div>
</template>
<script>
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import  SummaryDetail from '../common/SummaryDetail'
  import {requestUrl,token} from '../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
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
      var num = str.indexOf('Inventory') + 10
      var id = str.substr(num)
      this.id = id
//      单条数据渲染
      this.thisOneData()
//      明细列表渲染
      this.detailListData(1)
    },
    methods: {
//      当前id的一条数据
      thisOneData: function () {
        this.$http({
          url: requestUrl + '/front-system/stock/inventory/' + this.id,
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.list = response.data.body
        }, function (err) {
          console.log(err)
        })
      },
//      明细列表渲染 /front-system/stock/inventory/{id}/detail
      detailListData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/inventory/' + this.id + '/detail',
          method: 'get',
          headers: {'X-Overpowered-Token': token},
          data: {
            start_time: this.query.start_time || '',
            end_time: this.query.end_time || '',
            operation_type: this.query.operation_type || '',
            page: page,
            per_page: 10
          }
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
          order_code: '盘点单号',
          check_status: '审核状态',
          create_person: '制单人',
          check_person: '审核人',
          data: '盘点日期',
          differ_number: '差异库存量'
        },
        gridOperate2: false,
        gridColumns2: {
          goods_code: '货号',
          goods_name: '品名',
          stock_system: '系统库存量',
          stock_now: '实际库存量',
          difference_number: '差异库存量',
          unit: '单位',
          unit_specification: '单位规格'
        },
        query: {
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>
