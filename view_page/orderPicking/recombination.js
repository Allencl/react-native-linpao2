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


// 移复核区 校验
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
        visible:false,

        reservoir:"",  // 库区
        storage:"",   // 库位
        recombinationStorage:"",   // 复核区 库位库位
        
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
    // const {}=this.props.route.params.routeParams;

    // console.log(row)
    this.setState({
        reservoir:"",  // 库区
        storage:"",   // 库位
        recombinationStorage:"",   // 复核区 库位库位
    })
  }




  /**
   * 确定
   * @returns 
  */
   accomplishFunc=()=>{
    const {navigation,form} = this.props;


    this.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          // Toast.fail('必填字段未填！');
          // console.log(error)
  

          if(!value["recombinationStorage"]){
            Toast.fail('复核区库位库位不能为空！',1);
            return
          }
  
  
        } else{
        //   let _realStorage=value["realStorage"].trim();
  
        //   if(value.storage != _realStorage){
        //     Toast.fail('实际拣货库位必须与推荐库位一致！',1);
        //     return
        //   }
  
          let _json=Object.assign({

          })
  
          // console.log(bufferRow)
          // console.log(_json)
          // return
        //   WISHttpUtils.post("wms/pickingTask/newPickingOffTheShelf",{
        //     params:_json
        //     // hideLoading:true
        //   },(result) => {
        //     let {code}=result;
  
        //     if(code==200){
        //       Toast.success("下架完成！",1);
  
        //       navigation.navigate("orderPicking");
        //       DeviceEventEmitter.emit('globalEmitter_orderPicking_change_tabsPage',2);
        //     }
  
        //   });  
  
  
  
  
        }
      });



   }



  render() {
    let that=this;
    const {
        reservoir,  
        storage,   
        recombinationStorage,   
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
              name="reservoir"               
              {...getFieldProps('reservoir',{
                  rules:[{required:false}],
                  initialValue:reservoir
              })} 
              error={getFieldError('reservoir')}               
              lableName="推荐库区"
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
              name="recombinationStorage"   
              requiredSign={true}            
              {...getFieldProps('recombinationStorage',{
                  rules:[{required:true}],
                  initialValue:recombinationStorage
              })} 
              error={getFieldError('recombinationStorage')}   
              placeholder="请扫描或输入 复核区库位"            
              lableName="复核区库位"
              
            />




        </View>


        <View style={{marginTop:32,marginBottom:50}}>

          <Flex>
            <Flex.Item style={{paddingLeft:6}}>
              <Button type="ghost" onPress={()=>{ this.accomplishFunc() }}>小车拣配完成</Button>          
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

