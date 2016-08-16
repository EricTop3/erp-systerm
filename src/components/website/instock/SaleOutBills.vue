<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">销售出库汇总</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline text-center">
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
          <input type="text" class="form-control" placeholder="请输入品名或货号" v-model="query.search">
        </div>
        <span class="btn btn-info" @click="listData()">搜索</span>
        <span class="btn btn-warning" @click="cancel">撤销搜索</span>
      </form>
    </div>
    <!-- 表格 -->
    <table class="table table-striped table-border table-hover">
      <thead>
      <tr class="text-center">
        <td class="text-left">货号</td>
        <td>品名</td>
        <td>零售出库量</td>
        <td>零售单位</td>
        <td>单位规格</td>
        <td>商品分类</td>
        <td>操作</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center" v-for="item in list" :id="item.id">
        <td class="text-left">{{item.item_code}}</td>
        <td>{{item.item_name}}</td>
        <td>{{item.amount}}</td>
        <td>{{item.unit_name}}</td>
        <td>{{item.unit_specification}}</td>
        <td>{{item.category_name.display_name}}</td>
        <td><span class="btn btn-info btn-sm" @click="detail($event)">销售明细</span></td>
      </tr>
      </tbody>
    </table>

    <!-- 翻页 -->
    <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
          :last-page="page.last_page"></page>
  </div>
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import DatePicker from  '../../common/DatePicker'
  import {requestUrl, token, searchRequest, error} from '../../../publicFunction/index'
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
          url: requestUrl + '/front-system/stock/sale',
          method: 'get',
          data: {
            start_time: this.query.start_time || '',
            end_time: this.query.end_time || '',
            search: this.query.search || '',
            category_id: this.query.category || '',
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
      cancel: function () {
        this.query.start_time = ''
        this.query.end_time = ''
        this.query.search = ''
        this.query.category = ''
        this.listData(1)
      },
//    生产明细点击>跳转页面，把id追加到浏览器地址栏后
      detail: function (event) {
        var detailId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = '/#!/site/instock/SaleOutBills/' + detailId
      }
    },
    data: function () {
      return {
        timetext1: "开始时间",
        timetext2: "结束时间",
        category: [],
        page: [],
        list: [],
        gridOperate: true,
        gridColumns: {
          item_code: '货号',
          item_name: '品名',
          amount: '零售出库量',
          unit_name: '零售单位',
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
