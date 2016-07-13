<template>
  <modal :show.sync='instroduceDataModal' :modal-size="instroduceDataModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">原始配送出库单</h4>
    </div>
    <div slot="body">
      <!-- 页头 -->
      <div class="page-header text-center">
        <form action="" method="post" class="form-inline">
          <div class="form-group">
            <label>配送时间段</label>
            <input type="text" class="form-control date_picker" placeholder="开始时间">
            <input type="text" class="form-control date_picker" placeholder="结束时间">
          </div>
          <span class="btn btn-info">搜索</span>
          <span class="btn btn-info">撤销搜索</span>
        </form>
      </div>
      <div style="height:200px; overflow: auto;">
        <!--表格-->
        <grid :check="true" :data="citeData" :columns="citeDataTitle" v-on:change-operate="change"
              v-on:change-all-operate="changeAll"></grid>
      </div>

      <div style="height:200px; overflow: auto; margin-top: 20px;">
        <!--表格-->
        <grid :check="true" :data="addData" :columns="thisDataTitle" :is-add-flag.sync="isAdd"
              v-on:change-add-operate="changeOperate" v-on:change-all-operate="changeAllOperate"></grid>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmClick()" :class="{'btn-warning':!isAdd}"
              :disabled="!isAdd">确定添加
      </button>
    </div>
  </modal>
</template>
<script>
  import $ from 'jquery'
  import Modal from '../common/Modal'
  import Grid from '../common/Grid'
  import { requestUrl } from '../../publicFunction/index'
  import _ from 'underscore'
  export default{
    name: 'introduce-data',
    components: {
      Modal: Modal,
      Grid: Grid
    },
    props: {
      instroduceDataModal: false,
      instroduceDataModalSize: 'modal-sm',
      addData: []
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
//        this.detailListData(currentpage)
        console.log(currentpage)
      }
    },
    methods: {
//      单选上面表格加载下面数据
      change: function (currentId, currentObjCheck) {
        var fetchedData = []
//    根据当前id获取产品
        this.$http({
          url: requestUrl + '/front-system/store/resource/' + currentId + '/detail',
          method: 'get'
        }).then(function (response) {
          $.each(response.data.body.list,function(index,val){
            if(val.store_distribution_id ===currentId){
              val.store_distribution_id  ===  '123456'
            }
          })
          this.thisData = response.data.body.list
          fetchedData = this.thisData
          var firtElem = fetchedData[0]
          var lastElem = fetchedData[fetchedData.length - 1]
          var start = 0
          var end = 0
          if (currentObjCheck) {
            this.addData = this.addData.concat(fetchedData)
          } else {
            $.each(this.addData, function (index, val) {
              if (_.isEqual(val, firtElem)) {
                start = index
              }
              if (_.isEqual(val, lastElem)) {
                end = index
              }
            })
            this.addData.splice(start, end - start + 1)
          }
        }, function (err) {
          console.log(err)
        })
      },
//      全选上面表格加载下面数据
      changeAll: function (checkAll) {
        var self = this
        if (checkAll) {
          $.each(this.citeData, function (index, val) {
            var currentId = val.id
            console.log(currentId)
            self.$http({
              url: requestUrl + '/front-system/store/resource/' + currentId + '/detail',
              method: 'get'
            }).then(function (response) {
              self.addData = self.addData.concat(response.data.body.list)
              console.log(self.addData)
            }, function (err) {
              console.log(err)
            })
          })
          this.isAdd = this.isAddFlag
        } else {
          this.isAdd = false
          this.addData = []
        }
      },
//      下面表格数据添加全部商品添加
      changeAllOperate: function (checkAll) {
        this.isAddFlag = checkAll
        var goodslist = this.addData
        $.each(goodslist, function (index, val) {
          if (checkAll) {
            val.checked = true
          } else {
            val.checked = false
          }
        })
      },
//     下面表格数据单选选择商品
      changeOperate: function (currentId, currentObjCheck) {
        var goodslist = this.addData
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
      confirmClick: function () {
        this.instroduceDataModal = false
        this.$dispatch('confirmAdd')
      }
    },
    data: function () {
      return {
        isAdd: false,
        isAddFlag: false,
        page: [],
        citeDataTitle: {
          code: '配送出库单号',
          store_name: '调出仓库',
          number: '配送数量',
          date: '配送日期',
          create_person: '制单人',
          check_person: '审核人'
        },
        citeData: [
          {
            'id': 1,
            'checked': false,
            'store_name': '模拟接口测试门店A',
            'code': 'YHZYADH2016050110225801',
            'number': 20,
            'date': '2016-06-20 12:00:00',
            'create_person': '张三',
            'check_person': '李四'
          },
          {
            'id': 2,
            'checked': false,
            'store_name': '模拟接口测试门店B',
            'code': 'YHZYADH2016050110225801',
            'number': 30,
            'date': '2016-06-20 12:00:00',
            'create_person': '张三',
            'check_person': '李四'
          }
        ],
        thisDataTitle: {
          goods_code: '货号',
          goods_name: '品名',
          demanding_number: '要货数量',
          distribution_number: '配送数量',
          unit: '单位',
          unit_specification: '单位规格'
        },
        thisData: [
          {
            'id': 1,
            'store_distribution_id': 1,
            'checked': false,
            'goods_code': 'xyz201606271458011',
            'demanding_number': '50',
            'distribution_number': '70',
            'goods_name': '伊利牛奶',
            'unit': '箱',
            'unit_specification': '1箱*20盒*250ml',
            'created_at': '2016-06-20 12:00:00'
          },
          {
            'id': 2,
            'checked': false,
            'store_distribution_id': 1,
            'goods_code': 'xyz201606271458001',
            'demanding_number': '50',
            'distribution_number': '70',
            'goods_name': '牛角包',
            'unit': '个',
            'unit_specification': '1个',
            'created_at': '2016-06-20 12:00:00'
          },
          {
            'id': 3,
            'checked': false,
            'store_distribution_id': 1,
            'goods_code': 'xyz201606271458001',
            'demanding_number': '50',
            'distribution_number': '80',
            'goods_name': '露西咖啡豆',
            'unit': '包',
            'unit_specification': '1包*2500g',
            'created_at': '2016-06-20 12:00:00'
          }
        ],
        thisData1: [
          {
            'id': 1,
            'store_distribution_id': 1,
            'checked': false,
            'goods_code': 'xyz201606271458011',
            'demanding_number': '50',
            'distribution_number': '70',
            'goods_name': '哇哈哈',
            'unit': '箱',
            'unit_specification': '1箱*20盒*250ml',
            'created_at': '2016-06-20 12:00:00'
          },
          {
            'id': 2,
            'checked': false,
            'store_distribution_id': 1,
            'goods_code': 'xyz201606271458001',
            'demanding_number': '50',
            'distribution_number': '70',
            'goods_name': '牛角包1',
            'unit': '个',
            'unit_specification': '1个',
            'created_at': '2016-06-20 12:00:00'
          },
          {
            'id': 3,
            'checked': false,
            'store_distribution_id': 1,
            'goods_code': 'xyz201606271458001',
            'demanding_number': '50',
            'distribution_number': '80',
            'goods_name': '露西咖啡豆11',
            'unit': '包',
            'unit_specification': '1包*2500g',
            'created_at': '2016-06-20 12:00:00'
          }
        ]
      }
    }
  }
</script>
