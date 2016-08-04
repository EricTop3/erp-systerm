<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">库存查询</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline">
        <div class="form-group">
          <label>时间段</label>
          <date-picker :value.sync="search.start_time"></date-picker>-
          <date-picker :value.sync="search.ned_time"></date-picker>
        </div>
        <div class="form-group ml10">
          <label>商品分类</label>
          <select class="form-control" v-model="search.category_id">
            <option value="">请选择</option>
            <option v-for="item in categoryList" :value="item.id">{{item.display_name}}</option>
          </select>
        </div>
        <div class="form-group ml10">
          <input type="text" class="form-control" placeholder="请输入商品名或商品编号" v-model="search.name">
        </div>
        <div class="form-group ml10">
          <label><input type="checkbox" v-model="search.safe_stock">库存警戒中</label>
        </div>
        <button class="btn btn-primary" @click="searchMethod()">搜索</button>
        <button class="btn btn-default" @click="cancelSearch()">撤销搜索</button>
      </form>
    </div>

    <!-- 表格 -->
    <grid :data="productList" :columns="gridColumns" :operate="gridOperate">
      <div slot="operateList">
        <span class="btn btn-info btn-sm" @click="detail($event)">出入库明细</span>
      </div>
    </grid>

    <!-- 翻页 -->
    <page
      :total="page.total"
      :current.sync="page.current_page"
      :display="page.per_page"
      :last-page="page.last_page" v-if="productList.length>0"
    >
    </page>
  </div>
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import DatePicker from '../../common/DatePicker'
  import {
    searchRequest,
    token,
    getDataFromSiteApi,
    requestSystemUrl,
    error
  } from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      DatePicker: DatePicker,
      SiteNav: SiteNav
    },
    ready: function () {
//      获取分类
      var self = this
      var caUrl = requestSystemUrl + '/front-system/order/category'
      getDataFromSiteApi(caUrl, {}, function (response) {
        self.categoryList = response.data.body.list
      })

//      库存查询列表
      this.inventoryListData({})
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        var self = this
        this.$http({
          url: requestSystemUrl + '/front-system/stock/log',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          self.page = response.data.body.pagination
          self.productList = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      }
    },
    methods: {
// 库存列表数据渲染
      inventoryListData: function (data) {
        var self = this
        var url = requestSystemUrl + '/front-system/stock/log'
        getDataFromSiteApi(url, data, function (response) {
          self.productList = response.data.body.list
          self.numberChange(self.productList)
          self.page = response.data.body.pagination
          console.log('yes')
        })
      },
//    搜索
      searchMethod: function () {
        var data = {
          start_time: this.search.start_time || '',
          ned_time: this.search.ned_time || '',
          category_id: this.search.category_id || '',
          name: this.search.name || '',
          safe_stock: this.search.safe_stock || ''
        }
        this.inventoryListData(data)
      },
//    取消搜索
      cancelSearch: function () {
        this.search.start_time = ''
        this.search.ned_time = ''
        this.search.category_id = ''
        this.search.name = ''
        this.search.safe_stock = ''

        this.inventoryListData({})
      },
//      负数变为正数
      numberChange: function (list) {
        $.each(list, function (index, val) {
          if ( val.out_stock < 0 ) {
            val.out_stock = val.out_stock * (-1)
          }
        })
      },
//      出入库明细点击
      detail: function (event) {
        this.detailId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = '/#!/site/instock/InventoryQuery/' + this.detailId
      }
    },
    data: function () {
      return {
        categoryList: [],
        detailId: '',
        page: [],
        list: [],
        gridOperate: true,
        productList: [],
        gridColumns: {
          goods_code: '货号',
          goods_name: '品名',
          warehouse_name: '仓库',
          start_stock: '期初库存量',
          in_stock: '期间入库量',
          out_stock: '期间出库量',
          current_stock: '期末库存量',
          unit_name: '单位',
          unit_specification: '单位规格'
        },
        search: {
          start_time: '',
          ned_time: '',
          category_id: '',
          name: '',
          safe_stock: false
        }
      }
    }
  }
</script>

