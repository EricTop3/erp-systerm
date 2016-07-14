<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">盘点单汇总</li>
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
          <label>盘点时间段</label>
          <date-picker
            :value.sync="orderStartTime"
          >
          </date-picker>
          -
          <date-picker
            :value.sync="orderEndTime"
          >
          </date-picker>
        </div>
        <button type="submit" class="btn btn-info" @click="listData(1)">搜索</button>
        <span class="btn btn-warning" @click="cancel()">撤销搜索</span>
        <a v-link="{ path: '/instock/InventoryCreate'}" ><span class="btn btn-primary" style="display: inline-block; float:right;">新建盘点单</span></a>
      </form>
    </div>
  <!--列表详情-->
    <summary :table-header="gridColumns" :table-data="list" :detail-url="detailUrl" :page="page"></summary>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import DatePicker from '../common/DatePicker'
  import Summary from '../common/Summary'
  import {requestUrl,token} from '../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      DatePicker: DatePicker,
      Summary: Summary
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.listData(currentpage)
//        console.log(currentpage)
      }
    },
    ready: function () {
//      请求列表
      this.listData(1)
    },
    methods: {
//    生产出库-列表数据渲染
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/inventory',
          method: 'get',
          data: {
            start_time: this.query.start_time || '',
            end_time: this.query.end_time || '',
            order_code: this.query.order_code || '',
            check_status: this.query.check_status || '',
            create_person: this.query.create_person || '',
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
      cancel: function () {
        this.query.start_time = ''
        this.query.end_time = ''
        this.query.order_code = ''
        this.query.check_status = ''
        this.query.create_person = ''
        this.listData(1)
      },
//    明细点击>跳转页面，把id追加到浏览器地址栏后
      detail: function (event) {
        var detailId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = '/#!/instock/Inventory/' + detailId
      }
    },
    data: function () {
      return {
        page: [],
        detailUrl:  '/#!/instock/Inventory/',
        list: [],
        gridOperate: true,
        gridColumns: {
          order_number: '盘点单号',
          checked: '审核状态',
          create_person: '制单人',
          check_person: '审核人',
          created_at: '盘点日期',
          differ_amount: '差异库存量'
        },
        query: {
          start_time: '',
          end_time: '',
          order_code: '',
          check_status: '',
          create_person: ''
        }
      }
    }
  }
</script>
