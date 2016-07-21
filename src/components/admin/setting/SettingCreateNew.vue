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
          <form class="form-inline">
            <div class="form-group ml10">
              <label>商品分类</label>
              <select class="form-control" v-model="createList.category_id">
                <option v-for="item in category" :value="item.id">{{item.display_name}}</option>
              </select>
            </div>
            <div class="form-group" style="margin-left: 37px;">
              <label>商品属性</label>
              <select class="form-control" v-model="createList.product_type">
                <option value="1">工厂产成品</option>
                <option value="2">委外产成品</option>
                <option value="3">门店产成品</option>
                <option value="4">原材料</option>
                <option value="5">套餐</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>价格属性</label>
              <select class="form-control" v-model="createList.sell_type">
                <option value="1">可议价</option>
                <option value="2">特价</option>
                <option value="3">非议价</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>品名</label>
              <input type="text" class="form-control" v-model="createList.name">
            </div>
            <div class="form-group ml10">
              <label>货号</label>
              <input type="text" class="form-control" v-model="createList.code">
            </div>
            <br>
            <div class="form-group ml10">
              <label>销售状态</label>
              <select class="form-control" v-model="createList.sell_status">
                <option value="0">下架中</option>
                <option value="1">上架中</option>
                <option value="2">非卖品</option>
              </select>
            </div>
            <div class="form-group" style="margin-left: 37px;">
              <label>一级单位</label>
              <select class="form-control" v-model="createList.base_unit">
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} ({{item.alias}})</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>二级单位</label>
              <select class="form-control fsamll" v-model="createList.neutral_unit">
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} ({{item.alias}})</option>
              </select>
              <input type="text" class="form-control fsamll" placeholder="单位转换" v-model="createList.neutral_unit_value">
            </div>
            <div class="form-group ml10">
              <label>三级单位</label>
              <select class="form-control fsamll" v-model="createList.minimal_unit">
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} ({{item.alias}})</option>
              </select>
              <input type="text" class="form-control fsamll" placeholder="单位转换" style="width: 85px;"
                     v-model="createList.minimal_unit_value">
            </div>
            <br>
            <div class="form-group ml10">
              <label>零售单位</label>
              <select class="form-control" v-model="createList.sell_unit">
                <option v-for="item in baseUnit" :value="item.id">{{item.name}} ({{item.alias}})</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>采购加工单位</label>
              <select class="form-control" v-model="createList.production_unit">
                <option v-for="item in baseUnit" :value="item.id">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>安全库存</label>
              <input type="text" class="form-control" v-model="createList.safe_stock">
            </div>
            <br>
            <div class="form-group ml10">
              <label>零售单价</label>
              <input type="text" class="form-control" v-model="createList.aruc">
            </div>
            <div class="form-group ml10">
              <label>采购加工单价</label>
              <input type="text" class="form-control"
                     v-if="createList.product_type == 2 || createList.product_type == 4" placeholder="次项为必填项！"
                     v-model="createList.apuc">
              <input type="text" class="form-control" v-else v-model="createList.apuc">
            </div>
          </form>
        </div>

        <div class="panel panel-default" style="background-color: #fffdf4; color: #f76060; font-size: 12px;">
          <div class="panel-body">
            如:牛奶单位规格为1箱*18盒*250ml，设定箱为采购单位，盒为销售单位，则采购时按箱计，销售时按盒计<br>
            牛角面包单位规格为1盘*12个，设定盘为生产单位，则BOM清单的耗量为生产1盘牛角面包的耗量<br>
            商品只有一个单位，则采购单位和销售单位均设定为一级单位
          </div>
        </div>

        <div class="form-group">
          <label><input type="checkbox" :disabled="createList.product_type == 4" :checked="isStatrBOM"
                        v-model="createList.use_bill_of_material">
            启动BOM单</label>
          <button class="btn btn-primary spanblocks ml10" data-toggle="modal"
                  :disabled="createList.product_type == 4 || createList.use_bill_of_material == false"
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
                  <option v-for="item in baseUnit" :value="item.id">{{item.name}} ({{item.alias}})</option>
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
        <page :total='rederSetGoods.total' :current.sync='setGoodsPage.current_page' :display='setGoodsPage.per_page'
              :last-page='setGoodsPage.last_page'></page>

      </div>
    </div>
  </div>

  <!--模态框-添加商品-->
  <div class="modal fade" id="set-add-products-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">添加商品</h4>
        </div>
        <div class="modal-body">
          <!-- 页头 -->
          <div class="page-header">
            <form action="" method="post" class="form-inline">
              <div class="form-group">
                <label><input type="checkbox">库存警戒中</label>
              </div>
              <div class="form-group ml10">
                <input type="text" class="form-control" placeholder="请输入商品名或商品编号">
              </div>
              <span class="btn btn-primary">搜索</span>
              <span class="btn btn-warning">撤销搜索</span>
            </form>
          </div>
          <div class="container-fluid">
            <div class="row">
              <div class="col-sm-2" role="navigation" style="padding:0;">
                <ul class="nav nav-stacked dialog-sidebar">
                  <li class="header">商品分类</li>
                  <li class="active"><a href="#">全部<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">包装材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">咖啡原材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">面包<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">饼干<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">包装材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">咖啡原材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">面包<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">饼干<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">包装材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">咖啡原材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">面包<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">饼干<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                </ul>
              </div>
              <div class="col-sm-10" style="padding-right: 0;height:580px;overflow:auto;">
                <table class="table table-striped table-border table-hover">
                  <thead>
                  <tr>
                    <td><label><input type="checkbox"> 全选</label></td>
                    <td>货号</td>
                    <td>品名</td>
                    <td>日均销量</td>
                    <td>当前库存</td>
                    <td>单位</td>
                    <td>单位规格</td>
                    <td>商品分类</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td><input type="checkbox"></td>
                    <td>WB2545236584</td>
                    <td>伊利牛奶</td>
                    <td>100</td>
                    <td>102</td>
                    <td>箱</td>
                    <td>1箱*20盒*250ml</td>
                    <td>咖啡原材料</td>
                  </tr>
                  <tr>
                    <td><input type="checkbox"></td>
                    <td>WB2545236584</td>
                    <td>伊利牛奶</td>
                    <td>100</td>
                    <td>102</td>
                    <td>箱</td>
                    <td>1箱*20盒*250ml</td>
                    <td>咖啡原材料</td>
                  </tr>
                  <tr>
                    <td><input type="checkbox"></td>
                    <td>WB2545236584</td>
                    <td>伊利牛奶</td>
                    <td>100</td>
                    <td>102</td>
                    <td>箱</td>
                    <td>1箱*20盒*250ml</td>
                    <td>咖啡原材料</td>
                  </tr>
                  <tr>
                    <td><input type="checkbox"></td>
                    <td>WB2545236584</td>
                    <td>伊利牛奶</td>
                    <td>100</td>
                    <td>102</td>
                    <td>箱</td>
                    <td>1箱*20盒*250ml</td>
                    <td>咖啡原材料</td>
                  </tr>
                  <tr>
                    <td><input type="checkbox"></td>
                    <td>WB2545236584</td>
                    <td>伊利牛奶</td>
                    <td>100</td>
                    <td>102</td>
                    <td>箱</td>
                    <td>1箱*20盒*250ml</td>
                    <td>咖啡原材料</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary">确定添加</button>
        </div>
      </div>
    </div>
  </div>
  <!--模态框HTML-->

  <!--模态框-添加商品-->
  <set-goods :get-render-data="rederSetGoods" :stock-add-good-modal.sync="addGoodModal"
             :stock-add-good-modal-size="addGoodModalSize" :page.sync="showPage" :add-data.sync="setGoods"></set-goods>

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
  import {requestUrl, token, searchRequest} from '../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      SetGoods: SetGoods,
      AdminNav: AdminNav,
      LeftSetting: LeftSetting
    },
    ready: function () {
      $.each(this.rederSetGoods, function (index, val) {
        val.addFlag = false
      })
//      获取单位
      this.$http({
        url: requestUrl + '/backend-system/product/unit',
        method: 'get',
        headers: {'X-Overpowered-Token': token},
      }).then(function (response) {
        this.baseUnit = response.data.body.list
      }, function (err) {
        console.log(err)
      })
//      获取商品分类
      this.$http({
        url: requestUrl + '/front-system/order/category',
        method: 'get',
        headers: {'X-Overpowered-Token': token},
      }).then(function (response) {
        this.category = response.data.body.list
      }, function (err) {
        console.log(err)
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
          window.location.href = requestUrl + '/setting'
          console.log(response)
        }, function (error) {
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
    computed: {
//      是否启用BOM清单
      isStatrBOM: function () {
        if (this.createList.product_type != 4) {
          this.createList.use_bill_of_material = true
        } else if (this.createList.product_type == 4) {
          this.createList.use_bill_of_material = false
        }
      }
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
          sell_unit: '',
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
