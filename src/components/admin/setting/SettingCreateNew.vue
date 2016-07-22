<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2" role="navigation">
        <left-setting></left-setting>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：设置首页</li>
          <li class="active">商品设置</li>
          <li class="active">编辑新增商品</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <a v-link="{ path: '/admin/setting'}"><span class="btn btn-info spanblocks fr">返回商品列表</span></a>
          <div class="clearboth"></div>
        </div>

        <div class="inputFormat">
          <!--<validator name="validationSet">-->
          <form class="form-inline">
            <div class="form-group ml10">
              <label>商品分类</label>
              <select class="form-control" v-model="createList.category_id">
                <option value="">请选择</option>
                <option v-for="item in category" :value="item.id">{{item.display_name}}</option>
              </select>
            </div>
            <div class="form-group" style="margin-left: 37px;">
              <label>商品属性</label>
              <select class="form-control" v-model="createList.product_type">
                <option value="">请选择</option>
                <option value="1">工厂产成品</option>
                <option value="2">门店产成品</option>
                <option value="3">原材料</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>价格属性</label>
              <select class="form-control" v-model="createList.sell_type">
                <option value="">请选择</option>
                <option value="1">可议价</option>
                <option value="2">特价</option>
                <option value="3">非议价</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>品名</label>
              <input type="text" class="form-control" v-model="createList.name" placeholder="此项为必填项！">
            </div>
            <div class="form-group ml10">
              <label>货号</label>
              <input type="text" class="form-control" v-model="createList.code" placeholder="此项为必填项！">
            </div>
            <br>
            <div class="form-group ml10">
              <label>销售状态</label>
              <select class="form-control" v-model="createList.sell_status">
                <option value="">请选择</option>
                <option value="0">下架中</option>
                <option value="1">上架中</option>
                <option value="2">非卖品</option>
              </select>
            </div>
            <div class="form-group" style="margin-left: 37px;">
              <label>一级单位</label>
              <select class="form-control" v-model="createList.base_unit" @change="oneUnit">
                <option value="">请选择</option>
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} {{item.alias}}</option>
              </select>
              <span v-if="createList.neutral_unit">{{hasNeutralUnit}}</span>
            </div>
            <div class="form-group ml10">
              <label>二级单位</label>
              <select class="form-control" v-model="createList.neutral_unit" @change="twoUnit">
                <option value="">请选择</option>
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} {{item.alias}}</option>
              </select>
              <input type="text" class="form-control fsamll" placeholder="单位转换" v-model="createList.neutral_unit_value">
            </div>
            <div class="form-group ml10">
              <label>三级单位</label>
              <select class="form-control" v-model="createList.minimal_unit" @change="threeUnit">
                <option value="">请选择</option>
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} {{item.alias}}</option>
              </select>
              <input type="text" class="form-control fsamll" placeholder="单位转换" style="width: 85px;"
                     v-model="createList.minimal_unit_value">
            </div>
            <br>
            <div class="form-group ml10">
              <label>零售单位</label>
              <select class="form-control" v-model="createList.sell_unit">
                <option value="请选择">请选择</option>
                <option v-for="item in retailUnit" :value="item.id">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>采购加工单位</label>
              <select class="form-control" v-model="createList.production_unit">
                <option value="">请选择</option>
                <option v-for="item in baseUnit" :value="item.id">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>安全库存</label>
              <input type="text" class="form-control" v-model="createList.safe_stock" placeholder="此项为必填项！">
              <!--v-validate:createList.safe_stock="['required']" @invalid="touched"-->
              <!--<div v-if="createList.safe_stock == ''" style="float: right;">
                <p style="color:red; margin: 0px; margin-left: 10px; line-height: 34px;">{{safeStock}}</p>
              </div>-->
            </div>
            <br>
            <div class="form-group ml10">
              <label>零售单价</label>
              <input type="text" class="form-control" v-model="createList.aruc">
            </div>
            <div class="form-group ml10">
              <label>采购加工单价</label>
              <input type="text" class="form-control"
                     v-if="createList.product_type == 2 || createList.product_type == 3" placeholder="次项为必填项！"
                     v-model="createList.apuc">
              <input type="text" class="form-control" v-else v-model="createList.apuc">
            </div>
          </form>
          <!--</validator>-->
        </div>

        <div class="panel panel-default" style="background-color: #fffdf4; color: #f76060; font-size: 12px;">
          <div class="panel-body">
            如:牛奶单位规格为1箱*18盒*250ml，设定箱为采购单位，盒为销售单位，则采购时按箱计，销售时按盒计<br>
            牛角面包单位规格为1盘*12个，设定盘为生产单位，则BOM清单的耗量为生产1盘牛角面包的耗量<br>
            商品只有一个单位，则采购单位和销售单位均设定为一级单位
          </div>
        </div>

        <div class="form-group">
          <label><input type="checkbox" :disabled="createList.product_type == 3" :checked="isStatrBOM"
                        v-model="createList.use_bill_of_material">
            启动BOM单</label>
          <button class="btn btn-primary spanblocks ml10" data-toggle="modal"
                  :disabled="createList.product_type == 3 || createList.use_bill_of_material == false"
                  @click="addGoodModal=true">添加商品
          </button>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">货号</td>
            <td>品名</td>
            <td>耗量</td>
            <td>单位</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="item in rederSetGoods" track-by="$index" :id="item.id">
            <td class="text-left">{{item.code}}</td>
            <td>{{item.name}}</td>
            <td class="form-inline">
              <div class="form-group">
                <input type="text" class="form-control text-center" style="width:70px;" v-model="item.value">
              </div>
            </td>
            <td class="form-inline">
              <div class="form-group">
                <select class="form-control" v-model="item.unit">
                  <option v-for="item in baseUnit" :value="item.id">{{item.name}} {{item.alias}}</option>
                </select>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="panel panel-default" style="background-color: #fffdf4; color: #f76060; font-size: 12px;">
          <div class="panel-body">
            提示：如该商品库存不为零，无法修改商品属性
          </div>
        </div>
        <span class="btn btn-info spanblocks fl" @click="createNew()">保存</span>
        <!-- 翻页 -->
        <page v-if="rederSetGoods.total>0" :total='rederSetGoods.total' :current.sync='setGoodsPage.current_page' :display='setGoodsPage.per_page'
              :last-page='setGoodsPage.last_page'></page>

      </div>
    </div>
  </div>
  <!--模态框-添加商品-->
  <set-goods :get-render-data="rederSetGoods" :stock-add-good-modal.sync="addGoodModal"
             :stock-add-good-modal-size="addGoodModalSize" :page.sync="showPage" :add-data.sync="setGoods" :goods-list-title="productTabelHead"></set-goods>

</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import AdminNav from '../AdminNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import LeftSetting from '../common/LeftSetting'
  import SetGoods from '../common/SetGoods'
  import {requestUrl,requestSystemUrl, token, searchRequest,postDataToApi,getDataFromApi} from '../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      SetGoods: SetGoods,
      AdminNav: AdminNav,
      LeftSetting: LeftSetting
    },
    ready: function () {
      var self = this
//      获取单位
      getDataFromApi(requestSystemUrl + '/backend-system/product/unit',{},function(response){
        self.baseUnit = response.data.body.list
      })
//      获取商品分类
      getDataFromApi(requestSystemUrl + '/backend-system/product/category',{},function(response){
        self.category = response.data.body.list
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
        $.each(this.rederSetGoods, function (index, val) {
          var obj = {}
          obj['id'] = val.id
          obj['value'] = val.value
          obj['unit'] = val.unit
          materials.push(obj)
        })
        var materials = []
        var url = requestUrl + '/backend-system/product/product'
        var self = this
        var data ={
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
        }
        postDataToApi( url,data,function(response) {
          window.location.href = '?#!/admin/setting'
        })
      },
//   一级单位
     oneUnit: function () {
       var self = this
       $.each(this.baseUnit,function(index,val){
         if(val.id ===Number(self.createList.base_unit)){
           self.retailUnit[0].name = val.name
         }
       })
       this.createList.sell_unit = this.retailUnit[0].id
     },
//    二级单位
      twoUnit: function () {
        var self = this
        $.each(this.baseUnit,function(index,val){
          if(val.id ===Number(self.createList.neutral_unit)){
            self.retailUnit[1].name = val.name
          }
        })
        this.createList.sell_unit =  this.retailUnit[1].id
      },
//     三级单位
      threeUnit: function () {
        var self = this
        $.each(this.baseUnit,function(index,val){
          if(val.id ===Number(self.createList.minimal_unit)){
            self.retailUnit[2].name = val.name
          }
        })
        this.createList.sell_unit =  this.retailUnit[2].id
      },
/*//     验证
      touched: function () {
        this.safeStock = '请填写安全库存！'
      }*/
    },
    computed: {
//      是否启用BOM清单
      isStatrBOM: function () {
        if (this.createList.product_type != 3) {
          this.createList.use_bill_of_material = true
        } else if (this.createList.product_type == 3) {
          this.createList.use_bill_of_material = false
        }
      },
//      显示转换单位
      hasNeutralUnit: function () {
        var firstName = ''
        var secondName = ''
        var thirdName = ''
        var secondVal = this.createList.neutral_unit_value
        var thirdVal = this.createList.minimal_unit_value
        var base = this.baseUnit

        var self = this
        if(self.createList.minimal_unit == ''){
          $.each(base,function (index,val) {
            firstName = base[self.createList.base_unit-1].name
            secondName = base[self.createList.neutral_unit-1].name
          })
          return "1" + firstName + "=" + secondVal + secondName
        } else {
          $.each(base,function (index,val) {
            firstName = base[self.createList.base_unit-1].name
            secondName = base[self.createList.neutral_unit-1].name
            thirdName = base[self.createList.minimal_unit-1].name
          })
          return "1" + firstName + "=" + secondVal + secondName + " " + "1" + secondName + "=" + thirdVal + thirdName
        }
      }
    },
    data: function () {
      return {
//        safeStock: '',
        showPage: [],
        addGoodModal: false,
        addGoodModalSize: 'modal-lg',
        productTabelHead: {
            code: "货号",
            name: "品名",
            bruc: "日均销量",
            aruc: "当前库存",
            production_unit_name: "单位",
            specification_unit: "单位规格",
            category: "分类",
        },
        category: '',
        baseUnit: '',
        retailUnit:[{id:0,name:''},{id:1,name:''},{id:2,name:''}],
        setGoods: [],
        setGoodsPage: [],
        dataArray: [],
        rederSetGoods: [],
        createList: {
          category_id: '',
          product_type: '',
          sell_type: '',
          name: '',
          code: '',
          sell_status: '',
          base_unit: '',
          base_unit_value: 1,
          neutral_unit: '',
          neutral_unit_value: '',
          minimal_unit: '',
          minimal_unit_value: '',
          sell_unit: '请选择',
          production_unit: '',
          safe_stock: '',
          aruc: '',
          apuc: '',
          use_bill_of_material: '',
          materials: {
            id: '',
            value: '',
            unit: ''
          }
        }
      }
    }
  }
</script>
