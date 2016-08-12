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
          :check-url="checkUrl"
          :edit-flag.sync ="editFlag"
        >
        </summary-detail>
        <!--有列表切换的时候的情况-->
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)" data-toggle="tab">入库明细</a></li>
            <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">入库汇总</a></li>
            <li class="summaryCount" v-if="summaryModal"><a href="javascript:void(0)">合计：￥{{summaryPrice|priceChange}}</a></li>
            <a :href="exports" target="_blank" style="float:right;"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
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
                  <td>{{entry.purchase_unit_name}}</td>
                  <td>{{entry.unit_specification}}</td>
                  <td>{{entry.current_stock}}{{entry.purchase_unit_name}}</td>
                  <td>{{entry.demand_amount}}{{entry.purchase_unit_name}}</td>
                  <td v-if='editFlag'><count :count.sync='entry.main_reference_value'></count>{{entry.purchase_unit_name}}</td>
                  <td v-if='!editFlag'>{{entry.main_reference_value}}  {{entry.purchase_unit_name}}</td>
                  <td v-if='editFlag'> <price :price.sync='entry.purchase_unit_price' ></price>元/{{entry.purchase_unit_name}}</td>
                  <td v-if='!editFlag'>{{entry.purchase_unit_price }}  元/{{entry.purchase_unit_name}}</td>
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
                  <th v-for="value in  gridColumns1">
                    {{value}}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center" v-for="entry in summarystockGoods" track-by="$index" :id="[entry.id ? entry.id : '']">
                  <td>{{entry.item_code}}</td>
                  <td>{{entry.item_name}}</td>
                  <td>{{entry.unit_specification}}</td>
                  <td>{{entry.current_stock}}{{entry.purchase_unit_name}}</td>
                  <td>{{entry.demand_amount}}{{entry.purchase_unit_name}}</td>
                  <td>{{entry.item_amount}}{{entry.purchase_unit_name}}</td>
                  <td>￥{{entry.item_price|priceChange}}</td>
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
  import Count from '../../common/Count'
  import Price from  '../../common/Price'
  import Summary from '../../common/Summary'
  import DatePicker from  '../../common/DatePicker'
  import LeftPurchase from '../common/LeftPurchase'
  import SummaryDetail from '../../common/SummaryDetail'
  import {requestUrl,requestSystemUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest,putDataToApi} from '../../../publicFunction/index'
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
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/purchase/purchase'
        return this.exportUrl = url + '/export-excel/' + this.$route.params.queryId
      }
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
//      删除请求
       deleteFromApi: function (id) {
       var self = this
       deleteRequest(requestSystemUrl+ '/backend-system/purchase/purchase/'+ id,function(response){
       console.log('deleted')
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
          obj['price'] = val.purchase_unit_price
          obj['reference_type'] = val.item_type
          item.push(obj)
        })
        var data = {
          items: item
        }
        var url = requestSystemUrl + '/backend-system/purchase/purchase/'+ id
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
        var url = requestSystemUrl + '/backend-system/purchase/purchase/' + currentId
//       获取采购列表详情
        var purchaseUrl  = requestSystemUrl + '/backend-system/purchase/purchase/' + currentId + '/get'
//       获取商品列表详情
        getDataFromApi(url,{},function(response){
          self.detailList = response.data.body.list
          $.each(self.detailList,function(index,val){
            val.purchase_unit_price =  (val.purchase_unit_price*0.01).toFixed(2)
          })
        })
//        获取采购列表详情
        getDataFromApi(purchaseUrl,{},function(response){
          self.list = response.data.body
          exchangeData(self.list)
        })
      },
//     切换
      changeActive: function (event) {
        var cur = $(event.currentTarget)
        cur.addClass('active').siblings('li').removeClass('active')
        switch (Number(cur.attr('id'))){
          case 1:
            this.detailModal = true
            this.summaryModal = false
            this.summaryDetail()
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
                hash[array[i][ObjPropInArr]].item_amount=Number(array[i].item_amount) + Number( hash[array[i][ObjPropInArr]].item_amount)
                hash[array[i][ObjPropInArr]].item_price+=array[i].item_price;
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
        checkUrl: requestSystemUrl+ '/backend-system/purchase/purchase/',
        page: [],
        list: {},
        editFlag: false,
        detailModal: true,
        summaryModal: false,
        summaryPrice: 0,
        summarystockGoods: [],
        detailList: [],
        tabFlag: true,
        gridOperate: true,
        gridColumns: {
          document_number: '采购单号',
          checked: '审核状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          provider_name: '供应商',
          created_at: '制单日期',
          terminated_at: '到货日期',
          total_sum: '采购金额'
        },
        gridColumns1: {
          code: "货号",
          name: "品名",
          unit_specification:"单位规格",
          current_stock: "库存数量",
          demand_amount:"要货数量",
          main_reference_value:"采购数量",
          purchase_unit_price:"小计",
        },
        gridColumns2: {
          code: "货号",
          name: "品名",
          purchase_unit_name: '采购单位',
          unit_specification:"单位规格",
          current_stock: "库存数量",
          demand_amount:"要货数量",
          main_reference_value:"采购数量",
          purchase_unit_price:"采购单价",
          reference_number: "来源要货单号"
        }
      }
    }
  }
</script>
