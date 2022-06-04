import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Flex,Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisInputSN,WisBluetooth} from '@wis_component/ul';
import {WisFormPhoto} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址


import SelectReservoir from './select.js';  // 选择库区 下拉框


// 收货
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
        rowData:{},   // 行数据
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;

    this.initFunc()

  }


  componentWillUnmount(){

  }

  /**
   * 初始化
   * @param {*} value 
   */
  initFunc=()=>{
    const {routeParams}=this.props.route.params;

    // console.log(routeParams)
    this.setState({
      rowData:routeParams
    })
  }

  /**
   * 选择 库位
   * @param {*} value 
   */
   selectReservoirFunc=()=>{
      this.selectReservoirRef.openModle()
   }


   /**
    * 确认库位
    * @param {*} value 
  */
  reservoirConfirm=(option)=>{
    const {rowData}=this.state;

    this.setState({
      rowData:Object.assign(rowData,{
        _tmBasLocId:option.tmBasLocId,
        _reservoirName:`${option.locNo}-${option.locName}`
      })
    })
  }

  /**
   * 收货 
   * @param {*} value 
   */
  takeChangeText=(text)=>{
    const that=this;
    const {rowData}=this.state;

    let _value=Number(text);

    if(_value>rowData.receiveQty){
      Toast.fail('收货数量不能大于可收货数量！',1);
      return
    }
    
    this.setState({
      rowData:Object.assign(rowData,{_takeNumber:_value})
    })
  }


  /**
   * 提交
  */
  passHandle=(value)=>{
    const that=this;
    const {navigation} = this.props;


  }  






  render() {
    let that=this;
    let{rowData}=this.state;
    let {navigation} = this.props;


    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>


            <SelectReservoir 
              data={rowData._quarantineList||[]}
              onRef={(ref)=>{ this.selectReservoirRef=ref }}
              onConfirm={(option)=>{
                that.reservoirConfirm(option)
              }}
            />


            <View style={{paddingTop:15}}>
              <Flex style={styles.flexRow}>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>ASN:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData._basicData?.asnNo}</Text>
                </Flex.Item>
              </Flex>
              <Flex style={styles.flexRow}>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>行号:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData.lineno}</Text>
                </Flex.Item>
              </Flex>
              <Flex style={styles.flexRow}>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>物料:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData.partNo}</Text>
                </Flex.Item>
              </Flex>
              <Flex style={styles.flexRow}>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>名称:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData.partName}</Text>
                </Flex.Item>
              </Flex>
              <Flex style={styles.flexRow}>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>单位:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData._unitName}</Text>
                </Flex.Item>
              </Flex>
              <Flex style={styles.flexRow}>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>计划数量:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData.receiveQty}</Text>
                </Flex.Item>
              </Flex>
              <Flex style={styles.flexRow}>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>已收数量:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData.receivedQty}</Text>
                </Flex.Item>
              </Flex>
              <Flex style={styles.flexRow}>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>收货数量:</Text>
                  <TextInput
                    editable={!false}
                    style={{flex:7,height:38,borderColor:'#d9d9d9',borderRadius:4,borderWidth:1}}
                    value={ (rowData._takeNumber!=undefined)?String(rowData._takeNumber):String(rowData.receiveQty)}
                    keyboardType={"numeric"}
                    onChangeText={text => that.takeChangeText(text)}
                  /> 
                  
                  {/* <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData.receiveQty}</Text> */}
                </Flex.Item>    
              </Flex>
              <Flex style={styles.flexRow}>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>待检库位:</Text>
                  <View style={{flex:7,}}>
                    <TouchableOpacity onPress={() =>{ 
                      that.selectReservoirFunc()
                    }}>
                      <Text style={{fontSize:16,paddingTop:2,paddingBottom:2,paddingLeft:6,borderColor:'#d9d9d9',borderRadius:4,borderWidth:1}} numberOfLines={1}>{rowData._reservoirName}</Text>
                    </TouchableOpacity>
                  </View>
                </Flex.Item>  
              </Flex>
              {/* <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>质检标准:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>无数据</Text>
                </Flex.Item>  
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>包装方案:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>无数据</Text>
                </Flex.Item> 
              </Flex> */}
              <Flex style={styles.flexRow}>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:2,paddingRight:8,marginBottom:8,paddingTop:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>LPN:</Text>
                  <View style={{flex:7,}}>
                    <TextInput
                      style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderWidth:1}}
                      value={rowData._LPN}
                      placeholder={"请输入HU号"}
                      onChangeText={text =>{
                        that.setState({rowData:Object.assign(rowData,{_LPN:text})})
                      }}
                    />  
                  </View>
                </Flex.Item>  
              </Flex>
            </View>
                
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  flexRow:{
    borderBottomWidth:1,
    // borderColor:'red',
    borderColor:'#d9d9d9',
    marginTop:8,
    paddingBottom:2,
    // paddingTop:3
  },
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



export default PageForm;

