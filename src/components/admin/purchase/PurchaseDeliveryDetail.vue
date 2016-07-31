<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-purchase></left-purchase>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
          <li class="active">采购收货</li>
          <li class="active">查看收货单</li>
        </ol>
        <!--详情页面-->
        <summary-detail
          :table-header="gridColumns"
          :table-data="list"
          :grid-operate="gridOperate"
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
                <th v-for="value in  gridColumns2">
                  {{value}}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr class="text-center" v-for="entry in detailList" track-by="$index" :id="[entry.id ? entry.id : '']">
                <td>{{entry.item_code}}</td>
                <td>{{entry.item_name}}</td>
                <td>{{entry.main_reference_value}}</td>
                <td v-if="editFlag"><count :count.sync =entry.received_amount></count></td>
                <td v-if="!editFlag">{{entry.received_amount}}</td>
                <td v-if="editFlag"><count :count.sync =entry.additional_amount></count></td>
                <td v-if="!editFlag">{{entry.additional_amount}}</td>
                <td v-if="editFlag"><count :count.sync =entry.refund_amount></count></td>
                <td v-if="!editFlag">{{entry.refund_amount}}</td>
                <td v-if="editFlag"><price :price.sync =entry.unit_price></price>元</td>
                <td v-if="!editFlag">{{entry.unit_price}}元</td>
                <td >{{entry.reference_number}}</td>
              </tr>
              </tbody>
            </table>
            <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
            <!--<page :total="page.total" :current.sync="page.current_page" :display="page.per_page"-->
            <!--:last-page="page.last_page"></page>-->
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
                <td>{{entry.main_reference_value}}</td>
                <td>{{entry.received_amount}}</td>
                <td>{{entry.additional_amount}}</td>
                <td>{{entry.refund_amount}}</td>
                <td>{{entry.unit_price}}元</td>
                <td>{{entry.reference_number}}</td>
              </tr>
              </tbody>
            </table>
            <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
            <!--<page :total="page.total" :current.sync="page.current_page" :display="page.per_page"-->
            <!--:last-page="page.last_page"></page>-->
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
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import AdminNav from '../AdminNav'
  import Modal from '../../common/Modal'
  import Summary from '../../common/Summary'
  import DatePicker from  '../../common/DatePicker'
  import LeftPurchase from '../common/LeftPurchase'
  import SummaryDetail from '../../common/SummaryDetail'
  import Count from '../../common/Count'
  import Price from  '../../common/Price'
  import {requestUrl,requestSystemUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest,changeStatus} from '../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftPurchase: LeftPurchase,
      SummaryDetail: SummaryDetail,
      Count: Count,
      Price: Price
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.$http({
          url:requestSystemUrl + '/backend-system/purchase/receive',
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
//      删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl+ '/backend-system/purchase/receive/'+ id,function(response){
          console.log('deleted')
        })
      },
//     審核请求
      checkFromApi: function (id) {
        var self = this
        checkRequest(requestSystemUrl+ '/backend-system/purchase/receive/'+ id +'/checked',function(response){
          self.editFlag = false
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl +'/backend-system/purchase/receive/'+ id +'/finished',function(response){
          console.log('finished')
        })
      },

//           编辑
      editGoods: function () {
        this.editFlag = true
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
        var url = requestSystemUrl + '/backend-system/purchase/receive/' + currentId
//       获取采购列表详情
        var purchaseUrl  = requestSystemUrl + '/backend-system/purchase/receive/' + currentId + '/get'
//       获取商品列表详情
        getDataFromApi(url,{},function(response){
          self.detailList = response.data.body.list
          $.each(self.detailList,function(index,val){
              val.unit_price =  (val.unit_price*0.01).toFixed(2)
          })
        })
//        获取采购列表详情
        getDataFromApi(purchaseUrl,{},function(response){
          self.list = response.data.body
          changeStatus(self.list)
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
        editFlag: false,
        detailModal: true,
        summaryModal: false,
        detailList: [],
        gridColumns: {
          document_number: '收货单号',
          checked: '审核状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          warehouse: '收货仓库',
          provider_name: '供应商',
          operated_at: '收货日期',
          demand_amount: '采购数量',
          received_amount: '实际入库量',
          refund_amount: '退货数量'
        },
        gridColumns2: {
          code: "货号",
          name: "品名",
          main_reference_value: "采购数量",
          received_amount:"收货数量",
          additional_amount:"赠送数量",
          refund_amount:"退货数量",
          purchase_price:"采购单价",
          origen_source: '来源单号'
        }
      }
    }
  }
</script>
