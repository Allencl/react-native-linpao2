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
import {WisTableCross,WisFlexTablePage} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 


// 拣货响应
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      visible:false,


      odd:"",  // 拣货单号
      part:"",  // 零件号

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
   * 查询 拣货单号
   * @param {c} value 
   */
   searchFunc=()=>{
    const {odd}=this.state;
    
    // console.log(odd)
    this.tableRef.initFunc({
      params:{
        // lotOrOrder:odd
      }
    });

   }

   /**
    * 查询 零件
    */
   searchPartFunc=()=>{
    const {part}=this.state;
    let {navigation,form} = this.props;

    
    console.log(part)
    this.tableRef.initFunc({
      params:{
        // lotOrOrder:odd
      }
    });


    navigation.navigate("part");

   }


  render() {
    let that=this;
    let {visible,odd,part}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');




    return (
      <ScrollView style={{paddingLeft:8,paddingRight:8,paddingTop:16}}>


        {/* <Modal
          title="确认"
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          footer={[
            {text:'确认',onPress:()=> {  this.responseFunc()  } },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:18,marginBottom:22}}>
              <Text style={{fontSize:18}}>确认进行响应操作？？</Text>
            </View>
          </ScrollView>
        </Modal> */}


        <Flex>
          <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              <InputItem
                value={odd}
                onChange={(value) => {
                  this.setState({
                    odd:value
                  })
                }}
                placeholder="请扫描或输入 拣货单号"
              >
              </InputItem>
          </Flex.Item>
          <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
              <TouchableOpacity onPress={() =>{ 
                this.setState({odd:""});
                this.tableRef.initFunc({
                  params:{
                    // lotOrOrder:""
                  }
                });
               }}>
                <Icon style={{fontSize:22}} name="delete" />
              </TouchableOpacity>
          </Flex.Item>
          <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
            <TouchableOpacity onPress={() =>  this.searchFunc() }>
              <Icon style={{fontSize:22,color:'blue'}} name="search" />
            </TouchableOpacity>
          </Flex.Item>          
        </Flex>
        <Flex>
            <Flex.Item style={{flex:8,borderBottomWidth:1,borderBottomColor:"#e6ebf1"}}>
              <InputItem
                value={part}
                onChange={(value) => {
                  this.setState({
                    part:value
                  })
                }}
                placeholder="请扫描或输入 零件标签"
              >
        
              </InputItem>
            </Flex.Item>
            <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
              <TouchableOpacity onPress={() =>{ 
                this.setState({part:""});
                this.tableRef.initFunc({
                  params:{
                    // lotOrOrder:""
                  }
                });
               }}>
                <Icon style={{fontSize:22}} name="delete" />
              </TouchableOpacity>
          </Flex.Item>
          <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
            <TouchableOpacity onPress={() =>  this.searchPartFunc() }>
              <Icon style={{fontSize:22,color:'blue'}} name="search" />
            </TouchableOpacity>
          </Flex.Item>  

        </Flex>

        <View style={{height:12}}></View>          

        <WisFlexTablePage
          RequestURL="wms/iqcTask/listNew"
          // Parames={{showStatus:'1'}}
          onRef={(ref)=>{ this.tableRef=ref }}
          maxHeight={height-376}
          renderHead={()=>{
            return (
              <Flex>
                {/* <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text></Text>
                </Flex.Item> */}
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <View>
                    <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>零件</Text>
                  </View>
                </Flex.Item>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>拣货数量</Text>
                </Flex.Item>
                <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>已复核数量</Text>
                </Flex.Item>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>箱号</Text>
                </Flex.Item>             
              </Flex>
            )
          }}
          renderBody={(row,index,callBack)=>{
            return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex>
                  {/* <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
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
                  </Flex.Item> */}
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

