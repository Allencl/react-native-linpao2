import React, { Component } from 'react';
import {TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import {Modal,Card,Flex,Checkbox, Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisInputSN,WisBluetooth,WisFlexTable} from '@wis_component/ul';
import {WisFormPhoto} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址
import a from '@ant-design/react-native/lib/modal/alert';


// ASN 收货单 明细
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      visible:false,  


      basicData:{},  // 基础信息
      _company:'',   // 公司
      _orderType:'',  // 订单类型

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
   * @returns 
   */
  initFunc=()=>{
    const that=this;
    const {data}=this.props.route.params.routeParams;

    
    // console.log(23322)
    console.log( data )

    this.setState({
      basicData:data.poOrder
    })

    // 公司
    AsyncStorage.getItem("buffer_company_list").then((option)=>{
      let _data=JSON.parse(option);
      let company= _data.filter(o=>o.tmBasSupplId==data.poOrder.tmBasSupplId)[0];

      that.setState({
        _company:`${company.supplNo}-${company.supplName}`
      })

    })


    // 单据类型
    AsyncStorage.getItem("buffer_order_type").then((option)=>{
      let _typeData=JSON.parse(option);
      let _json=_typeData.filter(o=>o.dictValue==data.poOrder["poType"])[0];

      that.setState({
        _orderType:`${_json.dictValue}-${_json.dictLabel}`
      })
    })
    

  }





  render() {
    let that=this;
    let{visible,basicData,_company,_orderType}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:'#fff'}}>

        <Modal
          title="批量收货"
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          footer={[
            {text:'确认',onPress:()=>console.log('ok')},
            {text:'取消',onPress:()=>console.log('no')}
          ]}
        >
          <View style={{paddingLeft:12,marginTop:38,marginBottom:22}}>
            <Text style={{fontSize:18}}>确认是否进行批量收货操作？</Text>
          </View>
        </Modal>
        
        <View style={{padding:10,borderWidth:1,borderColor:'#e6ebf1',borderRadius:6,backgroundColor:'#fff'}}>
          <View style={{paddingBottom:12}}>
            <Text style={{fontSize:13,fontWeight:'600',color:"#1890ff"}}>基础信息</Text>
          </View>

          <Flex style={{marginBottom:10}}>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>{basicData.asnNo}</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>道口部分收货</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>{_orderType}</Text>
            </Flex.Item>
          </Flex>

          <Flex style={{marginBottom:10}}>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>{_company}</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'right'}}>收货行数：4/10</Text>
            </Flex.Item>
          </Flex>   
        </View>

        <View style={{height:12}}></View>

        <WisFlexTable
          title="待收货列表"
          data={[{},{},{}]}
          renderBody={(row)=>{
            return (
              <Flex style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>

                <Flex.Item style={{paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Checkbox
                    checked={false}
                  >
                  </Checkbox>
                </Flex.Item>
                <Flex.Item style={{paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>010</Text>
                </Flex.Item>
                <Flex.Item style={{paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>5220820-TB01</Text>
                </Flex.Item>
                <Flex.Item style={{paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    value={'1111'}
                  />
                </Flex.Item>                
                <Flex.Item style={{paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'center'}}>5/5件</Text>
                </Flex.Item>
                <Flex.Item style={{paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>S111库位</Text>
                </Flex.Item>
                <Flex.Item style={{paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    value={'1111'}
                  />
                </Flex.Item>   
            </Flex>
            )
          }}
        />


        <View style={{height:12}}></View>
        <Flex style={{backgroundColor:"#fff"}}>
            <Flex.Item style={{ paddingLeft:2, paddingRight:2 }}>
              <Button style={{height:36}} size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>逐条收货</Text></Button>
            </Flex.Item>
            <Flex.Item style={{ paddingLeft:2, paddingRight:2 }}>
              <Button style={{height:36}} onPress={()=>{ this.setState({visible:true}) }} size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>批量收货</Text></Button>
            </Flex.Item>
            {/* <Flex.Item style={{ paddingLeft:2, paddingRight:2 }}>
              <Button size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>取消收货</Text></Button>
            </Flex.Item>
            <Flex.Item style={{ paddingLeft:2, paddingRight:2 }}>
              <Button size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>整入整出</Text></Button>
            </Flex.Item>             */}
        </Flex>
        <View style={{height:12}}></View>


        <WisFlexTable
          title="已收货"
          data={[{},{}]}
          renderBody={(row)=>{
            return (
              <Flex style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
                <Flex.Item style={{paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>010</Text>
                </Flex.Item>
                <Flex.Item style={{paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>5220820-TB01</Text>
                </Flex.Item>
                <Flex.Item style={{paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'center'}}>5/5件</Text>
                </Flex.Item>
                <Flex.Item style={{paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>S111库位</Text>
                </Flex.Item>
            </Flex>
            )
          }}
        />


      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({

});



export default createForm()(PageForm);

