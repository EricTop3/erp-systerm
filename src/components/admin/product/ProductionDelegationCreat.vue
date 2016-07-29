<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-production></left-production>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：生产首页</li>
          <li class="active">委外生产单</li>
          <li class="active">列表</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="请输入采购单号" v-model="search.code">
            </div>
            <div class="form-group ml10">
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
              <date-picker :value.sync="time.startTime"></date-picker> -
              <date-picker :value.sync="time.endTime"></date-picker>
            </div>
            <br>
            <div class="form-group ml10 mt20">
              <label>生产时间段</label>
              <date-picker :value.sync="time.startTime1"></date-picker> -
              <date-picker :value.sync="time.endTime1"></date-picker>
            </div>
            <div class="form-group mt20">
              <label>合作工厂</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <span class="btn btn-primary mt20" @click="searchMethod">搜索</span>
            <span class="btn btn-warning mt20" @click="cancelSearch">撤销搜索</span>

            <span class="btn btn-info spanblocks fr">导出excel</span>
            <span class="btn btn-info spanblocks fr mr10">新建委外生产单</span>
          </form>
        </div>

        <!-- 表格 -->
        <summary :table-data="list" :table-header="gridColumns" :page="page"></summary>

        <!-- 表格
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">生产单号</td>
            <td>审核状态</td>
            <td>合作工厂</td>
            <td>制单人</td>
            <td>审核人</td>
            <td>制单日期</td>
            <td>生产日期</td>
            <td>加工费用</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">164643138431315</td>
            <td>未审核</td>
            <td>育成食品</td>
            <td>张三</td>
            <td>无</td>
            <td>2016-6-2</td>
            <td>2016-6-2</td>
            <td>￥300.00</td>
            <td>
              <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#production-audit-templ">审核</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#production-view-templ">查看</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#production-del-templ">删除</span>
            </td>
          </tr>
          <tr class="text-center">
            <td class="text-left">164643138431315</td>
            <td>已审核</td>
            <td>张三</td>
            <td>王二小</td>
            <td>2016-6-2</td>
            <td>2016-6-3</td>
            <td>300</td>
            <td>
              <span class="btn btn-primary btn-sm" data-toggle="modal">完成</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#production-view-templ">查看</span>
            </td>
          </tr>
          </tbody>
        </table>-->

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
  import LeftProduction from '../common/LeftProduction'
  import {
    requestUrl,
    requestSystemUrl,
    getDataFromApi,
    token,
    exchangeData,
    searchRequest,
    deleteRequest,
    checkRequest,
    finishRequest,
    changeStatus } from '../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftProduction: LeftProduction
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.$http({
          url: requestUrl + '/backend-system/produce/outsource',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.list = response.data.body.list
          var self = this
          changeStatus(this.list)
        }, function (err) {
          console.log(err)
        })
      },
//     删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl + '/backend-system/produce/outsource/'+ id,function(response){
          console.log('deleted')
        })
      },
//     審核请求
      checkFromApi: function (id) {
        var self = this
        checkRequest(requestSystemUrl + '/backend-system/produce/outsource/' + id + '/checked',function(response){
          console.log('checked')
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl + '/backend-system/produce/outsource/'+ id +'/finished',function(response){
          console.log('finished')
        })
      },
//    查看详情
      gotoDetail: function (id){
//        window.location.href = '#!/admin/purchase/order/purchasedetail/'+ id
      }
    },
    ready: function () {
      var self = this
//    获取制单人
      getDataFromApi( requestUrl + '/backend-system/store/store-account',{},function(response){
        self.search.orderMaker = response.data.body.list
      })
//    获取供应商
      getDataFromApi(requestUrl + '/backend-system/provider/provider',{},function(response){
        self.search.providerList = response.data.body.list
      })
      this.listData({})
    },
    methods: {
      listData: function (data) {
        var self = this
        var url = requestUrl + '/backend-system/produce/outsource'
        getDataFromApi(url,data,function(response){
          self.list = response.data.body.list
          self.page = response.data.body.pagination
          changeStatus(self.list)
        })
      },
      searchMethod: function(){
        var data = {
          created_id: this.search.selectedMaker,
          document_number: this.search.code,
          checked: this.search.selectedStatus,
          start_time: this.time.startTime,
          provider_id: this.search.selectedSuppier,
          end_time: this.time.endTime,
          start_receive_time: this.time.startTime1,
          end_receive_time: this.time.endTime1,
        }
        this.listData(data)
      },
    },
    data: function () {
      return {
        page: [],
        list: [],
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
          terminated_at: '到货日期',
          total_sum: '采购金额'
        }
      }
    }
  }
</script>
