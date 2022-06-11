import React, { Component } from 'react';
import { TouchableOpacity,TextInput,DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text,PermissionsAndroid,NativeModules   } from 'react-native';
import { Flex,Checkbox,Icon,InputItem,WingBlank,Modal, DatePicker, List, Tag, WhiteSpace, Toast,Button,Tabs } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";
import moment from "moment";
import CheckBox from '@react-native-community/checkbox';


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisFlexTable} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 


// 取消 响应
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      visible:false,
      visible2:false,
      visible3:false,


    }

  }

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;



  }

  componentWillUnmount(){

  }


  /**
   * 初始化
   */
   initPage=()=>{

   }


  /**
   * 确定
   * @returns 
  */
  responseFunc=()=>{
    // console.log('确定')

    this.setState({visible:true})
  } 


  /**
   * 确定 
   * @returns 
  */
   responseSubmitFunc=()=>{
    let {navigation,form} = this.props;

    // console.log('确定')

    // this.setState({visible:true})
    navigation.navigate("orderPicking");

  }   


  /**
   * 刷新
   * @returns 
  */
  refreshFunc=()=>{
    // this.tableRef.initFunc();
    console.log("刷新")
  }


  render() {
    let that=this;
    let {visible,visible2,visible3}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');




    return (
      <ScrollView style={{paddingLeft:8,paddingRight:8,paddingTop:16,backgroundColor:'#fff'}}>


        <Modal
          title="确认"
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          footer={[
            {text:'确认',onPress:()=> { this.responseSubmitFunc() }},
            {text:'取消',onPress:()=>{ }}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:18,marginBottom:22}}>
              <Text style={{fontSize:18}}>取消响应？</Text>
            </View>
          </ScrollView>
        </Modal>





        <Flex style={{marginBottom:16}}>
          <Flex.Item style={{flex:8}}>
            <Text>请选择需要取消响应的拣货任务</Text>
          </Flex.Item>
          <Flex.Item style={{flex:2}}></Flex.Item>
          <Flex.Item style={{flex:4,paddingLeft:3,paddingRight:3}}>
            <Button style={{height:36}} type="ghost" onPress={()=> { this.refreshFunc()   }}><Text style={{fontSize:14}}>刷新</Text></Button>  
          </Flex.Item>        
        </Flex>


        <WisFlexTable
          // title="待收货列表"
          // maxHeight={360}
          data={[{},{},{}]}
          onRef={(ref)=>{ this.tableRef=ref }}
          maxHeight={height-376}
          renderHead={()=>{
            return (
              <Flex>
                <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text></Text>
                </Flex.Item>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <View>
                    <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>任务编号</Text>
                  </View>
                </Flex.Item>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>零件</Text>
                </Flex.Item>
                <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>计划数量</Text>
                </Flex.Item>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>拣货库位</Text>
                </Flex.Item>             
              </Flex>
            )
          }}
          renderBody={(row,index,callBack)=>{
            return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex>
                  <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <View>
                      <Checkbox
                        checked={row._checked}
                        onChange={event => {
                          callBack && callBack(event.target.checked,index)
                          // that.cheCkquarantineFunc(event.target.checked,i)
                        }}
                      >
                      </Checkbox>
                    </View>
                  </Flex.Item>                
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.taskNo}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{'零件'}</Text>
                  </Flex.Item>     
                  <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.taskPickingNumber}</Text>
                  </Flex.Item>    
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.pickingMsg}</Text>
                  </Flex.Item>                               
              </Flex>

            </View>
            )
          }}
        />

        <Flex style={{marginBottom:12}}>

          <Flex.Item style={{flex:3,paddingLeft:3,paddingRight:3}}>
            <Button style={{height:36}} type="ghost" onPress={()=> {  this.responseFunc()  }}><Text style={{fontSize:14}}>确定</Text></Button>  
          </Flex.Item>
          <Flex.Item style={{flex:3,paddingLeft:3,paddingRight:3}}>
            <Button style={{height:36}} type="ghost" onPress={()=> {  navigation.navigate("orderPicking") }}><Text style={{fontSize:14}}>返回</Text></Button>  
          </Flex.Item>
        </Flex>


      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    // backgroundColor:"red",

  },
  checkBoxContainer:{
    flexDirection:'row',

  },
  checkBoxText:{
    marginTop:6
  }
});

export default createForm()(Page);
