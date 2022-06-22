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


// 上架任务 批量上架
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={


      storageForm:[],   //  确认库位
      storageList:[],   //库位

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
    this.getStorageFunc();

  }


  componentWillUnmount(){

  }


  /**
   * 初始化
   * @param {*} value 
   */
  initFunc=()=>{
    const {rows=[]}=this.props.route.params.routeParams;

    console.log(rows)
    this.setState({
      warehouse:rows[0]["dStorageName"],   // 仓库
      reservoir:rows[0]["dDlocName"],     // 库区
      storage:"",   
    })
  }


  /**
   * 获取 库位
  */
   getStorageFunc=()=>{
    const that=this;
    const {rows=[]}=this.props.route.params.routeParams;

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
        storageId:rows[0]["storageId"],
        // aaa:row["dBasDlocId"]
        status:"1",
        dlocType:(rows[0]["taskType"]=="5")?"6":"5"
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
    const {rows=[]}=this.props.route.params.routeParams;



    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)

        if(!value["storageForm"].length){
          Toast.fail('上架库位不能为空！',1);
          return
        }
      } else{


        let _jsonList=rows.map(o=>Object.assign({
          // ttMmTaskId:o.ttMmTaskId,
          // taskQty:o.taskQty,
          // ddStorageId:o.dBasStorageId,
          // ddBasDlocId:o.dBasDlocId,
          // ddBasLocId:o.dBasLocId,

          // aaStorageId:o.dBasStorageId,
          // aaBasDlocId:o.dBasDlocId,

          // aaBasLocId: value["storageForm"][0]["id"], // 库位
          // version:o.version


          ttMmTaskId:o.ttMmTaskId,
          taskQty:o.taskQty,
          ddStorageId:o.dBasStorageId,
          ddBasDlocId:o.dBasDlocId,
          ddBasLocId:o.dBasLocId,   
          aaStorageId:o.dBasStorageId,

          // aaBasDlocId:row.dBasDlocId,
          aaBasDlocId:rows[0]["dBasDlocId"],

          aaBasLocId: value["storageForm"][0]["id"],  // 确认库位   
          version:o.version
        }));


        // console.log( JSON.stringify(_jsonList) )
        // console.log( JSON.stringify(rows) )


        WISHttpUtils.post("wms/mmTask/moveTask",{
          params:_jsonList
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
        warehouse, 
        reservoir,  
        storage,  
        }=this.state;
    let {visible,visible3,storageForm,storageList}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>


        <View style={{marginTop:2}}>


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


            {/* <WisInput  
                form={form} 
                name="storage"       
                requiredSign={true}
                {...getFieldProps('storage',{
                    rules:[{required:true}],
                    initialValue:storage
                })} 
                error={getFieldError('storage')}               
                lableName="上架库位"
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
            title="上架库位（单选）"             
            lableName="上架库位"
            textFormat={o=>o._name}
            labelFormat={o=>o._name}
            onChangeValue={(_list)=>{
              // that.warehouseChange(_list);
            }}
            data={storageList}
            
          />



        </View>


        <View style={{marginTop:12,marginBottom:50}}>

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

