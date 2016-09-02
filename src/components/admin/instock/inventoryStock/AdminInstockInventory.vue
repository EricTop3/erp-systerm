<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">库存盘点</li>
          <li class="active">列表</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>仓库</label>
              <select class="form-control" v-model="search.selectedHouse">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in search.warehouseList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="请输入单号" v-model="search.code">
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
                <option :value="item.id" v-for="item in search.orderMaker">{{item.name}}</option>
                <option :value="item.id" v-for="item in storeAccountData">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>盘点时间段</label>
              <date-picker :value.sync="search.startTime" :time-text="timetext1"></date-picker>
              -
              <date-picker :value.sync="search.endTime" :time-text="timetext2"></date-picker>
            </div>

            <span class="btn btn-primary" @click="searchMethod">搜索</span>
            <span class="btn btn-warning" @click="cancelSearch">撤销搜索</span>

            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
            <span v-link="{ path:'/admin/instock/inventory/create' }"
                  class="btn btn-info spanblocks fr mr10">新建盘点单</span>
          </form>
        </div>
        <!-- 表格 -->
        <summary
          :table-data="list"
          :table-header="gridColumns"
          :page="page"
          :check-url="checkUrl">
        </summary>
      </div>
    </div>
  </div>
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
  import LeftInstock from '../../common/LeftInstock'
  import {
    requestSystemUrl,
    getDataFromApi,
    token,
    deleteRequest,
    changeStatus
  } from '../../../../publicFunction/index'
  export default{
    components: {
      LeftInstock: LeftInstock,
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker
    },
    ready: function () {
      var self = this
//    获取仓库列表
      var url = requestSystemUrl + '/backend-system/warehouse-minimal-list'
      getDataFromApi(url, {}, function (response) {
        self.search.warehouseList = response.data.body.list
      })
//    获取制单人(后台管理员)
      var makUrl = requestSystemUrl + '/backend-system/store/account'
      getDataFromApi(makUrl, {}, function (response) {
        self.search.orderMaker = response.data.body.list
      })
//    获取制单人（前台用户名）
      var storeAccountUrl = requestSystemUrl + '/backend-system/store/store-account'
      getDataFromApi(storeAccountUrl, {}, function (response) {
        self.storeAccountData = response.data.body.list
      })
      this.listData({})
    },
    events: {
//    审核错误提示
      checkFail: function(err){
        if(err.data.code == '200002'){
          modal.errModal = true
          modal.errInfo = '该订单不允许执行此操作，请联系管理员'
        }
      },
//    绑定翻页事件
      pagechange: function (currentpage) {
        var self = this
        this.$http({
          url: requestSystemUrl + '/backend-system/stock/inventory',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          self.page = response.data.body.pagination
          self.list = response.data.body.list
          changeStatus(self.list)
        }, function (err) {
          console.log(err)
        })
      },
//     删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl + '/backend-system/stock/inventory/' + id, function (response) {
          self.listData({})
        })
      },
//    查看详情
      gotoDetail: function (id) {
        window.location.href = '/#!/admin/instock/inventory/Detail/'+ id
      }
    },
    methods: {
      listData: function (data) {
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/inventory'
        getDataFromApi(url, data, function (response) {
          self.list = response.data.body.list
          self.page = response.data.body.pagination
          changeStatus(self.list)
        })
      },
//      搜索
      searchMethod: function () {
        var data = {
          start_time: this.search.startTime,
          end_time: this.search.endTime,
          document_number: this.search.code,
          creator_id: this.search.selectedMaker,
          warehouse_id: this.search.selectedHouse,
          checked: this.search.selectedStatus
        }
        this.listData(data)
      },
//      撤销搜索
      cancelSearch: function () {
        this.search.startTime = ''
        this.search.endTime = ''
        this.search.code = ''
        this.search.selectedMaker = ''
        this.search.selectedHouse = ''
        this.search.selectedStatus = ''
        this.listData({})
      }
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/stock/inventory'
        var data =
          'start_time=' + this.search.startTime + '&' +
          'end_time=' + this.search.endTime + '&' +
          'document_number=' + this.search.code + '&' +
          'creator_id=' + this.search.selectedMaker + '&' +
          'warehouse_id=' + this.search.selectedHouse + '&' +
          'checked=' + this.search.selectedStatus
        return this.exportUrl = url + '/export-excel?' + data
      }
    },
    data: function () {
      return {
        timetext1: '开始时间',
        timetext2: '结束时间',
        page: [],
        list: [],
        storeAccountData: [],
        checkUrl: requestSystemUrl + '/backend-system/stock/inventory/',
        gridColumns: {
          document_number: '盘点单号',
          checked: '审核状态',
          warehouse_name: '仓库',
          created_at: '盘点日期',
          difference: '差异库存量',
          creator_name: '制单人',
          auditor_name: '审核人'
        },
        search: {
          orderMaker: [],
          warehouseList: [],
          selectedHouse: '',
          code: '',
          selectedStatus: '',
          selectedMaker: '',
          startTime: '',
          endTime: ''
        }
      }
    }
  }
</script>
