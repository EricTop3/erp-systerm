<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <left-production></left-production>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：生产首页</li>
          <li class="active">生产领料单</li>
          <li class="active">查看</li>
        </ol>

        <!--详情页面 表格-->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <th>领料单号</th>
            <th>审核状态</th>
            <th>总部仓库</th>
            <th>领料工厂</th>
            <th>审核人</th>
            <th>领料单生成日期</th>
            <th>领料日期</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td>{{onedata.document_number}}</td>
            <td>{{onedata.checked}}</td>
            <td>{{onedata.stream_origin}}</td>
            <td>{{onedata.stream_target}}</td>
            <td>{{onedata.auditor}}</td>
            <td>{{onedata.created_at}}</td>
            <td>{{onedata.operated_at}}</td>
            <td>
              <span v-if="onedata.checked=='已审核' && onedata.operated_at!=''" class="btn btn-success btn-sm" @click="finish()">完成</span>
              <span v-if="onedata.checked=='已审核' && onedata.operated_at==''" class="btn btn-info btn-sm" @click="picking()">领料</span>
              <span v-if="onedata.checked=='未审核'" class="btn btn-danger btn-sm" @click="audit()">审核</span>
              <span v-if="onedata.checked=='未审核' && !isExist" class="btn btn-danger btn-sm" @click="editMethod()">编辑</span>
              <span v-if="onedata.checked=='未审核' && isExist" class="btn btn-success btn-sm" @click="saveGoods()">保存</span>
            </td>
          </tr>
          </tbody>
        </table>

        <!--有列表切换的时候的情况-->
        <ul class="nav nav-tabs" role="tablist">
          <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)"
                                                                                         data-toggle="tab">领料明细</a></li>
          <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">领料汇总</a>
          </li>
          <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr">导出</span></a>
        </ul>
        <!-- Tab panes -->
        <div class="tab-content">
          <!-- 明细 -->
          <div role="tabpanel" class="tab-pane active" v-if="detailModal">
            <!--表格详情列表-->
            <table class="table table-striped table-bordered table-hover">
              <thead>
              <tr class="text-center">
                <th v-for="value in  gridColumns2">
                  {{value}}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr class="text-center" v-for="entry in detailList" track-by="$index" :id="[entry.id ? entry.id : '']">
                <td>{{entry.item_code}}</td>
                <td>{{entry.item_name}}</td>
                <td>{{entry.unit_specification}}</td>
                <td>{{entry.material_stock + entry.consume}} {{entry.consume_unit_name}}</td>
                <td>{{entry.material_stock}} {{entry.consume_unit_name}}</td>
                <td>{{entry.consume}} {{entry.consume_unit_name}}</td>
                <td v-if='editFlag'>
                  <count :count.sync='entry.main_reference_value'></count>
                  {{entry.unit_name}}
                </td>
                <td v-if='!editFlag'>{{entry.main_reference_value}} {{entry.unit_name}}</td>
                <td>{{entry.reference_number}}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- 汇总 -->
          <div role="tabpanel" class="tab-pane active" v-if="summaryModal">
            <!--表格详情列表-->
            <table class="table table-striped table-bordered table-hover">
              <thead>
              <tr class="text-center">
                <th v-for="value in  gridColumns3">
                  {{value}}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr class="text-center" v-for="entry in detailList" track-by="$index" :id="[entry.id ? entry.id : '']">
                <td>{{entry.item_code}}</td>
                <td>{{entry.item_name}}</td>
                <td>{{entry.unit_specification}}</td>
                <td>{{entry.material_stock + entry.consume}} {{entry.unit_name}}</td>
                <td>{{entry.material_stock}} {{entry.unit_name}}</td>
                <td>{{entry.consume}} {{entry.consume_unit_name}}</td>
                <td>{{entry.main_reference_value}}{{entry.unit_name}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo">
  </error-tip>
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
  import ErrorTip from '../../../common/ErrorTip'
  import Summary from '../../../common/Summary'
  import SummaryDetail from '../../../common/SummaryDetail'
  import DatePicker from  '../../../common/DatePicker'
  import LeftProduction from '../../common/LeftProduction'
  import Count from '../../../common/Count'
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
      ErrorTip: ErrorTip,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      SummaryDetail: SummaryDetail,
      DatePicker: DatePicker,
      LeftProduction: LeftProduction,
      Count: Count
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getlistData(currentpage)
      }
    },
    ready: function () {
      this.getlistData(1)
      this.getOneData()
    },
    methods: {
//      编辑
      editMethod: function(){
        this.isExist = true
        this.editFlag = true
      },
//      保存
      saveGoods: function (event) {
        var self = this
        var id = this.$route.params.queryId
        var item = []
        $.each(self.detailList, function (index, val) {
          var obj = {}
          obj['reference_id'] = val.item_id
          obj['id'] = val.id
          obj['amount'] = val.main_reference_value
          item.push(obj)
        })
        var data = {
          items: item
        }
        var url = requestSystemUrl + '/backend-system/produce/pick/' + id
        putDataToApi(url, data, function (res) {
          self.isExist = false
          self.editFlag = false
          self.getOneData()
        },function(err){
          if (Number(err.data.code) === 220000) {
            console.log(err.data.message)
            self.modal.errModal = true
            self.modal.errInfo = err.data.message
          }
        })
      },
//      审核
      audit: function () {
        this.modal.auditModal = true
      },
//      确定审核
      confirmAudit: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/produce/pick/' + this.$route.params.queryId + '/checked'
        putDataToApi(url, {}, function (response) {
          self.modal.auditModal = false
          self.getOneData(1)
        }, function (err) {
          if (Number(err.data.code) === 220000) {
            self.modal.auditModal = false
            self.modal.errModal = true
            self.modal.errInfo = '库存不足，审核失败'
          }
        })
      },
//      领料
      picking: function () {
        this.modal.pickingModal = true
      },
//      确定领料/backend-system/produce/pick/{id}/pick
      confirmPicking: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/produce/pick/' + this.$route.params.queryId + '/pick'
        putDataToApi(url, {}, function (response) {
          self.modal.pickingModal = false
          self.getOneData(1)
        }, function (err) {
        })
      },
//      完成
      finish: function () {
        this.modal.finishModal = true
      },
//      确定完成
      confirmFinish: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/produce/pick/' + this.$route.params.queryId + '/finished'
        finishRequest(url, function (response) {
          self.modal.finishModal = false
          self.getOneData(1)
        }, function (err) {
        })
      },
//      列表数据渲染
      getlistData: function (page) {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/produce/pick/' + this.thisId
        getDataFromApi(url, {}, function (response) {
          self.detailList = response.data.body.list
          self.page = response.data.body.pagination
        })
      },
//      获取单条数据
      getOneData: function () {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/produce/pick/' + this.thisId + '/get'
        getDataFromApi(url, {}, function (response) {
          self.onedata = response.data.body
          exchangeData(self.onedata)
        })
      },
//      切换
      changeActive: function (event) {
        var cur = $(event.currentTarget)
        cur.addClass('active').siblings('li').removeClass('active')
        switch (Number(cur.attr('id'))) {
          case 1:
            this.detailModal = true
            this.summaryModal = false
            break
          case 2:
            this.detailModal = false
            this.summaryModal = true
            this.summary()
        }
      },
//      汇总方法
      summary: function () {
        var self = this
        self.summaryPrice = 0
        this.summarystockGoods = []
        this.summarystockGoods = this.summarystockGoods.concat(self.detailList)
        $.each(this.summarystockGoods, function (index, val) {
          val.item_amount = val.main_reference_value
          val.item_price = Number(val.item_amount * val.purchase_unit_price * 100)
          self.summaryPrice += val.item_price
        })
        this.summarystockGoods = this.summaryMethod("item_code", this.summarystockGoods)
      },
//     汇总方法
      summaryMethod: function (ObjPropInArr, array) {
        var hash = {};
        var result = [];
        for (var i = 0; i < array.length; i++) {
          if (hash[array[i][ObjPropInArr]]) {
            hash[array[i][ObjPropInArr]].material_stock = Number(array[i].material_stock) + Number(hash[array[i][ObjPropInArr]].item_amount)
            hash[array[i][ObjPropInArr]].consume = Number(array[i].consume) + Number(hash[array[i][ObjPropInArr]].consume)
            hash[array[i][ObjPropInArr]].main_reference_value = Number(array[i].main_reference_value) + Number(hash[array[i][ObjPropInArr]].main_reference_value)
          } else {
            hash[array[i][ObjPropInArr]] = array[i];
          }
        }
        for (var j in hash) {
          result.push(hash[j])
        }
        return result
      }
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/produce/pick'
        return this.exportUrl = url + '/export-excel/' + this.$route.params.queryId
      }
    },
    data: function () {
      return {
        editFlag: false,
        isExist: false,
        thisId: '',
        checkUrl: requestSystemUrl + '/backend-system/produce/pick/',
        detailModal: true,
        summaryModal: false,
        gridOperate: true,
        onedata: [],
        detailList: [],
        page: [],
        modal: {
          errModal: false,
          errInfo: '库存不足,审核失败!',
          auditModal: false,
          auditModalSize: 'modal-sm',
          pickingModal: false,
          pickingModalSize: 'modal-sm',
          finishModal: false,
          finishModalSize: 'modal-sm'
        },
        gridColumns: {
          document_number: '领料单号',
          checked: '审核状态',
          stream_origin: '生产车间库',
          stream_target: '领料工厂',
          auditor: '审核人',
          created_at: '领料单生成日期',
          operated_at: '领料日期'
        },
        gridColumns2: {
          item_code: '货号',
          item_name: '品名',
          unit_specification: '单位规格',
          a: '耗料量',
          material_stock: '生产车间库存',
          consume: '差料量',
          main_reference_value: '领料量',
          reference_number: '来源生产单号'
        },
        gridColumns3: {
          item_code: '货号',
          item_name: '品名',
          unit_specification: '单位规格',
          a: '耗料量',
          material_stock: '生产车间库存',
          consume: '差料量',
          main_reference_value: '领料量'
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
