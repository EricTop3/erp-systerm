<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">盘点单汇总</li>
      <li class="active">查看盘点单</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline text-center">
        <div class="form-group">
          <label>备注</label>
          <input type="text" class="form-control" placeholder="">
          <label>盘点日期</label>
          <input type="text" class="form-control date_picker" placeholder="开始时间" v-model="query.start_time">
        </div>
        <span class="btn btn-info" @click="addGoodModal=true">选择盘点商品</span>
        <span class="btn btn-primary" @click="inventoryAll()">盘点所有商品</span>
        <span class="btn btn-warning" @click="upLoadEnquiry()">提交盘点</span>
      </form>
    </div>

    <!-- 表格 -->
    <table class="table table-striped table-border table-hover">
      <thead>
      <tr class="text-center">
        <td class="text-left">货号</td>
        <td>品名</td>
        <td>系统库存量</td>
        <td>实际库存量</td>
        <td>差异库存量</td>
        <td>单位</td>
        <td>单位规格</td>
        <td>操作</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center" v-for="item in rederStockGoods" track-by="$index" :id="item.id">
        <td class="text-left">{{item.goods_code}}</td>
        <td>{{item.goods_name}}</td>
        <td>{{item.stock}}</td>
        <td align="center">
          <input type="text" class="form-control text-center" style="width:70px;" v-model="item.is_number">
        </td>
        <td>
          <div v-if="item.is_number==''"></div>
          <div v-else>{{item.stock - item.is_number}}</div>
        </td>
        <td>{{item.unit}}</td>
        <td>{{item.unit_specification}}</td>
        <td><span class="btn btn-primary btn-sm" @click="isDelete($event)">删除</span></td>
      </tr>
      </tbody>
    </table>

    <!--分页-->
    <page :total='rederStockGoods.length' :current.sync='instockPage.current_page' :display='instockPage.per_page'
          :last-page='instockPage.last_page'>
    </page>
  </div>
  <!--模态框-添加商品-->
  <stock-goods :stock-add-good-modal.sync="addGoodModal" :stock-add-good-modal-size="addGoodModalSize"
               :add-data.sync="stockGoods"></stock-goods>
  <!--模态框HTML-->

  <!--模态框-删除-->
  <modal :show.sync="deleteModal" :modal-size="deleteModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">删除</h4>
    </div>
    <div slot="body">
      <h4>删除弹出框！</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmDelelte()">确定</button>
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="deleteModal=false">取消</button>
    </div>
  </modal>
  <!--模态框HTML-->
</template>
<script>
  import $ from 'jquery'
  import Count from '../common/Count'
  import StockGoods from '../common/StockGoodsOperate'
  import Grid from '../common/Grid'
  import Modal from '../common/Modal'
  import Page from '../common/Page'
  import {requestUrl} from '../../publicFunction/index'
  var deleteId = ''
  export default {
    components: {
      StockGoods: StockGoods,
      Grid: Grid,
      Count: Count,
      Modal: Modal,
      Page: Page
    },
    events: {
//           确认增加
      confirmAdd: function () {
        var self = this
        $.each(self.stockGoods, function (index, val) {
          if (val.checked) {
            self.dataArray.push(val)
          }
        })
        this.rederStockGoods = self.dataArray
        self.dataArray = []
        this.addGoodModal = false
      },
    },
    methods: {
//      盘点所有商品
      inventoryAll: function () {
        this.$http({
          url: requestUrl + '/front-system/stock/goods',
          method: 'get'
        }).then(function (response) {
          this.rederStockGoods = response.data.body.list
          this.page = response.data.body.pagination
        }, function (err) {
          console.log(err)
        })
      },
//      明细列表渲染
      detailListData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/inventory/' + this.id + '/detail',
          method: 'get',
          data: {
            start_time: this.query.start_time || '',
            end_time: this.query.end_time || '',
            operation_type: this.query.operation_type || '',
            page: page,
            per_page: 10
          }
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.detailList = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      },
//     删除弹出框
      isDelete: function (event) {
        var currentId = Number($(event.currentTarget).parents('tr').attr('id'))
        deleteId = currentId
        this.deleteModal = true
      },
//      确认删除
      confirmDelelte: function () {
        var goodList = this.rederStockGoods
        this.deleteModal = false
        $.each(goodList, function (index, val) {
          if (val.id === deleteId) {
            goodList.splice(index, 1)
          }
        })
      },
//      提交盘点
      upLoadEnquiry: function () {
        var inventory = []
        $.each(this.rederStockGoods, function (index, val) {
          var obj = {}
          obj['id'] = val.id
          obj['amount'] = Number(val['is_number'])
          inventory.push(obj)
        })
//       提交盘点请求
        this.$http({
          url: requestUrl + '/front-system/stock/inventory',
          method: 'post',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          params: {
            inventory: inventory
          }
        }).then(function (reponse) {
          window.location.href = '/#!/instock/Inventory'
        }, function (err) {
          console.log(err)
        })
      }
    },
    data: function () {
      return {
        instockPage: [],
        deleteModal: false,
        deleteModalSize: 'modal-sm',
        addGoodModal: false,
        addGoodModalSize: 'modal-lg',
        stockGoods: [],
        dataArray: [],
        rederStockGoods: []
      }
    }
  }
</script>
