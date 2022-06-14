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


// 上架任务 批量上架
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={

      warehouse:"1",   // 仓库
      reservoir:"1",   // 库区
      storage:"1",     // 库位
 
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
    const {rows=[]}=this.props.route.params.routeParams;

    this.setState({
      warehouse:rows[0]["dBasStorageId"], 
      reservoir:rows[0]["dBasDlocId"],  
      storage:"",   
    })
  }


  /**
   * 提交
   */
   passHandle=()=>{
    const that=this;
    const {navigation} = this.props;
    const {rows=[]}=this.props.route.params.routeParams;



    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)

        if(!value["storage"]){
          Toast.fail('上架库位不能为空！');
          return
        }
      } else{


        let _jsonList=rows.map(o=>Object.assign({
          ttMmTaskId:o.ttMmTaskId,
          taskQty:o.taskQty,
          ddStorageId:o.dBasStorageId,
          ddBasDlocId:o.dBasDlocId,
          ddBasLocId:o.dBasLocId,
          aaStorageId:o.dBasStorageId,
          aaBasDlocId:o.dBasDlocId,
          aaBasLocId: value["storage"].trim(),
          version:o.version
        }));


        WISHttpUtils.post("wms/mmTask/moveTask",{
          params:_jsonList
          // hideLoading:true
        },(result) => {
          let {code}=result;

          if(code==200){
            Toast.success("批量上架完成！",1);

            navigation.navigate("putaway");
            DeviceEventEmitter.emit('globalEmitter_update_putaway_table');
          }

        });  

      }
    });
  }  







  render() {
    let that=this;
    let{
        warehouse, 
        reservoir,  
        storage,  
        }=this.state;
    let {visible,visible3}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>


        <View style={{marginTop:22}}>


            <WisInput  
                form={form} 
                name="warehouse"               
                {...getFieldProps('warehouse',{
                    rules:[{required:false}],
                    initialValue:warehouse
                })} 
                error={getFieldError('warehouse')}               
                lableName="上架仓库"
                disabled
            /> 
            
            <WisInput  
                form={form} 
                name="reservoir"               
                {...getFieldProps('reservoir',{
                    rules:[{required:false}],
                    initialValue:reservoir
                })} 
                error={getFieldError('reservoir')}   
                placeholder="请输入或扫描"
                lableName="上架库区"
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
                lableName="上架库位"
            /> 


        </View>


        <View style={{marginTop:32,marginBottom:50}}>

          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=> this.passHandle() }>提 交</Button>          
            </Flex.Item>
            <Flex.Item style={{paddingLeft:6}}>
              <Button type="ghost" onPress={()=>{ navigation.navigate("putaway") } }>取 消</Button>          
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

