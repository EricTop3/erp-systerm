<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2" role="navigation">
        <left-production></left-production>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：生产首页</li>
          <li class="active">领料单</li>
          <li class="active">新建</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="" style="width: 130px;"
                     v-model="searchData.document_number">
            </div>
            <div class="form-group ml10">
              <label>审核状态</label>
              <select class="form-control" v-model="searchData.checked">
                <option value="">全部</option>
                <option value="1">未审核</option>
                <option value="2">已审核</option>
                <option value="3">已完成</option>
              </select>
            </div>

            <div class="form-group ml10">
              <label>生产车间库</label>
              <select class="form-control" v-model="searchData.warehouse_id">
                <option value="">请选择</option>
                <option v-for="item in listProviderA" track-by="$index" :value="item.id">{{item.warehouses_name}}
                <option v-for="item in listProviderB" track-by="$index" :value="item.id">{{item.name}}
              </select>
            </div>
            <div class="form-group ml10">
              <label>领料单生成时间段</label>
              <date-picker :value.sync="searchData.start_time" :time-text="timetext1"
                           :timewidth="timewidth"></date-picker>
              <date-picker :value.sync="searchData.end_time" :time-text="timetext2"
                           :timewidth="timewidth"></date-picker>
            </div>
            <div class="form-group ml10">
              <label>领料日期</label>
              <date-picker :value.sync="searchData.receive_start_time" :time-text="timetext1"
                           :timewidth="timewidth"></date-picker>
              <date-picker :value.sync="searchData.receive_end_time" :time-text="timetext2"
                           :timewidth="timewidth"></date-picker>
            </div>
            <a :href=""><span class="btn btn-info spanblocks fr">导出</span></a>
            <br>
            <div class="form-group mt20">
              <label>领料工厂</label>
              <select class="form-control" v-model="searchData.target_id">
                <option value="">请选择</option>
                <option v-for="item in listProviderB" track-by="$index" :value="item.id">{{item.name}}
              </select>
            </div>
            <span class="btn btn-primary mt20" @click="getlistData(1)">搜索</span>
            <span class="btn btn-warning mt20" @click="cancelSearch()">撤销搜索</span>
          </form>
        </div>

        <!-- 表格 -->
        <summary
          :table-data="listdata"
          :table-header="gridColumns"
          :page="page"
          :check-url="checkUrl"
        >
        </summary>
      </div>
    </div>
  </div>
</template>
<style>
  .timewidth {
    width: 125px !important;
  }
</style>
<script>
  import $ from 'jquery'
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import AdminNav from '../../AdminNav'
  import Modal from '../../../common/Modal'
  import Summary from '../../../common/Summary'
  import DatePicker from  '../../../common/DatePicker'
  import LeftProduction from '../../common/LeftProduction'
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
    changeStatus
  } from '../../../../publicFunction/index'
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
        this.getlistData(currentpage)
      },
      //     删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl + '/backend-system/produce/pick/' + id, function (response) {
          self.getlistData(1)
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl + '/backend-system/produce/pick/' + id + '/finished', function (response) {
          self.getlistData(1)
        })
      },
//    查看详情
      gotoDetail: function (id) {
        window.location.href = '/#!/admin/production/getSupplies/' + id
      }
    },
    ready: function () {
      this.getlistProviderA()
      this.getlistProviderB()
      this.getlistData(1)
    },
    methods: {
//      列表数据渲染
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/produce/pick'
        var data = {
          document_number: self.searchData.document_number,
          checked: self.searchData.checked,
          warehouse_id: self.searchData.warehouse_id,
          target_id: self.searchData.target_id,
          start_time: self.searchData.start_time,
          end_time: self.searchData.end_time,
          receive_start_time: self.searchData.receive_start_time,
          receive_end_time: self.searchData.receive_end_time,
          page: page
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          exchangeData(self.listdata)
        })
      },
//      取消搜索
      cancelSearch: function () {
        this.searchData = {}
        this.getlistData(1)
      },
//      获取生产车间名称 '/backend-system/provider/provider'   '/backend-system/store/store/warehouses-list'
      getlistProviderA: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/provider/provider-minimal-list'
        getDataFromApi(url, {}, function (response) {
          self.listProviderA = response.data.body.list
        })
      },
      getlistProviderB: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/store/store/warehouses-list'
        getDataFromApi(url, {}, function (response) {
          self.listProviderB = response.data.body
        })
      }
    },
    data: function () {
      return {
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        listProviderA: [],
        listProviderB: [],
        listdata: [],
        page: [],
        checkUrl: requestSystemUrl + '/backend-system/produce/pick/',
        gridColumns: {
          document_number: '领料单号',
          checked: '审核状态',
          stream_origin: '生产车间库',
          stream_target: '领料工厂',
          auditor: '审核人',
          created_at: '领料单生成日期',
          operated_at: '领料日期'
        },
        searchData: {
          document_number: '',
          checked: '',
          warehouse_id: '',
          target_id: '',
          start_time: '',
          end_time: '',
          receive_start_time: '',
          receive_end_time: ''
        }
      }
    }
  }
</script>
