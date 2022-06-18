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


// 输入物流编号
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={

      code:"",  // 物流单号
     

    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;


    // 监听扫码枪
    this.honeyWell=DeviceEventEmitter.addListener('globalEmitter_honeyWell',function(key=""){

      // console.log(_key)
      that.props.form.setFieldsValue({
        code:_key,
      });

    });

  }


  componentWillUnmount(){
    this.honeyWell.remove();
  }


  /**
   * 初始化
   * @param {*} value 
   */
  initFunc=()=>{
    // const {}=this.props.route.params.routeParams;

    // console.log(row)
    // this.setState({
    //   code:"1",  
    //   name:"1",   
    //   planNum:"1",  
    //   orderNum:"1", 
    //   storage:"1",  
    //   realStorage:"1",  
    // })
  }


  /**
   * 确定
  */
   confirmHandle=()=>{
    const that=this;
    const {navigation} = this.props;
    const {list=[]}=this.props.route.params.routeParams;


    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)

        if(!value["code"]){
          Toast.fail('物流单号不能为空！',1);
          return
        }
      } else{

        let _json=list.map(o=>Object.assign({
          "boxNo": o.boxNo,
          // "carInfo": "string",
          // "driverInfo": "string",
          "pickOrderNo": o.pickOrderNo,
          "transfOrder": value["code"].trim(),
          "ttMmBoxingInfoId": o.ttMmBoxingInfoId,
          "ttMmPickOrderId": o.ttMmPickOrderId,
          "version": o.version
        }));

        WISHttpUtils.post("wms/boxingInfo/logisticsInfoInput",{
          params:_json
          // hideLoading:true
        },(result) => {
          let {code}=result;

          // console.log(result)
          if(code==200){
            Toast.success("操作成功！",2);
            navigation.navigate("examine");
            DeviceEventEmitter.emit('globalEmitter_examine_update_table');
          }

        });  

      }
    });
  }  





  render() {
    let that=this;
    const {
      code,  
    }=this.state;
    let {visible,visible3}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>


        <View style={{marginTop:22}}>

            <WisInput  
              form={form} 
              name="code"   
              requiredSign={true}
              {...getFieldProps('code',{
                  rules:[{required:true}],
                  initialValue:code
              })} 
              // placeholder="扫描或录入编码"
              error={getFieldError('code')}               
              lableName="物流单号"
              
            /> 
            
        </View>


        <View style={{marginTop:32,marginBottom:50}}>
          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=>{ this.confirmHandle() }}>确定</Button>          
            </Flex.Item>
            <Flex.Item style={{paddingLeft:6}}>
              <Button type="ghost" onPress={()=>{ 
                navigation.navigate("examine");
               }}>取消</Button>          
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

