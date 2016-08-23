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
              <input type="text" class="form-control" placeholder="请输入单号" style="width: 130px;"
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
                <option v-for="item in listProviderB" track-by="$index" value="{{item.id}}">{{item.name}}
              </select>
            </div>
            <div class="form-group ml10">
              <label>领料工厂</label>
              <select class="form-control" v-model="searchData.target_id">
                <option value="">请选择</option>
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
            <br>
            <div class="form-group mt10">
              <label>领料日期</label>
              <date-picker :value.sync="searchData.receive_start_time" :time-text="timetext1"
                           :timewidth="timewidth"></date-picker>
              <date-picker :value.sync="searchData.receive_end_time" :time-text="timetext2"
                           :timewidth="timewidth"></date-picker>
            </div>
            <span class="btn btn-primary mt10" @click="getlistData(1)">搜索</span>
            <span class="btn btn-warning mt10" @click="cancelSearch()">撤销搜索</span>
            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10 mt10">导出</span></a>
          </form>
        </div>
        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <th>领料单号</th>
            <th>审核状态</th>
            <th>生产车间库</th>
            <th>领料工厂</th>
            <th>审核人</th>
            <th>领料单生成日期</th>
            <th>领料日期</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="item in listdata" :id="item.id">
            <td>{{item.document_number}}</td>
            <td>{{item.checked}}</td>
            <td>{{item.stream_origin}}</td>
            <td>{{item.stream_target}}</td>
            <td>{{item.auditor}}</td>
            <td>{{item.created_at}}</td>
            <td>{{item.operated_at}}</td>
            <td>
              <span v-if="item.checked=='已审核' && item.operated_at!=''" class="btn btn-success btn-sm" @click="finish($event)">完成</span>
              <span v-if="item.checked=='已审核' && item.operated_at==''" class="btn btn-info btn-sm" @click="picking($event)">领料</span>
              <span v-if="item.auditor==''" class="btn btn-danger btn-sm" @click="audit($event)">审核</span>
              <span class="btn btn-primary btn-sm" @click="view($event)">查看</span>
              <span v-if="item.checked=='未审核'" class="btn btn-default btn-sm" @click="deleteData($event)">删除</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
  <!--模态框-审核-->
  <modal :show.sync="modal.auditModal" :modal-size="modal.auditModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" @click="modal.auditModal=false" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">审核</h4>
    </div>
    <div slot="body">
      <h4 class="text-center">是否通过审核</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-info" @click="confirmAudit()">是</button>
      <button type="button" class="btn btn-primary" @click="modal.auditModal=false">否</button>
    </div>
  </modal>
  <!--模态框-审核-->
  <!--模态框-领料-->
  <modal :show.sync="modal.pickingModal" :modal-size="modal.pickingModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" @click="modal.pickingModal=false"
              aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">领料</h4>
    </div>
    <div slot="body">
      <h4 class="text-center">确定是否领料</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-info" @click="confirmPicking()">确定</button>
      <button type="button" class="btn btn-primary" @click="modal.pickingModal=false">取消</button>
    </div>
  </modal>
  <!--模态框-领料-->
  <!--模态框-删除-->
  <modal :show.sync="modal.deleteModal" :modal-size="modal.deleteModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" @click="modal.deleteModal=false" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">删除</h4>
    </div>
    <div slot="body">
      <h4 class="text-center">确定是否删除</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-info" @click="confirmDelete()">确定</button>
      <button type="button" class="btn btn-primary" @click="modal.deleteModal=false">取消</button>
    </div>
  </modal>
  <!--模态框-删除-->
  <!--模态框-完成-->
  <modal :show.sync="modal.finishModal" :modal-size="modal.finishModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" @click="modal.finishModal=false" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">完成</h4>
    </div>
    <div slot="body">
      <h4 class="text-center">确定是否完成</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-info" @click="confirmFinish()">确定</button>
      <button type="button" class="btn btn-primary" @click="modal.finishModal=false">取消</button>
    </div>
  </modal>
  <!--模态框-完成-->
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
    putDataToApi,
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
      LeftProduction: LeftProduction,
      ErrorTip: ErrorTip
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getlistData(currentpage)
      }
    },
    ready: function () {
      this.getlistProviderB()
      this.getlistData(1)
    },
    methods: {
//      查看详情
      view: function(event){
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = '/#!/admin/production/getSupplies/' + this.thisId
      },
//      审核
      audit: function (evnet) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.modal.auditModal = true
      },
//      确定审核
      confirmAudit: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/produce/pick/' + this.thisId + '/checked'
        putDataToApi(url, {}, function (response) {
          self.modal.auditModal = false
          self.getlistData(1)
        }, function (err) {
          if (Number(err.data.code) === 220000) {
            self.modal.auditModal = false
            self.modal.errModal = true
            self.modal.errInfo = '审核失败'
          }
        })
      },
//      领料
      picking: function (evnet) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.modal.pickingModal = true
      },
//      确定领料/backend-system/produce/pick/{id}/pick
      confirmPicking: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/produce/pick/' + this.thisId + '/pick'
        putDataToApi(url, {}, function (response) {
          self.modal.pickingModal = false
          self.getlistData(1)
        }, function (err) {
        })
      },
//      删除
      deleteData: function (evnet) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.modal.deleteModal = true
      },
//      确定删除
      confirmDelete: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/produce/pick/' + this.thisId
        deleteRequest(url, function (response) {
          self.modal.deleteModal = false
          self.getlistData(1)
        }, function (err) {
        })
      },
//      完成
      finish: function (evnet) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.modal.finishModal = true
      },
//      确定完成
      confirmFinish: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/produce/pick/' + this.thisId + '/finished'
        finishRequest(url, function (response) {
          self.modal.finishModal = false
          self.getlistData(1)
        }, function (err) {
        })
      },
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
      getlistProviderB: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/store/store/warehouses-list'
        getDataFromApi(url, {}, function (response) {
          self.listProviderB = response.data.body
        })
      }
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/produce/pick'
        var data =
          'document_number=' + this.searchData.document_number + '&' +
          'checked=' + this.searchData.checked + '&' +
          'warehouse_id=' + this.searchData.warehouse_id + '&' +
          'target_id=' + this.searchData.target_id + '&' +
          'start_time=' + this.searchData.start_time + '&' +
          'end_time=' + this.searchData.end_time + '&' +
          'receive_start_time=' + this.searchData.receive_start_time + '&' +
          'receive_end_time=' + this.searchData.receive_end_time
        return this.exportUrl = url + '/export-excel?' + data
      }
    },
    data: function () {
      return {
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        listProviderB: [],
        listdata: [],
        page: [],
        thisId: '',
        modal: {
          errModal: false,
          errInfo: 'high，你的库存不足，请去工厂采购',
          auditModal: false,
          auditModalSize: 'modal-sm',
          pickingModal: false,
          pickingModalSize: 'modal-sm',
          deleteModal: false,
          deleteModalSize: 'modal-sm',
          finishModal: false,
          finishModalSize: 'modal-sm'
        },
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
        gridOperate: true,
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
