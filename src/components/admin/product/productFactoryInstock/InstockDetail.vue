<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-production></left-production>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：生产首页</li>
          <li class="active">工厂生产入库单</li>
          <li class="active">查看工厂生产入库单详情</li>
        </ol>

        <!--详情页面-->
        <summary-detail
          :table-header="gridColumns"
          :table-data="list"
          :grid-operate="gridOperate"
          :check-url = "checkUrl"
          :edit-flag.sync = 'editFlag'
        >
        </summary-detail>
        <!--有列表切换的时候的情况-->
        <ul class="nav nav-tabs" role="tablist">
          <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)" data-toggle="tab">入库明细</a></li>
          <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">入库汇总</a></li>
          <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr">导出</span></a>
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
                <td>{{entry.produce_amount}}</td>
                <td v-if='editFlag'><count :count.sync='entry.main_reference_value'></count></td>
                <td v-if='!editFlag'>{{entry.main_reference_value}}</td>
                <td v-if='editFlag'><count :count.sync='entry.defective_amount'></count></td>
                <td v-if='!editFlag'>{{entry.defective_amount}} </td>
                <td>{{entry.unit_name}}</td>
                <td>{{entry.unit_specification}}</td>
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
              <tr class="text-center" v-for="entry in summarystockGoods" track-by="$index" :id="[entry.id ? entry.id : '']">
                <td>{{entry.item_code}}</td>
                <td>{{entry.item_name}}</td>
                <td>{{entry.item_produce_amount}}</td>
                <td>{{entry.item_main_reference_value}}</td>
                <td>{{entry.item_defective_amount}} </td>
                <td>{{entry.unit_name}}</td>
                <td>{{entry.unit_specification}}</td>
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
  import {
    requestUrl,
    requestSystemUrl,
    getDataFromApi,
    token,
    exchangeData,
    detailNull,
    searchRequest,
    deleteRequest,
    checkRequest,
    putDataToApi,
    finishRequest } from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftProduction:LeftProduction,
      SummaryDetail: SummaryDetail,
      Count: Count
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        var self = this
        this.$http({
          url:requestSystemUrl + '/backend-system/production/factory/',
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
        deleteRequest(requestSystemUrl+ '/backend-system/production/factory/'+ id,function(response){
          console.log('deleted')
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl +'/backend-system/production/factory/'+ id +'/finished',function(response){
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
          obj['reference_type'] = val.item_type
          obj['id'] = val.id
          obj['amount'] = val.main_reference_value
          obj['defective_amount'] = val.defective_amount
          item.push(obj)
        })
        var data = {
          items: item
        }
        var url = requestSystemUrl + '/backend-system/production/factory/'+ id
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
        var url = requestSystemUrl + '/backend-system/production/factory/' + currentId
//       获取单个列表详情
        var purchaseUrl  = requestSystemUrl + '/backend-system/production/factory/' + currentId + '/get'
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
//     汇总方法
    summary: function () {
      var self = this
      this.summarystockGoods = []
      this.summarystockGoods =this.summarystockGoods.concat(self.detailList)
      $.each( this.summarystockGoods ,function (index,val){
          val.item_defective_amount = val.defective_amount
          val.item_main_reference_value = val.main_reference_value
          val.item_produce_amount = val.produce_amount
      })
      this.summarystockGoods = this.summaryMethod ("item_code", this.summarystockGoods)
    },
//     汇总方法
    summaryMethod: function  (ObjPropInArr, array){
      var hash={};
      var result=[];
      for(var i=0;i<array.length;i++){
        if(hash[array[i][ObjPropInArr]]){
          hash[array[i][ObjPropInArr]].item_defective_amount=Number(array[i].item_defective_amount) + Number( hash[array[i][ObjPropInArr]].item_defective_amount)
          hash[array[i][ObjPropInArr]].item_main_reference_value=Number(array[i].item_main_reference_value) + Number( hash[array[i][ObjPropInArr]].item_main_reference_value)
          hash[array[i][ObjPropInArr]].item_produce_amount=Number(array[i].item_produce_amount) + Number( hash[array[i][ObjPropInArr]].item_produce_amount)
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
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/production/factory'
        return this.exportUrl = url + '/export-excel/' + this.$route.params.queryId
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
        gridOperate: true,
        checkUrl: requestSystemUrl+ '/backend-system/production/factory/',
        gridColumns: {
          document_number: '收货单号',
          checked: '审核状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          stream_origin: '生产工厂',
          stream_target: '调入仓库',
          operated_at: '收货日期',
          stock_amount: '入库数量',
          defective_amount: '次品数量'
        },
        gridColumns2: {
          code: "货号",
          name: "品名",
          unit_space: '生产数量',
          total_stock: '入库数量',
          required_amount: '次品数量',
          product_amount: '单位',
          unit_specifition: '单位规格',
        }
      }
    }
  }
</script>
