<template>
  <site-nav></site-nav>
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
          <input type="text" class="form-control" placeholder="请填写单号" v-model="query.order_code">
        </div>
        <div class="form-group ml10">
          <label>审核状态</label>
          <select class="form-control" v-model="query.check_status">
            <option value="">请选择</option>
            <option value="1">已审核</option>
            <option value="0">未审核</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>制单人</label>
          <select class="form-control" v-model="query.create_person">
            <option value="">请选择</option>
            <option v-for="item in creators" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>盘点时间段</label>
          <date-picker :value.sync="query.start_time" :time-text="timetext1"></date-picker>
          -
          <date-picker :value.sync="query.end_time" :time-text="timetext2"></date-picker>
        </div>
        <span class="btn btn-info" @click="search">搜索</span>
        <span class="btn btn-warning" @click="cancel()">撤销搜索</span>
        <a v-link="{ path: '/site/instock/InventoryCreate'}"><span class="btn btn-primary" style="display: inline-block; float:right;">新建盘点单</span></a>
      </form>
    </div>

    <!--列表详情-->
    <summary :table-header="gridColumns"
             :table-data="list"
             :check-url="checkUrl"
             :page="page"
             :special-show="specialShow"
             :has-validate-authority="true"
             :has-look-authority = "true"
             :has-finish-authority="true"
             :has-delete-authority= "true"></summary>

  </div>
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import DatePicker from '../../common/DatePicker'
  import Summary from '../../common/Summary'
  import {requestUrl, requestSystemUrl, token,searchRequest,changeStatus,deleteRequest,checkRequest,finishRequest, error,getDataFromSiteApi } from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      DatePicker: DatePicker,
      Summary: Summary,
      SiteNav: SiteNav
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.listData(currentpage)
      },
//     删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl + '/front-system/stock/inventory/'+ id,function(response){
          self.listData({})
        })
      },
//    查看详情
      gotoDetail: function (id){
        window.location.href = '#!/site/instock/Inventory/'+ id
      }
    },
    ready: function () {
      var self  = this
//      请求列表
      this.listData(1)
//      制单人
      getDataFromSiteApi(requestUrl + '/front-system/account', {}, function (response) {
        self.creators = response.data.body.list
      })
    },
    methods: {
//    盘点单-列表数据渲染
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
          changeStatus(this.list)
        }, function (err) {
          error(err)
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
//      搜索页面
      search: function () {
        var self = this
        searchRequest(
          requestUrl + '/front-system/stock/inventory',
          {
            start_time: this.query.start_time,
            end_time: this.query.end_time,
            order_number: this.query.order_code,
            checked: this.query.check_status,
            creator_id: this.query.create_person,
            per_page: 16
          },
          function (response) {
            self.list = response.data.body.list
            self.page = response.data.body.pagination
            changeStatus(self.list)
          }
        )
      },
//    明细点击>跳转页面，把id追加到浏览器地址栏后
      detail: function (event) {
        var detailId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = '/#!/site/instock/Inventory/' + detailId
      }
    },
    data: function () {
      return {
        timetext1: "开始时间",
        timetext2: "结束时间",
        specialShow: true,
        creators: [],
        page: [],
        checkUrl: requestUrl + '/front-system/stock/inventory/',
        list: [],
        gridOperate: true,
        gridColumns: {
          document_number: '盘点单号',
          checked: '审核状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          created_at: '盘点日期',
          difference: '差异库存量'
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
