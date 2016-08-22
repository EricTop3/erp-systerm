<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">盘点差异汇总</li>
      <li class="active">差异明细</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline">
        <div class="form-group">
          <label>时间段</label>
          <date-picker :value.sync="query.start_time" :time-text="timetext1"></date-picker>
          -
          <date-picker :value.sync="query.end_time" :time-text="timetext2"></date-picker>
        </div>
        <span class="btn btn-info" @click="search">查询</span>
        <span class="btn btn-warning" @click="cancel()">撤销搜索</span>
      </form>
    </div>
    <!-- 表格 单条数据 -->
    <table class="table table-striped table-hover table-border">
      <thead>
      <tr class="text-center">
        <td class="text-left">货号</td>
        <td>品名</td>
        <td>差异库存量</td>
        <td>单位</td>
        <td>单位规格</td>
        <td>商品分类</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center">
        <td class="text-left">{{list.item_code}}</td>
        <td>{{list.item_name}}</td>
        <td>{{list.difference}}</td>
        <td>{{list.unit_name}}</td>
        <td>{{list.unit_specification}}</td>
        <td>{{list.category_name.display_name}}</td>
      </tr>
      </tbody>
    </table>
    <!-- 表格 详情列表 -->
    <grid :data="detailList" :columns="gridColumns2" :operate="gridOperate2"></grid>
    <!-- 翻页 -->
    <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
          :last-page="page.last_page"></page>
  </div>
</template>
<script>
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import DatePicker from '../../common/DatePicker'
  import  SummaryDetail from '../../common/SummaryDetail'
  import {requestUrl, token, requestSystemUrl, error} from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      DatePicker: DatePicker,
      SummaryDetail: SummaryDetail,
      SiteNav: SiteNav
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.detailListData(currentpage)
      }
    },
    ready: function () {
//      单条数据渲染
      this.thisOneData()
//      明细列表渲染
      this.detailListData(1)
    },
    methods: {
//      当前id的一条数据 /front-system/stock/difference/{id}
      thisOneData: function () {
        this.id = this.$route.params.queryId
        this.$http({
          url: requestUrl + '/front-system/stock/difference/' + this.id  + '/detail',
          data: {
            start_time: this.query.start_time || '',
            end_time: this.query.end_time || ''
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.list = response.data.body
        }, function (err) {
          error(err)
        })
      },
//      明细列表渲染 /front-system/stock/difference/{id}/detail
      detailListData: function (page) {
        this.id = this.$route.params.queryId
        this.$http({
          url: requestUrl + '/front-system/stock/difference/' + this.id,
          method: 'get',
          headers: {'X-Overpowered-Token': token},
          data: {
            start_time: this.query.start_time || '',
            end_time: this.query.end_time || '',
            page: page,
            per_page: 10
          }
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.detailList = response.data.body.list
        }, function (err) {
          error(err)
        })
      },
//      搜索
      search: function () {
        this.thisOneData()
        this.detailListData(1)
      },
//      取消搜索
      cancel: function () {
        this.query = {}
        this.thisOneData()
        this.detailListData(1)
      }
    },
    data: function () {
      return {
        timetext1: "开始时间",
        timetext2: "结束时间",
        id: '',
        page: [],
        list: [],
        detailList: [],
        gridOperate2: false,
        gridColumns2: {
          created_at: '时间',
          item_name: '品名',
          difference: '差异数量',
          unit_name: '单位',
          creator_name: '操作人',
          document_number: '盘点单号'
        },
        query: {
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>
