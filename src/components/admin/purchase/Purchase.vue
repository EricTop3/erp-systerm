<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-purchase></left-purchase>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
          <li class="active">采购订单</li>
          <li class="active">列表</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="请输入采购单号" v-model="search.code">
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
              <label>制单时间段</label>
              <date-picker :value.sync="time.startTime" time-text=开始时间></date-picker> -
              <date-picker :value.sync="time.endTime"  time-text=结束时间></date-picker>
            </div>
            <div class="form-group ml10">
              <label>供应商</label>
              <select class="form-control" v-model="search.selectedSuppier">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in search.providerList">{{item.name}}</option>
              </select>
            </div>
            <span type="submit" class="btn btn-primary " @click="searchMethod(1)">搜索</span>
            <span class="btn btn-warning" @click="cancelSearch">撤销搜索</span>
            <a v-link="{path: '/admin/purchase/order/createNewPurchase'}" class="btn btn-info spanblocks fr" v-if="authority.create">新建采购单</a>
            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10" v-if="authority.export">导出</span></a>
          </form>
        </div>
        <!-- 表格 -->
        <summary
          :table-data="list"
          :table-header="gridColumns"
          :page="page"
          :check-url="checkUrl"
          :finish-url = "checkUrl"
          :finish-flag = "true"
          :has-validate-authority="authority.validate"
          :has-look-authority = "authority.look"
          :has-finish-authority="authority.finish"
          :has-delete-authority= "authority.delete"
        >
        </summary>
      </div>
    </div>
  </div>

</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import AdminNav from '../AdminNav'
  import Modal from '../../common/Modal'
  import Summary from '../../common/Summary'
  import DatePicker from  '../../common/DatePicker'
  import LeftPurchase from '../common/LeftPurchase'
  import {requestUrl,requestSystemUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest,systermAuthority} from '../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftPurchase: LeftPurchase
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.searchMethod(currentpage)
      },
//     删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl + '/backend-system/purchase/purchase/'+ id,function(response){
          self.listData({})
        })
      },
//    查看详情
      gotoDetail: function (id){
        window.location.href = '#!/admin/purchase/order/purchasedetail/'+ id
      }
    },
    ready: function () {
      var self = this
//    获取制单人
      getDataFromApi( requestUrl + '/backend-system/store/get/account',{},function(response){
        self.search.orderMaker = response.data.body.list
      })
//    获取合作工厂
      getDataFromApi(requestUrl + '/backend-system/provider/get/provider',{},function(response){
        self.search.providerList = response.data.body.list
      })
      this.listData({})
//    权限判断隐藏
      if(systermAuthority.indexOf('purchase-order-list-index') > -1){
        this.authority.look = true
      }
      if(systermAuthority.indexOf('purchase-order-list-check') > -1){
        this.authority.validate = true
      }
      if(systermAuthority.indexOf('purchase-order-list-over')  > -1){
        this.authority.finish = true
      }
      if(systermAuthority.indexOf('purchase-order-list-delete') > -1){
        this.authority.delete = true
      }
      if(systermAuthority.indexOf('purchase-order-list-create') > -1){
        this.authority.create = true
      }
      if(systermAuthority.indexOf('purchase-order-list-export') > -1){
        this.authority.export = true
      }
    },
    methods: {
      listData: function (data) {
        var self = this
        var url = requestUrl + '/backend-system/purchase/purchase'
        getDataFromApi(url,data,function(response){
          self.list = response.data.body.list
          self.page = response.data.body.pagination
          exchangeData(self.list)
        })
      },
      searchMethod: function(page){
        var data = {
          creator_id: this.search.selectedMaker,
          document_number: this.search.code,
          checked: this.search.selectedStatus,
          start_time: this.time.startTime,
          provider_id: this.search.selectedSuppier,
          end_time: this.time.endTime,
          page: page
        }
        this.listData(data)
      },
      cancelSearch: function () {
        this.listData({})
        this.search.selectedMaker = ''
        this.search.code = ''
        this.search.selectedStatus = ''
        this.time.startTime = ''
        this.search.selectedSuppier = ''
        this.time.endTime = ''
        this.time.startTime1= ''
        this.time.endTime1 = ''
      }
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/purchase/purchase'
        var data =
          'creator_id=' + this.search.selectedMaker + '&' +
          'document_number=' + this.search.code + '&' +
          'checked=' + this.search.selectedStatus + '&' +
          'start_time=' + this.time.startTime + '&' +
          'provider_id=' + this.search.selectedSuppier + '&' +
          'end_time=' + this.time.endTime + '&' +
          'start_receive_time=' + this.time.startTime1 + '&' +
          'end_receive_time=' + this.time.endTime1
        return this.exportUrl = url + '/export-excel?' + data
      }
    },
    data: function () {
      return {
        exportUrl: '',
        page: [],
        list: [],
        checkUrl: requestSystemUrl + '/backend-system/purchase/purchase/',
        authority: {
          create: false,
          export: false,
          validate: false,
          look: false,
          finish: false,
          delete: false
        },
        time:{
          startTime:'',
          startTime1:'',
          endTime:'',
          endTime1:'',
        },
        search: {
          selectedStatus: '',
          selectedMaker: '',
          selectedSuppier: '',
          code: '',
          orderMaker: [],
          providerList: [],
        },
        gridColumns: {
          document_number: '采购单号',
          checked: '状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          provider_name: '供应商',
          created_at: '制单日期',
          total_sum: '采购金额'
        }
      }
    }
  }
</script>
