<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">要货汇总</li>
      <li class="active">查看要货单</li>
    </ol>
    <!--详情页面-->
    <summary-detail
      :detail-list="detailList"
      :table-header="gridColumns"
      :table-data="list"
      :check-url="checkUrl"
      :edit-flag.sync = 'editFlag'
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
            <td v-if='editFlag'> <count :count.sync='entry.main_reference_value'></count></td>
            <td v-if='!editFlag'>{{entry.main_reference_value}}</td>
            <td>{{entry.unit}}</td>
            <td>{{entry.unit_specification}}</td>
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
            <td>{{entry.consumable_code}}</td>
            <td>{{entry.consumable_name}}</td>
            <td>{{entry.main_reference_value}}</td>
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
</template>

<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import Modal from '../../common/Modal'
  import Count from '../../common/Count'
  import SummaryDetail from '../../common/SummaryDetail'
  import {requestUrl,token,exchangeData, checkRequest, error,changeStatus} from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      SummaryDetail: SummaryDetail,
      SiteNav: SiteNav,
      Count: Count
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.listData(currentpage)
      },
    },
    ready: function () {
      console.log(this.list)
      var str = window.location.href
      var num = str.indexOf('GoodsApplyNum') + 14
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
          url: requestUrl + '/front-system/stock/enquiry/' + this.id,
          method: 'get',
          headers:{'X-Overpowered-Token':token}
        }).then(function (response) {
          this.list = response.data.body
          exchangeData(this.list)
        }, function (err) {
          error(err)
        })
      },
//      明细列表渲染 /front-system/stock/products/{id}/detail
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/enquiry/' + this.id + '/detail',
          method: 'get',
          headers:{ 'X-Overpowered-Token':token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          console.log(this.page.current_page)
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
        id: 0,
        page: [],
        list: [],
        checkUrl: requestUrl + '/front-system/stock/enquiry/',
        detailList: [],
        editFlag: false,
        detailModal: true,
        summaryModal: false,
        gridOperate: true,
        gridColumns: {
          order_number: '单号',
          checked: '审核状态',
          receipt_status: '单据状态',
          creator: '制单人',
          auditor: '审核人',
          created_at: '制单日期',
          delivery_date: '送货日期',
          amount: '要货数量'
        },
        gridOperate2: false,
        gridColumns2: {
          consumable_code: '货号',
          consumable_name: '品名',
          amount: '要货数量',
          unit: '单位',
          unit_specification: '单位规格'
        }
      }
    }
  }
</script>
