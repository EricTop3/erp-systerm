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
      :table-header="gridColumns"
      :table-data="list"
      :check-url="checkUrl"
      :edit-flag.sync = 'editFlag'
      :is-exist.sync = 'isExist'
      :has-validate-authority="true"
      :has-edit-authority="true"
    >
    </summary-detail>
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
        <!-- 翻页
        <page
          :total="page.total"
          :current.sync="page.current_page"
          :display="page.per_page"
          :last-page="page.last_page">
        </page>-->
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
  import {
    requestSystemUrl,
    token,
    exchangeData,
    checkRequest,
    getDataFromSiteApi,
    putDataToApi,
    error,
    changeStatus } from '../../../publicFunction/index'
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
/*//    绑定翻页事件
      pagechange: function (currentpage) {
        var self = this
        this.$http({
          url:requestSystemUrl + '/front-system/stock/enquiry/' + self.id + '/detail',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          self.page = response.data.body.pagination
          self.detailList = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      },*/
//      保存
      saveGoods: function (event) {
        var self = this
        this.editFlag = false
        var id = self.$route.params.queryId
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
        var url = requestSystemUrl + '/front-system/stock/enquiry/'+ id
        putDataToApi(url,data,function (res) {
          console.log('yes')
//      单条数据渲染
          self.thisOneData()
//      明细列表渲染
          self.listData({})
        })
      }
    },
    ready: function () {
      this.id = this.$route.params.queryId
//      单条数据渲染
      this.thisOneData()
//      明细列表渲染
      this.listData({})
    },
    methods: {
//      当前id的一条数据
      thisOneData: function () {
        var self = this
        var url = requestSystemUrl + '/front-system/stock/enquiry/' + self.id
        getDataFromSiteApi(url, {}, function (response) {
          self.list = response.data.body
          exchangeData(self.list)
        })
      },
//      明细列表渲染
      listData: function (data) {
        var self = this
        var url = requestSystemUrl + '/front-system/stock/enquiry/' + self.id + '/detail'
        getDataFromSiteApi(url, {}, function (response) {
//          self.page = response.data.body.pagination
          self.detailList = response.data.body.list
        })
      },
    },
    data: function () {
      return {
        id: 0,
//        page: [],
        list: [],
        checkUrl: requestSystemUrl + '/front-system/stock/enquiry/',
        detailList: [],
        isExist: false,
        editFlag: false,
        detailModal: true,
        summaryModal: false,
        gridOperate: true,
        gridColumns: {
          order_number: '单号',
          checked: '审核状态',
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
