<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">销售出库汇总</li>
      <li class="active">销售出库明细</li>
    </ol>

    <!-- 表格 单条数据 -->
    <grid :data="list" :columns="gridColumns" :operate="gridOperate">
      <div slot="operateList"></div>
    </grid>

    <!-- 表格 详情列表 -->
    <grid :data="detailList" :columns="gridColumns2" :operate="gridOperate2"></grid>

    <!-- 翻页 -->
    <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
          :last-page="page.last_page"></page>

  </div>
</template>
<script>
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import {requestUrl,token} from '../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.detailListData(currentpage)
//        console.log(currentpage)
      }
    },
    ready: function () {
      var str = window.location.href
      var num = str.indexOf('SaleOutBills') + 13
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
          url: requestUrl + '/front-system/stock/sale/' + this.id,
          method: 'get'
        }).then(function (response) {
          this.list = response.data.body
        }, function (err) {
          console.log(err)
        })
      },
//      明细列表渲染 /front-system/stock/sale/{id}/detail
      detailListData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/sale/' + this.id + '/detail',
          method: 'get',
          data: {
            start_time: this.query.start_time || '',
            end_time: this.query.end_time || '',
            operation_type: this.query.operation_type || '',
            page: page,
            per_page: 10
          },
          headers: {'X-Overpowered-Token': token}
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
          order_code: '货号',
          order_name: '品名',
          sale_number: '零售出库量',
          unit: '零售单位',
          unit_specification: '单位规格',
          category: '商品分类'
        },
        gridOperate2: false,
        gridColumns2: {
          created_at: '时间',
          goods_name: '品名',
          sale_number: '零售出库量',
          unit: '零售单位',
          operator: '操作人',
          order_code: '盘点单号'
        },
        query: {
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>
