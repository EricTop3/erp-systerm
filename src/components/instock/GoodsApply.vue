<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">要货单汇总</li>
      <li class="active">查看要货单</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header text-center">
      <form action="" method="post" class="form-inline">
        <div class="form-group ml10">
          <label>送货时间</label>
          <date-picker  :value.sync="sendStartTime"></date-picker>
        </div>
        <div class="form-group">
          <label>备注</label>
          <input type="text" class="form-control" placeholder="" v-model="remarks">
        </div>
        <span class="btn btn-info" data-toggle="modal" data-target="#inventory-add-templ" @click="addGoodModal=true">添加商品</span>
        <span class="btn btn-info" @click="upLoadEnquiry()">提交要货</span>
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
        <td>要货数量</td>
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
        <td>
          <list-delete :delete-data.sync="rederStockGoods"></list-delete>
        </td>
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
</template>
<script>
  import $ from 'jquery'
  import Count from '../common/Count'
  import StockGoods from '../common/StockGoodsOperate'
  import Grid from '../common/Grid'
  import Modal from '../common/Modal'
  import Page from '../common/Page'
  import DatePicker from '../common/DatePicker'
  import ListDelete from '../common/ListDelete'
  import {requestUrl,token} from '../../publicFunction/index'
  export default {
    components: {
      StockGoods: StockGoods,
      Grid: Grid,
      Count: Count,
      Modal: Modal,
      Page: Page,
      ListDelete: ListDelete,
      DatePicker: DatePicker
    },
    events: {
//      确认增加
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
//      提交要货
      upLoadEnquiry: function () {
        var items = []
        $.each(this.rederStockGoods, function (index, val) {
          var obj = {}
          obj['consumable_id'] = val.id
          obj['amount'] = Number(val['is_number'])
          items.push(obj)
        })
//       提交要货请求
        this.$http.post(requestUrl + '/front-system/stock/enquiry',
          {
            'items': items,
            'date': this.sendStartTime
          }
        ).then(function (reponse) {
          var id=reponse.data.body
          window.location.href = '/?#!/instock/GoodsApplyNum/'+ id
        }, function (err) {
          console.log(err)
        })
      }
    },
    data: function () {
      return {
        date: '',
        remarks: '',
        sendStartTime: '',
        format: 'yyyy-MM-dd',
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
