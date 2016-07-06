<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">收货单汇总</li>
      <li class="active">查看收货单</li>
    </ol>

    <!-- 表格 单条数据 -->
    <grid :data="list" :columns="gridColumns" :operate="gridOperate">
      <div slot="operateList">
        <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#inventory-audit-templ">审核</span>
        <span class="btn btn-primary btn-sm">编辑</span>
        <span class="btn btn-warning btn-sm">删除</span>
      </div>
    </grid>

    <div>
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a href="#detail"  data-toggle="tab">入库明细</a></li>
        <li role="presentation"><a href="#summary"  data-toggle="tab">入库汇总</a></li>
      </ul>

      <!-- Tab panes -->
      <div class="tab-content">
        <div role="tabpanel" class="tab-pane active" id="detail">
          <!-- 表格 详情列表 -->
          <grid :data="detailList" :columns="gridColumns2" :operate="gridOperate2"></grid>

          <!-- 翻页 -->
          <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
                :last-page="page.last_page"></page>
        </div>
        <div role="tabpanel" class="tab-pane" id="summary">
          <!--&lt;!&ndash; 表格 详情列表 &ndash;&gt;-->
          <!--<grid :data="detailList3" :columns="gridColumns3" :operate="gridOperate3"></grid>-->

          <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
          <!--<page :total="page3.total" :current.sync="page3.current_page" :display="page3.per_page"-->
                <!--:last-page="page3.last_page"></page>-->
        </div>
      </div>
    </div>

  </div>

  <!--模态框-审核-->
  <div class="modal fade" id="inventory-audit-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">审核</h4>
        </div>
        <div class="modal-body">
          <h4>审核弹出框！</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary">保存</button>
        </div>
      </div>
    </div>
  </div>
  <!--模态框HTML-->

  <!--模态框-删除-->
  <div class="modal fade" id="inventory-del-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">审核</h4>
        </div>
        <div class="modal-body">
          <h4>删除弹出框！</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary">保存</button>
        </div>
      </div>
    </div>
  </div>
  <!--模态框HTML-->
</template>

<script>
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
//        this.detailListData(currentpage)
        console.log(currentpage)
      }
    },
    ready: function () {
      var str = window.location.href
      var num = str.indexOf('AllotNum') + 9
      var id = str.substr(num)
      this.id = id
//      单条数据渲染
      this.thisOneData()
//      明细列表渲染
      this.listData(1)
    },
    methods: {
//      当前id的一条数据
      thisOneData: function () {
        this.$http({
          url: requestUrl + '/front-system/stock/recipient/' + this.id,
          method: 'get'
        }).then(function (response) {
          this.list = response.data.body
        }, function (err) {
          console.log(err)
        })
      },
//      明细列表渲染 /front-system/stock/products/{id}/detail
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/recipient/' + this.id + '/detail',
          method: 'get'
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.detailList = response.data.body.list
        }, function (err) {
          console.log(err)
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
          order_code: '单号',
          check_status: '审核状态',
          create_person: '制单人',
          check_person: '审核人',
          date: '收货日期',
          number: '收货数量'
        },
        gridOperate2: false,
        gridColumns2: {
          goods_code: '货号',
          goods_name: '品名',
          recipient_number: '要货数量',
          distribution_number: '配送数量',
          now_number: '实际入库量',
          unit: '单位',
          unit_specification: '单位规格',
          order_source_code: '来源单号'
        },
        page3: [],
        gridOperate3: false,
        gridColumns3: {
          goods_code: '货号',
          goods_name: '品名',
          recipient_number: '要货数量',
          distribution_number: '配送数量',
          now_number: '实际入库量',
          unit: '单位',
          unit_specification: '单位规格'
        }
      }
    }
  }
</script>
