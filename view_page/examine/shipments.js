import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Flex,Checkbox,Modal,Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisInputSN} from '@wis_component/ul';
import {WisSelectFlex} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址


// 请指定发货区存放库位
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={

        code:"1",  // 待发运库位
        storage:"",  // 实际待发运库位

        check:false,   // 是否自提
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;

  }


  componentWillUnmount(){

  }




  /**
   * 确定
  */
   confirmHandle=()=>{
    const that=this;
    const {navigation} = this.props;


    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)

          
        if(!value["storage"]){
            Toast.fail('实际待发运库位不能为空！',1);
            return
          }

      } else{

  


        console.log(value)

        navigation.navigate("examine");


        // navigation.navigate("cardPicking");

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

        //   }

        // });  

      }
    });
  }  


  /**
   * 取消
   * @returns 
   */
   cancelFunc=()=>{
    let {navigation,form} = this.props;

    navigation.navigate("examine");

   }


  render() {
    let that=this;
    const {
        code,  
        storage,
        check
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
              {...getFieldProps('code',{
                  rules:[{required:false}],
                  initialValue:code
              })} 
              error={getFieldError('code')}               
              lableName="待发运库位"
              disabled
            />   


            <WisInput  
              form={form} 
              name="storage"   
              requiredSign={true}
              {...getFieldProps('storage',{
                  rules:[{required:true}],
                  initialValue:storage
              })} 
              error={getFieldError('storage')}               
              lableName="实际待发运库位"
            />           

            <View style={{marginTop:18}}>
                <Checkbox
                    checked={check}
                    // style={{marginTop:12}}
                    onChange={event => {
                    this.setState({ check: event.target.checked });
                    }}
                >
                    <Text style={{fontSize:16,paddingLeft:6,color:"#000000d9"}}>是否自提</Text>
                </Checkbox>
            </View>
            
        </View>


        <View style={{marginTop:32,marginBottom:50}}>
          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=>{ this.confirmHandle() }}>确认移动</Button>          
            </Flex.Item>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=>{ this.cancelFunc() }}>取消</Button>          
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

