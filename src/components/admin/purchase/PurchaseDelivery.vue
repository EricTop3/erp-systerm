<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-purchase></left-purchase>
        <div class="col-lg-10">
          <!-- 路径导航 -->
          <ol class="breadcrumb">
            <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
            <li class="active">采购收货</li>
            <li class="active">列表</li>
          </ol>
          <!-- 页头 -->
          <div class="page-header">
            <form class="form-inline">
              <div class="form-group">
                <label>单号</label>
                <input type="text" class="form-control" placeholder="请输入单号" v-model="search.code">
              </div>
              <div class="form-group  ml10">
                <label>审核状态</label>
                <select class="form-control" v-model="search.selectedStatus">
                  <option value="">请选择</option>
                  <option value="0">未审核</option>
                  <option value="1">已审核</option>
                </select>
              </div>
              <div class="form-group ml10">
                <label>制单人</label>
                <select class="form-control" v-model="search.selectedMaker">
                  <option value="">请选择</option>
                  <option :value="item.id" v-for="item in search.orderMaker" >{{item.name}}</option>
                </select>
              </div>
              <div class="form-group ml10">
                <label>收货时间段</label>
                <date-picker :value.sync="time.startTime" :time-text="timetext1"></date-picker> -
                <date-picker :value.sync="time.endTime" :time-text="timetext2"></date-picker>
              </div><br>
              <div class="form-group ml10 mt10">
                <label>供应商</label>
                <select class="form-control" v-model="search.selectedSuppier">
                  <option value="">请选择</option>
                  <option :value="item.id" v-for="item in search.providerList">{{item.name}}</option>
                </select>
              </div>
              <div class="form-group ml10 mt10">
                <label>收货仓库</label>
                <select class="form-control" v-model="search.stream_origin_id">
                  <option value="">请选择</option>
                  <option :value="item.id" v-for="item in warehouseList">{{item.name}}</option>
                </select>
              </div>
              <span type="submit" class="btn btn-primary mt10" @click="searchMethod(1)">搜索</span>
              <span class="btn btn-warning mt10" @click="cancelSearch">撤销搜索</span>
              <a v-link="{ path: '/admin/purchase/delivery/createNewDelivery'}"  class="btn btn-info spanblocks fr mt10">新建收货单</a>
              <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10 mt10">导出</span></a>
            </form>
          </div>

          <!--表格 -->
          <summary
            :table-header="gridColumns"
            :table-data="list"
            :page.sync= "page"
            :check-url ="checkUrl"
          >
          </summary>
        </div>
    </div>
    </div>
</template>
<style>
</style>
<script>
  import AdminNav from '../AdminNav'
  import LeftPurchase from '../common/LeftPurchase'
  import Summary from '../../common/Summary'
  import DatePicker from '../../common/DatePicker'
  import {requestSystemUrl,requestUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest,changeStatus} from '../../../publicFunction/index'
  export default{
    components:{
      AdminNav: AdminNav,
      LeftPurchase: LeftPurchase,
      Summary: Summary,
      DatePicker: DatePicker
    },
    ready: function (){
      var self = this
//         获取制单人
      getDataFromApi( requestUrl + '/backend-system/store/account',{},function(response){
        self.search.orderMaker = response.data.body.list
      })
//    获取供应商
      getDataFromApi(requestUrl + '/backend-system/provider/provider',{},function(response){
        self.search.providerList = response.data.body.list
      })
//      获取仓库列表
      getDataFromApi(requestSystemUrl + '/backend-system/warehouse-minimal-list',{},function(response){
        self.warehouseList = response.data.body.list
      })
      this.fetlistFormApi({})
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/purchase/receive'
        var data =
          'document_number=' + this.search.code + '&' +
          'checked=' + this.search.selectedStatus + '&' +
          'created_id=' + this.search.selectedMaker + '&' +
          'start_receive_time=' + this.time.startTime + '&' +
          'end_receive_time=' + this.time.endTime + '&' +
          'provider_id=' + this.search.selectedSuppier + '&' +
          'warehouse_id=' + this.search.stream_origin_id
        return this.exportUrl = url + '/export-excel?' + data
      }
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.searchMethod(currentpage)
      },
//     删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl + '/backend-system/purchase/receive/'+ id,function(response){
          self.fetlistFormApi({})
        })
      },
//    查看详情
      gotoDetail: function (id){
        window.location.href = '/#!/admin/purchase/delivery/deliverydetail/'+ id
      }
    },
    data: function () {
      return {
        timetext1: '开始时间',
        timetext2: '结束时间',
        warehouseList: [],
        gridColumns: {
          "document_number": "收货单号",
          "checked": "审核状态",
          "creator_name": "制单人",
          "auditor_name": "审核人",
          "warehouse": "收货仓库",
          "provider_name": "供应商",
          "operated_at": "收货日期",
          "actual_amount": "实际入库量",
          "purchase_amount": '采购数量',
          "refund_amount": '退货数量'
        },
        list: [],
        checkUrl: requestSystemUrl + '/backend-system/purchase/receive/',
        time:{
          startTime:'',
          endTime:'',
        },
        search: {
          selectedStatus: '',
          selectedMaker: '',
          selectedSuppier: '',
          stream_origin_id: '',
          alotStock: [],
          code: '',
          orderMaker: [],
          providerList: [],
        },
        page: {},
      }
    },
    methods:  {
      fetlistFormApi: function (data){
        var url = requestSystemUrl +  '/backend-system/purchase/receive'
        var self = this
        getDataFromApi(url,data,function(response){
          self.list = response.data.body.list
          changeStatus(self.list)
          self.page = response.data.body.pagination
        })
      },
      searchMethod: function (page) {
        var data = {
          creator_id: this.search.selectedMaker,
          document_number: this.search.code,
          checked: this.search.selectedStatus,
          provider_id: this.search.selectedSuppier,
          start_receive_time: this.time.startTime,
          end_receive_time: this.time.endTime,
          warehouse_id: this.search.stream_origin_id,
          page: page
        }
        this.fetlistFormApi(data)
      },
      cancelSearch: function () {
        this.fetlistFormApi({})
        this.search.selectedMaker  = ''
        this.search.code = ''
        this.search.selectedStatus = ''
        this.search.selectedSuppier = ''
        this.time.startTime = ''
        this.search.stream_origin_id = ''
      }
    }
  }
</script>
