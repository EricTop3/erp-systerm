<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">库存盘点</li>
          <li class="active">新建库存盘点</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline text-center">
            <div class="form-group">
              <label>仓库</label>
              <select class="form-control" v-model="selectedHouse">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in warehouseList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group  ml10">
              <label>备注</label>
              <input type="text" class="form-control" style="width: 450px;">
            </div>
            <span class="btn btn-primary" @click="addStockGoods">选择盘点商品</span>
            <span class="btn btn-default" @click="inventoryAll">盘点所有商品</span>
            <span class="btn btn-default" @click="upLoadEnquiry">提交盘点</span>
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
          <tr class="text-center" v-for="entry in rederStockGoods" track-by="$index" :id="[entry.id ? entry.id : '']">
            <td class="text-left">{{entry.code}}</td>
            <td>{{entry.name}}</td>
            <td>
              <span style="color:red;">后台还没</span>
            </td>
            <td align="center">
              <count :count.sync =entry.current_stock></count>
            </td>
            <td>
              <span style="color:red;">反数据给我</span>
            </td>
            <td>{{entry.production_unit_name}}</td>
            <td>{{entry.specification_unit}}</td>
            <td>
              <slot name="operate">
                <list-delete :delete-data.sync="tableData" ></list-delete>
              </slot>
            </td>
          </tr>
          </tbody>
        </table>
        <!--分页-->
        <page
          :total='page.len'
          :current='page.current_page'
          :display='page.per_page'
          :last-page='page.last_page' v-if="page.len > 0">
        </page>

        <!--本地分页-->
        <page
          :total='pageLocal.len'
          :current='pageLocal.current_page'
          :display='pageLocal.per_page'
          :last-page='pageLocal.last_page' v-if="pageLocal.len > 0">
        </page>
      </div>
    </div>
  </div>

  <!--模态框-添加商品-->
  <stock-goods
    :get-render-data="rederSetGoods"
    :stock-add-good-modal.sync="modal.addGoodModal"
    :stock-add-good-modal-size="modal.addGoodModalSize"
    :page.sync="showPage"
    :add-data.sync="stockGoods"
    :goods-list-title="purchaseTabelHead"
    :product-url="request.productUrl"
    :category-url='request.categoryUrl'
  ></stock-goods>

  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import AdminNav from '../../AdminNav'
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import ErrorTip from '../../../common/ErrorTip'
  import ListDelete  from '../../../common/ListDelete'
  import StockGoods from '../../../common/StockGoodsOperate'
  import Count from '../../../common/Count'
  import LeftInstock from '../../common/LeftInstock'
  import {
    requestUrl,
    requestSystemUrl,
    token,
    searchRequest,
    getDataFromApi,
    postDataToApi,
    exchangeData,
    deleteRequest,
    detailGoodsInfo
  } from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      AdminNav: AdminNav,
      Count: Count,
      StockGoods: StockGoods,
      ErrorTip: ErrorTip,
      ListDelete: ListDelete,
      LeftInstock: LeftInstock
    },
    ready: function () {
      var self = this
//    仓库请求接口
      var url = requestSystemUrl + '/backend-system/warehouse-minimal-list'
//    获取仓库列表
      getDataFromApi(url, {}, function (response) {
        self.warehouseList = response.data.body.list
      })
    },
    events: {
//           确认增加
      confirmAdd: function () {
        var self = this
        $.each(self.stockGoods, function (index, val) {
          val.current_stock = ''
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        self.rederStockGoods = self.dataArray
        self.old = self.dataArray
        self.localPage(self.old)
      },
//     删除商品
      delete: function (id) {
        var self = this
        $.each(self.rederStockGoods, function (index, val) {
          if (val.id === id) {
            self.rederStockGoods.splice(index, 1)
          }
        })
      },
//      分页
      pagechange: function (currentpage) {
        if (this.ispageLocal) {
          this.inventoryAll(currentpage)
        } else {
          console.log('正在启用的是启用本地分页！')
        }
      }
    },
    methods: {
//      添加商品
      addStockGoods: function () {
        this.modal.addGoodModal=true
      },
//      盘点所有商品
      inventoryAll: function (page) {
        var self = this
        var data = {
          page: page || ''
        }
        getDataFromApi(self.request.productUrl, data, function (respon) {
          self.rederStockGoods = respon.data.body.list
          self.page.current_page = respon.data.body.pagination.current_page
          self.page.last_page = respon.data.body.pagination.last_page
          self.page.per_page = respon.data.body.pagination.per_page
          self.page.len = respon.data.body.pagination.total
          self.ispageLocal = true
        })
      },
//      提交盘点
      upLoadEnquiry: function () {
        var inventory = []
        var hasStock = false
        $.each(this.rederStockGoods, function (index, val) {
          var obj = {}
          obj['reference_id'] = val.id
          obj['current_stock'] = Number(val.current_stock)
          if (val.current_stock == '') {
            hasStock = true
          }
          inventory.push(obj)
        })

        if (this.selectedHouse === '') {
          this.modal.errModal = true
          this.modal.errInfo = 'high,你还没有填写仓库'
        } else if (this.rederStockGoods.length < 1) {
          this.modal.errModal = true
          this.modal.errInfo = 'high,你忘记添加商品了'
        } else if (hasStock) {
          this.modal.errModal = true
          this.modal.errInfo = 'high,你忘记实际库存量了'
        } else {
//       提交盘点请求
          var url = requestSystemUrl + '/backend-system/stock/inventory'
          var data = {
            items: inventory,
            warehouse_id: this.selectedHouse
          }
          postDataToApi(url, data, function (respon) {
            window.location.href = '/?#!/admin/instock/inventory'
          })
        }
      },
//     本地分页
      localPage: function (data) {
        this.pageLocal.len = data.length
        console.log(this.pageLocal.len)
        if (this.pageLocal.len % this.pageLocal.per_page === 0) {
          this.pageLocal.last_page = this.pageLocal.len / this.pageLocal.per_page
        } else {
          this.pageLocal.last_page = (Math.floor(this.pageLocal.len / this.pageLocal.per_page)) + 1
        }
//        this.page.current_page * this.page.per_page, this.page.len - this.page.current_page * this.page.per_page
        var a = data.splice(1,2)
        console.log('我是' + a)
        console.log('yes' + data)
      }

    },
    data: function () {
      return {
//        是否启用本地分页
        ispageLocal: false,
        pageLocal: {
          current_page: 1, // 当前页
          last_page: 1, // 最后一页
          per_page: 2, // 一页有多少个
          len: 0 // 总共的个数
        },
        page: {
          current_page: '',
          last_page: '',
          per_page: '',
          len: ''
        },
        showPage: [],
        selectedHouse: '',
        old: [],
        rederStockGoods: [],
        dataArray: [],
        warehouseList: [],
        modal: {
          addGoodModal: false,
          addGoodModalSize: 'modal-lg',
          errModal: false,
          errInfo: ''
        },
        purchaseTabelHead: {
          code: "货号",
          name: "品名",
          a: "日均销量",
          c: "当前库存",
          production_unit_name: "单位",
          specification_unit: "单位规格",
          category: "商品分类"
        },
        request: {
          productUrl: requestSystemUrl +  '/backend-system/product/product',
          categoryUrl: requestSystemUrl + '/backend-system/product/category',
        }
      }
    }
  }
</script>
