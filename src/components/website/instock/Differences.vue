<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">盘点差异汇总</li>
    </ol>
    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline">
        <div class="form-group ml10">
          <label>商品分类</label>
          <select class="form-control" v-model="query.category">
            <option value="">请选择</option>
            <option v-for="item in category" :value="item.id">{{item.display_name}}</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>销售时间段</label>
          <date-picker :value.sync="query.start_time" :time-text="timetext1"></date-picker>
          -
          <date-picker :value.sync="query.end_time" :time-text="timetext2"></date-picker>
        </div>
        <div class="form-group">
          <label>品名或货号</label>
          <input type="text" class="form-control" placeholder="请输入品名或货号" v-model="query.search">
        </div>
        <button class="btn btn-info" @click="search">搜索</button>
        <span class="btn btn-warning" @click="cancel()">撤销搜索</span>
      </form>
    </div>
    <!-- 表格 -->
    <grid :data="list" :columns="gridColumns" :operate="gridOperate">
      <div slot="operateList">
        <span class="btn btn-info btn-sm" @click="detail($event)">差异明细</span>
      </div>
    </grid>
    <!--分页-->
    <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
          :last-page="page.last_page">
    </page>
  </div>
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import DatePicker from '../../common/DatePicker'
  import {requestUrl, token, searchRequest, exchangeData, error} from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      DatePicker: DatePicker,
      SiteNav: SiteNav
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.listData(currentpage)
      }
    },
    ready: function () {
      this.listData(1)
//      获取商品分类
      this.$http({
        url: requestUrl + '/front-system/order/category',
        method: 'get',
        headers: {'X-Overpowered-Token': token},
      }).then(function (response) {
        this.category = response.data.body.list
      }, function (err) {
        error(err)
      })
    },
    methods: {
//    列表数据渲染
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/difference',
          method: 'get',
          data: {
            start_time: this.query.start_time || '',
            end_time: this.query.end_time || '',
            search: this.query.search || '',
            category: this.query.category || '',
            page: page,
            per_page: 16
          },
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.list = response.data.body.list
        }, function (err) {
          error(err)
        })
      },
      detail: function (event) {
        var detailId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = this.detailUrl + detailId
      },
      //      搜索页面
      search: function () {
        var self = this
        searchRequest(
          requestUrl + '/front-system/stock/difference',
          {
            start_time: this.query.start_time,
            end_time: this.query.end_time,
            category_id: this.query.category,
            search: this.query.search,
            per_page: 16
          },
          function (response) {
            self.list = response.data.body.list
            self.page = response.data.body.pagination
            exchangeData(self.list)
          }
        )
      },
      cancel: function () {
        this.query.start_time = ''
        this.query.end_time = ''
        this.query.search = ''
        this.query.category = ''
        this.listData(1)
      }
    },
    data: function () {
      return {
        timetext1: "开始时间",
        timetext2: "结束时间",
        category: [],
        page: [],
        list: [],
        detailUrl: '/#!/site/instock/Differences/',
        gridOperate: true,
        gridColumns: {
          item_code: '货号',
          item_name: '品名',
          difference: '差异库存量',
          unit_name: '单位',
          unit_specification: '单位规格',
          category_name: '商品分类'
        },
        query: {
          start_time: '',
          end_time: '',
          search: '',
          category: ''
        }
      }
    }
  }
</script>
