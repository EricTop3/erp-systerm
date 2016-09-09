<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">库存配送出库</li>
          <li class="active">列表</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="请输入单号" v-model="searchData.document_number">
            </div>
            <div class="form-group ml10">
              <label>审核状态</label>
              <select class="form-control" v-model="searchData.checked">
                <option value="">请选择</option>
                <option value="1">未审核</option>
                <option value="2">已审核</option>
                <option value="3">已完成</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>调入仓库</label>
              <select class="form-control" v-model="searchData.warehouse_id">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in warehouseList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>出货仓库</label>
              <select class="form-control" v-model="searchData.stream_origin_id">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in warehouseList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>制单人</label>
              <select class="form-control" v-model="searchData.creator_id">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in orderMaker">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>配送时间段</label>
              <date-picker :value.sync="searchData.start_receive_time" :time-text="timetext1"></date-picker> -
              <date-picker :value.sync="searchData.end_receive_time" :time-text="timetext2"></date-picker>
            </div>
            <div class="form-group ml10">
              <label>制单时间段</label>
              <date-picker :value.sync="searchData.start_maker_time" :time-text="timetext1"></date-picker> -
              <date-picker :value.sync="searchData.end_maker_time" :time-text="timetext2"></date-picker>
            </div>
            <span class="btn btn-primary" @click="searchMethod()">搜索</span>
            <span class="btn btn-warning" @click="cancelSearch()">撤销搜索</span>

            <a :href="exports" target="_blank" style="float:right;"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
            <span class="btn btn-info spanblocks fr mr10" v-link="{ path: '/admin/instock/dispatching/create',exact: true}">新建配送出库单</span>
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
        >
        </summary>
        <!--错误信息-->
        <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import AdminNav from '../../AdminNav'
  import Modal from '../../../common/Modal'
  import Summary from '../../../common/Summary'
  import DatePicker from  '../../../common/DatePicker'
  import LeftInstock from '../../common/LeftInstock'
  import ErrorTip from '../../../common/ErrorTip'
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
    changeStatus} from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftInstock: LeftInstock,
      ErrorTip: ErrorTip
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.$http({
          url: requestUrl + '/backend-system/stock/distribution',
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
        deleteRequest(requestSystemUrl + '/backend-system/stock/distribution/'+ id,function(response){
          self.listData({})
        })
      },
//    查看详情
      gotoDetail: function (id){
        window.location.href = '/#!/admin/instock/dispatching/Detail/'+ id
      },
//    审核失败
      checkFail: function (err){
        var self = this
        if(Number(err.data.code) === 220000){
          self.modal.errModal = true
          self.modal.errInfo =  "库存不足，操作被拒绝"
        }
      }
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/stock/distribution'
        var data =
          'document_number=' + this.searchData.document_number + '&' +
          'checked=' + this.searchData.checked + '&' +
          'warehouse_id=' + this.searchData.warehouse_id + '&' +
          'stream_origin_id=' + this.searchData.stream_origin_id + '&' +
          'creator_id=' + this.searchData.creator_id + '&' +
          'start_receive_time=' + this.searchData.start_receive_time + '&' +
          'end_receive_time=' + this.searchData.end_receive_time
        return this.exportUrl = url + '/export-excel?' + data
      }
    },
    ready: function () {
      var self = this
//      获取制单人
      getDataFromApi( requestUrl + '/backend-system/store/account',{},function(response){
        self.orderMaker = response.data.body.list
      })
//    获取仓库列表
      getDataFromApi(requestSystemUrl + '/backend-system/warehouse-minimal-list',{},function(response){
        self.warehouseList = response.data.body.list
      })
      this.listData({})
    },
    methods: {
//      列表数据渲染
      listData: function (data) {
        var self = this
        var url = requestUrl + '/backend-system/stock/distribution'
        getDataFromApi(url,data,function(response){
          self.list = response.data.body.list
          self.page = response.data.body.pagination
          exchangeData(self.list)
        })
      },
      searchMethod: function () {
        var data ={
            document_number: this.searchData.document_number || '',
            checked: this.searchData.checked || '',
            warehouse_id: this.searchData.warehouse_id || '',
            stream_origin_id: this.searchData.stream_origin_id || '',
            creator_id: this.searchData.creator_id || '',
            start_receive_time: this.searchData.start_receive_time || '',
            end_receive_time: this.searchData.end_receive_time || '',
            start: this.searchData.start_maker_time || '',
            end: this.searchData.end_maker_time || '',

          }
        this.listData(data)
      },
//    撤销搜索
      cancelSearch: function () {
        this.searchData.document_number = ''
        this.searchData.checked = ''
        this.searchData.warehouse_id = ''
        this.searchData.stream_origin_id = ''
        this.searchData.creator_id = ''
        this.searchData.start_receive_time = ''
        this.searchData.end_receive_time = ''
        this.searchData.start_maker_time = ''
        this.searchData.end_maker_time = ''
        this.listData({})
      }
    },
    data: function () {
      return {
        timetext1: '开始时间',
        timetext2: '结束时间',
        page: [],
        list: [],
        checkUrl: requestSystemUrl + '/backend-system/stock/distribution/',
        warehouseList: [],
        modal:{
          errModal: false,
          errInfo: 'high,这是错误提示'
        },
        time:{
          startTime:'',
          startTime1:'',
          endTime:'',
          endTime1:'',
        },
        orderMaker: [],
        gridColumns: {
          order_number: '配送单号',
          checked: '审核状态',
          stream_origin_name: '出货仓库',
          warehouse_name: '调入仓库',
          creator_name: '制单人',
          auditor_name: '审核人',
          operated_at: '配送时间',
          created_at: '制单时间段',
          amount: '配送数量'
        },
        searchData: {
          document_number: '',
          checked: 0,
          warehouse_id: '',
          creator_id: '',
          start_receive_time: '',
          end_receive_time: '',
          start_maker_time: '',
          end_maker_time: '',
          stream_origin_id: '',
        }
      }
    }
  }
</script>
