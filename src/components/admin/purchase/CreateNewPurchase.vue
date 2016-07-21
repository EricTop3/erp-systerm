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
            <span class="btn btn-primary" data-toggle="modal" data-target="#data-cite-templ">引用原始单据</span>
            <button class="btn btn-default" @click="addGoodModal=true">添加商品</button>
            <span class="btn btn-default"  data-toggle="modal" data-target="#procurement-submit-templ">提交采购</span>
          </form>
        </div>

        <div>
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#detail"  data-toggle="tab">入库明细</a></li>
            <li role="presentation"><a href="#summary"  data-toggle="tab">入库汇总</a></li>
            <div class="spanblocks fr mr30 mt10 f16">合计：<span class="c-erp">￥3000.00</span> </div>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="detail">
              <!-- 表格 -->
              <table class="table table-striped table-border table-hover">
                <thead>
                <tr class="text-center">
                  <td class="text-left">货号</td>
                  <td>品名</td>
                  <td>单位规格</td>
                  <td>库存数量</td>
                  <td>门店要货量</td>
                  <td>采购数量</td>
                  <td>采购单价</td>
                  <td>来源要货单号</td>
                  <td>操作</td>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center">
                  <td class="text-left">164643138431315</td>
                  <td>伊利牛奶</td>
                  <td>1箱*20盒*250ml</td>
                  <td>5000 盒</td>
                  <td>300 盒</td>
                  <td align="center" class="form-inline"><input type="text" class="form-control text-center" style="width:100px;" value="50">箱</td>
                  <td align="center" class="form-inline"><input type="text" class="form-control text-center" style="width:100px;" value="10.00">/箱</td>
                  <td>65496496131655163415</td>
                  <td><span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#procurement-del-templ">删除</span></td>
                </tr>
                </tbody>
              </table>
              <!-- 翻页 -->
              <nav class="text-right">
                <ul class="pagination">
                  <li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
                  <li class="active"><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
                </ul>
              </nav>
            </div>

            <div role="tabpanel" class="tab-pane" id="summary">
              <table class="table table-striped table-border table-hover">
                <thead>
                <tr class="text-center">
                  <td class="text-left">货号</td>
                  <td>品名</td>
                  <td>单位规格</td>
                  <td>总部库存</td>
                  <td>门店要货量</td>
                  <td>采购数量</td>
                  <td>小计</td>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center">
                  <td class="text-left">164643138431315</td>
                  <td>伊利牛奶</td>
                  <td>1箱*20盒*250ml</td>
                  <td>100</td>
                  <td>10</td>
                  <td>2000</td>
                  <td>￥200.00</td>
                </tr>
                </tbody>
              </table>
              <!-- 翻页 -->
              <nav class="text-right">
                <ul class="pagination">
                  <li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
                  <li><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li class="active"><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!--模态框-添加商品-->
  <set-goods :get-render-data="rederSetGoods" :stock-add-good-modal.sync="addGoodModal"
             :stock-add-good-modal-size="addGoodModalSize" :page.sync="showPage" :add-data.sync="setGoods"></set-goods>
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
  import {requestUrl, token, searchRequest} from '../../../publicFunction/index'
  export default{
    components:{
      AdminNav: AdminNav,
      Grid: Grid,
      Page: Page,
      SetGoods: SetGoods,
      DatePicker: DatePicker,
      LeftPurchase: LeftPurchase
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
