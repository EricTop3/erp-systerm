<template>
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
            <option v-for="item in category" :value="item.id">{{item.display_name}}</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>销售时间段</label>
          <date-picker :value.sync="query.start_time"></date-picker>-
          <date-picker :value.sync="query.end_time"></date-picker>
        </div>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="请输入品名或货号" v-model="query.search">
        </div>
        <button class="btn btn-info" @click="search">搜索</button>
        <span class="btn btn-warning" @click="cancel">撤销搜索</span>
      </form>
    </div>

    <!-- 表格 -->
    <grid :data="list" :columns="gridColumns" :operate="gridOperate">
      <div slot="operateList">
        <span class="btn btn-info btn-sm" @click="detail($event)">销售明细</span>
      </div>
    </grid>

    <!-- 翻页 -->
    <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
          :last-page="page.last_page"></page>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import DatePicker from  '../common/DatePicker'
  import {requestUrl,token,searchRequest} from '../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
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
//      获取商品分类
      this.$http({
        url: requestUrl + '/front-system/order/category',
        method: 'get',
        headers: {'X-Overpowered-Token': token},
      }).then(function (response) {
        this.category = response.data.body.list
      }, function (err) {
        console.log(err)
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
            category: this.query.category || '',
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
      },
//      搜索页面
      search: function () {
        var self = this
        searchRequest(
          requestUrl + '/front-system/stock/products',
          {
            start_time: this.query.start_time,
            end_time: this.query.end_time,
            category_id: this.query.category,
            search: this.query.search,
            per_page: 16
          },
          function (response){
            self.list = response.data.body.list
            self.page = response.data.body.pagination
          }
        )
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
        window.location.href = '/#!/instock/SaleOutBills/' + detailId
      }
    },
    data: function () {
      return {
        category: [],
        page: [],
        list: [],
        gridOperate: true,
        gridColumns: {
          consumable_code: '货号',
          consumable_name: '品名',
          sale_amount: '零售出库量',
          unit: '零售单位',
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
