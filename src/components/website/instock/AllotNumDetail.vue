<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">收货单汇总</li>
      <li class="active">查看收货单</li>
    </ol>
    <!--表格-->
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
            <th v-for="value in  gridColumns2">
              {{value}}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="entry in detailList" track-by="$index" :id="[entry.id ? entry.id : '']">
            <td>{{entry.consumable_code}}</td>
            <td>{{entry.consumable_name}}</td>
            <td>{{entry.recipient_amount}}</td>
            <td>{{entry.distribution_amount}}</td>
            <td v-if='editFlag'> <count :count.sync='entry.current_amount'></count></td>
            <td v-if='!editFlag'>{{entry.current_amount}}</td>
            <td>{{entry.unit}}</td>
            <td>{{entry.unit_specification}}</td>
            <td>{{entry.order_source_code}}</td>
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
            <th v-for="value in  gridColumns3">
              {{value}}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="entry in summarystockGoods" track-by="$index" :id="[entry.id ? entry.id : '']">
            <td>{{entry.consumable_code}}</td>
            <td>{{entry.consumable_name}}</td>
            <td>{{entry.item_recipient_amount}}</td>
            <td>{{entry.item_distribution_amount}}</td>
            <td>{{entry.item_current_amount}}</td>
            <td>{{entry.unit}}</td>
            <td>{{entry.unit_specification}}</td>
          </tr>
          </tbody>
        </table>
        <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
        <!--<page :total="page.total" :current.sync="page.current_page" :display="page.per_page"-->
        <!--:last-page="page.last_page"></page>-->
      </div>
    </div>
  </div>
  <!--模态框HTML-->
</template>

<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import Modal from '../../common/Modal'
  import ListValidate from '../../common/ListValidate'
  import SummaryDetail from '../../common/SummaryDetail'
  import Count  from '../../common/Count'
  import {requestUrl, token,searchRequest,exchangeData,error,changeStatus } from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      ListValidate: ListValidate,
      SummaryDetail: SummaryDetail,
      SiteNav: SiteNav,
      Count: Count
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
//        this.detailListData(currentpage)
        console.log(currentpage)
      }
    },
    ready: function () {
      var str = window.location.href
      var num = str.indexOf('AllotNum') + 9
      var id = str.substr(num)
      this.id = id
//      单条数据渲染
      this.thisOneData()
//      明细列表渲染
      this.listData(1)
    },
    methods: {
//      当前id的一条数据
      thisOneData: function () {
        this.$http({
          url: requestUrl + '/front-system/stock/recipient/' + this.id,
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.list = response.data.body
          changeStatus(this.list)
        }, function (err) {
          error(err)
        })
      },
//      明细列表渲染 /front-system/stock/products/{id}/detail
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/recipient/' + this.id + '/detail',
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.detailList = response.data.body.list
        }, function (err) {
          error(err)
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
            break
          case 2:
            this.detailModal = false
            this.summaryModal = true
            this.summary()
        }
      },
//       汇总方法
    summary: function () {
      var self = this
      this.summarystockGoods = []
      this.summarystockGoods =this.summarystockGoods.concat(self.detailList)
      $.each(this.summarystockGoods,function (index,val){
        val.item_recipient_amount = val.recipient_amount
        val.item_distribution_amount = val.distribution_amount
        val.item_current_amount = val.current_amount
      })
      this.summarystockGoods = this.summaryMethod ("item_code", this.summarystockGoods)
    },
//    汇总方法
    summaryMethod: function  (ObjPropInArr, array){
      var hash={};
      var result=[];
      for(var i=0;i<array.length;i++){
        if(hash[array[i][ObjPropInArr]]){
          hash[array[i][ObjPropInArr]].item_recipient_amount=Number(array[i].item_recipient_amount) + Number( hash[array[i][ObjPropInArr]].item_recipient_amount)
          hash[array[i][ObjPropInArr]].item_distribution_amount=Number(array[i].item_distribution_amount) + Number( hash[array[i][ObjPropInArr]].item_distribution_amount)
          hash[array[i][ObjPropInArr]].item_current_amount=Number(array[i].item_current_amount) + Number( hash[array[i][ObjPropInArr]].item_current_amount)
        }else{
          hash[array[i][ObjPropInArr]]=array[i];
        }
      }
      for(var j in hash){
        result.push(hash[j])
      }
      return result
    },
    },
    data: function () {
      return {
        id: 0,
        tabFlag: true,
        editFlag: false,
        detailModal: true,
        summaryModal: false,
        page: [],
        checkUrl:requestUrl +  '/front-system/stock/recipient/',
        inventoryAuditModal: false,
        inventoryAuditModalSize: 'modal-sm',
        dataId: '',
        checked: '',
        list: [],
        detailList: [],
        gridOperate: true,
        gridColumns: {
          order_number: '单号',
          checked: '审核状态',
          creator: '制单人',
          auditor: '审核人',
          date: '收货日期',
          amount: '收货数量'
        },
        gridOperate2: false,
        gridColumns2: {
          goods_code: '货号',
          goods_name: '品名',
          recipient_amount: '要货数量',
          distribution_amount: '配送数量',
          current_amount: '实际入库量',
          unit: '单位',
          unit_specification: '单位规格',
          order_source_code: '来源单号'
        },
        page3: [],
        gridOperate3: false,
        gridColumns3: {
          goods_code: '货号',
          goods_name: '品名',
          recipient_amount: '要货数量',
          distribution_amount: '配送数量',
          current_amount: '实际入库量',
          unit: '单位',
          unit_specification: '单位规格'
        }
      }
    }
  }
</script>
<style scoped>
  table thead tr th {
    text-align: center
  }

  table thead tr th:first-child {
    text-align: left;
  }

  table tbody tr td:first-child {
    text-align: left;
  }
</style>
