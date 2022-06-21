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


// 移复检区
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
    // this.reservoirFunc();     // 获取 库区
    // this.storageFunc();        // 获取库位


  }


  componentWillUnmount(){

  }


  /**
   * 获取 仓库
  */
  getWarehouseFunc=()=>{
    const that=this;
    const {list=[]}=this.props.route.params.routeParams;


    WISHttpUtils.get('wms/storage/list?status=1',{
      params:{

      }
    },(result)=>{
      const {rows=[],code}=result;



      if(code==200){
        let _rows=rows.map(o=>Object.assign({_name:`${o.storageNo}-${o.storageName}`,id:o.tmBasStorageId}));
      
        let _warehouse=_rows.filter(o=> list[0]["tmBasStorageDId"]==o.id);
        
        // console.log(_warehouse)
        // console.log(result)
        that.setState({
          warehouseList:_rows
        });
  
        that.props.form.setFieldsValue({
          "warehouse":_warehouse
        });


        that.reservoirFunc();     // 获取 库区
      }




    })

  }

  /**
   * 获取 库区
  */
  reservoirFunc=()=>{
    const that=this;
    const {list=[]}=this.props.route.params.routeParams;


    WISHttpUtils.get('wms/dloc/list',{
      params:{
        storageId:list[0]["tmBasStorageDId"],
        status:'1',
        dlocType:'8'
      }
    },(result)=>{
      const {rows=[],code}=result;


      // console.log(result)
      if(code==200){
        let _row=rows.map(o=>Object.assign({_name:`${o.dlocNo}-${o.dlocName}`,id:o.tmBasDlocId}))

        that.setState({
          reservoirList:_row
        })
  
        that.props.form.setFieldsValue({
          "reservoir":_row
        });        


        that.storageFunc(list[0]["tmBasStorageDId"],_row[0]["id"]);        // 获取库位
      }


    })    
  }
  

  /**
   * 获取 库位
  */
  storageFunc=(_storageId,_dlocId)=>{
      const that=this;
      const {list=[]}=this.props.route.params.routeParams;


      WISHttpUtils.get('wms/loc/list',{
        params:{
          dlocId: _dlocId,
          storageId: _storageId,
          status: '1'
        }
      },(result)=>{
        const {rows=[],code}=result;



        // console.log(list)
        // console.log(rows)

        if(code==200){
          let _row=rows.map(o=>Object.assign({_name:`${o.locNo}-${o.locName}`,id:o.tmBasLocId}))
          let _storage=_row.filter(o=> list[0]["tmBasLocDId"]==o.id);


          that.setState({
            storageList:_row
          });

          that.props.form.setFieldsValue({
            "storage":_storage
          });  
        }


        // console.log(result)
      })    
  }
  


  /**
   * 仓库切换
   * @param {*} value 
   */
  // warehouseChange=(data=[])=>{

  //   let _json={
  //     storageId:data[0].id 
  //   }

  //   // this.reservoirFunc(_json);

  //   this.props.form.setFieldsValue({
  //     "reservoir":[],
  //     "storage":[]
  //   });
  // }


  /**
   * 库区切换
   * @param {*} value 
  */
  //  reservoirChange=(data=[])=>{

  //   let _json={
  //     dlocId:data[0].id 
  //   }

  //   this.storageFunc(_json);

  //   this.props.form.setFieldsValue({
  //     "storage":[]
  //   });
  //  }


  /**
    * 库区 清空
  */
  // cleanReservoirChange=()=>{
  //   this.props.form.setFieldsValue({
  //     "storage":[]
  //   });
  //   this.storageFunc()
  // }


  /**
   * 提交
   */
  passHandle=(value)=>{
    const that=this;
    const {navigation} = this.props;
    const {list=[]}=this.props.route.params.routeParams;


    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)


        if(!value["storage"]["length"]){
          Toast.fail('推荐库位未选择！',1);
          return
        }


      } else{

        let _jsonList=list.map(o=>Object.assign({
          pickDlocAId: o.tmBasDlocDId,
          pickDlocDId: value["reservoir"][0].id,
          pickLocAId: o.tmBasLocDId,
          pickLocDId: value["storage"][0].id,
          pickStorageAId:o.tmBasStorageDId,
          pickStorageDId: o.tmBasStorageDId,
          ttMmWmhPickingId: o.ttMmWmhPickingId,
          version: o.version
        }));


        WISHttpUtils.post("wms/pickingTask/pickToStockDToTask",{
          method:"PUT",
          params:_jsonList
          // hideLoading:true
        },(result) => {
          let {code}=result;


          if(code==200){
            Toast.success('操作成功！',1);
            navigation.navigate('orderPicking'); 
            DeviceEventEmitter.emit('globalEmitter_updata_orderPicking_recheck');
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
            {...getFieldProps('warehouse',{
              rules:[{required:false }],
              initialValue:[]
            })} 
            error={getFieldError('warehouse')}  
            title="仓库（单选）"             
            lableName="仓库"
            textFormat={o=>o._name}
            labelFormat={o=>o._name}
            onChangeValue={(_list)=>{
              // that.warehouseChange(_list);
            }}
            data={warehouseList}
            disabled
          />

          <WisSelectFlex 
            form={form} 
            name="reservoir"
            {...getFieldProps('reservoir',{
              rules:[{required:false }],
              initialValue:[]
            })} 
            error={getFieldError('reservoir')}  
            title="推荐库区（单选）"             
            lableName="推荐库区"
            textFormat={o=>o._name}
            labelFormat={o=>o._name}
            onChangeValue={(_list)=>{
              // that.reservoirChange(_list);
            }}
            onCleanValue={()=>{
              // this.cleanReservoirChange()
            }}
            data={reservoirList}
            disabled={true}
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
            title="推荐库位（单选）"             
            lableName="推荐库位"
            textFormat={o=>o._name}
            labelFormat={o=>o._name}
            onChangeValue={(_list)=>{
              // that.productionChange(_list);
            }}
            onCleanValue={()=>{
              this.props.form.setFieldsValue({
                "storage":[]
              }); 
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

