import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Flex,Modal,Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisInputSN} from '@wis_component/ul';
import {WisFormPhoto} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址



// 配货员 拣货
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      visible:false,

      bufferRow:{},  // 行数据

      freeze:'',   // 冻结数量
      freezeText:"",   // 冻结 原因


      code:"",  // 零件编码
      name:"",   // 零件名称
      planNum:"",  // 计划数量
      orderNum:"",  // 拣货数量
      storage:"",   // 推存库位
      realStorage:"",  // 实际库位      

    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;
    let active=this.props.route.params.routeParams["active"];

    if(active=="startPicking"){
      this.nextArticleHandle();
    }else{
      this.initFunc();
    }
    

  }


  componentWillUnmount(){

  }


  /**
   * 修改 拣货数量
   */
   orderNumChange=(text)=>{
    const {bufferRow}=this.state;

    // console.log(text)
    if(Number(text) >= Number(bufferRow.taskPickingNumber)){
      Toast.fail('拣货数量不能大于计划数量！',1);
      this.props.form.setFieldsValue({
        freeze:"0",
        "orderNum":String(bufferRow.taskPickingNumber)
      });
      return
    }


    this.props.form.setFieldsValue({
      "freeze": String(Number(bufferRow.taskPickingNumber) - Number(text) )
    });



   }

  /**
   * 初始化
   * @param {*} value 
   */
  initFunc=(rowNow)=>{

    let row= rowNow || this.props.route.params.routeParams["row"];


    this.setState({
      bufferRow:row
    });

    // console.log(row)

    this.props.form.setFieldsValue({
      code:row.partNo,  
      name:row.partName,   
      planNum:String(row.taskPickingNumber||0),  
      orderNum:"",  
      storage:row.locPName,  
      realStorage:"", 
      // realStorage:row.locPName,  


      freeze:row.holdQty,   // 冻结数量
      freezeText:row.holdReason,   // 冻结 原因
    })
  }


  /**
   * 下一条
  */
  nextArticleHandle=()=>{
    const that=this;
    const {navigation} = this.props;


    WISHttpUtils.get("wms/pickingTask/appNextTask",{
      params:{}
      // hideLoading:true
    },(result) => {
      let {code,data={}}=result;

      // console.log(result)
      if(code==200){
        Toast.success("获取到新数据！",1);

        this.props.form.setFieldsValue({
          code:'',  
          name:'',  
          planNum:'',
          orderNum:'',
          storage:'',
          realStorage:'',
          freeze:'',   // 冻结数量
          freezeText:'',
        });

        that.initFunc(data)
      }

    });  

  }  


  /**
   * 下架完成
   * @returns 
  */
   accomplishFunc=()=>{
    const that=this;
    const {bufferRow}=this.state;
    const {navigation,form} = this.props;



    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)

        if(!value["orderNum"]){
          Toast.fail('拣货数量不能为空！',1);
          return
        }

        if(!value["realStorage"]){
          Toast.fail('实际库位不能为空！',1);
          return
        }


        

      } else{
        let _realStorage=value["realStorage"].trim();

        if(value.storage != _realStorage){
          Toast.fail('实际库位必须与推荐库位一致！',1);
          return
        }

        let _json=Object.assign({
            "actualPickingNumber": bufferRow.actualPickingNumber,
            "holdQty": Number(value.freeze||0),  // 冻结数量
            "holdReason": value.freezeText||'',
            // "locPName": value.storage,
            "locPName": _realStorage,
            "taskPickingNumber": Number(value.planNum),
            "ttMmWmhPickingId": bufferRow.ttMmWmhPickingId,
            "version": bufferRow.version
        })

        // console.log(bufferRow)
        // console.log(_json)
        // return
        WISHttpUtils.post("wms/pickingTask/newPickingOffTheShelf",{
          params:_json
          // hideLoading:true
        },(result) => {
          let {code}=result;

          if(code==200){
            Toast.success("操作成功！",1);
            that.nextArticleHandle()
          }

        });  




      }
    });




   }

   /**
    * 下架完成
    * @returns 
  */
  accomplishHandle=()=>{
    let {navigation,form} = this.props;

    navigation.navigate("orderPicking");
    DeviceEventEmitter.emit('globalEmitter_orderPicking_change_tabsPage',2);

    setTimeout(()=>{
      DeviceEventEmitter.emit('globalEmitter_updata_orderPicking_recheck');
    },200)
  }


  /**
   * 小测拣配完成
   * @returns 
   */
   cardAccomplish=()=>{
    let {navigation,form} = this.props;

    navigation.navigate("cardPicking");

    DeviceEventEmitter.emit('globalEmitter_update_cardPicking');
   }


  render() {
    let that=this;
    const {
      code,  
      name,   
      planNum,  
      orderNum, 
      storage,  
      realStorage,  


      freeze,
      freezeText,

    }=this.state;
    let {visible,visible3}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {active}=this.props.route.params.routeParams;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>

        <Modal
          title="错误提示！"
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          footer={[
            {text:'确认',onPress:()=> { }},
            {text:'取消',onPress:()=>{ }}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:18,marginBottom:22}}>
              <Text style={{fontSize:18}}>实际拣货库位必须与推存库位一致！</Text>
            </View>
          </ScrollView>
        </Modal>


        <View style={{marginTop:2}}>


            <WisInput  
              form={form} 
              name="code"               
              {...getFieldProps('code',{
                  rules:[{required:false}],
                  initialValue:code
              })} 
              error={getFieldError('code')}               
              lableName="零件编码"
              disabled
            /> 
            
            <WisInput  
              form={form} 
              name="name"               
              {...getFieldProps('name',{
                  rules:[{required:false}],
                  initialValue:name
              })} 
              error={getFieldError('name')}               
              lableName="零件名称"
              disabled
            />

            <WisInput  
              form={form} 
              name="planNum"    
              {...getFieldProps('planNum',{
                  rules:[{required:false}],
                  initialValue:planNum
              })} 
              error={getFieldError('planNum')}               
              lableName="计划数量"
              disabled
            />

            <WisInput  
              form={form} 
              name="freeze"               
              {...getFieldProps('freeze',{
                  rules:[{required:false}],
                  initialValue:freeze
              })} 
              error={getFieldError('freeze')}               
              lableName="冻结数量"
              disabled
            />


            <WisInput  
              form={form} 
              name="freezeText"               
              {...getFieldProps('freezeText',{
                  rules:[{required:false}],
                  initialValue:freezeText
              })} 
              error={getFieldError('freezeText')}               
              lableName="冻结原因"
                
            />

            <WisInput  
              form={form} 
              name="orderNum"      
              type="number"  
              requiredSign={true}           
              {...getFieldProps('orderNum',{
                  rules:[{required:true}],
                  initialValue:orderNum
              })} 
              onChangeValue={(text)=>{
                this.orderNumChange(text)
              }}
              error={getFieldError('orderNum')}               
              lableName="拣货数量"
              
            />

            <WisInput  
              form={form} 
              name="storage"               
              {...getFieldProps('storage',{
                  rules:[{required:false}],
                  initialValue:storage
              })} 
              error={getFieldError('storage')}               
              lableName="推荐库位"
              disabled
            />

            <WisInput  
              form={form} 
              requiredSign={true}
              name="realStorage"               
              {...getFieldProps('realStorage',{
                  rules:[{required:true}],
                  initialValue:realStorage
              })} 
              error={getFieldError('realStorage')}               
              lableName="实际库位"
                
            />


        </View>


        <View style={{marginTop:12,marginBottom:30}}>
          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=> this.accomplishFunc() }>下一条</Button>          
            </Flex.Item>
            <Flex.Item style={{paddingLeft:6}}>
              { (active=="startPicking") ? 
                <Button type="ghost" onPress={()=>{ this.cardAccomplish() }}>小车拣配完成</Button>
                :
                <Button type="ghost" onPress={()=>{ this.accomplishHandle() }}>下架完成</Button>
              }
                        
            </Flex.Item>
          </Flex>
             
        </View>      
                
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  inputBox:{
    fontSize:14,
    height:48,
    borderColor:'#515a6e',
    borderWidth:1,
    borderRadius:3,
    paddingLeft:8,

  },
  headContainer:{
    flexDirection:'row',
    paddingTop:18,
    paddingBottom:2,
    backgroundColor:"white",
    borderBottomWidth:1,
    borderColor:"#e9e9e9", 
  },
  headIcon:{
    paddingLeft:10,
    paddingRight:10
  }
});



export default createForm()(PageForm);

