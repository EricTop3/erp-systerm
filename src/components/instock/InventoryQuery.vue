<template>
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
          <input type="text" class="form-control date_picker" placeholder="开始时间" v-model="query.start_time"> -
          <input type="text" class="form-control date_picker" placeholder="结束时间" v-model="query.end_time">
        </div>
        <div class="form-group ml10">
          <label>商品分类</label>
          <select class="form-control">
            <option>请选择</option>
          </select>
        </div>
        <div class="form-group ml10">
          <input type="text" class="form-control" placeholder="请输入商品名或商品编号" v-model="query.search">
        </div>
        <div class="form-group ml10">
          <label><input type="checkbox" v-model="query.minimal_unit_stock">库存警戒中</label>
        </div>
        <button type="submit" class="btn btn-primary" @click="inventoryListData(1)">搜索</button>
        <button type="submit" class="btn btn-default" @click="cancel()">撤销搜索</button>
      </form>
    </div>

    <!-- 表格 -->
    <grid :data="list" :columns="gridColumns" :operate="gridOperate">
      <div slot="operateList">
        <span class="btn btn-info btn-sm" @click="detail($event)">出入库明细</span>
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
  import {requestUrl} from '../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page
    },
    events: {
      pagechange: function (currentpage) {
        this.inventoryListData(currentpage)
      }
    },
    methods: {
// 库存列表数据渲染
      inventoryListData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/storage',
          method: 'get',
          data: {
            start_time: this.query.start_time || '',
            end_time: this.query.end_time || '',
            search: this.query.search || '',
            minimal_unit_stock: this.query.minimal_unit_stock || '',
            category_id: this.query.category_id || '',
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
      cancel: function () {
        this.query.start_time = ''
        this.query.end_time = ''
        this.query.search = ''
        this.query.minimal_unit_stock = ''
        this.query.category_id = ''
        this.inventoryListData(1)
      },
//      出入库明细点击
      detail: function (event) {
        this.detailId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = '/#!/instock/InventoryQuery/' + this.detailId
      }
    },
    ready: function () {
//      库存查询列表
      this.inventoryListData(1)
    },
    data: function () {
      return {
        detailId: 1,
        page: [],
        list: [],
        gridOperate: true,
        gridColumns: {
          goods_code: '货号',
          goods_name: '品名',
          warehouse: '仓库',
          begin_stock: '期初库存量',
          storage_stock: '期间入库量',
          outbound_stock: '期间出库量',
          end_stock: '期末库存量',
          unit: '单位',
          unit_specification: '单位规格'
        },
        query: {
          start_time: '',
          end_time: '',
          search: '',
          minimal_unit_stock: false,
          category_id: ''
        }
      }
    }
  }
</script>

