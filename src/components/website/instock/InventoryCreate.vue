<template>
  <site-nav></site-nav>
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
          <input type="text" class="form-control" placeholder="请填写盘点备注" v-model="note">
        </div>
        <span class="btn btn-info" @click="chooseAddGoods()">选择盘点商品</span>
        <span class="btn btn-primary" @click="inventoryAll()">盘点所有商品</span>
        <span class="btn btn-default" @click="upLoadEnquiry()">提交盘点</span>
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
        <td class="text-left">{{item.code}}</td>
        <td>{{item.name}}</td>
        <td><span style="color:red;">{{item.system_stock}}</span></td>
        <td align="center">
          <count :count.sync=item.current_stock  :is-float="true"></count>
        </td>
        <td>
          <template v-if="item.current_stock == ''">{{ - item.system_stock}}</template>
          <template v-else>{{((item.current_stock*1000 - item.system_stock*1000)/1000).toFixed(3) }}</template>
        </td>
        <td>{{item.production_unit_name}}</td>
        <td>{{item.specification_unit}}</td>
        <td>
          <list-delete :delete-data.sync="rederStockGoods"></list-delete>
        </td>
      </tr>
      </tbody>
    </table>
    <!--本地分页-->
    <page
      :total='pageLocal.len'
      :current='pageLocal.current_page'
      :display='pageLocal.per_page'
      :last-page='pageLocal.last_page' v-if="pageLocal.len > 0">
    </page>
  </div>
  <!--模态框-添加商品-->
  <stock-goods
    :get-render-data="rederStockGoods"
    :stock-add-good-modal.sync="modal.addGoodModal"
    :stock-add-good-modal-size="modal.addGoodModalSize"
    :page.sync="showPage"
    :add-data.sync="stockGoods"
    :goods-list-title="goodsListTitle"
    :product-url="request.productUrl"
    :category-url="request.categoryUrl"
  ></stock-goods>
  <!--模态框HTML-->

  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
</template>

<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Count from '../../common/Count'
  import StockGoods from '../../common/StockGoodsOperate'
  import ErrorTip from '../../common/ErrorTip'
  import Grid from '../../common/Grid'
  import ListDelete from '../../common/ListDelete'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import DatePicker from '../../common/DatePicker'
  import {
    requestUrl,
    requestSystemUrl,
    token,
    searchRequest,
    getDataFromApi,
    postDataToApi,
    exchangeData,
    deleteRequest,
    error,
    detailGoodsInfo
  } from '../../../publicFunction/index'
  var deleteId = ''
  export default {
    components: {
      StockGoods: StockGoods,
      DatePicker: DatePicker,
      ListDelete: ListDelete,
      Grid: Grid,
      ErrorTip: ErrorTip,
      Count: Count,
      Modal: Modal,
      Page: Page,
      SiteNav: SiteNav
    },
    events: {
//    确认增加
      confirmAdd: function () {
        var self = this
        if (!self.flag) {
          self.dataArray = []
        }
        $.each(self.stockGoods, function (index, val) {
          val.current_stock = val.system_stock
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        self.rederStockGoods = self.dataArray
        self.localPage(self.rederStockGoods)
        self.flag = true
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
        $.each(this.dataArray, function (index, val) {
          if (val.id === id) {
            self.dataArray.splice(index, 1)
            return false
          }
        })
        self.localPage(self.dataArray)
      },
//      分页
      pagechange: function (currentpage) {
        this.pageLocal.current_page = currentpage
        this.localPage(this.dataArray)
//        $.each(this.dataArray, function (index, val) {
//          if (val.current_stock == '') {
//            val.current_stock = null
//          }
//        })
      }
    },
    methods: {
//      选择添加商品
      chooseAddGoods: function () {
        this.modal.addGoodModal = true
        this.$broadcast('getGoodsWhenClick')
        if (!this.flag) {
          $(".table-bordered").find(":checkbox").prop("checked", false)
        }
      },
//      盘点所有商品
      inventoryAll: function () {
        var self = this
        self.flag = false
        var data = {
          per_page: 999
        }
        self.pageLocal.current_page = 1
        getDataFromApi(self.request.productUrl, data, function (respon) {
          self.dataArray = respon.data.body.list
          self.rederStockGoods = self.dataArray
          self.localPage(self.dataArray)
          $.each(self.dataArray,function(index,val){
            val.current_stock = val.system_stock
          })
        })
        $.each(self.stockGoods,function(index,val){
          val.again = false
        })
      },
//      提交盘点
      upLoadEnquiry: function () {
        var inventory = []
        var hasStock = false
        $.each(this.dataArray, function (index, val) {
          var obj = {}
          obj['reference_id'] = val.id
          obj['current_stock'] = Number(val['current_stock'])
          if (val.current_stock == '') {
            hasStock = true
          }
          inventory.push(obj)
        })
        if (this.dataArray.length < 1) {
          this.modal.errModal = true
          this.modal.errInfo = '请添加盘点商品'
        } else if (hasStock) {
          this.modal.errModal = true
          this.modal.errInfo = '请完整填写实际库存量'
        } else {
//       提交盘点请求
          var url = requestSystemUrl + '/front-system/stock/inventory'
          var data = {
            items: inventory,
            note: this.note
          }
          postDataToApi(url, data, function (respon) {
            window.location.href = '/#!/site/instock/Inventory'
          })
        }
      },
//     本地分页
      localPage: function (data) {
        this.pageLocal.len = data.length
        console.log('数组总长度：' + this.pageLocal.len)
        if (this.pageLocal.len % this.pageLocal.per_page === 0) {
          this.pageLocal.last_page = this.pageLocal.len / this.pageLocal.per_page
        } else {
          this.pageLocal.last_page = (Math.floor(this.pageLocal.len / this.pageLocal.per_page)) + 1
        }
        var start = (this.pageLocal.current_page * this.pageLocal.per_page) - this.pageLocal.per_page
        var end = (start + this.pageLocal.per_page) > this.pageLocal.len ? this.pageLocal.len : (start + this.pageLocal.per_page)
        this.newData = data.slice(start, end)
        this.rederStockGoods = this.newData
      }
    },
    data: function () {
      return {
//        盘点备注
        note: '',
//        盘点所有商品按钮点击后改变flag状态为false
        flag: true,
        newData: [],
        pageLocal: {
          current_page: 1, // 当前页
          last_page: 1, // 最后一页
          per_page: 6, // 一页有多少个
          len: 0 // 总共的个数
        },
        showPage: [],
        stockGoods: [],
        rederStockGoods: [],
        dataArray: [],
        modal: {
          deleteModal: false,
          deleteModalSize: 'modal-sm',
          addGoodModal: false,
          addGoodModalSize: 'modal-lg',
          errModal: false,
          errInfo: '请填写正确的信息'
        },
        goodsListTitle: {
          'code': '货号',
          'name': '品名',
          'sale_amount': '日均销量',
          'system_stock': '系统库存',
          'production_unit_name': '单位',
          'specification_unit': '单位规格',
          'category': '商品分类'
        },


        request: {
          productUrl: requestSystemUrl + '/front-system/product',
          categoryUrl: requestSystemUrl + '/front-system/order/category',
        }
      }
    }
  }
</script>
