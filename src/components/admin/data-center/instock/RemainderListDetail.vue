<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-datacenter></left-datacenter>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb breadcrumbs">
          <li><a v-link="{ path: '/admin/dataCenter/instock/checkList'}"> 盘点单统计</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/allocateList'}"> 调拨单统计</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/requisitionList'}"> 要货单统计</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/distributionList'}"> 配送单统计</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/allList'}"> 收发存汇总表</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/remainderList'}"> 存货总账</a></li>
          <li class="active"><a v-link="{ path: '/admin/dataCenter/instock/remainderListDetail'}"> 存货明细账</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/orderSaleList'}"> 零售出库单统计</a></li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>分类</label>
              <select class="form-control" v-model="searchData.category_id">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in providerList">{{item.display_name}}</option>
              </select>
            </div>

            <div class="form-group ml10">
              <label>品名</label>
              <input type="text" class="form-control" placeholder="请输入商品名称" v-model="searchData.item_name">
            </div>
            <div class="form-group ml10">
              <label>时间段</label>
              <date-picker :value.sync="searchData.start_time" time-text=开始时间></date-picker>
              -
              <date-picker :value.sync="searchData.end_time" time-text=结束时间></date-picker>
            </div>

            <span class="btn btn-primary " @click="searchMethod(1)">搜索</span>
            <span class="btn btn-warning" @click="searchCancel()">撤销搜索</span>

            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
          </form>
        </div>

        <!-- 列表渲染表格 -->
        <table class="table table-striped table-bordered table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">分类</td>
            <td>货号</td>
            <td>品名</td>
            <td>单位</td>
            <td>单位规格</td>
            <td>期间入库数量</td>
            <td>期间入库单价</td>
            <td>期间入库金额</td>
            <td>期间出库数量</td>
            <td>期间出库单价</td>
            <td>期间出库金额</td>
            <td>即时库存数量</td>
            <td>即时库存单价</td>
            <td>即时库存金额</td>
            <td>操作类型</td>
            <td>操作时间</td>
            <td>操作人</td>
            <td>单号</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="item in listdata">
            <td class="text-left">{{item.category_name}}</td>
            <td>{{item.goods_code}}</td>
            <td>{{item.goods_name}}</td>
            <td>{{item.unit_name}}</td>
            <td>{{item.unit_specification}}</td>
            <td><template v-if="item.amount > 0">{{item.amount}}</template></td>
            <td><template v-if="item.amount > 0">{{item.price}}</template></td>
            <td><template v-if="item.amount > 0">{{item.total_sum}}</template></td>
            <td><template v-if="item.amount < 0">{{item.amount}}</template></td>
            <td><template v-if="item.amount < 0 && item.price !='0'">￥-{{item.price}}</template></td>
            <td><template v-if="item.amount < 0 && item.total_sum !='0'">￥-{{item.total_sum}}</template></td>
            <td>{{item.current_stock}}</td>
            <td>{{item.current_stock_price}}</td>
            <td>{{item.current_stock_total_sum}}</td>
            <td>{{item.operated_type}}</td>
            <td>{{item.created_at}}</td>
            <td>{{item.creator_name}}</td>
            <td>{{item.document_number}}</td>
          </tr>
          </tbody>
        </table>

        <!--翻页-->
        <page :total='page.total' :current.sync='page.current_page' :display='page.per_page' :last-page='page.last_page'
              v-if="listdata.length>0"></page>

      </div>
    </div>
  </div>
  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
</template>
<style>

</style>
<script>
  import $ from 'jquery'
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import AdminNav from '../../AdminNav'
  import Modal from '../../../common/Modal'
  import Summary from '../../../common/Summary'
  import DatePicker from  '../../../common/DatePicker'
  import ErrorTip from '../../../common/ErrorTip'
  import LeftDatacenter from '../../common/LeftDataCenters'
  import {
    requestUrl,
    requestSystemUrl,
    getDataFromApi,
    token,
    exchangeData,
    searchRequest,
    deleteRequest,
    checkRequest,
    finishRequest
  } from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      ErrorTip: ErrorTip,
      LeftDatacenter: LeftDatacenter
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getListData(currentpage)
      }
    },
    ready: function () {
//      获取列表数据
      this.getListData(1)
//      获取分类列表
      this.getProviderList()
    },
    methods: {
//      获取数据列表
      getListData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/data-center/stock/log-collect-list/details'
        var data = {
          start_time: self.searchData.start_time,
          end_time: self.searchData.end_time,
          item_name: self.searchData.item_name,
          category_id: self.searchData.category_id,
          page: page
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        }, function (err) {
        })
      },
//      获取分类列表/backend-system/product/category
      getProviderList: function () {
        var self = this
        var data = {}
        var url = requestSystemUrl + '/backend-system/product/category'
        getDataFromApi(url, data, function (response) {
          self.providerList = response.data.body.list
        })
      },
//      搜索
      searchMethod: function (page) {
        this.getListData(page)
      },
//      撤销搜索
      searchCancel: function () {
        var self = this
        self.searchData.start_time = ''
        self.searchData.end_time = ''
        self.searchData.item_name = ''
        self.searchData.category_id = ''
        this.getListData(1)
      },
//    对获取到的数据进行处理1
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          if (value.current_stock_price != '') {
            value.current_stock_price = '￥' + (value.current_stock_price * (0.01)).toFixed(2)
          }
          if (value.current_stock_total_sum != '') {
            value.current_stock_total_sum = '￥' + (value.current_stock_total_sum * (0.01)).toFixed(2)
          }
          if (value.price != '') {
            value.price = (value.price * (0.01)).toFixed(2)
          }
          if (value.total_sum != '' && value.total_sum != 0) {
            value.total_sum = (value.total_sum * (0.01)).toFixed(2)
          }
          switch (value.checked) {
            case  1:
              value.checked = '未审核'
              break
            case  2:
              value.checked = '已审核'
              break
            case  3:
              value.checked = '已完成'
              break
          }
          switch (value.operated_type) {
            case 'ProduceDocument':
              value.operated_type = '生产出库'
              break;
            case 'ProductionPutInDocument':
              value.operated_type = '生产入库'
              break;
            case 'DistributionDocument':
              value.operated_type = '配送出库'
              break;
            case 'ReceivingDocument':
              value.operated_type = '采购收货'
              break;
            case 'StoreReceivingDocument':
              value.operated_type = '门店收货'
              break;
            case 'AppointmentDistribute':
              value.operated_type = '预约单出货'
              break;
            case 'AppointmentProduce':
              value.operated_type = '预约单生产'
              break;
            case 'Sale':
              value.operated_type = '零售出库'
              break;
            case 'AllocateDocument':
              value.operated_type = '调拨出库'
              break;
            case 'CheckListDocument':
              value.operated_type = '差异处理'
              break;
            case 'PickDocument':
              value.operated_type = '领料'
              break;
          }
        })
      }
    },
    computed: {
//      导出 /backend-system/data-center/purchase/order/details
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/data-center/stock/log-collect-list'
        var data =
          'item_name=' + this.searchData.item_name + '&' +
          'category_id=' + this.searchData.category_id + '&' +
          'start_time=' + this.searchData.start_time + '&' +
          'end_time=' + this.searchData.end_time
        return this.exportUrl = url + '/export-excel/all?' + data
      }
    },
    data: function () {
      return {
        exportUrl: '',
        page: [],
        listdata: [],
        onedata: [],
        providerList: [],
        personList: [],
        gridColumns: {
          category_name: '分类',
          goods_code: '货号',
          goods_name: '品名',
          unit_name: '单位',
          unit_specification: '单位规格',
          in_stock: '期间入库数量',
          in_stock_price: '期间入库平均单价',
          in_stock_total_sum: '期间入库金额',
          out_stock: '期间出库数量',
          out_stock_price: '期间出库平均单价',
          out_stock_total_sum: '期间出库金额',
          current_stock: '即时库存',
          current_stock_price: '即时单价',
          current_stock_total_sum: '即时金额',
          operated_type: '操作类型',
          created_at: '操作时间',
          creator_name: '操作人',
          document_number: '单号'
        },
        productOperate: false,
        searchData: {
          start_time: '',
          end_time: '',
          category_id: '',
          item_name: ''
        },
        modal: {
          errModal: false,
          errInfo: ''
        }
      }
    }
  }
</script>
