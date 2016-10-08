<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-production></left-production>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：生产首页</li>
          <li class="active">委外生产入库单</li>
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
              <label>收货时间段</label>
              <date-picker :value.sync="time.startTime" :time-text="timetext1"></date-picker>
              -
              <date-picker :value.sync="time.endTime" :time-text="timetext1"></date-picker>
            </div>
            <div class="form-group mt20">
              <label>供应商</label>
              <select class="form-control" v-model="search.selectedFactory">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in search.cooperativeFactory">{{item.name}}</option>
              </select>
            </div>
            <span class="btn btn-primary" @click="searchMethod">搜索</span>
            <span class="btn btn-warning" @click="cancelSearch">撤销搜索</span>
            <a v-if="authority.create"
               v-link="{ path: '/admin/production/delegationInstock/ProductionDelegationInstockNew' }"
               class="btn btn-info spanblocks fr mr10">新建委外入库单</a>
            <a v-if="authority.exports" :href="exports" target="_blank"><span
              class="btn btn-info spanblocks fr mr10">导出</span></a>
          </form>
        </div>
        <!-- 表格 -->
        <summary :table-data="list" :table-header="gridColumns" :page="page" :check-url="checkUrl"
                 :has-validate-authority="authority.validate"
                 :has-look-authority="authority.look"
                 :has-delete-authority="authority.delete"
        ></summary>
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
    systermAuthority,
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
          url: requestUrl + '/backend-system/production/outsource',
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
        deleteRequest(requestSystemUrl + '/backend-system/production/outsource/' + id, function (response) {
          console.log('deleted')
          self.listData({})
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl + '/backend-system/production/outsource/' + id + '/finished', function (response) {
          console.log('finished')
          self.listData({})
        })
      },
//    查看详情
      gotoDetail: function (id) {
        window.location.href = '#!/admin/production/delegationInstock/ProductionDelegationInstockDetail/' + id
      }
    },
    ready: function () {
      var self = this
//    获取制单人
      getDataFromApi(requestUrl + '/backend-system/store/get/account', {}, function (response) {
        self.search.orderMaker = response.data.body.list
      })
//      获取合作工厂cooperativeFactory
      getDataFromApi(requestUrl + '/backend-system/provider/get/provider', {}, function (response) {
        self.search.cooperativeFactory = response.data.body.list
      })
      this.listData({})
//    权限判断
//      查看
      if (systermAuthority.indexOf('outsource-produce-in-list-index') > -1) {
        this.authority.look = true
      }
//      审核
      if (systermAuthority.indexOf('outsource-produce-in-list-check') > -1) {
        this.authority.validate = true
      }
//      删除
      if (systermAuthority.indexOf('outsource-produce-in-list-delete') > -1) {
        this.authority.delete = true
      }
//      导出
      if (systermAuthority.indexOf('outsource-produce-in-list-export') > -1) {
        this.authority.exports = true
      }
//      新建
      if (systermAuthority.indexOf('outsource-produce-in-list-create') > -1) {
        this.authority.create = true
      }
    },
    methods: {
      listData: function (data) {
        var self = this
        var url = requestUrl + '/backend-system/production/outsource'
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
          creator_id: this.search.selectedMaker,
          checked: this.search.selectedStatus,
          start_time: this.time.startTime,
          provider_id: this.search.selectedFactory,
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
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/production/outsource'
        var data =
          'document_number=' + this.search.code + '&' +
          'created_id=' + this.search.selectedMaker + '&' +
          'checked=' + this.search.selectedStatus + '&' +
          'start_time=' + this.time.startTime + '&' +
          'iprovider_id=' + this.search.selectedFactory + '&' +
          'end_time=' + this.time.endTime + '&' +
          'start_receive_time=' + this.time.startTime + '&' +
          'end_receive_time=' + this.time.endTime
        return this.exportUrl = url + '/export-excel?' + data
      }
    },

    data: function () {
      return {
        timetext1: "开始时间",
        timetext2: "结束时间",
        page: [],
        list: [],
        checkUrl: requestSystemUrl + '/backend-system/production/outsource/',
        time: {
          startTime: '',
          endTime: '',
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
          document_number: '收货单号',
          checked: '审核状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          stream_origin: '生产工厂',
          stream_target: '调入厂库',
          operated_at: '收货日期',
          stock_amount: '入库数量',
          defective_amount: '次品数量',
          total_sum: '加工费用'
        },
        authority: {
          validate: false,
          look: false,
          delete: false,
          exports: false,
          create: false
        }
      }
    }
  }
</script>
