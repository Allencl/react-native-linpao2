import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Modal,Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
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


// ASN 收货单
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
        visible:false,  


      taskNo:"",  // 任务号
      asnNo:"",   // asn 号
      batchNo:"",  // 批次号
      supplier:"",  // 供应商
      supplies:"",   // 物料
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
        supplier:"",
        supplies:"",
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
  passHandle=(value)=>{
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

        let _acceptsQty=Number((value.qualifiedNum).trim());
        let _concessionQty=Number((value.concessionNum).trim());
        let _unacceptsQty=Number((value.disqualificationNum).trim());



        if(value.inspectNum!=(_acceptsQty+_concessionQty+_unacceptsQty)){
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
                let {data=[]}=result;

                console.log('1111111111122222')
                console.log(result)
        
                // console.log(result);
                // that.setState({
                //   cardList: data.map((o,i)=>Object.assign({},o,{name:`${o.trolleyName}[${o.trolleyCode}]`,id:i+1})),
                // });
            });  

        

         console.log(_json)
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
    let {visible}=this.state;
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
            {text:'确认',onPress:()=> that.batchTakeFunc() },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <View style={{paddingLeft:12,marginTop:38,marginBottom:22}}>
            <Text style={{fontSize:18}}>送检数量必须等于</Text>
            <Text style={{fontSize:18}}>合格数+让步数+不合格数</Text>
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
                lableName="物料"
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
          <Button type="ghost" onPress={this.passHandle}>提 交</Button>          
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

