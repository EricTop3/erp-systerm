<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-purchase></left-purchase>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
          <li class="active">采购订单</li>
          <li class="active">新建</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>供应商</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group  ml10">
              <label>备注</label>
              <input type="text" class="form-control" placeholder="" style="width: 450px;">
            </div>
            <span class="btn btn-primary" data-toggle="modal" data-target="#data-cite-templ" @click="inclucdePurchaseData">引用原始单据</span>
            <button class="btn btn-default" @click="addGoodModal=true">添加商品</button>
            <span class="btn btn-default"  data-toggle="modal" data-target="#procurement-submit-templ">提交采购</span>
          </form>
        </div>
        <!--表格 -->
        <summary :table-header="gridColumns" :summary-data="summryData" :table-data="detailData" :page="page"  :detail-url="detailUrl" :tab-flag="tabFlag"></summary>
      </div>
    </div>
  </div>
  <introduce-data :instroduce-data-modal.sync='parentIntroModal' :instroduce-data-modal-size="parentIntroModalSize" :add-data.sync="stockGoods" :url="currentUrl"></introduce-data>
  <!--模态框-添加商品-->
  <set-goods :get-render-data="rederSetGoods" :stock-add-good-modal.sync="addGoodModal"
             :stock-add-good-modal-size="addGoodModalSize" :page.sync="showPage" :add-data.sync="setGoods" :goods-list-title="purchaseTabelHead"></set-goods>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import AdminNav from '../AdminNav'
  import SetGoods from '../common/SetGoods'
  import LeftPurchase from '../common/LeftPurchase'
  import DatePicker from '../../common/DatePicker'
  import Summary from '../../common/Summary'
  import IntroduceData  from '../../common/IntroduceData'
  import {requestSystemUrl, token, searchRequest} from '../../../publicFunction/index'
  export default{
    components:{
      AdminNav: AdminNav,
      Grid: Grid,
      Page: Page,
      SetGoods: SetGoods,
      DatePicker: DatePicker,
      LeftPurchase: LeftPurchase,
      Summary: Summary,
      IntroduceData: IntroduceData
    },
    ready: function () {
      $.each(this.rederSetGoods, function (index, val) {
        val.addFlag = false
      })
    },
    events: {
//      确认增加
      confirmAdd: function () {
        var self = this
        $.each(self.setGoods, function (index, val) {
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        this.rederSetGoods = self.dataArray
        this.old = self.dataArray
        this.localPage(this.old)
        this.rederSetGoods = this.old
      },
//      分页
      pagechange: function (currentpage) {
        this.current_page = currentpage
        this.localPage(this.old)
        this.rederSetGoods = this.old
      }
    },
    methods: {
//      新增商品请求
      createNew: function () {
        var materials = []
        $.each(this.rederSetGoods, function (index, val) {
          var obj = {}
          obj['id'] = val.id
          obj['value'] = val.value
          obj['unit'] = val.unit
          materials.push(obj)
        })
        this.$http.post(requestUrl + '/backend-system/product/product', {
          category_id: this.createList.category_id,
          product_type: this.createList.product_type,
          sell_type: this.createList.sell_type,
          name: this.createList.name,
          code: this.createList.code,
          sell_status: this.createList.sell_status,
          base_unit: this.createList.base_unit,
          base_unit_value: this.createList.base_unit_value,
          neutral_unit: this.createList.neutral_unit,
          neutral_unit_value: this.createList.neutral_unit_value,
          minimal_unit: this.createList.minimal_unit,
          minimal_unit_value: this.createList.minimal_unit_value,
          sell_unit: this.createList.sell_unit,
          production_unit: this.createList.production_unit,
          safe_stock: this.createList.safe_stock,
          aruc: this.createList.aruc,
          apuc: this.createList.apuc,
          use_bill_of_material: this.createList.use_bill_of_material,
          materials: materials
        }, {
          headers: {'X-Overpowered-Token': token}
        }, function (response) {
          window.location.href = '/#!/admin/setting'
          console.log(response)
        }, function (error) {
//          window.location.href = '/#!/admin/setting'
          console.log(error)
        })
      },
//     引入数据
      inclucdePurchaseData: function () {

      },
//     前端本地分页函数
      localPage: function (data) {
        this.len = data.length
        if (this.len % this.per_page === 0) {
          this.totalPage = this.len / this.per_page
        } else {
          this.totalPage = (Math.floor(this.len / this.per_page)) + 1
        }
        data.splice(this.current_page * this.per_page, this.len - this.current_page * this.per_page)
      },
    },
    data: function () {
      return {
        showPage: [],
        gridColumns: {
          code: "货号",
          name: "品名",
          aruc: "库存数量",
          a:"门店要货量",
          b:"采购数量",
          c:"采购单价",
          d: "来源要货单号",
        },
        currentUrl: '',
        purchaseTabelHead: {
          code: "货号",
          name: "品名",
          aruc: "库存数量",
          category: "分类",
          production_unit_name: "单位",
          specification_unit: "单位规格"
        },
        addGoodModal: false,
        addGoodModalSize: 'modal-lg',
        category: '',
        baseUnit: '',
        setGoods: [],
        setGoodsPage: [],
        dataArray: [],
        rederSetGoods: [],
      }
    }
  }
</script>
