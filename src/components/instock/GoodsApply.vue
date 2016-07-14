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
          <date-picker  :value.sync="startTime"></date-picker>
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
        <td class="text-left">{{item.code}}</td>
        <td>{{item.name}}</td>
        <td>{{item.sale_amount}}</td>
        <td>{{item.current_stock}}</td>
        <td align="center">
          <count :count.sync="item.sale_refund" :amount.sync='item.current_stock'></count>
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
    <page :total='rederStockGoods.length' :current.sync='current_page' :display='per_page'  :last-page='totalPage' v-if="rederStockGoods.length>0"></page>
  </div>
  <!--模态框-添加商品-->
  <stock-goods :stock-add-good-modal.sync="addGoodModal" :stock-add-good-modal-size="addGoodModalSize"
               :add-data.sync="stockGoods"></stock-goods>
  <!--错误信息弹出-->
  <modal :show.sync='messageTipModal' :modal-size="messageTipModalSize" class='form-horizontal'>
    <div slot='header'>
      <button type='button' class='close' data-dismiss='modal' @click="priceAdjectModal=false" aria-label='Close'><span
        aria-hidden='true' @click="messageTipModal=false">&times;</span></button>
      <h4 class='modal-title'>友情提示</h4>
    </div>
    <div slot='body'>
      <div class='form-group'>
        <p class="modal-body">{{messageTip}}</p>
      </div>
    </div>
    <div slot='footer'>
      <button type='button' class='btn btn-primary' @click='messageTipModal = false'>关闭</button>
    </div>
  </modal>
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
        $.each(this.rederStockGoods,function(index,value){
          value.sale_refund = value.current_stock
        })
        console.log(this.rederStockGoods.length)
        console.log(this.per_page)
        if(this.rederStockGoods.length %this.per_page===0){
          this.totalPage =this.rederStockGoods.length/this.per_page
        }else{
          this.totalPage =(Math.floor(this.rederStockGoods.length/ this.per_page))+1
        }
        self.dataArray = []
        this.addGoodModal = false
      },
//      分页
      pagechange: function(){

      }
    },
    methods: {
//      提交要货
      upLoadEnquiry: function () {
        var items = []
        $.each(this.rederStockGoods, function (index, val) {
          var obj = {}
          obj['consumable_id'] = val.id
          obj['amount'] = Number(val['sale_refund'])
          items.push(obj)
        })
        if(this.startTime===''){
          this.messageTipModal = true
          this.messageTip = 'high,你还没有填写日期哟'
        }else if(this.rederStockGoods.length<1){
          this.messageTipModal = true
          this.messageTip = 'high,你忘记添加商品了哟'
        }else{
//          提交要货请求
          this.$http.post(requestUrl + '/front-system/stock/enquiry',
            {
              'items': items,
              'date': this.startTime
            }
          ).then(function (reponse) {
              var id=reponse.data.body
              window.location.href = '/?#!/instock/GoodsApplyNum/'+ id
          }, function (err) {
            console.log(err)
          })
        }
      }
    },
    data: function () {
      return {
        date: '',
        remarks: '',
        messageTipModal: false,
        current_page: 1,
        per_page: 10,
        totalPage: 1,
        startTime: '',
        messageTip: 'high,请填写正确的信息哟',
        messageTipModalSize: 'modal-sm',
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
<style>
  .modal-body{
    text-align: center;
  }
</style>
