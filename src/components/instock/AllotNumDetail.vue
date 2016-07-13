<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">收货单汇总</li>
      <li class="active">查看收货单</li>
    </ol>

    <table class="table table-striped table-bordered table-hover">
      <thead>
      <tr class="text-center">
        <th v-for="value in gridColumns">
          {{value}}
        </th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center" v-for="entry in  list" track-by="$index" :id="[entry.id ? entry.id : '']">
        <td v-for="value in gridColumns">
          {{entry[$key]}}
        </td>
        <td>
          <slot name="operate">
            <list-validate :list.sync="list" :flag.sync="validateFlag" v-if="entry.checked==='未审核'" v-on:finishEdit="finishEdit"></list-validate>
            <span class="btn btn-primary btn-sm" @click="edit" v-if="entry.checked==='未审核'">编辑</span>
          </slot>
      </tr>
      </tbody>
    </table>

    <div>
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a href="#detail" data-toggle="tab">入库明细</a></li>
        <li role="presentation"><a href="#summary" data-toggle="tab">入库汇总</a></li>
      </ul>

      <!-- Tab panes -->
      <div class="tab-content">
        <!-- 入库明细 -->
        <div role="tabpanel" class="tab-pane active" id="detail">
          <!-- 表格 详情列表 -->
          <grid :data="detailList" :columns="gridColumns2" :operate="gridOperate2"></grid>

          <!-- 翻页 -->
          <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
                :last-page="page.last_page"></page>
        </div>

        <!-- 入库汇总 -->
        <div role="tabpanel" class="tab-pane" id="summary">
          <!-- 表格 详情列表 -->
          <grid :data="detailList" :columns="gridColumns3" :operate="gridOperate3"></grid>

          <!-- 翻页 -->
          <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
                :last-page="page.last_page"></page>
        </div>
      </div>
    </div>

  </div>
  <!--模态框HTML-->
</template>

<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import Modal from '../common/Modal'
  import ListValidate from '../common/ListValidate'
  import {requestUrl, token,searchRequest } from '../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      ListValidate: ListValidate
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
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.list = response.data.body
          var self = this
            $.each(this.list, function (index, val) {
              self.dataId = val.id
              self.checked = val.checked
              if (val.checked == '0') {
                val.checked = '未审核'
              } else {
                val.checked = '已审核'
              }
            })
        }, function (err) {
          console.log(err)
        })
      },
//      明细列表渲染 /front-system/stock/products/{id}/detail
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/recipient/' + this.id + '/detail',
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.detailList = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      },
//    审核
      inventory: function () {
        this.inventoryAuditModal = true
        console.log(this.dataId)
      },
//     确认审核
      sureInventory: function () {
        console.log(this.dataId)
        this.$http.put(requestUrl + '/front-system/stock/inventory/' + this.dataId,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Overpowered-Token': token
            }
          }).then(function (response) {
          this.inventoryAuditModal = false
          this.checked = '已审核'

        }, function (err) {
          console.log(err)
        })
      }
    },
    data: function () {
      return {
        id: 0,
        page: [],
        inventoryAuditModal: false,
        inventoryAuditModalSize: 'modal-sm',
        dataId: '',
        checked: '',
        list: [],
        detailList: [],
        gridOperate: true,
        gridColumns: {
          order_number: '单号',
          checked: '审核状态',
          creator: '制单人',
          auditor: '审核人',
          date: '收货日期',
          amount: '收货数量'
        },
        gridOperate2: false,
        gridColumns2: {
          goods_code: '货号',
          goods_name: '品名',
          recipient_amount: '要货数量',
          distribution_amount: '配送数量',
          current_amount: '实际入库量',
          unit: '单位',
          unit_specification: '单位规格',
          order_source_code: '来源单号'
        },
        page3: [],
        gridOperate3: false,
        gridColumns3: {
          goods_code: '货号',
          goods_name: '品名',
          recipient_amount: '要货数量',
          distribution_amount: '配送数量',
          current_amount: '实际入库量',
          unit: '单位',
          unit_specification: '单位规格'
        }
      }
    }
  }
</script>
<style scoped>
  table thead tr th {
    text-align: center
  }

  table thead tr th:first-child {
    text-align: left;
  }

  table tbody tr td:first-child {
    text-align: left;
  }
</style>
