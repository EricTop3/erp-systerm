<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">调拨出货汇总</li>
      <li class="active">新建调拨单</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline">
        <div class="form-group">
          <label>出货时间</label>
          <date-picker
            :value.sync="date"
          >
          </date-picker>
        </div>
        <div class="form-group">
          <label>收货仓库</label>
          <select class="form-control" v-model="receipts_store">
            <option>全部</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>备注</label>
          <input type="text" class="form-control" placeholder="" v-model="remarks">
        </div>

        <span class="btn btn-info" @click="addGoodModal=true">添加商品</span>
        <span class="btn btn-primary" @click="upLoadEnquiry()">提交出货</span>
      </form>
    </div>


    <!-- 表格 -->
    <table class="table table-striped table-border table-hover">
      <thead>
      <tr class="text-center">
        <td class="text-left">货号</td>
        <td>品名</td>
        <td>日均销量</td>
        <td>当前库存</td>
        <td>出货数量</td>
        <td>单位</td>
        <td>单位规格</td>
        <td>操作</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center" v-for="item in rederStockGoods" track-by="$index" :id="item.id">
        <td class="text-left">{{item.goods_code}}</td>
        <td>{{item.goods_name}}</td>
        <td>{{item.day_sales}}</td>
        <td>{{item.stock}}</td>
        <td align="center">
          <count :count.sync='item.is_number'></count>
        </td>
        <td>{{item.unit}}</td>
        <td>{{item.unit_specification}}</td>
        <td><span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#inventory-del-templ"
                  @click="isDelete($event)">删除</span></td>
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
      <button type="button" class="btn btn-primary" @click="confirmDelelte()">保存</button>
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="deleteModal=false">关闭</button>
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
  import DatePicker from '../common/DatePicker'
  import {requestUrl} from '../../publicFunction/index'
  var deleteId = ''
  export default {
    components: {
      StockGoods: StockGoods,
      Grid: Grid,
      Count: Count,
      Modal: Modal,
      Page: Page,
      DatePicker: DatePicker
    },
    events: {
//   确认增加
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
      }
    },
    methods: {
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
//      提交出货
      upLoadEnquiry: function () {
        var goods = []
        $.each(this.rederStockGoods, function (index, val) {
          var obj = {}
          obj['id'] = val.id
          obj['amount'] = Number(val['is_number'])
          goods.push(obj)
        })
//       提交要货请求
        this.$http.post(requestUrl + '/front-system/stock/issue',
          {
            goods: goods,
            date: this.date,
            remarks: this.remarks,
            receipts_store: this.receipts_store
          }
        ).then(function (reponse) {
          console.log(response)
//          window.location.href = '/?#!/instock/AllotOutBills/1'
        }, function (err) {
          console.log(err)
        })
      }
    },
    data: function () {
      return {
        date: '',
        remarks: '',
        receipts_store: '金星门店',
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
