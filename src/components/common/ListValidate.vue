<template>
  <!--审核按钮-->
  <span class="btn btn-sm"   :class="whenClick ? btn-primary : 'btn-danger' " data-toggle="modal" data-target="#inventory-audit-templ" @click="validate($event)">{{whenClick ? check = '审核中' : check= '审核'}}</span>
  <!--审核模态框-->
  <modal :show.sync="validateModal" :modal-size="validateModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true"  @click="validateModal=false">&times;</span></button>
      <h4 class="modal-title">审核</h4>
    </div>
    <div slot="body">
      <h4>是否通过审核</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" data-dismiss="modal" @click="confirmValidate()">是</button>
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="validateModal=false">否</button>
    </div>
  </modal>
</template>
<script>
  import $ from 'jquery'
  import {checkRequest,token} from '../../publicFunction/index'
  import Modal from '../common/Modal'
  var currentId = 0
  export default{
    name: 'list-validate',
    components: {
      Modal: Modal
    },
    props: {
      list: {
        required: true,
      },
      checkUrl: '',
      flag: false,
    },
    data: function () {
      return {
        validateModal: false,
        validateModalSize: 'modal-sm',
        whenClick: false,
      }
    },
    methods: {
//    审核
      validate: function (event) {
        var self = this
        currentId = Number($(event.currentTarget).parents('tr').attr('id'))
        if(self.whenClick){
          return false
        }else{
          self.validateModal = true
        }
      },
//    确定审核
      confirmValidate: function () {
        var self = this
        self.whenClick = true
        self.validateModal = false
        checkRequest(this.checkUrl +currentId+ '/checked' ,function (){
          if(!(self.list instanceof Array)){
            if (self.list.id === currentId) {
              self.list.checked = '已审核'
              self.whenClick = false
              if(window.location.href.indexOf('/admin')>0){
                self.list.auditor = window.localStorage.getItem("systermName")
                self.list.auditor_name=  window.localStorage.getItem("systermName")
              }else{
                self.list.auditor  = window.localStorage.getItem("storeName")
                self.list.auditor_name= window.localStorage.getItem("storeName")
              }
            }
          }else{
            $.each(self.list, function (index, val) {
              if (val.id === currentId) {
                val.checked = '已审核'
                if(window.location.href.indexOf('/admin')>0){
                  val.auditor_name = window.localStorage.getItem("systermName")
                  val.auditor =  window.localStorage.getItem("systermName")
                }else{
                  val.auditor_name = window.localStorage.getItem("storeName")
                  val.auditor = window.localStorage.getItem("storeAccount")
                }
              }
            })
          }
          self.$dispatch("finishEdit")
        },function(err){
          self.whenClick = false
          self.$dispatch("checkFail",err)
        })
      }
    }
  }
</script>
