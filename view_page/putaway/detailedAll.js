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
    const {row={}}=this.props.route.params.routeParams;

    console.log(row)
    this.setState({
      warehouse:"1", 
      reservoir:"1",   
      storage:"1",   
 
    })
  }


  /**
   * 提交
   */
  passHandle=()=>{
    const that=this;
    const {navigation} = this.props;
    const {row={}}=this.props.route.params.routeParams;



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

        let _checkQty=Number(value.inspectNum);   // 送检数量

        let _acceptsQty=Number((value.qualifiedNum).trim());   // 合格数
        let _concessionQty=Number((value.concessionNum).trim());   // 让步数
        let _unacceptsQty=Number((value.disqualificationNum).trim());  // 不合格数



        // 让步接收时，合格品数量必须为 0
        if(_acceptsQty && _concessionQty){
          that.setState({visible3:true})
          return
        }


        // 让步说明不能为空
        if(_concessionQty && !((value.concessionText).trim())){
          Toast.fail('让步说明不能为空！',1);
          return
        }

        // 不合格原因不能为空
        if(_unacceptsQty && !((value.disqualificationText).trim())){
          Toast.fail('不合格原因不能为空！',1);
          return
        }


        // 送检数量必须 = 合格数+让步数+不合格数
        if(_checkQty != (_acceptsQty+_concessionQty+_unacceptsQty)){
          that.setState({visible:true})
          return
        }


        let _json=Object.assign(row,{
            acceptsQty:_acceptsQty,
            concessionQty:_concessionQty,
            concessionReason:value.concessionText,
            unacceptsQty:_unacceptsQty,
            unacceptsReason:value.disqualificationText
        })


        WISHttpUtils.post("wms/iqcTask/saveIqcTask",{
          params:_json
          // hideLoading:true
        },(result) => {
          let {code}=result;

          if(code==200){
            Toast.success("检验完成！",1);

            navigation.navigate("quality");
            DeviceEventEmitter.emit('globalEmitter_update_quality_table');
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
                lableName="上架库区"
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

