<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <left-setting></left-setting>
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
          <validator name="validationSet">
          <form class="form-inline" novalidate @submit="onSubmit">
            <div class="form-group ml10">
              <label>商品分类</label>
              <select class="form-control" v-model="createList.category_id" v-validate:goodscate="['required']">
                <option value="">请选择</option>
                <option v-for="item in category" :value="item.id">{{item.display_name}}</option>
              </select>
              <div style="float: right;">
                <p v-if="$validationSet.goodscate.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <div class="form-group" style="margin-left: 28px;">
              <label>商品属性</label>
              <select class="form-control" :disabled="true" v-model="createList.product_type" v-validate:producttype="['required']">
                <option value="">请选择</option>
                <option value="1">工厂产成品</option>
                <option value="2">原材料</option>
                <option value="3">门店产成品</option>
              </select>
              <div style="float: right;">
                <p v-if="$validationSet.producttype.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <div class="form-group ml10" style="margin-left:99px;">
              <label>价格属性</label>
              <select class="form-control" v-model="createList.sell_type" v-validate:selltype="['required']">
                <option value="">请选择</option>
                <option value="1">可议价</option>
                <option value="2">特价</option>
                <option value="3">非议价</option>
                <option value="4">非卖品</option>
              </select>
              <div style="float: right;">
                <p v-if="$validationSet.selltype.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <br>
            <div class="form-group ml10">
              <label>商品名称</label>
              <input type="text" class="form-control" v-model="createList.name" v-validate:goodsname="['required']">
              <div style="float: right;">
                <p v-if="$validationSet.goodsname.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <div class="form-group ml10" style="margin-left: 28px;">
              <label>商品货号</label>
              <input type="text" class="form-control" v-model="createList.code" v-validate:goodscode="['required']">
              <div style="float: right;">
                <p v-if="$validationSet.goodscode.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <div class="form-group ml10" style="margin-left:99px;">
              <label>销售状态</label>
              <select class="form-control" v-model="createList.sell_status" v-validate:sellstatus="['required']">
                <option value="">请选择</option>
                <option value="0">下架中</option>
                <option value="1">上架中</option>
              </select>
              <div style="float: right;">
                <p v-if="$validationSet.sellstatus.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <br>
            <div class="form-group ml10">
              <label>一级单位</label>
              <select class="form-control" v-model="createList.base_unit" @change="oneUnit" v-validate:baseunit="['required']">
                <option value="">请选择</option>
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} {{item.alias}}</option>
              </select>
              <div style="float: right;">
                <p v-if="$validationSet.baseunit.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <div class="form-group ml10" style="margin-left: 28px;">
              <label>二级单位</label>
              <select class="form-control" v-model="createList.neutral_unit" @change="twoUnit">
                <option value="">请选择</option>
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} {{item.alias}}</option>
              </select>
              <input type="text" v-if="createList.neutral_unit == ''" class="form-control fsamll"  style="width:85px!important;" placeholder="单位转换" v-model="createList.neutral_unit_value">
              <input type="text" v-else class="form-control fsamll"  style="width:85px!important;" placeholder="单位转换" v-model="createList.neutral_unit_value" v-validate:neutralunit="['required']">
              <div style="float: right;">
                <template v-if="createList.neutral_unit != ''">
                  <p v-if="$validationSet.neutralunit.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
                </template>
              </div>
            </div>
            <div class="form-group ml10" style="padding-left:10px;">
              <label>三级单位</label>
              <select class="form-control" v-model="createList.minimal_unit" @change="threeUnit">
                <option value="">请选择</option>
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} {{item.alias}}</option>
              </select>
              <input type="text" v-if="createList.minimal_unit == ''" class="form-control fsamll" placeholder="单位转换"  style="width:85px!important;" v-model="createList.minimal_unit_value">
              <input type="text" v-else class="form-control fsamll" placeholder="单位转换"  style="width:85px!important;" v-model="createList.minimal_unit_value" v-validate:minimalunit="['required']">
              <div style="float: right;">
                <template v-if="createList.minimal_unit != ''">
                  <p v-if="$validationSet.minimalunit.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
                </template>
              </div>
            </div>
            <span style="width:220px; display:inline-block; padding-bottom:10px;" v-if="createList.neutral_unit">{{hasNeutralUnit}}</span>
            <br>
            <div class="form-group ml10">
              <label>零售单位</label>
              <select v-if="createList.product_type == 2 && createList.sell_status != 1" class="form-control" v-model="createList.sell_unit">
                <option value="">请选择</option>
                <option v-for="item in retailUnit" :value="item.id">{{item.name}}</option>
              </select>
              <select v-else class="form-control" v-model="createList.sell_unit" v-validate:sellunit="['required']">
                <option value="">请选择</option>
                <option v-for="item in retailUnit" :value="item.id">{{item.name}}</option>
              </select>
              <div style="float: right;">
                <template v-if="createList.product_type != 2 || createList.sell_status == 1">
                  <p v-if="$validationSet.sellunit.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
                </template>
              </div>
            </div>
            <div class="form-group ml10">
              <label>采购加工单位</label>
              <select class="form-control" v-model="createList.production_unit" v-validate:productionunit="['required']">
                <option value="">请选择</option>
                <option v-for="item in retailUnit" :value="item.id">{{item.name}}</option>
              </select>
              <div style="float: right;">
                <p v-if="$validationSet.productionunit.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <div class="form-group ml10" style="margin-left:99px;">
              <label>安全库存</label>
              <input v-if="createList.product_type != 2" type="text" class="form-control" v-model="createList.safe_stock">
              <input v-else type="text" class="form-control" v-model="createList.safe_stock" v-validate:safestock="['required']">
              <div style="float: right;">
                <template v-if="!(createList.product_type != 2)">
                  <p v-if="$validationSet.safestock.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
                </template>
              </div>
            </div>
            <br>
            <div class="form-group ml10">
              <label>零售单价</label>
              <input v-if="!(createList.product_type != 2 || createList.sell_status == 1)" type="text" class="form-control" v-model="createList.aruc" @input="priceValidateA()">
              <input v-else type="text" class="form-control"  v-model="createList.aruc" v-validate:goodsaruc="['required']" @input="priceValidateA()">
              <div style="float: right;">
                <template v-if="createList.product_type != 2 || createList.sell_status == 1" >
                  <p v-if="$validationSet.goodsaruc.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
                </template>
              </div>
            </div>
            <div class="form-group ml10">
              <label>采购加工单价</label>
              <input v-if="createList.product_type != 2" type="text" class="form-control" v-model="createList.apuc" @input="priceValidateB()">
              <input v-else type="text" class="form-control" v-model="createList.apuc" v-validate:goodsapuc="['required']" @input="priceValidateB()">
              <div style="float: right;">
                <template v-if="createList.product_type == 2" >
                  <p v-if="$validationSet.goodsapuc.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
                </template>
              </div>
            </div>
          </form>
          </validator>
        </div>

        <div class="panel panel-default" style="background-color: #fffdf4; color: #f76060; font-size: 12px;">
          <div class="panel-body" style="color:red;">
          <p>* 号为必填项！</p>
          <p v-if="createList.code != '' && $validationSet.goodscode.required">货号不能重复，请重新填写！</p>
          </div>
        </div>

        <div class="panel panel-default" style="background-color: #fffdf4; color: #f76060; font-size: 12px;">
          <div class="panel-body">
            如:牛奶单位规格为1箱*18盒*250ml，设定箱为采购单位，盒为销售单位，则采购时按箱计，销售时按盒计<br>
            牛角面包单位规格为1盘*12个，设定盘为生产单位，则BOM清单的耗量为生产1盘牛角面包的耗量<br>
            商品只有一个单位，则采购单位和销售单位均设定为一级单位
          </div>
        </div>

        <div class="form-group">
          <label><input type="checkbox" :disabled="true" :checked="isStatrBOM"
                        v-model="createList.use_bill_of_material">
            启动BOM单</label>
          <button class="btn btn-primary spanblocks ml10"
                  :disabled="createList.product_type == 2 || createList.use_bill_of_material == false || createList.bom_status == false"
                  @click="modal.addGoodModal=true">添加商品
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
            <td>操作</td>
          </tr>
          </thead>
          <tbody v-if="createList.use_bill_of_material == true">
          <tr class="text-center" v-for="item in rederSetGoods" track-by="$index" :id="item.id">
            <td class="text-left">{{item.code}}</td>
            <td>{{item.name}}</td>
            <td class="form-inline">
              <div class="form-group">
                <input type="text" :disabled="createList.bom_status == false" class="form-control text-center" style="width:70px;" v-model="item.value">
              </div>
            </td>
            <td class="form-inline">
              <div class="form-group">
                <select class="form-control" :disabled="createList.bom_status == false" v-model="item.units">
                  <option v-for="items in item.unit" :value="items.id">{{items.name}}</option>
                </select>
              </div>
            </td>
            <td>
              <slot v-if="createList.bom_status" name="operate">
                <list-delete :delete-data.sync="tableData"></list-delete>
              </slot>
              <span v-else class="btn btn-primary" :disabled="true">删除</span>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="panel panel-default" style="background-color: #fffdf4; color: #f76060; font-size: 12px;">
          <div class="panel-body">
            提示：如该商品库存不为零，无法修改商品属性
          </div>
        </div>
        <button type="submit" class="btn btn-info spanblocks fl" @click="onSubmit($event)">保存</button>
        <!-- 翻页 -->
        <page v-if="len>0" :total='len' :current='current_page' :display='per_page' :last-page='totalPage'></page>
      </div>
    </div>
  </div>
  <!--模态框-添加商品-->
  <set-goods :get-render-data="rederSetGoods" :stock-add-good-modal.sync="modal.addGoodModal"
             :stock-add-good-modal-size="modal.addGoodModalSize" :page.sync="showPage" :add-data.sync="setGoods" :goods-list-title="productTabelHead"></set-goods>

  <!--错误提示信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
</template>
<style scoped>
  .form-group div { width:30px; overflow: hidden;}
</style>
<script>
  import $ from 'jquery'
  import AdminNav from '../AdminNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import LeftSetting from '../common/LeftSetting'
  import ListDelete  from '../../common/ListDelete'
  import SetGoods from '../common/SetGoods'
  import ErrorTip from '../../common/ErrorTip'
  import {requestUrl,requestSystemUrl, token, searchRequest,postDataToApi,getDataFromApi,putDataToApi} from '../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      SetGoods: SetGoods,
      AdminNav: AdminNav,
      ListDelete: ListDelete,
      LeftSetting: LeftSetting,
      ErrorTip: ErrorTip
    },
    ready: function () {
//      获取Id
      var str = window.location.href
      var num = str.indexOf('settingEditProduct') + 19
      var id = str.substr(num)
      this.id = id

      var self = this
//      获取单条数据
      getDataFromApi(requestSystemUrl + '/backend-system/product/product/' + self.id,{},function(response){

        self.createList.bom_status = response.data.body.bom_status
        self.createList.category_id = response.data.body.category_id
        self.createList.product_type = response.data.body.product_type
        self.createList.sell_type = response.data.body.sell_type
        self.createList.name = response.data.body.name
        self.createList.code = response.data.body.code
        self.createList.sell_status = String(response.data.body.sell_status)

        self.createList.base_unit = response.data.body.specification_unit[0].unit.unit_id
        self.createList.neutral_unit = response.data.body.specification_unit[1] !== undefined ? response.data.body.specification_unit[1].unit.unit_id: ''
        self.createList.neutral_unit_value = response.data.body.specification_unit[1] !== undefined ? response.data.body.specification_unit[1].unit.value: ''
        self.createList.minimal_unit = response.data.body.specification_unit[2] !== undefined ? response.data.body.specification_unit[2].unit.unit_id: ''
        self.createList.minimal_unit_value = response.data.body.specification_unit[2] !== undefined ? response.data.body.specification_unit[2].value: ''

        self.retailUnit[0].name = response.data.body.specification_unit[0].unit.unit_name
        self.retailUnit[0].id = response.data.body.specification_unit[0].unit.unit_id
        self.retailUnit[1].name = response.data.body.specification_unit[1] !== undefined ? response.data.body.specification_unit[1].unit.unit_name : ''
        self.retailUnit[1].id = response.data.body.specification_unit[1] !== undefined ? response.data.body.specification_unit[1].unit.unit_id : ''
        self.retailUnit[2].name = response.data.body.specification_unit[2] !== undefined ? response.data.body.specification_unit[2].unit.unit_name : ''
        self.retailUnit[2].id = response.data.body.specification_unit[2] !== undefined ? response.data.body.specification_unit[2].unit.unit_id : ''

        self.createList.sell_unit = response.data.body.sell_unit_id
        self.createList.safe_stock = response.data.body.safe_stock == 0 ? '' : response.data.body.safe_stock
        self.createList.production_unit = response.data.body.production_unit_id !== null ? response.data.body.production_unit_id : ''
        self.createList.aruc = response.data.body.aruc == 0 ? '' : (Number(response.data.body.aruc) * 0.01).toFixed(2)
        self.createList.apuc = (Number(response.data.body.apuc) * 0.01).toFixed(2)

        if(response.data.body.bom == ''){
          self.createList.use_bill_of_material = false
          console.log('没有BOM清单' + self.createList.use_bill_of_material)
        } else {
          self.createList.use_bill_of_material = true
          console.log('有BOM清单' + self.createList.use_bill_of_material)
//        BOM清单
          $.each(response.data.body.bom, function (index, val) {
            var obj = {}
            obj['code'] = val.product_code
            obj['name'] = val.product_name
            obj['id'] = val.product_id
            obj['value'] = val.consumption
            obj['units'] = val.consumption_unit
            obj['unit'] = val.unit
            self.rederSetGoods.push(obj)
          })
//      判断商品是否已经被添加
          $.each(self.rederSetGoods, function (index, val1) {
            self.dataArray.push(val1)
            $.each(self.setGoods, function (index, val2) {
              if (val1.id == val2.id) {
                console.log("我是rederSetGoods：" + val1.id)
                console.log("我是setGoods：" + val2.id)
                if (val2.choice && !val2.again) {
                  val2.again = true
                  self.dataArray.push(val2)
                }
              }
            })
          })
        }
      })
//      获取单位
      getDataFromApi(requestSystemUrl + '/backend-system/product/unit',{},function(response){
        self.baseUnit = response.data.body.list
      })
//      获取商品分类
      getDataFromApi(requestSystemUrl + '/backend-system/product/get/category',{},function(response){
        self.category = response.data.body.list
      })
    },
    events: {
//      确认添加商品
      confirmAdd: function () {
        var self = this
        $.each(self.setGoods, function (index, val) {
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        for (var a = 0; a < self.dataArray.length; a++) {
          for (var b = a+1; b < self.dataArray.length; b++) {
            if (self.dataArray[a].id == self.dataArray[b].id) {
              console.log(self.dataArray[a].id)
              console.log(self.dataArray[b].id)
              self.dataArray.splice(b, 1)
            }
          }
        }
        this.rederSetGoods = self.dataArray
        this.old = self.dataArray
        this.localPage(this.old)
        this.rederSetGoods = this.old
      },
//     删除商品
      delete: function (id) {
        var self = this
        $.each(this.rederSetGoods, function (index, val) {
          if (val.id === id) {
            self.rederSetGoods.splice(index, 1)
            val.choice = false
            val.again =  false

            self.dataArray = self.rederSetGoods
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
//        价格正则1
      priceValidateA: function () {
        var re = /^\d{0,8}\.{0,1}(\d{1,2})?$/
        if (!re.test(this.createList.aruc)) {
          this.createList.aruc =  ''

        }
      },
//        价格正则2
      priceValidateB: function () {
        var re = /^\d{0,8}\.{0,1}(\d{1,2})?$/
        if (!re.test(this.createList.apuc)) {
          this.createList.apuc =  ''

        }
      },
      onSubmit: function (e) {
        // validate manually
        var self = this
        this.$validate(function () {
          if (self.$validationSet.invalid) {
            console.log('信息未填写完整')
            self.modal.errModal = true
            self.modal.errInfo = '信息未填写完整,请认真检查！'
            e.preventDefault()
          } else {
            console.log('进入商品请求')
            self.createNew()
          }
        })
      },
//      新增商品
      createNew: function () {
        var self = this
        var materials = []
        $.each(this.rederSetGoods, function (index, val) {
          var obj = {}
          obj['id'] = val.id
          obj['value'] = val.value
          obj['unit'] = val.units
          materials.push(obj)
        })
//          启用BOM单
        if(this.createList.use_bill_of_material){
          console.log('已启用BOM清单：' + this.createList.use_bill_of_material)
          var isS = materials != ''
          console.log('是否已经添加商品：' + isS)

          if (materials=='') {
            this.modal.errModal = true
            this.modal.errInfo = '请在BOM清单中添加商品！'
          } else {
            var isEmpty = true
            $.each(materials, function (index, val) {
              if(val.value == undefined || val.unit == undefined){
                isEmpty = false
                return false
              }
            })
            if(!isEmpty){
              self.modal.errModal = true
              self.modal.errInfo = '请检查BOM清单中的耗量或者单位是否填写完整！'
            } else {
              var url = requestUrl + '/backend-system/product/product/' + self.id
              var data ={
                category_id: self.createList.category_id,
                product_type: self.createList.product_type,
                sell_type: self.createList.sell_type,
                name: self.createList.name,
                code: self.createList.code,
                sell_status: self.createList.sell_status,
                base_unit: self.createList.base_unit,
                base_unit_value: self.createList.base_unit_value,
                neutral_unit: self.createList.neutral_unit,
                neutral_unit_value: self.createList.neutral_unit_value,
                minimal_unit: self.createList.minimal_unit,
                minimal_unit_value: Number(self.createList.minimal_unit_value * self.createList.neutral_unit_value) == 0 ? '': Number(self.createList.minimal_unit_value * self.createList.neutral_unit_value),
                sell_unit: self.createList.sell_unit,
                production_unit: self.createList.production_unit,
                safe_stock: self.createList.safe_stock,
                aruc: self.createList.aruc,
                apuc: self.createList.apuc,
                use_bill_of_material: self.createList.use_bill_of_material,
                materials: materials
              }
              putDataToApi(url,data,function(response) {
                window.location.href = '?#!/admin/setting'
              },function (err) {
//            判断货号是否重复
                if(err.data.body.validate_error.code && err.data.body.validate_error.code[0] == 'The code has already been taken.'){
                  self.$validationSet.goodscode.required = true
                }
              })
            }
          }
//          未启用BOM清单
        } else {
          console.log('未启用BOM清单：' + this.createList.use_bill_of_material)
          materials = ''
          this.rederSetGoods = ''
          var url = requestUrl + '/backend-system/product/product/' + self.id
          var data ={
            category_id: self.createList.category_id,
            product_type: self.createList.product_type,
            sell_type: self.createList.sell_type,
            name: self.createList.name,
            code: self.createList.code,
            sell_status: self.createList.sell_status,
            base_unit: self.createList.base_unit,
            base_unit_value: self.createList.base_unit_value,
            neutral_unit: self.createList.neutral_unit,
            neutral_unit_value: self.createList.neutral_unit_value,
            minimal_unit: self.createList.minimal_unit,
            minimal_unit_value: Number(self.createList.minimal_unit_value * self.createList.neutral_unit_value) == 0 ? '': Number(self.createList.minimal_unit_value * self.createList.neutral_unit_value),
            sell_unit: self.createList.sell_unit,
            production_unit: self.createList.production_unit,
            safe_stock: self.createList.safe_stock,
            aruc: self.createList.aruc,
            apuc: self.createList.apuc,
            use_bill_of_material: self.createList.use_bill_of_material,
            materials: materials
          }
          putDataToApi(url,data,function(response) {
            window.location.href = '?#!/admin/setting'
          },function (err) {
//            判断货号是否重复
            if(err.data.body.validate_error.code && err.data.body.validate_error.code[0] == 'The code has already been taken.'){
              self.$validationSet.goodscode.required = true

            }
          })
        }
      },
//   一级单位
     oneUnit: function () {
       var self = this
       $.each(this.baseUnit,function(index,val){
         if(val.id === Number(self.createList.base_unit)){
           self.retailUnit[0].name = val.name
           self.retailUnit[0].id = val.id
         }
       })
       this.createList.sell_unit = this.retailUnit[0].id
       this.createList.production_unit = this.retailUnit[0].id
     },
//    二级单位
      twoUnit: function () {
        var self = this
        $.each(this.baseUnit,function(index,val){
          if(val.id === Number(self.createList.neutral_unit)){
            self.retailUnit[1].name = val.name
            self.retailUnit[1].id = val.id
          }
        })
        this.createList.sell_unit = this.retailUnit[1].id
        this.createList.production_unit = this.retailUnit[1].id
      },
//     三级单位
      threeUnit: function () {
        var self = this
        $.each(this.baseUnit,function(index,val){
          if(val.id === Number(self.createList.minimal_unit)){
            self.retailUnit[2].name = val.name
            self.retailUnit[2].id = val.id
          }
        })
        this.createList.sell_unit = this.retailUnit[2].id
        this.createList.production_unit = this.retailUnit[2].id
      },
//     前端本地分页函数
      localPage: function (data) {
        this.len = data.length
//        console.log(data.length)
        if (this.len % this.per_page === 0) {
          this.totalPage = this.len / this.per_page
        } else {
          this.totalPage = (Math.floor(this.len / this.per_page)) + 1
        }
        data.splice(this.current_page * this.per_page, this.len - this.current_page * this.per_page)
      }
    },
    computed: {
//      是否启用BOM清单
      isStatrBOM: function () {
        if (this.createList.product_type != 2) {
          console.log('商品属性：' + this.createList.product_type)
          this.createList.use_bill_of_material = true
          console.log('此时的BOM清单：' + this.createList.use_bill_of_material)
        } else {
          console.log('商品属性：' + this.createList.product_type)
          this.createList.use_bill_of_material = false
          console.log('此时的BOM清单：' + this.createList.use_bill_of_material)
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
        id: '',
        len: 0,
        current_page: 1,
        per_page: 10,
        totalPage: 1,
        showPage: [],
        modal:{
          errModal: false,
          errInfo: '',
          addGoodModal: false,
          addGoodModalSize: 'modal-lg',
        },
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
        retailUnit:[{id:'',name:''},{id:'',name:''},{id:'',name:''}],
        setGoods: [],
        setGoodsPage: [],
        dataArray: [],
        rederSetGoods: [],
        createList: {
          bom_status: '',
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
            units: ''
          }
        }
      }
    }
  }
</script>
