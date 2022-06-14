import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisInputSN,WisBluetooth} from '@wis_component/ul';
import {WisFormPhoto} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址


// ASN 收货单
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      // odd:"ASN0602074",   // 单号
      odd:"",   // 单号

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

      // 判断设备
      // if( !(/^\d{2}\.\d{2}\.\d{2}\.\d{2}$/.test(key)) ){
      //   Toast.fail('错误设备编号！');
      //   return
      // }
      

      // let _key=key;
      // if(key&&key.length>11){
      //   _key =(key.split("-")[0]).slice(3);
      // }

      // console.log(_key)
      that.props.form.setFieldsValue({
        odd:key,
      });

    });

  }


  componentWillUnmount(){
    this.honeyWell.remove();
  }


  /**
   * 提交
   */
  passHandle=(value)=>{
    const that=this;
    const {odd}=this.state;
    const {navigation} = this.props;


    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)


        if(!value["odd"]){
          Toast.fail('收货单号不能为空！',1);
          return
        }



      } else{
        let _odd=value["odd"].trim();


        WISHttpUtils.get(`wms/poOrderPart/getOrderDetails/${_odd}`,{
          params:{
    
          }
        },(result)=>{
          const {code,msg,data={}}=result;

          
          navigation.navigate('takeDetailed',{
            odd:odd,
            data:data
          });    

        })




      }
  });
  }  






  render() {
    let that=this;
    let{odd}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>

        <WisBluetooth 
          onRef={(ref)=>{this.bluetoothRef=ref}}
        />
       
        <View style={{marginTop:22}}>


          <WisInput  
            form={form} 
            name="odd"               
            requiredSign={true}
            {...getFieldProps('odd',{
              rules:[{required:true }],
              initialValue:odd
            })} 
            error={getFieldError('odd')}  
            placeholder="请扫描或输入 收货单号"            
            // lableName="收货单号"
          />  


        </View>


        <View style={{marginTop:32,marginBottom:50}}>
          <Button type="ghost" onPress={this.passHandle}>确 定</Button>          
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

