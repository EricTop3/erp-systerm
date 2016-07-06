<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">要货汇总</li>
      <li class="active">查看要货单</li>
    </ol>

    <!-- 表格 单条数据 -->
    <grid :data="list" :columns="gridColumns" :operate="!validateFlag">
      <div slot="operateList">
        <span class="btn btn-primary btn-sm" >编辑</span>
        <list-delete :delete-data="list"></list-delete>
      </div>
    </grid>

    <!-- 表格 详情列表 -->
    <grid :data="detailList" :columns="gridColumns2" :operate="gridOperate2"></grid>

    <!-- 翻页 -->
    <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
          :last-page="page.last_page"></page>

  </div>
</template>

<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import Modal from '../common/Modal'
  import ListValidate from '../common/ListValidate'
  import ListDelete from '../common/ListDelete'
  import {requestUrl} from '../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      ListValidate: ListValidate,
      ListDelete: ListDelete
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
      var num = str.indexOf('GoodsApplyNum') + 14
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
          url: requestUrl + '/front-system/stock/enquiry/' + this.id,
          method: 'get'
        }).then(function (response) {
          this.list = response.data.body
          var self = this
          $.each(this.list, function (index, val) {
            switch (val.check) {
              case 'start':
                val.check = '未审核'
                break
              case 'end':
                val.check = '已审核'
                self.validateFlag = true
                break
            }
            switch (val.receipts) {
              case 'start':
                val.receipts = '未处理'
                break
              case 'end':
                val.receipts = '已处理'
                break
            }
          })
        }, function (err) {
          console.log(err)
        })
      },
//      明细列表渲染 /front-system/stock/products/{id}/detail
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/enquiry/' + this.id + '/detail',
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
        validateModal: false,
        validateFlag: false,
        validateModalSize: 'modal-sm',
        gridOperate: true,
        gridColumns: {
          order_code: '单号',
          check: '审核状态',
          receipts: '单据状态',
          create_person: '制单人',
          check_person: '审核人',
          created_at: '制单日期',
          delivery_date: '送货日期',
          number: '要货数量'
        },
        gridOperate2: false,
        gridColumns2: {
          goods_code: '货号',
          goods_name: '品名',
          number: '要货数量',
          unit: '单位',
          unit_specification: '单位规格'
        }
      }
    }
  }
</script>
