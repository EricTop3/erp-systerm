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
          <li class="active">查看委外生产单</li>
        </ol>

        <!--详情页面-->
        <summary-detail
          :table-header="gridColumns"
          :table-data="list"
          :grid-operate="gridOperate"
          :check-url = "checkUrl"
          :edit-flag.sync = "editFlag"
        >
        </summary-detail>
        <!--有列表切换的时候的情况-->
        <ul class="nav nav-tabs" role="tablist">
          <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)" data-toggle="tab">入库明细</a></li>
          <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">入库汇总</a></li>
        </ul>
        <!-- Tab panes -->
        <div class="tab-content">
          <!-- 入库明细 -->
          <div role="tabpanel" class="tab-pane active" v-if="detailModal">
            <!--表格详情列表-->
            <table class="table table-striped table-bordered table-hover">
              <thead>
              <tr class="text-center">
                <th v-for="value in gridColumns2">
                  {{value}}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr class="text-center" v-for="entry in detailList" track-by="$index" :id="[entry.id ? entry.id : '']">
                <td>{{entry.item_code}}</td>
                <td>{{entry.item_name}}</td>
                <td>{{entry.unit_specification}}</td>
                <td>{{entry.origin_stock_amount}}</td>
                <td>{{entry.demand_amount}}</td>
                <td v-if="editFlag"><count :count.sync =entry.main_reference_value></count>{{entry.unit_name}}</td>
                <td v-if="!editFlag">{{entry.main_reference_value}}/{{entry.unit_name}}</td>
                <td v-if="editFlag"><price :price.sync =entry.unit_price></price>元/{{entry.unit_name}}</td>
                <td v-if="!editFlag">{{entry.unit_price}}元/{{entry.unit_name}}</td>
                <td >{{entry.reference_number}}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- 入库汇总 -->
          <div role="tabpanel" class="tab-pane active"  v-if="summaryModal">
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
                <td>{{entry.origin_stock_amount}}</td>
                <td>{{entry.demand_amount}}</td>
                <td>{{entry.main_reference_value}}/{{entry.unit_name}}</td>
                <td>{{entry.unit_price}}/{{entry.unit_name}}</td>
                <td>{{entry.reference_number}}</td>
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
  import SummaryDetail from '../../../common/SummaryDetail'
  import Count from '../../../common/Count'
  import Price from  '../../../common/Price'
  import {
    requestUrl,
    putDataToApi,
    requestSystemUrl,
    getDataFromApi,
    token,
    exchangeData,
    searchRequest,
    deleteRequest,
    checkRequest,
    finishRequest,
    detailNull,
    changeStatus } from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftProduction: LeftProduction,
      SummaryDetail: SummaryDetail,
      Count: Count,
      Price: Price
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        var self = this
        this.$http({
          url:requestSystemUrl + '/backend-system/produce/outsource/',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          self.page = response.data.body.pagination
          self.list = response.data.body.list
          exchangeData(this.list)
        }, function (err) {
          console.log(err)
        })
      },
//      删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl+ '/backend-system/produce/outsource/'+ id,function(response){
          console.log('deleted')
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl +'/backend-system/produce/outsource/'+ id +'/finished',function(response){
          console.log('finished')
        })
      },
//      编辑
      editGoods: function (event) {
        this.editFlag = true
      },
//      保存
      saveGoods: function (event) {
        var self = this
        this.editFlag = false
        var id = this.$route.params.queryId
        var item = []
        $.each(self.detailList,function (index,val) {
          var obj = {}
          obj['reference_id'] = val.item_id
          obj['id'] = val.id
          obj['amount'] = val.main_reference_value
          obj['reference_type'] = val.item_type
          item.push(obj)
        })
        var data = {
          items: item
        }
        var url = requestSystemUrl + '/backend-system/produce/outsource/'+ id
        putDataToApi(url,data,function (res) {
          console.log('yes')
        })
      }
    },
    ready: function () {
      this.listData()
    },
    methods: {
      listData: function (page) {
        var currentId = this.$route.params.queryId
        var self = this
//        获取商品列表详情
        var url = requestSystemUrl + '/backend-system/produce/outsource/' + currentId
//       获取列表详情
        var purchaseUrl  = requestSystemUrl + '/backend-system/produce/outsource/' + currentId + '/get'
//       获取列表
        getDataFromApi(url,{},function(response){
          self.detailList = response.data.body.list
        })
//        获取列表详情
        getDataFromApi(purchaseUrl,{},function(response){
          self.list = response.data.body
          exchangeData(self.list)
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
            this.$dispatch('detail')
            break
          case 2:
            this.detailModal = false
            this.summaryModal = true
            this.$dispatch('summary')
        }
      }
    },
    data: function () {
      return {
        page: [],
        list: {},
        checkUrl: requestSystemUrl+ '/backend-system/produce/outsource/',
        editFlag: false,
        detailModal: true,
        summaryModal: false,
        detailList: [],
        tabFlag: true,
        gridColumns: {
          document_number: '生产单号',
          checked: '审核状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          outsource_name: '合作工厂',
          created_at: '制单日期',
          operated_at: '生产日期',
          amount: '加工费用'
        },
        gridColumns2: {
          item_code: "货号",
          item_name: "品名",
          unit_specification: '单位规格',
          origin_stock_amount: '总部库存',
          demand_amount: "门店要货数量",
          main_reference_value:'生产数量',
          unit_price:"加工单价",
          reference_number:"来源要货单号"
        }
      }
    }
  }
</script>
