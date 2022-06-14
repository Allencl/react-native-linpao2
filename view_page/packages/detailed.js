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
import {WisFormPhoto,WisSelectFlex} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址


// 移库
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      warehouseName:"",   // 仓库名

      warehouse:[],    // 仓库
      reservoir:[],    // 库区
      storage:[],     // 库位



      warehouseList:[],  // 仓库数据
      reservoirList:[],  // 库区列表  
      storageList:[],    // 库位列表
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;


    this.getWarehouseFunc();  // 获取仓库
    this.reservoirFunc();     // 获取 库区
    this.storageFunc();        // 获取库位


  }


  componentWillUnmount(){

  }


  /**
   * 获取 仓库
  */
  getWarehouseFunc=()=>{
    const that=this;
    const {data=[]}=this.props.route.params.routeParams;


    WISHttpUtils.get('wms/storage/list',{
      params:{

      }
    },(result)=>{
      const {rows=[]}=result;

      let _warehouse=rows.filter(o=> data[0]["sStorageId"]==o.tmBasStorageId)[0];


      this.props.form.setFieldsValue({
        "warehouse":[{_name:_warehouse.storageName,id:_warehouse.tmBasStorageId}],
      });

      that.setState({
        // warehouseName:_warehouse?.storageName,   
        warehouseList:rows.map(o=>Object.assign({_name:o.storageName,id:o.tmBasStorageId}))
      })

      // console.log(data)
      // console.log(result)
    })

  }

  /**
   * 获取 库区
  */
  reservoirFunc=()=>{
    const that=this;
    const {data=[]}=this.props.route.params.routeParams;

    WISHttpUtils.get('wms/dloc/list',{
      params:{
        storageId:data[0]?.sStorageId,
        dlocType:'4'
      }
    },(result)=>{
      const {rows=[]}=result;

      that.setState({
        reservoirList:rows.map(o=>Object.assign({_name:o.dlocName,id:o.tmBasDlocId}))
      })

      // console.log(result)
    })    
  }
  

  /**
   * 获取 库位
  */
  storageFunc=(params)=>{
      const that=this;

      WISHttpUtils.get('wms/loc/list',{
        params:{
          ...params
        }
      },(result)=>{
        const {rows=[]}=result;

        that.setState({
          storageList:rows.map(o=>Object.assign({_name:o.locName,id:o.tmBasLocId}))
        })

        // console.log(result)
      })    
  }
  


  /**
   * 仓库切换
   * @param {*} value 
   */
  warehouseChange=(data=[])=>{

    let _json={
      storageId:data[0].id 
    }

    // this.reservoirFunc(_json);

    this.props.form.setFieldsValue({
      "reservoir":[],
      "storage":[]
    });
  }


  /**
   * 库区切换
   * @param {*} value 
  */
   reservoirChange=(data=[])=>{

    let _json={
      dlocId:data[0].id 
    }

    this.storageFunc(_json);

    this.props.form.setFieldsValue({
      "storage":[]
    });
   }


  /**
    * 库区 清空
  */
  cleanReservoirChange=()=>{
    this.props.form.setFieldsValue({
      "storage":[]
    });
    this.storageFunc()
  }


  /**
   * 提交
   */
  passHandle=(value)=>{
    const that=this;
    const {navigation} = this.props;
    const {data=[]}=this.props.route.params.routeParams;



    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)

        if(!value["warehouse"]["length"]){
          Toast.fail('包装仓库未选择！',1);
          return
        }

        if(!value["reservoir"]["length"]){
          Toast.fail('包装库区未选择！',1);
          return
        }

        if(!value["storage"]["length"]){
          Toast.fail('包装库位未选择！',1);
          return
        }


      } else{

        let _jsonList=data.map(o=>Object.assign({
          // moveStorageQty:o.taskQty,
          // dStorageId:value.warehouse[0]['id'],
          // dBasDlocId:value.reservoir[0]['id'],
          // dBasLocId:value.storage[0]['id']

          ttPackageTaskId:o.ttPackageTaskId,
          taskQty:o.taskQty,
          ddStorageId:o.dStorageId,
          ddBasDlocId:o.dBasDlocId,
          ddBasLocId:o.dBasLocId,
          aaStorageId:value.warehouse[0]['id'],
          aaBasDlocId:value.reservoir[0]['id'],
          aaBasLocId:value.storage[0]['id'],
          version:o.version
        }));


        // console.log(_jsonList)
        // return
        WISHttpUtils.post("wms/packageTask/moveStorage",{
          params:_jsonList
          // hideLoading:true
        },(result) => {
          let {code}=result;


          if(code==200){
            Toast.success('移库成功！',1);
            navigation.navigate('packages'); 
            DeviceEventEmitter.emit('globalEmitter_updata_packagesList');
          }

        });  

      }
  });
  }  






  render() {
    let that=this;
    let{}=this.state;
    const {warehouse,reservoir,storage,warehouseName}=this.state;
    const {warehouseList=[],reservoirList=[],storageList=[]}=this.state;

    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>



          <WisSelectFlex 
            form={form} 
            name="warehouse"
            requiredSign={true}
            {...getFieldProps('warehouse',{
              rules:[{required:true }],
              initialValue:[]
            })} 
            error={getFieldError('warehouse')}  
            title="包装仓库（单选）"             
            lableName="包装仓库"
            textFormat={o=>o._name}
            labelFormat={o=>o._name}
            onChangeValue={(_list)=>{
              that.warehouseChange(_list);
            }}
            data={warehouseList}
            disabled
          />

          <WisSelectFlex 
            form={form} 
            name="reservoir"
            requiredSign={true}
            {...getFieldProps('reservoir',{
              rules:[{required:true }],
              initialValue:[]
            })} 
            error={getFieldError('reservoir')}  
            title="包装库区（单选）"             
            lableName="包装库区"
            textFormat={o=>o._name}
            labelFormat={o=>o._name}
            onChangeValue={(_list)=>{
              that.reservoirChange(_list);
            }}
            onCleanValue={()=>{
              this.cleanReservoirChange()
            }}
            data={reservoirList}
          />

          <WisSelectFlex 
            form={form} 
            name="storage"
            requiredSign={true}
            {...getFieldProps('storage',{
              rules:[{required:true }],
              initialValue:[]
            })} 
            error={getFieldError('storage')}  
            title="包装库位（单选）"             
            lableName="包装库位"
            textFormat={o=>o._name}
            labelFormat={o=>o._name}
            onChangeValue={(_list)=>{
              // that.productionChange(_list);
            }}
            data={storageList}
          />


        <View style={{marginTop:22}}>


        </View>


        <View style={{marginTop:32,marginBottom:50}}>
          <Button type="ghost" onPress={this.passHandle}>确 定</Button>          
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

