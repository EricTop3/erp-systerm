<template>
  <modal :show.sync='instroduceDataModal' :modal-size="instroduceDataModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true" @click="instroduceDataModal= false">&times;</span></button>
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
        <!--表格-->
        <grid :check="true" :data="firstData" :columns="firstDataTitle" v-on:change-operate="change"
              v-on:change-all-operate="changeAll" :check-all.sync="citeCheckAll"></grid>
      </div>

      <div style="height:200px; overflow: auto; margin-top: 20px;">
        <!--表格-->
        <grid :check="true" :data="secondData" :columns="secondDataTitle" :is-add-flag.sync="isAdd" :check-all.sync="secondDataCheckAll"
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
  import { requestUrl,token,getDataFromApi} from '../../publicFunction/index'
  import _ from 'underscore'
  export default{
    name: 'introduce-data',
    components: {
      Modal: Modal,
      Grid: Grid
    },
    ready: function () {
      var self = this
      var url = this.url
      getDataFromApi(url,{},function(response){
        self.firstData = response.data.body.list
      })
    },
    props: {
      instroduceDataModal: false,
      instroduceDataModalSize: 'modal-sm',
      secondData: [],
      firstDataTitle: {
        code: '配送出库单号',
        store_name: '调出仓库',
        number: '配送数量',
        date: '配送日期',
        create_person: '制单人',
        check_person: '审核人'
      },
      firstData: [],
      secondDataTitle: {
        goods_code: '货号',
        goods_name: '品名',
        demanding_number: '要货数量',
        distribution_number: '配送数量',
        unit: '单位',
        unit_specification: '单位规格'
      },
      secondData: [],
      url: '',
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
        var self = this
        var fetchedData = []
//    根据当前id获取产品
        getDataFromApi(this.url + "/" + currentId,{},function(response){
          $.each(response.data.body.list,function(index,val){
            if(val.store_distribution_id ===currentId){
              val.store_distribution_id  ===  '123456'
            }
          })
          self.secondData = response.data.body.list
          console.log(self.secondData)
          console.log()
          fetchedData = self.secondData
          var firtElem = fetchedData[0]
          var lastElem = fetchedData[fetchedData.length - 1]
          var start = 0
          var end = 0
          if (currentObjCheck) {
            self.secondData = self.secondData.concat(fetchedData)
          } else {
            $.each(self.secondData, function (index, val) {
              if (_.isEqual(val, firtElem)) {
                start = index
              }
              if (_.isEqual(val, lastElem)) {
                end = index
              }
            })
            self.secondData.splice(start, end - start + 1)
          }
        })
      },
//      全选上面表格加载下面数据
      changeAll: function (checkAll) {
        var self = this
        if (checkAll) {
          $.each(this.firstData, function (index, val) {
            var currentId = val.id
            getDataFromApi(self.url+'/'+currentId,{},function(response){
              self.secondData = self.secondData.concat(response.data.body.list)
            })
          })
          this.isAdd = this.isAddFlag
        } else {
          this.isAdd = false
          this.secondData = []
        }
      },
//      下面表格数据添加全部商品添加
      changeAllOperate: function (checkAll) {
        this.isAddFlag = checkAll
        var goodslist = this.secondData
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
        var goodslist = this.secondData
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
        citeCheckAll: false,
        secondDataCheckAll: false,
      }
    }
  }
</script>
