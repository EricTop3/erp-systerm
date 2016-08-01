<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存</li>
          <li class="active">配送出库</li>
          <li class="active">查看库存</li>
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
          <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)" data-toggle="tab">出库明细</a></li>
          <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">出库汇总</a></li>
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
                <td>{{entry.goods_code}}</td>
                <td>{{entry.goods_name}}</td>
                <td>{{entry.origin_stock_amount}}</td>
                <td>{{entry.target_stock_amount}}</td>
                <td>{{entry.purchase_amount}}</td>
                <td v-if="!editFlag">{{entry.number}}</td>
                <td v-if="editFlag"><count :count.sync =entry.number :flag.sync="editFlag"></count></td>
                <td>{{entry.unit_name}}</td>
                <td>{{entry.unit_specification}}</td>
                <td>{{entry.reference_number}}</td>
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
                <td>{{entry.purchase_unit_name}}</td>
                <td>{{entry.unit_specification}}</td>
                <td>{{entry.current_stock}}{{entry.purchase_unit_name}}</td>
                <td>{{entry.demand_amount}}{{entry.purchase_unit_name}}</td>
                <td>{{entry.main_reference_value}}{{entry.purchase_unit_name}}</td>
                <td>{{entry.purchase_unit_price }}元/{{entry.purchase_unit_name}}</td>
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
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import AdminNav from '../../AdminNav'
  import Modal from '../../../common/Modal'
  import Summary from '../../../common/Summary'
  import DatePicker from  '../../../common/DatePicker'
  import LeftInstock from '../../common/LeftInstock'
  import SummaryDetail from '../../../common/SummaryDetail'
  import Count from '../../../common/Count'
  import {requestUrl,requestSystemUrl,getDataFromApi,token,exchangeData,detailNull,searchRequest,deleteRequest,checkRequest,finishRequest,putDataToApi} from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftInstock:LeftInstock,
      SummaryDetail: SummaryDetail,
      Count: Count
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.$http({
          url:requestSystemUrl + '/backend-system/purchase/purchase',
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
//    编辑
      saveDataToApi: function () {

      },
//     審核请求
      checkFromApi: function (id) {
        var self = this
        checkRequest(requestSystemUrl+ '/backend-system/purchase/purchase/'+ id +'/checked',function(response){
          self.editFlag = false
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl +'/backend-system/purchase/purchase/'+ id +'/finished',function(response){
          console.log('finished')
        })
      },
//      编辑
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
        var url = requestSystemUrl + '/backend-system/stock/distribution/' + currentId
//       获取单个列表详情
        var purchaseUrl  = requestSystemUrl + '/backend-system/stock/distribution/' + currentId + '/get'
//       获取商品列表详情
        getDataFromApi(url,{},function(response){
          self.detailList = response.data.body.list
        })
//        获取采购列表详情
        getDataFromApi(purchaseUrl,{},function(response){
          self.list = response.data.body
          exchangeData(self.list)
        })
      },
      //       切换
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
        detailList: [],
        editFlag: false,
        detailModal: true,
        summaryModal: false,
        gridColumns: {
          order_number: '配送单号',
          checked: '审核状态',
          stream_origin_name: '出货仓库',
          warehouse_name: '调入仓库',
          creator_name: '制单人',
          auditor_name: '审核人',
          operated_at: '制单日期',
          amount: '配送数量'
        },
        gridColumns2: {
          code: "货号",
          name: "品名",
          current_stock: "出货仓库库存",
          demand_amount:"调入仓库库存",
          main_reference_value:"要货数量",
          purchase_unit_price:"配送数量",
          reference_number: "采购单位",
          unit_space: '单位规格',
          origen_number: '来源要货单号',
        }
      }
    }
  }
</script>
