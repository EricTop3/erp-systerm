<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">调拨出货汇总</li>
      <li class="active">新建调拨单</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline text-center">
        <div class="form-group">
          <label>出货时间</label>
          <date-picker :value.sync="date"></date-picker>
        </div>
        <div class="form-group">
          <label>收货仓库</label>
          <select class="form-control" v-model="receiptsStore">
            <option value="">请选择</option>
            <option v-for="item in store" :value="item.id">{{item.name}}</option>
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
      <tr class="text-center" v-for="item in renderStockGoods" track-by="$index" :id="item.id">
        <td class="text-left">{{item.code}}</td>
        <td>{{item.name}}</td>
        <td>{{item.sale_amount}}</td>
        <td>{{item.current_stock}}</td>
        <td align="center">
          <count :count.sync='item.sale_refund'></count>
        </td>
        <td>{{item.unit}}</td>
        <td>{{item.unit_specification}}</td>
        <td>
          <list-delete :delete-data.sync="renderStockGoods"></list-delete>
        </td>
      </tr>
      </tbody>
    </table>

    <!--分页-->
    <page :total='renderStockGoods.length' :current.sync='current_page' :display='per_page' :last-page='totalPage'
          v-if="renderStockGoods.length>0">
    </page>
  </div>
  <!--模态框-添加商品-->
  <stock-goods
    :stock-add-good-modal.sync="addGoodModal"
    :stock-add-good-modal-size="addGoodModalSize"
    :add-data.sync="stockGoods"
    :page.sync="showPage"
    :goods-list-title="goodsListTitle"
    :get-render-data="renderStockGoods"
    :product-url="productUrl"
    :category-url="categoryUrl">
  </stock-goods>
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
  import SiteNav from '../SiteNav'
  import Count from '../../common/Count'
  import StockGoods from '../../common/StockGoodsOperate'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import ListDelete from '../../common/ListDelete'
  import DatePicker from '../../common/DatePicker'
  import {requestUrl, token, error,getDataFromSiteApi,postSiteDataToApi} from '../../../publicFunction/index'
  var deleteId = ''
  export default {
    components: {
      StockGoods: StockGoods,
      Grid: Grid,
      Count: Count,
      Modal: Modal,
      Page: Page,
      ListDelete: ListDelete,
      DatePicker: DatePicker,
      SiteNav: SiteNav
    },
    ready: function () {
      var self = this
//      渲染仓库
      getDataFromSiteApi(requestUrl + '/front-system/warehouse-minimal-list',{},function(response){
        self.store = response.data.body.list
      })
    },
    events: {
//   确认增加
      confirmAdd: function () {
        var self = this
        $.each(self.stockGoods, function (index, val) {
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        this.renderStockGoods = self.dataArray
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
        var goodList = this.renderStockGoods
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
        var self =  this
        $.each(this.renderStockGoods, function (index, val) {
          var obj = {}
          obj['reference_id'] = Number(val.id)
          obj['amount'] = Number(val['sale_refund'])
          goods.push(obj)
        })
//       提交要货请求
        if (this.date === '') {
          this.messageTipModal = true
          this.messageTip = 'high,你还没有填写日期哟'
        } else if (this.renderStockGoods.length < 1) {
          this.messageTipModal = true
          this.messageTip = 'high,你忘记添加商品了哟'
        } else if (this.receiptsStore === '') {
          this.messageTipModal = true
          this.messageTip = 'high,你忘记添加收货仓库了哟'
        } else {
          postSiteDataToApi(requestUrl + '/front-system/stock/distribution', {
            items: goods,
            operated_at: self.date,
            remarks: self.remarks,
            warehouse_id: self.receiptsStore
          },function (response) {
            window.location.href = '/?#!/site/instock/AllotOutBills/'
          },function (err){
            self.messageTipModal = true
          })
        }
      }
    },
    data: function () {
      return {
        messageTip: 'high,请填写正确的信息哟',
        messageTipModal: false,
        messageTipModalSize: 'modal-sm',
        receiptsStore: '',
        store: [],
        current_page: 1,
        per_page: 10,
        totalPage: 1,
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
        renderStockGoods: [],
        goodsListTitle: {
          'code': '货号',
          'name': '品名',
          'sale_amount': '日均销量',
          'current_stock': '当前库存',
          'production_unit_name': '单位',
          'specification_unit': '单位规格',
          'category': '商品分类'
        },
        productUrl: requestUrl + '/front-system/product',
        categoryUrl: requestUrl + '/front-system/order/category'
      }
    }
  }
</script>
