<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2" role="navigation">
        <left-instock></left-instock>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
          <li class="active">库存配送出库</li>
          <li class="active">新建配送出库</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>出货仓库</label>
              <select class="form-control" v-model="selectedOutHouse" id="selectedOutHouse">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in warehouseList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>调入仓库</label>
              <select class="form-control" v-model="selectedInHouse" id="selectedInHouse">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in warehouseList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>配送时间</label>
              <date-picker :value.sync="sendTime"></date-picker>
            </div>

            <div class="form-group ml10">
              <label>备注</label>
              <input type="text" class="form-control" v-model="note" style="width: 250px">
            </div>
            <span class="btn btn-primary" @click="inclucdePurchaseData">引用原始单据</span>
            <span class="btn btn-default" @click="addStockGoods">添加商品</span>
            <span class="btn btn-default" @click="uploadPurchase">提交出库</span>
          </form>
        </div>

        <!--入库明细入库汇总-->
        <div>
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)" data-toggle="tab">出库明细</a></li>
            <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">出库汇总</a></li>
          </ul>
          <!-- Tab panes -->
          <div class="tab-content">
            <!-- 出库明细 -->
            <div role="tabpanel" class="tab-pane active" v-if="detailModal">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                <tr class="text-center">
                  <th v-for="value in  gridColumns">
                    {{value}}
                  </th>
                  <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center" v-for="entry in renderstockGoods" track-by="$index"
                    :id="[entry.id ? entry.id : '']">
                  <td>{{entry.item_code}}</td>
                  <td>{{entry.item_name}}</td>
                  <td>{{entry.origin_stock}}</td>
                  <td>{{entry.target_stock}}</td>
                  <td>{{entry.main_reference_value}}</td>
                  <td>
                    <count :count.sync=entry.distribution_amount></count>
                  </td>
                  <td>{{entry.unit_name}}</td>
                  <td>{{entry.unit_specification}}</td>
                  <td>{{entry.reference_number}}</td>
                  <td>
                    <slot name="operate">
                      <list-delete :delete-data.sync="tableData"></list-delete>
                    </slot>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- 出库汇总 -->
            <div role="tabpanel" class="tab-pane active" v-if="summaryModal">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                <tr class="text-center">
                  <th v-for="value in  gridColumns1">
                    {{value}}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center" v-for="entry in summarystockGoods" track-by="$index"
                    :id="[entry.id ? entry.id : '']">
                  <td>{{entry.item_code}}</td>
                  <td>{{entry.item_name}}</td>
                  <td>{{entry.origin_stock}}</td>
                  <td>{{entry.target_stock}}</td>
                  <td>{{entry.item_main_reference_value}}</td>
                  <td>{{entry.item_amount}}</td>
                  <td>{{entry.unit_name}}</td>
                  <td>{{entry.unit_specification}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--引入原始数据-->
  <introduce-data
    :title="origenData.title"
    :url="origenData.dataUrl"
    :instroduce-data-modal.sync='modal.parentIntroModal'
    :instroduce-data-modal-size="modal.parentIntroModalSize"
    :first-data-title="origenData.firstDataTitle"
    :first-data.sync="origenData.firstData"
    :second-data-title="origenData.secondDataTitle"
    :second-data.sync="origenData.secondData"
    :request-data="{stream_origin_id:selectedOutHouse,stream_target_id:selectedInHouse,type:2}"
  >
  </introduce-data>
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
    :request-data="{stream_origin_id:selectedOutHouse,stream_target_id:selectedInHouse,product_type:1}"
  >
  </stock-goods>
  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import AdminNav from '../../AdminNav'
  import StockGoods from '../../../common/StockGoodsOperate'
  import DatePicker from '../../../common/DatePicker'
  import Summary from '../../../common/Summary'
  import IntroduceData  from '../../../common/IntroduceData'
  import ErrorTip from '../../../common/ErrorTip'
  import LeftInstock from '../../common/LeftInstock'
  import ListDelete from '../../../common/ListDelete'
  import Count from '../../../common/Count'
  import {
    requestSystemUrl,
    token,
    searchRequest,
    getDataFromApi,
    postDataToApi,
    detailGoodsInfo
  } from '../../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      Grid: Grid,
      Page: Page,
      StockGoods: StockGoods,
      DatePicker: DatePicker,
      Summary: Summary,
      IntroduceData: IntroduceData,
      ErrorTip: ErrorTip,
      LeftInstock: LeftInstock,
      ListDelete: ListDelete,
      Count: Count
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
//      添加商品确认增加
      confirmAdd: function () {
        var self = this
        detailGoodsInfo(self.stockGoods, 'ProductItem')
        $.each(self.stockGoods, function (index, val) {
          val.distribution_amount = ''
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        this.renderstockGoods = self.dataArray
        $("#selectedOutHouse").attr('disabled',true)
        $("#selectedInHouse").attr('disabled',true)
      },
//      引入原始数据添加商品
      includeConfirmAdd: function () {
        var self = this
        var saveDataArray = []
        var detailArrayFromApi = []
        detailGoodsInfo(this.origenData.secondData, 'Requisition')
        saveDataArray = this.stockGoods.concat(this.origenData.secondData)
        $.each(saveDataArray, function (index, val) {
          val.distribution_amount = val.main_reference_value
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        this.renderstockGoods = self.dataArray
        $("#selectedOutHouse").attr('disabled',true)
        $("#selectedInHouse").attr('disabled',true)
      },
//     删除商品
      delete: function (id) {
        var self = this
        $.each(this.renderstockGoods, function (index, val) {
          if (val.id === id) {
            self.renderstockGoods.splice(index, 1)
            val.choice = false
            val.again = false
          }
        })
      },
//      分页
      pagechange: function (currentpage) {
        this.current_page = currentpage
        this.localPage(this.old)
        this.rederSetGoods = this.old
      }
    },
    methods: {
//     提交配送出库
      uploadPurchase: function () {
        var self = this
        var items = []
        var uploadFlag = true
//      提交配送出库请求地址
        var url = requestSystemUrl + '/backend-system/stock/distribution'
        $.each(this.renderstockGoods, function (index, val) {
          var obj = {}
          obj.reference_id = val.id
          obj.reference_type = val.reference_type
          obj.amount = val.distribution_amount
          if (val.distribution_amount === '') {
            uploadFlag = false
          }
          items.push(obj)
        });
//      提交配送出库需要填写的数据
        var data = {
          items: items,
          note: this.note,
          operated_at: this.sendTime,
          stream_origin_id: this.selectedOutHouse,
          warehouse_id: this.selectedInHouse
        }
//      判断配送出库和采购单价是否为空
        $.each(items, function (index, val) {
        })
//       提交之前的判断
        if (this.selectedOutHouse === '') {
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没填写出货厂库'
        } else if (this.selectedInHouse === '') {
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没填写调入厂库'
        } else if (this.sendTime === '') {
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没填写配送时间'
        } else if (items.length < 1) {
          this.modal.errModal = true
          this.modal.errInfo = 'high,你还没有添加商品哟'
        } else if (!uploadFlag) {
          this.modal.errModal = true
          this.modal.errInfo = 'high,你的配送数量不能为空哟'
        } else {
          postDataToApi(url, data, function (response) {
            window.location.href = "#!/admin/instock/dispatching"
          })
        }
      },
//      添加商品
      addStockGoods: function () {
        if (this.selectedOutHouse && this.selectedInHouse) {
          this.modal.addGoodModal = true
          this.$broadcast('getGoodsWhenClick')
        } else if (!this.selectedOutHouse) {
          this.modal.errModal = true
          this.modal.errInfo = '请选择出货仓库'
        } else if (!this.selectedInHouse) {
          this.modal.errModal = true
          this.modal.errInfo = '请选择调入仓库'
        }
      },
//     引入数据
      inclucdePurchaseData: function () {
        if (this.selectedOutHouse && this.selectedInHouse) {
          this.modal.parentIntroModal = true
          this.$broadcast('getGoodsWhenClick')
        } else if (!this.selectedOutHouse) {
          this.modal.errModal = true
          this.modal.errInfo = '请选择出货仓库'
        } else if (!this.selectedInHouse) {
          this.modal.errModal = true
          this.modal.errInfo = '请选择调入仓库'
        }
      },
      //      入库明细与入库汇总切换
      changeActive: function (event) {
        var cur = $(event.currentTarget)
        cur.addClass('active').siblings('li').removeClass('active')
        switch (Number(cur.attr('id'))) {
          case 1:
            this.detailModal = true
            this.summaryModal = false
            break
          case 2:
            this.detailModal = false
            this.summaryModal = true
            this.summary()
        }
      },
      //          汇总方法
      summary: function () {
        var self = this
        self.summaryPrice = 0
        this.summarystockGoods = []
        this.summarystockGoods = this.summarystockGoods.concat(self.renderstockGoods)
        $.each(this.summarystockGoods, function (index, val) {
          val.item_main_reference_value = val.main_reference_value
          val.item_amount = val.distribution_amount
        })
        this.summarystockGoods = this.summaryMethod("item_code", this.summarystockGoods)
      },
//     汇总方法
      summaryMethod: function (ObjPropInArr, array) {
        var hash = {};
        var result = [];
        for (var i = 0; i < array.length; i++) {
          if (hash[array[i][ObjPropInArr]]) {
            hash[array[i][ObjPropInArr]].item_main_reference_value = Number(array[i].item_main_reference_value) + Number(hash[array[i][ObjPropInArr]].item_main_reference_value)
            hash[array[i][ObjPropInArr]].item_amount = Number(array[i].item_amount) + Number(hash[array[i][ObjPropInArr]].item_amount)
          } else {
            hash[array[i][ObjPropInArr]] = array[i];
          }
        }
        for (var j in hash) {
          result.push(hash[j])
        }
        return result
      }
    },
    data: function () {
      return {
//        出库明细
        detailModal: true,
//        入库汇总
        summaryModal: false,
        summarystockGoods: [],
        showPage: [],
        reference_type: 'Receiving',
        sendTime: '',
        selectedOutHouse: '',
        selectedInHouse: '',
        note: '',
        warehouseList: [],
        tabFlag: true,
        gridColumns: {
          code: "货号",
          name: "品名",
          specification_unit: "出货仓库库存",
          aruc: "调入仓库库存",
          order_quantity: "要货数量",
          purchase_quantity: "配送数量",
          purchase_price: "采购单位",
          unit_specification: "单位规格",
          a: "来源要货单号"
        },
        gridColumns1: {
          code: "货号",
          name: "品名",
          specification_unit: "出货仓库库存",
          aruc: "调入仓库库存",
          order_quantity: "要货数量",
          purchase_quantity: "配送数量",
          purchase_price: "采购单位",
          unit_specification: "单位规格"
        },
        renderstockGoods: [],
        stockGoods: [],
        currentUrl: '',
        purchaseTabelHead: {
          code: "货号",
          name: "品名",
          null: "库存数量",
          category: "分类",
          production_unit_name: "单位",
          specification_unit: "单位规格"
        },
        request: {
          productUrl: requestSystemUrl + '/backend-system/product/product',
          categoryUrl: requestSystemUrl + '/backend-system/product/category',
          productData: {
            product_type: 1
          }
        },
        origenData: {
          title: '原始要货配料单',
          dataUrl: requestSystemUrl + '/backend-system/reference-document/requisition',
          firstDataTitle: {
            "document_number": "要货单号",
            "store_name": "要货仓库",
            "amount": "要货数量",
            "created_at": "要货日期",
            "creator_name": "制单人",
            "auditor_name": "审核人"
          },
          firstData: [],
          secondDataTitle: {
            "item_code": "货号",
            "item_name": "品名",
            "main_reference_value": "要货数量",
            "unit_name": "单位",
            "unit_specification": "单位规格"
          },
          secondData: []
        },
        modal: {
          addGoodModal: false,
          addGoodModalSize: 'modal-lg',
          parentIntroModal: false,
          parentIntroModalSize: 'modal-lg',
          errModal: false,
          errInfo: 'high。这是友情提醒'
        },
        category: '',
        baseUnit: '',
        setGoods: [],
        setGoodsPage: [],
        dataArray: [],
      }
    }
  }
</script>
