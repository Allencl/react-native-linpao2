import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Icon,Flex,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
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



    this.update=DeviceEventEmitter.addListener('globalEmitter_update_take_index',function(key=""){
      that.setState({odd:""})
    });


    // 监听扫码枪
    this.honeyWell=DeviceEventEmitter.addListener('globalEmitter_honeyWell',function(key=""){



    });

  }


  componentWillUnmount(){
    this.honeyWell.remove();
    this.update.remove();
  }


  /**
   * 提交
   */
  passHandle=()=>{
    const that=this;
    const {odd}=this.state;
    const {navigation} = this.props;

    let _odd=odd.trim();

    if(!_odd){
      Toast.fail('收货单号不能为空！',1);
      return
    }

    WISHttpUtils.get(`wms/poOrderPart/getOrderDetails/${_odd}`,{
      params:{}
    },(result)=>{
      const {code,msg,data={}}=result;

      // console.log(result)
      if(!data.poOrderPartList){
        msg && Toast.info(`${msg}！`,1);
        return
      }

      // if(!poOrderPartList.length){
      //   // 
      //   // this.setState({
      //   //   basicData:{},
      //   //   waitReceivingList:[],
      //   //   completeList:[]
      //   // })
      // }      

      navigation.navigate('takeDetailed',{
        odd:_odd,
        data:data
      });    
    });



    // this.props.form.validateFields((error, value) => {
    //   // 表单 不完整
    //   if(error){
    //     // Toast.fail('必填字段未填！');
    //     // console.log(error)


    //     if(!value["odd"]){
    //       Toast.fail('收货单号不能为空！',1);
    //       return
    //     }



    //   } else{
    //     let _odd=value["odd"].trim();


    //     WISHttpUtils.get(`wms/poOrderPart/getOrderDetails/${_odd}`,{
    //       params:{
    
    //       }
    //     },(result)=>{
    //       const {code,msg,data={}}=result;

          
    //       navigation.navigate('takeDetailed',{
    //         odd:odd,
    //         data:data
    //       });    

    //     })




    //   }
    // });
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
       
        {/* <View style={{marginTop:22}}>


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


        </View> */}
        <Flex style={{marginTop:12}}>
          <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
            <TextInput
              style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderBottomWidth:1}}
              value={odd}
              placeholder={"请扫描或输入 收货单号"}
              onChangeText={text => this.setState({odd:text}) }
            /> 
          </Flex.Item>

          <Flex.Item style={{flex:1,paddingLeft:12,paddingRight:0}}>
            <TouchableOpacity onPress={() =>{ 
              this.setState({odd:""});
              }}>
              <Icon style={{fontSize:22}} name="delete" />
            </TouchableOpacity>
          </Flex.Item>
        </Flex>






        <View style={{marginTop:32,marginBottom:50}}>
          <Button type="ghost" onPress={()=> this.passHandle() }>确 定</Button>          
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

