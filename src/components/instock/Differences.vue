<template>
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
          <select class="form-control">
            <option>请选择</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>销售时间段</label>
          <input type="text" class="form-control date_picker" placeholder="开始时间" v-model="query.start_time"> -
          <input type="text" class="form-control date_picker" placeholder="结束时间" v-model="query.end_time">
        </div>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="请输入品名或货号" v-model="query.search">
        </div>
        <button type="submit" class="btn btn-info" @click="listData(1)">搜索</button>
        <span class="btn btn-warning" @click="cancel()">撤销搜索</span>
      </form>
    </div>

    <!--汇总列表-->
    <summary :table-data.sync="list" :table-header.sync="gridColumns" :page.sync="page"
             :detail-url.sync="detailUrl">
       <div slot="operate">
         <span class="btn btn-info btn-sm" @click="detail($event)">差异明细</span>
       </div>
    </summary>
    <!-- 表格 -->
    <grid :data="list" :columns="gridColumns" :operate="gridOperate">
      <div slot="operateList">
        <span class="btn btn-info btn-sm" @click="detail($event)">差异明细</span>
      </div>
    </grid>
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
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.listData(currentpage)
      }
    },
    ready: function () {
      this.listData(1)
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
        this.query.category = ''
        this.listData(1)
      }
    },
    data: function () {
      return {
        page: [],
        list: [],
        detailUrl: '/#!/instock/Differences/',
        gridOperate: true,
        gridColumns: {
          code: '货号',
          name: '品名',
          difference_number: '差异库存量',
          unit: '单位',
          unit_specification: '单位规格',
          category: '商品分类'
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
