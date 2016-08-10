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
          <li class="active">生产领料单</li>
          <li class="active">查看</li>
        </ol>

        <!--详情页面 表格-->
        <summary-detail
          :table-header="gridColumns"
          :table-data="onedata"
          :grid-operate="gridOperate"
          :check-url = "checkUrl"
          :edit-flag.sync = 'editFlag'
        >
        </summary-detail>

        <!--有列表切换的时候的情况-->
        <ul class="nav nav-tabs" role="tablist">
          <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)" data-toggle="tab">领料明细</a></li>
          <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">领料汇总</a>
          </li>
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
                <td>{{entry.material_stock}}{{entry.unit_name}}</td>
                <td>{{consume}} {{entry.unit_name}}</td>
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
                <td>{{entry.material_stock}}{{entry.unit_name}}</td>
                <td>{{consume}} {{entry.unit_name}}</td>
                <td>{{entry.main_reference_value}}{{entry.unit_name}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
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
    changeStatus
  } from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
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
      },
      //     删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl + '/backend-system/produce/pick/'+ id,function(response){
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
    },
    ready: function () {
      this.getlistData(1)
      this.getOneData()
    },
    methods: {
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
        switch (Number(cur.attr('id'))){
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
        this.summarystockGoods =this.summarystockGoods.concat(self.detailList)
        $.each(this.summarystockGoods,function (index,val){
          val.item_amount = val.main_reference_value
          val.item_price = Number(val.item_amount  *  val.purchase_unit_price * 100)
          self.summaryPrice += val.item_price
        })
        this.summarystockGoods = this.summaryMethod ("item_code", this.summarystockGoods)
      },
//     汇总方法
      summaryMethod: function (ObjPropInArr, array){
        var hash={};
        var result=[];
        for(var i=0;i<array.length;i++){
          if(hash[array[i][ObjPropInArr]]){
            hash[array[i][ObjPropInArr]].material_stock=Number(array[i].material_stock) + Number( hash[array[i][ObjPropInArr]].item_amount)
            hash[array[i][ObjPropInArr]].consume=Number(array[i].consume) + Number( hash[array[i][ObjPropInArr]].consume)
            hash[array[i][ObjPropInArr]].main_reference_value=Number(array[i].main_reference_value) + Number( hash[array[i][ObjPropInArr]].main_reference_value)
          }else{
            hash[array[i][ObjPropInArr]]=array[i];
          }
        }
        for(var j in hash){
          result.push(hash[j])
        }
        return result
      }
    },
    data: function () {
      return {
        editFlag: false,
        thisId: '',
        checkUrl: requestSystemUrl + '/backend-system/produce/pick/',
        detailModal: true,
        summaryModal: false,
        gridOperate: true,
        onedata: [],
        detailList: [],
        page: [],
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
          material_stock: '生产车间库存',
          a: '耗料量',
          b: '领料量',
          reference_number: '来源生产单号'
        },
        gridColumns3: {
          item_code: '货号',
          item_name: '品名',
          unit_specification: '单位规格',
          material_stock: '生产车间库存',
          a: '耗料量',
          b: '领料量'
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
