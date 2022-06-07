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


// 上架任务 详情
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={

      taskNo:"3",        // 任务号
      supplier:'3',     // 供应商
      supplierName:'3',   // 供应商名
      part:'3',         // 零件号
      partName:'3',     // 零件名称
      number:'3',      // 上架数量
      boxNum:'3',      // 零件箱号
      storage:'3',    // 推存库位
      storageAffirm:'3',   // 确认库位
 
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
      taskNo:row.taskNo,       
      supplier:'1',    
      supplierName:'1',  
      part:row.partNo,        
      partName:row.partName,     
      number:'1',     
      boxNum:'1',     
      storage:'1',   
      storageAffirm:'1',   
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
      taskNo,       
      supplier,     
      supplierName,   
      part,        
      partName,     
      number,      
      boxNum,     
      storage,   
      storageAffirm,   
        }=this.state;
    let {visible,visible3}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>


        <View style={{marginTop:22}}>


            <WisInput  
                form={form} 
                name="taskNo"               
                {...getFieldProps('taskNo',{
                    rules:[{required:false}],
                    initialValue:taskNo
                })} 
                error={getFieldError('taskNo')}               
                lableName="任务号"
                disabled
            /> 
            
            <WisInput  
                form={form} 
                name="supplier"               
                {...getFieldProps('supplier',{
                    rules:[{required:false}],
                    initialValue:supplier
                })} 
                error={getFieldError('supplier')}               
                lableName="供应商"
                disabled
            />

            <WisInput  
                form={form} 
                name="supplierName"               
                {...getFieldProps('supplierName',{
                    rules:[{required:false}],
                    initialValue:supplierName
                })} 
                error={getFieldError('supplierName')}               
                lableName="供应商名"
                disabled
            />

            <WisInput  
                form={form} 
                name="part"               
                {...getFieldProps('part',{
                    rules:[{required:false}],
                    initialValue:part
                })} 
                error={getFieldError('part')}               
                lableName="零件号"
                disabled
            />

            <WisInput  
                form={form} 
                name="partName"               
                {...getFieldProps('partName',{
                    rules:[{required:false}],
                    initialValue:partName
                })} 
                error={getFieldError('partName')}               
                lableName="零件名称"
                disabled
            />

            <WisInput  
                form={form} 
                name="number"               
                {...getFieldProps('number',{
                    rules:[{required:false}],
                    initialValue:number
                })} 
                error={getFieldError('number')}               
                lableName="上架数量"
                disabled
            />

            <WisInput  
                form={form} 
                name="boxNum"               
                {...getFieldProps('boxNum',{
                    rules:[{required:false}],
                    initialValue:boxNum
                })} 
                error={getFieldError('boxNum')}               
                lableName="零件箱号"
                disabled
            />


            <WisInput  
                form={form} 
                name="storage"     
                type="number"
                {...getFieldProps('storage',{
                    rules:[{required:false}],
                    initialValue:storage
                })} 
                error={getFieldError('storage')}               
                lableName="推荐库位"
            />     


            <WisInput  
                form={form} 
                name="storageAffirm"               
                {...getFieldProps('storageAffirm',{
                    rules:[{required:false}],
                    initialValue:storageAffirm
                })} 
                error={getFieldError('storageAffirm')}               
                lableName="确认库位"
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

