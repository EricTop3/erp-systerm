<template>
  <modal :show.sync="stockAddGoodModal"  :modal-size="stockAddGoodModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">添加商品</h4>
    </div>
    <div slot="body">
      <div class="page-header">
        <form action="" method="post" class="form-inline">
          <div class="form-group">
            <label><input type="checkbox">库存警戒中</label>
          </div>
          <div class="form-group ml10">
            <input type="text" class="form-control" placeholder="请输入商品名或商品编号" v-model="query.search">
          </div>
          <span class="btn btn-info" @click="search()">搜索</span>
          <span class="btn btn-warning" @click="cancel()">撤销搜索</span>
        </form>
      </div>
      <div class="container-fluid" style="height: 400px; overflow: auto;">
        <div class="row">
          <div class="col-sm-2" role="navigation" style="padding:0;">
            <ul class="nav nav-stacked sidebar">
              <li class="header">商品分类</li>
              <li v-for="item in category" track-by="$index" :class="{'active':$index===0}" @click="fetchStockGood($event)">
                <a href="javascript:void(0)">{{item.display_name}}<span
                  class="glyphicon glyphicon-chevron-right"></span></a></li>
            </ul>
          </div>
          <div class="col-sm-10" style="padding-right: 0;height:550px;overflow:auto;">
            <!--表格-->
            <grid :check="true" :data="goodsList" :columns="goodsListTitle" :is-add-flag.sync="isAdd" v-on:change-all-operate="changeAllOperate" v-on:change-operate="changeOperate"></grid>
            <!--分页-->
            <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
                  :last-page='page.last_page'></page>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmClick()" :class="{'btn-warning':!isAdd}" :disabled="!isAdd">确定添加</button>
    </div>
  </modal>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import Modal from '../common/Modal'
  import {requestUrl,token} from '../../publicFunction/index'
  export default {
    name: 'stockGoods',
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal
    },
    compiled: function () {
//      分类
      this.$http({
        url: requestUrl + '/front-system/order/category',
        method: 'get',
      }).then(function (response) {
        this.category = response.data.body.list
      }, function (err) {
        console.log(err)
      })
//       获取产品
      this.requestApi({per_page: 16})
      this.addData = this.goodsList
    },
    props: {
      addData: [],
      stockAddGoodModal: false,
      stockAddGoodModalSize: 'modal-lg',
      page: [
        {
          total: 10,
          current_page: 1,
          per_page: 10,
          last_page: 1
        }
      ]
    },
    methods: {
//      全选选择添加商品
      changeAllOperate: function (checkAll) {
        var goodslist = this.goodsList
        $.each(goodslist, function (index, val) {
          if (checkAll) {
            val.checked = true
          } else {
            val.checked = false
          }
        })
      },
//     单选选择商品
      changeOperate: function (currentId, currentObjCheck) {
        var goodslist = this.goodsList
        if (currentObjCheck) {
          $.each(goodslist, function (index, val) {
            if (val.id === currentId) {
              val.checked = true
            }
          })
        } else {
          $.each(goodslist, function (index, val) {
            if (val.id === currentId) {
              val.checked = false
            }
          })
        }
      },
//     公共产品列表请求
      requestApi: function (data) {
        this.$http({
          url: requestUrl + '/front-system/stock/enquiry',
          method: 'get',
          data: data
        }).then(function (response) {
          this.goodsList = response.data.body.list
          this.page = response.data.body.pagination
          this.addData = this.goodsList
        }, function (err) {
          console.log(err)
        })
      },
//    根据分类进行产品请求
      fetchStockGood: function (event) {
        var currentObj = $(event.currentTarget)
        this.query.category = currentObj.find('a').html()
        var data = {
          category: this.query.category
        }
        currentObj.addClass('active').siblings('li').removeClass('active')
        this.$dispatch('fetchProduct')
//       获取产品
        this.requestApi(data)
      },
//      根据搜索进行产品请求
      search: function () {
        var data = {
          search: this.query.search
        }
        this.requestApi(data)
      },
//      撤销搜索
      cancel: function () {
        var data = {}
        this.requestApi(data)
      },
//      点击确定添加按钮
      confirmClick: function () {
        this.stockAddGoodModal = false
        this.$dispatch('confirmAdd')
      }
    },
    data: function () {
      return {
        isAdd: false,
        query: {
          search: '',
          category: ''
        },
        category: [],
        goodsListTitle: {
          'goods_code': '货号',
          'goods_name': '品名',
          'day_sales': '日均销量',
          'stock': '当前库存',
          'unit': '单位',
          'unit_specification': '单位规格',
          'category': '商品分类'
        },
        goodsList: [
          {
            'id': 1,
            'checked': false,
            'goods_code': 'xyz201606271458011',
            'safety_stock': '50',
            'day_sales': '22',
            'category': '原材料',
            'goods_name': '伊利牛奶',
            'stock': 0,
            'unit': '箱',
            'unit_specification': '1箱*20盒*250ml'
          },
          {
            'id': 2,
            'checked': false,
            'goods_code': 'xyz201606271458001',
            'safety_stock': '50',
            'day_sales': '22',
            'category': '原材料',
            'goods_name': '牛角包',
            'stock': 20000,
            'unit': '个',
            'unit_specification': '1个'
          },
          {
            'id': 3,
            'checked': false,
            'goods_code': 'xyz201606271458001',
            'safety_stock': '50',
            'day_sales': '22',
            'category': '原材料',
            'goods_name': '露西咖啡豆',
            'stock': 3000,
            'unit': '包',
            'unit_specification': '1包*2500g'
          },
          {
            'id': 4,
            'checked': false,
            'goods_code': 'xyz201606271458001',
            'safety_stock': '50',
            'day_sales': '22',
            'category': '原材料',
            'goods_name': '糖浆',
            'stock': 2000,
            'unit': '瓶',
            'unit_specification': '1瓶*1000ml'
          },
          {
            'id': 5,
            'checked': false,
            'goods_code': 'xyz201606271458001',
            'safety_stock': '50',
            'day_sales': '22',
            'category': '原材料',
            'goods_name': '蔓越莓饼干',
            'stock': 3000,
            'unit': '盒',
            'unit_specification': '1盒*12块'
          },
          {
            'id': 6,
            'checked': false,
            'goods_code': 'xyz201606271458001',
            'safety_stock': '50',
            'day_sales': '22',
            'category': '原材料',
            'goods_name': '白砂糖',
            'stock': 2000,
            'unit': '包',
            'unit_specification': '1包*0.5kg'
          }
        ]
      }
    }
  }
</script>
