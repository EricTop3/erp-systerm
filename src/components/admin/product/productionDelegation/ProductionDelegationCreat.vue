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
                <option :value="item.id" v-for="item in search.orderMaker">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>制单时间段</label>
              <date-picker :value.sync="time.startTime"></date-picker>
              -
              <date-picker :value.sync="time.endTime"></date-picker>
            </div>
            <br>
            <div class="form-group ml10 mt20">
              <label>生产时间段</label>
              <date-picker :value.sync="time.startTime1"></date-picker>
              -
              <date-picker :value.sync="time.endTime1"></date-picker>
            </div>
            <div class="form-group mt20">
              <label>合作工厂</label>
              <select class="form-control" v-model="search.selectedFactory">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in search.cooperativeFactory">{{item.name}}</option>
              </select>
            </div>
            <span class="btn btn-primary mt20" @click="searchMethod">搜索</span>
            <span class="btn btn-warning mt20" @click="cancelSearch">撤销搜索</span>

            <span class="btn btn-info spanblocks fr">导出excel</span>
            <a v-link="{ path: '/admin/production/delegationCreatNew' }"
               class="btn btn-info spanblocks fr mr10">新建委外生产单</a>
          </form>
        </div>

        <!-- 表格 -->
        <summary :table-data="list" :table-header="gridColumns" :page="page"></summary>

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
          exchangeData(this.list)
        }, function (err) {
          console.log(err)
        })
      },
//     删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl + '/backend-system/produce/outsource/' + id, function (response) {
          console.log('deleted')
          self.listData({})
        })
      },
//     審核请求
      checkFromApi: function (id) {
        var self = this
        checkRequest(requestSystemUrl + '/backend-system/produce/outsource/' + id + '/checked', function (response) {
          console.log('checked')
          self.listData({})
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl + '/backend-system/produce/outsource/' + id + '/finished', function (response) {
          console.log('finished')
          self.listData({})
        })
      },
//    查看详情
      gotoDetail: function (id) {
        window.location.href = '#!/admin/production/delegationCreatDetail/' + id
      }
    },
    ready: function () {
      var self = this
//    获取制单人
      getDataFromApi(requestUrl + '/backend-system/store/store-account', {}, function (response) {
        self.search.orderMaker = response.data.body.list
      })
//      获取合作工厂cooperativeFactory
      getDataFromApi(requestUrl + '/backend-system/provider/provider', {}, function (response) {
        self.search.cooperativeFactory = response.data.body.list
      })
      this.listData({})
    },
    methods: {
      listData: function (data) {
        var self = this
        var url = requestUrl + '/backend-system/produce/outsource'
        getDataFromApi(url, data, function (response) {
          self.list = response.data.body.list
          self.page = response.data.body.pagination
          exchangeData(self.list)
        })
      },
//      搜索
      searchMethod: function () {
        var data = {
          document_number: this.search.code,
          created_id: this.search.selectedMaker,
          checked: this.search.selectedStatus,
          start_time: this.time.startTime,
          iprovider_id: this.search.selectedFactory,
          end_time: this.time.endTime,
          start_receive_time: this.time.startTime1,
          end_receive_time: this.time.endTime1,
        }
        this.listData(data)
      },
//     取消搜索
      cancelSearch: function () {
        this.listData({})
      },
    },
    data: function () {
      return {
        page: [],
        list: [],
        time: {
          startTime: '',
          startTime1: '',
          endTime: '',
          endTime1: '',
        },
        search: {
          selectedStatus: '',
          selectedMaker: '',
          selectedFactory: '',
          code: '',
          orderMaker: [],
          cooperativeFactory: [],
        },
        gridColumns: {
          document_number: '生产单号',
          checked: '审核状态',
          outsource_name: '合作工厂',
          creator_name: '制单人',
          auditor_name: '审核人',
          created_at: '制单日期',
          operated_at: '生产日期',
          amount: '加工费用'
        }
      }
    }
  }
</script>
