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
            <div class="form-group" style="margin-left: 37px;">
              <label>商品属性</label>
              <select class="form-control" v-model="createList.product_type" v-validate:producttype="['required']">
                <option value="">请选择</option>
                <option value="1">工厂产成品</option>
                <option value="2">原材料</option>
                <option value="3">门店产成品</option>
              </select>
              <div style="float: right;">
                <p v-if="$validationSet.producttype.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <div class="form-group ml10">
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
            <div class="form-group ml10">
              <label>品名</label>
              <input type="text" class="form-control" v-model="createList.name" v-validate:goodsname="['required']">
              <div style="float: right;">
                <p v-if="$validationSet.goodsname.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <div class="form-group ml10">
              <label>货号</label>
              <input type="text" class="form-control" v-model="createList.code" v-validate:goodscode="['required']">
              <div style="float: right;">
                <p v-if="$validationSet.goodscode.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <br>
            <div class="form-group ml10">
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
            <div class="form-group" style="margin-left: 37px;">
              <label>一级单位</label>
              <select class="form-control" v-model="createList.base_unit" @change="oneUnit" v-validate:baseunit="['required']">
                <option value="">请选择</option>
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} {{item.alias}}</option>
              </select>
              <div style="float: right;">
                <p v-if="$validationSet.baseunit.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
              <span v-if="createList.neutral_unit">{{hasNeutralUnit}}</span>
            </div>
            <div class="form-group ml10">
              <label>二级单位</label>
              <select class="form-control" v-model="createList.neutral_unit" @change="twoUnit">
                <option value="">请选择</option>
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} {{item.alias}}</option>
              </select>
              <input type="text" v-if="createList.neutral_unit == ''" class="form-control fsamll" placeholder="单位转换" v-model="createList.neutral_unit_value">
              <input type="text" v-else class="form-control fsamll" placeholder="单位转换" v-model="createList.neutral_unit_value" v-validate:neutralunit="['required']">
              <div v-if="createList.neutral_unit != ''" style="float: right;">
                <p v-if="$validationSet.neutralunit.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>

            </div>
            <div class="form-group ml10">
              <label>三级单位</label>
              <select class="form-control" v-model="createList.minimal_unit" @change="threeUnit">
                <option value="">请选择</option>
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} {{item.alias}}</option>
              </select>
              <input type="text" v-if="createList.minimal_unit == ''" class="form-control fsamll" placeholder="单位转换" style="width: 85px;" v-model="createList.minimal_unit_value">
              <input type="text" v-else class="form-control fsamll" placeholder="单位转换" style="width: 85px;" v-model="createList.minimal_unit_value" v-validate:minimalunit="['required']">
              <div v-if="createList.minimal_unit != ''" style="float: right;">
                <p v-if="$validationSet.minimalunit.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
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
              <div v-if="createList.product_type != 2 || createList.sell_status == 1" style="float: right;">
                <p v-if="$validationSet.sellunit.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <div class="form-group ml10">
              <label>采购加工单位</label>
              <select v-if="createList.product_type != 2" class="form-control" v-model="createList.production_unit">
                <option value="">请选择</option>
                <option v-for="item in retailUnit" :value="item.id">{{item.name}}</option>
              </select>
              <select v-else class="form-control" v-model="createList.production_unit" v-validate:productionunit="['required']">
                <option value="">请选择</option>
                <option v-for="item in retailUnit" :value="item.id">{{item.name}}</option>
              </select>
              <div v-if="createList.product_type == 2" style="float: right;">
                <p v-if="$validationSet.productionunit.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <div class="form-group ml10">
              <label>安全库存</label>
              <input type="text" class="form-control" v-model="createList.safe_stock" v-validate:safestock="['required']">
              <div style="float: right;">
                <p v-if="$validationSet.safestock.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <br>
            <div class="form-group ml10">
              <label>零售单价</label>
              <input v-if="!(createList.product_type != 2 || createList.sell_status == 1)" type="text" class="form-control" v-model="createList.aruc">
              <input v-else type="text" class="form-control"  v-model="createList.aruc" v-validate:goodsaruc="['required']">
              <div v-if="createList.product_type != 2 || createList.sell_status == 1" style="float: right;">
                <p v-if="$validationSet.goodsaruc.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
            <div class="form-group ml10">
              <label>采购加工单价</label>
              <input v-if="createList.product_type != 2" type="text" class="form-control" v-model="createList.apuc">
              <input v-else type="text" class="form-control" v-model="createList.apuc" v-validate:goodsapuc="['required']">
              <div v-if="createList.product_type == 2" style="float: right;">
                <p v-if="$validationSet.goodsapuc.required" style="margin: 0px; margin-left: 5px; line-height: 34px; color: red;">*</p>
              </div>
            </div>
          </form>
          </validator>
        </div>

        <div class="panel panel-default" style="background-color: #fffdf4; color: #f76060; font-size: 12px;">
          <div class="panel-body" style="color:red;">* 号为必填项！</div>
        </div>

        <div class="panel panel-default" style="background-color: #fffdf4; color: #f76060; font-size: 12px;">
          <div class="panel-body">
            如:牛奶单位规格为1箱*18盒*250ml，设定箱为采购单位，盒为销售单位，则采购时按箱计，销售时按盒计<br>
            牛角面包单位规格为1盘*12个，设定盘为生产单位，则BOM清单的耗量为生产1盘牛角面包的耗量<br>
            商品只有一个单位，则采购单位和销售单位均设定为一级单位
          </div>
        </div>

        <div class="form-group">
          <label><input type="checkbox" :disabled="createList.product_type == 2" :checked="isStatrBOM"
                        v-model="createList.use_bill_of_material">
            启动BOM单</label>
          <button class="btn btn-primary spanblocks ml10"
                  :disabled="createList.product_type == 2 || createList.use_bill_of_material == false"
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
          <tbody v-if="this.createList.use_bill_of_material == true">
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
        <button type="submit" class="btn btn-info spanblocks fl" @click="onSubmit($event)">保存</button>
        <!-- 翻页 -->
        <page v-if="len>0" :total='len' :current='current_page' :display='per_page' :last-page='totalPage'></page>
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
//      确认添加商品
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
//    验证
    validators: {
     /* numeric: function (val/!*,rule*!/) {
       return /^[-+]?[0-9]+$/.test(val)
       },
       url: function (val) {
       return /^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val)
       }*/
    },
    methods: {
      onSubmit: function (e) {
        // validate manually
        var self = this
        this.$validate(function () {
          if (self.$validationSet.invalid) {
            console.log(self.$validationSet.invalid)
            e.preventDefault()
          } else {
            console.log(self.$validationSet.invalid)
            self.createNew()
          }
        })
      },
//      新增商品请求
      createNew: function () {
        var self = this
        var materials = []
        $.each(this.rederSetGoods, function (index, val) {
          var obj = {}
          obj['id'] = val.id
          obj['value'] = val.value
          obj['unit'] = val.unit
          materials.push(obj)
        })
        if(this.createList.use_bill_of_material == false){
          materials = []
          this.rederSetGoods = ''
          var url = requestUrl + '/backend-system/product/product'
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
            minimal_unit_value: self.createList.minimal_unit_value,
            sell_unit: self.createList.sell_unit,
            production_unit: self.createList.production_unit,
            safe_stock: self.createList.safe_stock,
            aruc: self.createList.aruc,
            apuc: self.createList.apuc,
            use_bill_of_material: self.createList.use_bill_of_material,
            materials: materials
          }
          postDataToApi( url,data,function(response) {
            window.location.href = '?#!/admin/setting'
          })
        } else {
          $.each(materials, function (index, val) {
            if(val.value == undefined || val.unit == undefined){
              alert('请检查耗量或者单位是否填写完整！')
            } else {
              var url = requestUrl + '/backend-system/product/product'
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
                minimal_unit_value: self.createList.minimal_unit_value,
                sell_unit: self.createList.sell_unit,
                production_unit: self.createList.production_unit,
                safe_stock: self.createList.safe_stock,
                aruc: self.createList.aruc,
                apuc: self.createList.apuc,
                use_bill_of_material: self.createList.use_bill_of_material,
                materials: materials
              }
              postDataToApi( url,data,function(response) {
                window.location.href = '?#!/admin/setting'
              })
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
          this.createList.use_bill_of_material = true
        } else if (this.createList.product_type == 2) {
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
        len: 0,
        current_page: 1,
        per_page: 10,
        totalPage: 1,
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
        retailUnit:[{id:'',name:''},{id:'',name:''},{id:'',name:''}],
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
