<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-datacenter></left-datacenter>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb breadcrumbs">
          <li><a v-link="{ path: '/admin/dataCenter/purchase/orderStatistics'}"> 采购订单统计</a></li>
          <li class="active"><a v-link="{ path: '/admin/dataCenter/purchase/receivingStatistics'}"> 采购收货单统计</a></li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>供应商</label>
              <select class="form-control" v-model="searchData.provider_id">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in providerList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group  ml10">
              <label>货号</label>
              <input type="text" class="form-control" placeholder="请输入货号" v-model="searchData.item_code">
            </div>
            <div class="form-group  ml10">
              <label>品名</label>
              <input type="text" class="form-control" placeholder="请输入商品名称" v-model="searchData.item_name">
            </div>
            <div class="form-group ml10">
              <label>时间段</label>
              <date-picker :value.sync="searchData.start_time" time-text=开始时间></date-picker> -
              <date-picker :value.sync="searchData.end_time"  time-text=结束时间></date-picker>
            </div>
            <span class="btn btn-primary " @click="searchMethod(1)">搜索</span>
            <span class="btn btn-warning" @click="searchCancel()">撤销搜索</span>

            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
            <a v-link="{ path: '/admin/dataCenter/purchase/receivingStatistics/detail'}" class="btn btn-primary spanblocks fr mr10">明细</a>
          </form>
        </div>

        <!-- 统计表格 -->
        <table class="table table-striped table-border table-hover mt20" :data="onedata">
          <tbody>
          <tr>
            <td><span class="pr50">收货数量汇总：{{onedata.demand_amount}}</span> <span class="pr50">采购金额汇总：{{onedata.demand_price}}</span></td>
          </tr>
          </tbody>
        </table>

        <!-- 列表渲染表格 -->
        <grid :data="listdata" :columns="gridColumns" :operate="productOperate"></grid>

        <!--翻页-->
        <page :total='page.total' :current.sync='page.current_page' :display='page.per_page' :last-page='page.last_page' v-if="listdata.length>0"></page>

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
  import {requestUrl,requestSystemUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest} from '../../../../publicFunction/index'
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
//      获取单条汇总数据
      this.getOneData(1)
//      获取供应商列表
      this.getProviderList()
    },
    methods: {
//      获取数据列表
      getListData: function(page){
        var self = this
        var url = requestSystemUrl + '/backend-system/data-center/purchase/receiving'
        var data = {
          start_time: self.searchData.start_time,
          end_time: self.searchData.end_time,
          item_code: self.searchData.item_code,
          item_name: self.searchData.item_name,
          provider_id: self.searchData.provider_id,
          page: page
        }
        getDataFromApi(url,data,function(response){
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        },function(err){})
      },
//      获取单条数据
      getOneData: function(page){
        var self = this
        var url = requestSystemUrl + '/backend-system/data-center/purchase/receiving/total'
        var data = {
          start_time: self.searchData.start_time,
          end_time: self.searchData.end_time,
          item_code: self.searchData.item_code,
          item_name: self.searchData.item_name,
          provider_id: self.searchData.provider_id
        }
        getDataFromApi(url,data,function(response){
          self.onedata = response.data.body.list
          self.onedata.demand_price ='￥' +  (self.onedata.demand_price * 0.01).toFixed(2)
        },function(err){})
      },
//      获取供应商列表
      getProviderList: function(){
        var self = this
        var data = {}
        var url = requestSystemUrl + '/backend-system/provider/provider'
        getDataFromApi(url,data,function(response){
          self.providerList = response.data.body.list
        })
      },
//      搜索
      searchMethod: function(page){
        this.getListData(page)
        this.getOneData()
      },
//      撤销搜索
      searchCancel: function(){
        var self = this
        self.searchData.start_time = ''
        self.searchData.end_time = ''
        self.searchData.item_code = ''
        self.searchData.item_name = ''
        self.searchData.provider_id = ''
        this.getListData(1)
        this.getOneData()
      },
//    对获取到的数据进行处理1
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          if (value.unit_price != '') {
            value.unit_price = '￥' + (value.unit_price * (0.01)).toFixed(2)
          }
          if (value.price != '') {
            value.price = '￥' + (value.price * (0.01)).toFixed(2)
          }
        })
      }
    },
    computed: {
//      导出 /backend-system/data-center/purchase/order
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/data-center/purchase/receiving'
        var data =
          'item_name=' + this.searchData.item_name + '&' +
          'item_code=' + this.searchData.item_code + '&' +
          'provider_id=' + this.searchData.provider_id + '&' +
          'start_time=' + this.searchData.start_time + '&' +
          'end_time=' + this.searchData.end_time
        return this.exportUrl = url + '/export-excel?' + data
      }
    },
    data: function () {
      return {
        exportUrl: '',
        page: [],
        listdata: [],
        onedata: [],
        providerList: [],
        gridColumns: {
          warehouse: '仓库',
          provider_name: '供应商',
          item_code: '货号',
          item_name: '品名',
          unit_name: '单位',
          unit_specification: '单位规格',
          amount: '实际入库量',
          unit_price: '单价',
          price: '金额'
        },
        productOperate: false,
        searchData: {
          start_time: '',
          end_time: '',
          provider_id: '',
          item_code: '',
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
