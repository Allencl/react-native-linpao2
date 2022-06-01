import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import {Card,Flex, Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
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


// ASN 收货单 明细
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      odd:"",   // 单号
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;



  }


  componentWillUnmount(){

  }









  render() {
    let that=this;
    let{odd}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:'#fff'}}>
        
        <View style={{padding:10,borderWidth:1,borderColor:'#e6ebf1',borderRadius:6,backgroundColor:'#fff'}}>
          <View style={{paddingBottom:12}}>
            <Text style={{fontSize:13,fontWeight:'600',color:"#1890ff"}}>基础信息</Text>
          </View>

          <Flex style={{marginBottom:10}}>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>2201061011</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>道口部分收货</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>一般采购订单</Text>
            </Flex.Item>
          </Flex>

          <Flex style={{marginBottom:10}}>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>长沙江凯汽车零部件有限公司</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'right'}}>收货行数：4/10</Text>
            </Flex.Item>
          </Flex>   
        </View>

        <View style={{height:12}}></View>
        <Flex style={{backgroundColor:"#fff"}}>
            <Flex.Item style={{ paddingLeft:2, paddingRight:2 }}>
              <Button size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>逐条收货</Text></Button>
            </Flex.Item>
            <Flex.Item style={{ paddingLeft:2, paddingRight:2 }}>
              <Button size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>批量收货</Text></Button>
            </Flex.Item>
            <Flex.Item style={{ paddingLeft:2, paddingRight:2 }}>
              <Button size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>取消收货</Text></Button>
            </Flex.Item>
            <Flex.Item style={{ paddingLeft:2, paddingRight:2 }}>
              <Button size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>整入整出</Text></Button>
            </Flex.Item>            
        </Flex>
        <View style={{height:12}}></View>


        <View style={{padding:10,borderWidth:1,borderColor:'#e6ebf1',borderRadius:6,backgroundColor:'#fff'}}>
          <View style={{paddingBottom:12}}>
            <Text style={{fontSize:13,fontWeight:'600',color:"#1890ff"}}>已收货</Text>
          </View>

          <Flex style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>010</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>5220820-TB01</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>5/5件</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>S111库位</Text>
            </Flex.Item>
          </Flex>
          <Flex style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>010</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>5220820-TB01</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>5/5件</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>S111库位</Text>
            </Flex.Item>
          </Flex>
          <Flex style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>010</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>5220820-TB01</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>5/5件</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>S111库位</Text>
            </Flex.Item>
          </Flex>
        </View>


      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({

});



export default createForm()(PageForm);

