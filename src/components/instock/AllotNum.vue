<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">收货单汇总</li>
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
          <select class="form-control">
            <option>请选择</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>制单人</label>
          <select class="form-control">
            <option>全部</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>制单时间段</label>
          <date-picker :value.sync="orderStartTime"></date-picker>-
          <date-picker :value.sync="orderEndTime"></date-picker>
        </div>
        <div class="form-group ml10">
          <label>送货时间段</label>
          <date-picker :value.sync="sendStartTime"></date-picker>-
          <date-picker :value.sync="sendEndTime"></date-picker>
        </div>
        <button type="submit" class="btn btn-info" @click="listData(1)">搜索</button>
        <a v-link="{ path: '/instock/Allot'}"><span class="btn btn-primary">新建收货单</span></a>
      </form>
    </div>
    <!--表格 -->
    <summary :table-header="gridColumns" :table-data="list" :page="page" :detail-url="detailUrl"></summary>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import Summary from  '../common/Summary'
  import DatePicker from '../common/DatePicker'
  import {requestUrl, token} from '../../publicFunction/index'
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
      this.listData(1)
    },
    methods: {
//    收货单汇总-列表数据渲染
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/recipient',
          method: 'get',
          data: {
            start_time1: this.query.start_time1 || '',
            end_time1: this.query.end_time1 || '',
            start_time2: this.query.start_time2 || '',
            end_time2: this.query.end_time2 || '',
            order_code: this.query.order_code || '',
            create_person: this.query.create_person || '',
            check_status: this.query.check_status || '',
            page: page,
            per_page: 16
          },
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.list = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      }
    },
    data: function () {
      return {
        page: [],
        list: [],
        detailUrl: '/#!/instock/AllotNum/',
        gridColumns: {
          order_code: '单号',
          check_status: '审核状态',
          create_person: '制单人',
          check_person: '审核人',
          date: '收货日期',
          number: '收货数量'
        },
        query: {
          start_time1: '',
          start_time2: '',
          end_time1: '',
          end_time2: '',
          order_code: '',
          check_status: '',
          create_person: ''
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
