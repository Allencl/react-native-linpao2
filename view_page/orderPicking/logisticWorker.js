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

    this.initFunc();

  }


  componentWillUnmount(){

  }


  /**
   * 初始化
   * @param {*} value 
   */
  initFunc=()=>{
    const {row={}}=this.props.route.params.routeParams;

    console.log(row)
    this.setState({
      code:row.partNo,  
      name:row.partName,   
      planNum:String(row.taskPickingNumber),  
      orderNum:String(row.taskPickingNumber),  
      storage:row.locPName,  
      // realStorage:"", 
      realStorage:row.locPName,  

    })
  }


  /**
   * 下一条
  */
  nextArticleHandle=()=>{
    const that=this;
    const {navigation} = this.props;


    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)

        // if(!value["odd"]){
        //   Toast.fail('收货单号不能为空！');
        //   return
        // }
      } else{

        console.log(value.realStorage)

        // 不合格原因不能为空
        if(!value.realStorage){
          Toast.fail('实际拣货库位不能为空！',1);
          return
        }

        if( value.storage != value.realStorage){
          that.setState({visible:true})
          return
        }
        


        // let _json=Object.assign(row,{
        //     acceptsQty:_acceptsQty,
        //     concessionQty:_concessionQty,
        //     concessionReason:value.concessionText,
        //     unacceptsQty:_unacceptsQty,
        //     unacceptsReason:value.disqualificationText
        // })


        // WISHttpUtils.post("wms/iqcTask/saveIqcTask",{
        //   params:_json
        //   // hideLoading:true
        // },(result) => {
        //   let {code}=result;

        //   if(code==200){
        //     Toast.success("检验完成！",1);

        //     navigation.navigate("quality");
        //     DeviceEventEmitter.emit('globalEmitter_update_quality_table');
        //   }

        // });  

      }
    });
  }  


  /**
   * 下架完成
   * @returns 
  */
   accomplishFunc=()=>{
    const {navigation,form} = this.props;
    const {row={}}=this.props.route.params.routeParams;


    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)

        if(!value["realStorage"]){
          Toast.fail('实际拣货库位不能为空！',1);
          return
        }
      } else{
        let _realStorage=value["realStorage"].trim();

        if(value.storage != _realStorage){
          Toast.fail('实际拣货库位必须与推荐库位一致！',1);
          return
        }

        let _json=Object.assign(row,{
            confirmLoc:_realStorage,
        })


        WISHttpUtils.post("wms/pickingTask/updataPKOffTheShelf",{
          params:_json
          // hideLoading:true
        },(result) => {
          let {code}=result;

          if(code==200){
            Toast.success("下架完成！",1);

            navigation.navigate("orderPicking");
            DeviceEventEmitter.emit('globalEmitter_orderPicking_change_tabsPage',2);
          }

        });  




      }
    });




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
    }=this.state;
    let {visible,visible3}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
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


        <View style={{marginTop:22}}>


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
              name="orderNum"               
              {...getFieldProps('orderNum',{
                  rules:[{required:false}],
                  initialValue:orderNum
              })} 
              error={getFieldError('orderNum')}               
              lableName="拣货数量"
              disabled
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
              lableName="实际拣货库位"
                
            />


        </View>


        <View style={{marginTop:32,marginBottom:50}}>

          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=> this.nextArticleHandle() }>下一条</Button>          
            </Flex.Item>
            <Flex.Item style={{paddingLeft:6}}>
              <Button type="ghost" onPress={()=>{ this.accomplishFunc() }}>下架完成</Button>          
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

