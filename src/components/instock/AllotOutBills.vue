<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">调拨出库单汇总</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline">
        <div class="form-group">
          <label>单号</label>
          <input type="text" class="form-control" placeholder="" v-model="query.order_code">
        </div>
        <div class="form-group ml10">
          <label>审核状态</label>
          <select class="form-control" v-model="query.check_status">
            <option value="1">已审核</option>
            <option value="0">未审核</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>收货仓库</label>
          <select class="form-control">
            <option>全部</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>制单人</label>
          <select class="form-control" v-model="query.create_person">
            <option v-for="item in creators" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>出库时间段</label>
          <date-picker :value.sync="query.start_time"></date-picker>-
          <date-picker :value.sync="query.end_time"></date-picker>
        </div>
        <button type="submit" class="btn btn-info" @click="search">搜索</button>
        <a v-link="{ path: '/instock/AllotOut'}" ><span class="btn btn-primary">新建出库</span></a>
      </form>
    </div>
    <summary :table-header="gridColumns" :table-data="list" :detail-url="detailUrl" :page="page"></summary>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import Summary from '../common/Summary'
  import DatePicker from '../common/DatePicker'
  import {requestUrl,token,searchRequest,exchangeData} from '../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Summary: Summary,
      DatePicker: DatePicker
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.listData(currentpage)
      }
    },
    ready: function () {
//      渲染数据列表
      this.listData(1)
//      渲染制单人
      this.$http({
        url: requestUrl + '/front-system/create/order/users',
        method: 'get',
        headers: {'X-Overpowered-Token': token},
      }).then(function (response) {
        this.creators = response.data.body
      }, function (err) {
        console.log(err)
      })
    },
    methods: {
//    列表数据渲染
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/issue',
          method: 'get',
          headers: {'X-Overpowered-Token': token},
          data: {
            start_time: this.query.start_time || '',
            end_time: this.query.end_time || '',
            order_code: this.query.order_code || '',
            check_status: this.query.check_status || '',
            create_person: this.query.create_person || '',
            receipts_store: this.query.receipts_store || '',
            page: page,
            per_page: 16
          }
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.list = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      },
      //      搜索页面
      search: function () {
        var self = this
        searchRequest(
          requestUrl + '/front-system/stock/issue',
          {
            start_time: this.query.start_time,
            end_time: this.query.end_time,
            order_code: this.query.order_code,
            check_status: this.query.check_status,
            create_person: this.query.create_person,
            receipts_store: this.query.receipts_store,
            per_page: 16
          },
          function (response){
            self.list = response.data.body.list
            self.page = response.data.body.pagination
            exchangeData(self.list)
          }
        )
      }
    },
    data: function () {
      return {
        creators: [],
        list: [],
        page: [],
        detailUrl: '/#!/instock/AllotOutBills/',
        gridOperate: true,
        gridColumns: {
          order_code: '货号',
          check: '审核状态',
          receipts_store: '收货仓库',
          create_person: '制单人',
          check_person: '审核人',
          date: '出货日期',
          number: '出货数量'
        },
        query: {
          start_time: '',
          end_time: '',
          order_code: '',
          check_status: '',
          create_person: '',
          receipts_store: ''
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
