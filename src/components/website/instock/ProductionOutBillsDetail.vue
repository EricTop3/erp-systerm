<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">生产出库汇总</li>
      <li class="active">生产出库明细</li>
    </ol>

    <!-- 表格 单条数据 -->
    <table class="table table-striped table-border table-hover">
      <thead>
      <tr class="text-center">
        <td class="text-left">货号</td>
        <td>品名</td>
        <td>生产出库量</td>
        <td>单位</td>
        <td>单位规格</td>
        <td>商品分类</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center">
        <td class="text-left">{{list.goods_code}}</td>
        <td>{{list.goods_name}}</td>
        <td>{{list.amount}}</td>
        <td>{{list.unit_name}}</td>
        <td>{{list.unit_specification}}</td>
        <td>{{list.category_name}}</td>
      </tr>
      </tbody>
    </table>
    <!-- 表格 详情列表 -->
    <grid :data="detailList" :columns="gridColumns2" :operate="gridOperate2"></grid>

    <!-- 翻页 -->
    <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
          :last-page="page.last_page" v-if="detailList.length > 0"></page>

  </div>
</template>
<script>
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import SummaryDetail from '../../common/SummaryDetail'
  import {requestUrl, token, error} from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
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
      this.id = this.$route.params.queryId
//      单条数据渲染
      this.thisOneData()
//      明细列表渲染
      this.detailListData(1)
    },
    methods: {
//      当前id的一条数据
      thisOneData: function () {
        this.id = this.$route.params.queryId
        this.$http({
          url: requestUrl + '/front-system/stock/produce-put/' + this.id + '/detail',
          method: 'get',
          data: {
            start_time: this.$route.query.start_time,
            end_time: this.$route.query.end_time
          },
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.list = response.data.body
        }, function (err) {
          error(err)
        })
      },
//      明细列表渲染 /front-system/stock/products/{id}/detail
      detailListData: function (page) {
        this.id = this.$route.params.queryId
        this.$http({
          url: requestUrl + '/front-system/stock/produce-put/' + this.id,
          method: 'get',
          data: {
            start_time: this.$route.query.start_time,
            end_time: this.$route.query.end_time,
            page: page,
            per_page: 16
          },
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.detailList = response.data.body.list
        }, function (err) {
          error(err)
        })
      }
    },
    data: function () {
      return {
        id: 0,
        page: [],
        list: [],
        detailList: [],
        gridOperate: true,
        gridColumns: {
          consumable_code: '货号',
          consumable_name: '品名',
          amount: '生产出库量',
          unit: '单位',
          unit_specification: '单位规格',
          category_name: '商品分类'
        },
        gridOperate2: false,
        gridColumns2: {
          created_at: '时间',
          goods_name: '品名',
          amount: '生产出库量',
          unit_name: '单位',
          creator_name: '操作人',
          document_number: '单号'
        },
        query: {
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>
