<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">要货单汇总</li>
      <li class="active">申请要货</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header text-center">
      <form action="" method="post" class="form-inline">
        <div class="form-group ml10">
          <label>送货时间</label>
          <date-picker :value.sync="startTime"></date-picker>
        </div>
        <div class="form-group">
          <label>备注</label>
          <input type="text" class="form-control" placeholder="" v-model="remarks">
        </div>
        <span class="btn btn-info" data-toggle="modal" data-target="#inventory-add-templ" @click="addStockGoods">添加商品</span>
        <span class="btn btn-info" @click="upLoadEnquiry()">提交要货</span>
      </form>
    </div>
    <!-- 表格 -->
    <table class="table table-striped table-border table-hover">
      <thead>
      <tr class="text-center">
        <th>货号</th>
        <th>品名</th>
        <th>日均销量</th>
        <th>当前库存</th>
        <th>要货数量</th>
        <th>单位</th>
        <th>单位规格</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center" v-for="item in rederStockGoods" track-by="$index" :id="item.id">
        <td>{{item.code}}</td>
        <td>{{item.name}}</td>
        <td>{{item.dms}}</td>
        <td>{{item.current_stock}}</td>
        <td align="center">
          <count :count.sync="item.sale_refund"></count>
        </td>
        <td>{{item.product_type === 2 ? item.unit_name = item.production_unit_name :item.unit_name = item.sell_unit_name }}</td>
        <td>{{item.specification_unit}}</td>
        <td>
          <list-delete :delete-data.sync="rederStockGoods"></list-delete>
        </td>
      </tr>
      </tbody>
    </table>
    <!--&lt;!&ndash;分页&ndash;&gt;-->
    <!--<page :total='len' :current='current_page' :display='per_page' :last-page='totalPage'></page>-->
  </div>
  <!--模态框-添加商品-->
  <stock-goods :stock-add-good-modal.sync="addGoodModal" :stock-add-good-modal-size="addGoodModalSize"
               :add-data.sync="stockGoods" :page.sync="showPage" :goods-list-title="goodsListTitle"
               :get-render-data="rederStockGoods" :product-url="productUrl" :category-url="categoryUrl"></stock-goods>
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
  import DatePicker from '../../common/DatePicker'
  import ListDelete from '../../common/ListDelete'
  import {requestUrl, token, deleteRequest, postDataToApi, error} from '../../../publicFunction/index'
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
    events: {
//      确认增加
      confirmAdd: function () {
        var self = this
        $.each(self.stockGoods, function (index, val) {
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        this.rederStockGoods = self.dataArray
        this.old = self.dataArray
        this.localPage(this.old)
        this.rederStockGoods = this.old
        console.log(this.old)
      },
//      分页
      pagechange: function (currentpage) {
        this.current_page = currentpage
        this.localPage(this.old)
        this.rederStockGoods = this.old
      },
//      删除
      delete: function (id) {
        var self = this
//       添加商品的状态改变
        $.each(this.stockGoods, function (index, val) {
          if (val.id === id) {
            val.choice = false
            val.again = false
          }
        })
//       从列表中删除
        $.each(this.rederStockGoods, function (index, val) {
          if (val.id === id) {
            self.rederStockGoods.splice(index, 1)
          }
        })
      }
    },
    ready: function () {
      $.each(this.rederStockGoods, function (index, val) {
        val.addFlag = false
      })
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
        if (this.startTime === '') {
          this.messageTipModal = true
          this.messageTip = 'high,你还没有填写日期哟'
        } else if (this.rederStockGoods.length < 1) {
          this.messageTipModal = true
          this.messageTip = 'high,你忘记添加商品了哟'
        } else {
//          提交要货请求
//          postDataToApi(
//            requestUrl + '/front-system/stock/enquiry',
//            {
//            'items': items,
//            'date': this.startTime
//            },
//            function(response){
//            var id=response.data.body
//            window.location.href = '/#!/site/instock/GoodsApplyNum/'+ id
//          })
          this.$http.post(requestUrl + '/front-system/stock/enquiry',
            {
              'items': items,
              'date': this.startTime,
              'note': this.remarks,
            },
            {
              headers: {'X-Overpowered-Token': token}
            }
          ).then(function (reponse) {
            var id = reponse.data.body.id
            window.location.href = '/#!/site/instock/GoodsApplyNum/' + id
          }, function (err) {
            if (err.data.code === '100000') {
              this.messageTipModal = true
              this.messageTip = 'high,填写了要货数量才能提货哟'
            }
          })
        }
      },
//      添加商品
      addStockGoods: function ( ){
        this.addGoodModal = true
        this.$broadcast('getGoodsWhenClick')
      },
    },
    data: function () {
      return {
        date: '',
        old: [],
        remarks: '',
        messageTipModal: false,
        len: 0,
        current_page: 1,
        per_page: 10,
        totalPage: 1,
        startTime: '',
        showPage: [],
        messageTip: 'high,请填写正确的信息哟',
        messageTipModalSize: 'modal-sm',
        instockPage: [],
        deleteModal: false,
        deleteModalSize: 'modal-sm',
        addGoodModal: false,
        addGoodModalSize: 'modal-lg',
        stockGoods: [],
        dataArray: [],
        pageArray: [],
        rederStockGoods: [],
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
<style scoped>
  .modal-body {
    text-align: center;
  }
</style>
