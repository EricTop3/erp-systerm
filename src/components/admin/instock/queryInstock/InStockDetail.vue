<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">库存查询</li>
          <li class="active">出入库明细</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group ml10">
              <label>操作类型</label>
              <select class="form-control" v-model="search.type">
                <option value="">请选择</option>
                <option value="">零售出库</option>
                <option value="ProduceDocument">生产出库</option>
                <option value="ProductionPutInDocument">生产入库</option>
                <option value="DistributionDocument">配送出库</option>
                <option value="ReceivingDocument">采购收货</option>
                <option value="StoreReceivingDocument">门店收货</option>
                <option value="AppointmentDistribute">预约单出货</option>
                <option value="AppointmentProduce">预约单生产</option>
                <option value="">预约单收货</option>
                <option value="">调拨出库</option>
                <option value="">调拨入库</option>
                <option value="">差异处理</option>
                <option value="PickDocument-1">领料入库</option>
                <option value="PickDocument-2">领料出库</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>盘点时间段</label>
              <date-picker :value.sync="search.start_time"></date-picker>
              -
              <date-picker :value.sync="search.ned_time"></date-picker>
            </div>
            <button type="submit" class="btn btn-primary" @click="searchMethod">查询</button>
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
            <td class="text-left">{{productList1.goods_code}}</td>
            <td>{{productList1.goods_name}}</td>
            <td>{{productList1.warehouse_name}}</td>
            <td>{{productList1.start_stock}}</td>
            <td>{{productList1.in_stock}}</td>
            <td>{{productList1.out_stock}}</td>
            <td>{{productList1.current_stock}}</td>
            <td>{{productList1.unit_name}}</td>
            <td>{{productList1.unit_specification}}</td>
          </tr>
          </tbody>
        </table>

        <!-- 表格 -->
        <grid :data="productList2" :columns="gridColumns2" :operate="productOperate2"></grid>

        <!-- 翻页 -->
        <page
          :total='page.total'
          :current.sync='page.current_page'
          :display='page.per_page'
          :last-page='page.last_page' v-if="productList2.length>0">
        </page>

      </div>
    </div>
  </div>
</template>

<script>
  import AdminNav from '../../AdminNav'
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import LeftInstock from '../../common/LeftInstock'
  import DatePicker from '../../../common/DatePicker'
  import {
    requestUrl,
    requestSystemUrl,
    token,
    searchRequest,
    getDataFromApi,
    postDataToApi,
    exchangeData,
    deleteRequest
  } from '../../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      AdminNav: AdminNav,
      DatePicker: DatePicker,
      LeftInstock: LeftInstock
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        var self = this
        var currentId = this.$route.params.queryId
        this.$http({
          url: requestSystemUrl + '/backend-system/stock/log/' + currentId,
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          self.page = response.data.body.pagination
          self.productList2 = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      }
    },
    ready: function () {
      var self = this
//       获取单条详情
      var currentId = this.$route.params.queryId
      var urlOne = requestSystemUrl + '/backend-system/stock/log/' + currentId + '/detail'
      getDataFromApi(urlOne, {}, function (response) {
        self.productList1 = response.data.body
        self.modifyGetedData(self.productList1)
      })
//      获取列表数据
      this.getOneData({})
    },
    methods: {
//    对获取到de列表数据进行处理
      modifyGetedData: function (value) {
        if(value.out_stock < 0 ){
          value.out_stock = value.out_stock * (-1)
        }
      },
      getOneData: function (data) {
        var currentId = this.$route.params.queryId
        var self = this
//        获取列表详情
        var url = requestSystemUrl + '/backend-system/stock/log/' + currentId
        getDataFromApi(url, data, function (response) {
          self.productList2 = response.data.body.list
          self.page = response.data.body.pagination
          $.each(self.productList2, function (index, val) {
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
              val.out_stock = val.amount * (-1)
              if(val.operated_type == 'PickDocument'){
                val.operated_type = '领料出库'
              }
            }
            switch (val.operated_type) {
              case 'ProduceDocument':
                val.operated_type = '生产出库'
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
              case 'ProductionPutInDocument':
                val.operated_type = '生产入库'
                break;
              case 'AppointmentDistribute':
                val.operated_type = '预约单出货'
                break;
              case 'Sale':
                val.operated_type = '零售出库'
                break;
              case 'AppointmentProduce':
                val.operated_type = '预约单生产'
                break;
            }
          })
          console.log(self.productList2.in_stock)
        })
      },
//    查询
      searchMethod: function () {
        var data = {
          start_time: this.search.start_time,
          ned_time: this.search.ned_time,
          type: this.search.type
        }
        this.getOneData(data)
      },
    },
    data: function () {
      return {
        page: [],
        productList1: [],
        productOperate2: false,
        productList2: [],
        gridColumns2: {
          document_number: "单号",
          out_stock: "出库量",
          in_stock: "入库量",
          current_stock: "即时库存",
          unit_name: "单位",
          operated_type: "操作类型",
          creator_name: "操作人",
          created_at: "时间"
        },
        search: {
          start_time: '',
          ned_time: '',
          type: ''
        }
      }
    }
  }
</script>
<style scoped>
  h1 {
    color: #42b983;
  }
</style>

