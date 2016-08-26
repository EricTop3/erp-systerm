<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">库存查询</li>
      <li class="active">出入库明细查询</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline text-center">
        <div class="form-group ml10">
          <label>操作类型</label>
          <select class="form-control" v-model="search.operation_type">
            <option value="">请选择</option>
            <option value="Sale">零售出库</option>
            <option value="ProduceDocument">生产出库</option>
            <option value="ProductionPutInDocument">生产入库</option>
            <option value="DistributionDocument">配送出库</option>
            <option value="ReceivingDocument">采购收货</option>
            <option value="StoreReceivingDocument">门店收货</option>
            <option value="AppointmentDistribute">预约单出货</option>
            <option value="AppointmentProduce">预约单生产出库</option>
            <option value="">预约单收货</option>
            <option value="AllocateDocument">调拨出库</option>
            <option value="">调拨入库</option>
            <option value="CheckListDocument">差异处理</option>
            <option value="PickDocument-1">领料入库</option>
            <option value="PickDocument-2">领料出库</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>盘点时间段</label>
          <date-picker :value.sync="search.start_time" :time-text='timetext1'></date-picker>-
          <date-picker :value.sync="search.end_time" :time-text='timetext2'></date-picker>
        </div>
        <span class="btn btn-primary" @click="searchMethod(1)">查询</span>
      </form>
    </div>

    <!-- 表格 -->
    <table class="table table-striped table-border table-hover">
      <thead>
      <tr class="text-center">
        <td class="text-left">货号</td>
        <td>品名</td>
        <td>仓库</td>
        <td>期初库存量</td>
        <td>期间入库量</td>
        <td>期间出库量</td>
        <td>期末库存量</td>
        <td>单位</td>
        <td>单位规格</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center">
        <td class="text-left">{{list.goods_code}}</td>
        <td>{{list.goods_name}}</td>
        <td>{{list.warehouse_name}}</td>
        <td>{{list.start_stock}}</td>
        <td>{{list.in_stock}}</td>
        <td>{{list.out_stock}}</td>
        <td>{{list.current_stock}}</td>
        <td>{{list.unit_name}}</td>
        <td>{{list.unit_specification}}</td>
      </tr>
      </tbody>
    </table>

    <!-- 表格 详情列表 -->
    <grid :data="detailList" :columns="gridColumns2" :operate="gridOperate2"></grid>

    <!--分页-->
    <page :total="page.total" :current.sync="page.current_page" :display="page.per_page" :last-page="page.last_page" v-if="detailList.length>0"></page>
  </div>
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import DatePicker from '../../common/DatePicker'
  import {
    searchRequest,
    token,
    getDataFromSiteApi,
    requestSystemUrl,
    error } from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      DatePicker: DatePicker,
      SiteNav: SiteNav
    },
    ready: function () {
      this.id = this.$route.params.queryId
//      单条数据渲染
      this.thisOneData({})
//      明细列表渲染
      this.detailListData({})
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.searchMethod(currentpage)
      }
    },
    methods: {
//      当前id的一条数据
      thisOneData: function (data) {
        var self = this
        var url = requestSystemUrl + '/front-system/stock/log/' + self.id + '/detail'
        getDataFromSiteApi(url, data, function (response) {
          self.list = response.data.body
        })
      },
//      明细列表渲染
      detailListData: function (data) {
        var self = this
        var url = requestSystemUrl + '/front-system/stock/log/' + self.id
        getDataFromSiteApi(url, data, function (response) {
          self.detailList = response.data.body.list
          self.page = response.data.body.pagination
          $.each(self.detailList, function (index, val) {
            val.in_stock = ''
            val.out_stock = ''
            if (val.amount > 0) {
              val.in_stock = val.amount
              val.out_stock = 0
              if(val.operated_type == 'PickDocument'){
                val.operated_type = '领料入库'
              }
            } else {
              val.in_stock = 0
              val.out_stock = val.amount*(-1)
              if(val.operated_type == 'PickDocument'){
                val.operated_type = '领料出库'
              }
            }
            switch(val.operated_type){
              case 'ProduceDocument':
                val.operated_type = '生产出库'
                break;
              case 'ProductionPutInDocument':
                val.operated_type = '生产入库'
                break;
              case 'DistributionDocument':
                val.operated_type = '配送出库'
                break;
              case 'ReceivingDocument':
                val.operated_type = '采购收货'
                break;
              case 'StoreReceivingDocument':
                val.operated_type = '门店收货'
                break;
              case 'AppointmentDistribute':
              val.operated_type = '预约单出货'
              break;
              case 'AppointmentProduce':
                val.operated_type = '预约单生产'
                break;
              case 'Sale':
                val.operated_type = '零售出库'
                break;
              case 'AllocateDocument':
                val.operated_type = '调拨出库'
                break;
              case 'CheckListDocument':
                val.operated_type = '差异处理'
                break;
            }
          })
        })
      },
//    查询
      searchMethod: function (page) {
        var data = {
          start_time: this.search.start_time || '',
          end_time: this.search.end_time || '',
          type: this.search.operation_type,
          page: page
        }
        this.detailListData(data)
      }
    },
    data: function () {
      return {
        timetext1: '开始时间',
        timetext2: '结束时间',
        id: '',
        page: [],
        list: [],
        detailList: [],
        gridOperate2: false,
        gridColumns2: {
          created_at: '时间',
          out_stock: '出库量',
          in_stock: '入库量',
          current_stock: '即时库存',
          unit_name: '单位',
          operated_type: '操作类型',
          creator_name: '操作人',
          document_number: '单号'
        },
        search: {
          start_time: '',
          end_time: '',
          operation_type: ''
        }
      }
    }
  }
</script>
