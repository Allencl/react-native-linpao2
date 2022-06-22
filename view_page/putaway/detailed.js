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
import {WisFormPhoto,WisSelectFlex} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址


// 上架任务 详情
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={

      storageForm:[],   //  确认库位
      storageList:[],   //库位

      taskNo:"",        // 任务号
      supplier:'',     // 供应商
      supplierName:'',   // 供应商名
      part:'',         // 零件号
      partName:'',     // 零件名称
      number:'',      // 上架数量
      boxNum:'',      // 零件箱号
      storage:'',    // 推存库位
      // storageAffirm:'',   // 确认库位
 
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


    this.getStorageFunc()

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
      taskNo:row.taskNo||'',       
      supplier:row.supplNo||'',    
      supplierName:row.supplName||'',  
      part:row.partNo||'',        
      partName:row.partName||'',     
      number:String(row.taskQty||''),     
      boxNum:row.lpnId||'',     
      storage:row.dLocName||'',   
      // storageAffirm:'',   
    })
  }



  /**
   * 获取 库位
  */
   getStorageFunc=()=>{
    const that=this;
    const {row={},data=[]}=this.props.route.params.routeParams;

    // console.log(row)
    // console.log(

    //   {
    //     // storageId:"ST1",
    //     // status:"1"
    //     storageId:row["storageId"],
    //     // aaa:row["dBasDlocId"]
    //     status:"1",
    //     dlocType:(row.taskType=="5")?"6":"5"
    //     // dlocType:"6"



    //     // dlocType:"9"
    //   }

    // )

    WISHttpUtils.get('wms/loc/list',{
      params:{
        // storageId:"ST1",
        // status:"1"
        storageId:row["storageId"],
        // aaa:row["dBasDlocId"]
        status:"1",
        dlocType:(row.taskType=="5")?"6":"5"
        // dlocType:"9"
      }
    },(result)=>{
      const {rows=[]}=result;

      // let _storageForm=rows.filter(o=> data[0]["sStorageId"]==o.tmBasStorageId)[0];


      // this.props.form.setFieldsValue({
      //   "storageForm":[{_name:_storageForm.storageName,id:_storageForm.tmBasStorageId}],
      // });

      // console.log()
      let _rows=rows.map(o=>Object.assign({_name:`${o.locNo}-${o.locName}`,id:o.tmBasLocId}))



      that.setState({
        // warehouseName:_warehouse?.storageName,   
        storageList:_rows
      })

      // console.log(data)
      // console.log(result)
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
        // console.log(value)

        if(!value["storageForm"].length){
          Toast.fail('确认库位不能为空！',1);
          return
        }
      } else{


        let _json=Object.assign({
          ttMmTaskId:row.ttMmTaskId,
          taskQty:row.taskQty,
          ddStorageId:row.dBasStorageId,
          ddBasDlocId:row.dBasDlocId,
          ddBasLocId:row.dBasLocId,   
          aaStorageId:row.dBasStorageId,

          // aaBasDlocId:row.dBasDlocId,
          aaBasDlocId:"-1",

          aaBasLocId: value.storageForm[0]["id"],  // 确认库位   
          version:row.version
        })

        // console.log( value.storageForm)
        // console.log( JSON.stringify(_json) )
        // console.log( JSON.stringify(row) )
        // return

        WISHttpUtils.post("wms/mmTask/moveTask",{
          params:[_json]
          // hideLoading:true
        },(result) => {
          let {code}=result;

          if(code==200){
            Toast.success("操作成功！",1);
            
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
      taskNo,       
      supplier,     
      supplierName,   
      part,        
      partName,     
      number,      
      boxNum,     
      storage,   
      storageAffirm,   
      storageForm
        }=this.state;
    let {visible,visible3,storageList}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>


        <View style={{marginTop:2}}>


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
                disabled
            />     


            {/* <WisInput  
                form={form} 
                name="storageAffirm" 
                requiredSign={true}
                {...getFieldProps('storageAffirm',{
                    rules:[{required:true}],
                    initialValue:storageAffirm
                })} 
                placeholder="请输入或扫描 库位"
                error={getFieldError('storageAffirm')}               
                lableName="确认库位"
            />  */}


          <WisSelectFlex 
            form={form} 
            name="storageForm"
            requiredSign={true}
            {...getFieldProps('storageForm',{
              rules:[{required:true }],
              initialValue:[]
            })} 
            error={getFieldError('storageForm')}  
            title="确认库位（单选）"             
            lableName="确认库位"
            textFormat={o=>o._name}
            labelFormat={o=>o._name}
            onChangeValue={(_list)=>{
              // that.warehouseChange(_list);
            }}
            data={storageList}
            
          />



        </View>


        <View style={{marginTop:8,marginBottom:20}}>

          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=> this.passHandle() }>上架</Button>          
            </Flex.Item>
            <Flex.Item style={{paddingLeft:6}}>
              <Button type="ghost" onPress={()=>{ navigation.navigate("putaway") } }>取消</Button>          
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

