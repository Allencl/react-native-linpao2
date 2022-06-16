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


// 质检任务 详情
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      visible:false,  
      visible3:false,


      taskNo:"",  // 任务号
      asnNo:"",   // asn 号
      batchNo:"",  // 批次号
      supplier:"",  // 供应商
      supplies:"",   // 零件
      name:"",  // 名称
      inspectNum:"",  // 送检数量

      qualifiedNum:"",  // 合格数
      concessionNum:"",  // 让步数
      concessionText:"",  // 让步说明
      disqualificationNum:"",  // 不合格数
      disqualificationText:"",  // 不合格说明  
      
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

    // console.log(row)
    this.setState({
        taskNo:row.iqcNo,
        asnNo:row.orderNo,
        batchNo:row.lotNo,
        supplier:row.supplName,
        supplies:row.partNo,
        name:row.partName,
        inspectNum:String(row.checkQty),
    
        qualifiedNum:String(row.acceptsQty),
        concessionNum:String(row.concessionQty),
        concessionText:'',
        disqualificationNum:String(row.unacceptsQty),
        disqualificationText:'',
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
    let{taskNo,  
        asnNo,   
        batchNo,  
        supplier, 
        supplies,   
        name,  
        inspectNum,  
        qualifiedNum,  
        concessionNum,  concessionText,disqualificationNum,disqualificationText,  
        }=this.state;
    let {visible,visible3}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>


        <Modal
          title={"错误提示"}
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          footer={[
            {text:'确认',onPress:()=> {} },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <View style={{paddingLeft:12,marginTop:38,marginBottom:22}}>
            <Text style={{fontSize:18}}>送检数量必须等于</Text>
            <Text style={{fontSize:18}}>合格数+让步数+不合格数</Text>
          </View>
        </Modal>



        <Modal
          title={"错误提示"}
          transparent
          onClose={()=>{
            this.setState({visible3:false})
          }}
          maskClosable
          visible={visible3}
          closable
          footer={[
            {text:'确认',onPress:()=> {} },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <View style={{paddingLeft:12,marginTop:38,marginBottom:22}}>
            <Text style={{fontSize:18}}>让步接收时，合格品数量必须为0！</Text>
            <Text style={{fontSize:18}}>有合格品时，不能让步接收！</Text>
          </View>
        </Modal>



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
                name="asnNo"               
                {...getFieldProps('asnNo',{
                    rules:[{required:false}],
                    initialValue:asnNo
                })} 
                error={getFieldError('asnNo')}               
                lableName="ASN号"
                disabled
            />

            <WisInput  
                form={form} 
                name="batchNo"               
                {...getFieldProps('batchNo',{
                    rules:[{required:false}],
                    initialValue:batchNo
                })} 
                error={getFieldError('batchNo')}               
                lableName="批次号"
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
                name="supplies"               
                {...getFieldProps('supplies',{
                    rules:[{required:false}],
                    initialValue:supplies
                })} 
                error={getFieldError('supplies')}               
                lableName="零件"
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
                lableName="名称"
                disabled
            />

            <WisInput  
                form={form} 
                name="inspectNum"               
                {...getFieldProps('inspectNum',{
                    rules:[{required:false}],
                    initialValue:inspectNum
                })} 
                error={getFieldError('inspectNum')}               
                lableName="送检数量"
                disabled
            />


            <WisInput  
                form={form} 
                name="qualifiedNum"     
                type="number"
                {...getFieldProps('qualifiedNum',{
                    rules:[{required:false}],
                    initialValue:qualifiedNum
                })} 
                error={getFieldError('qualifiedNum')}               
                lableName="合格数"
            />     


            <WisInput  
                form={form} 
                name="concessionNum"   
                type="number"
                {...getFieldProps('concessionNum',{
                    rules:[{required:false}],
                    initialValue:concessionNum
                })} 
                error={getFieldError('concessionNum')}               
                lableName="让步数"
            />    

            <WisInput  
                form={form} 
                name="concessionText"               
                {...getFieldProps('concessionText',{
                    rules:[{required:false}],
                    initialValue:concessionText
                })} 
                error={getFieldError('concessionText')}               
                lableName="让步说明"
            /> 

            <WisInput  
                form={form} 
                type="number"
                name="disqualificationNum"               
                {...getFieldProps('disqualificationNum',{
                    rules:[{required:false}],
                    initialValue:disqualificationNum
                })} 
                error={getFieldError('disqualificationNum')}               
                lableName="不合格数"
            />       

            <WisInput  
                form={form} 
                name="disqualificationText"               
                {...getFieldProps('disqualificationText',{
                    rules:[{required:false}],
                    initialValue:disqualificationText
                })} 
                error={getFieldError('disqualificationText')}               
                lableName="不合格原因"
            />  


        </View>


        <View style={{marginTop:32,marginBottom:50}}>

          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=> this.passHandle() }>提 交</Button>          
            </Flex.Item>
            <Flex.Item style={{paddingLeft:6}}>
              <Button type="ghost" onPress={()=>{ navigation.navigate("quality") } }>取 消</Button>          
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

