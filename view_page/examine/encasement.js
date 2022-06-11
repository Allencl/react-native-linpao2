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


// 装箱信息
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      visible:false,   
      visible2:false,
      visible3:false,



      odd:"",  // 拣货单号
      ctn:"",   // 箱号
      part:"",  // 零件号


      num:"",  // 物流单号

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
   * 拆箱
   * @returns 
   */
   separateFunc=()=>{
    console.log("才开")
   }



  /**
   * 打印 装箱清单
   * @returns 
   */
  printFunc=()=>{
    console.log("打印 装箱清单")
  }


  /**
   * 输入物流单号 
   */
   importLogisticsNum=()=>{
    let {navigation,form} = this.props;
    navigation.navigate('logisticsNum'); 
    
   }
  

  render() {
    let that=this;
    let {visible,visible2,visible3,odd,ctn,part,num}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');




    return (
      <ScrollView style={{paddingLeft:8,paddingRight:8,paddingTop:16}}>


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
            {text:'确认',onPress:()=> { this.separateFunc()   } },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:18,marginBottom:22}}>
              <Text style={{fontSize:18}}>确认对选中的记录进行拆箱？</Text>
            </View>
          </ScrollView>
        </Modal>


        <Modal
          title="确认"
          transparent
          onClose={()=>{
            this.setState({visible2:false})
          }}
          maskClosable
          visible={visible2}
          closable
          footer={[
            {text:'确认',onPress:()=> { this.printFunc()   } },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:18,marginBottom:22}}>
              <Text style={{fontSize:18}}>打印装箱清单？</Text>
            </View>
          </ScrollView>
        </Modal>

        {/* <Modal
          title="输入物流单号"
          transparent
          onClose={()=>{
            this.setState({visible3:false})
          }}
          maskClosable
          visible={visible3}
          closable
          footer={[
            {text:'确认',onPress:()=> { this.printFunc()   } },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
              <InputItem
                value={num}
                onChange={(value) => {
                  this.setState({
                    num:value
                  })
                }}
                placeholder="请输入物流单号"
              >
                物流单号
              </InputItem>
          </ScrollView>
        </Modal> */}

        <Flex>
          <Flex.Item style={{borderBottomWidth:1,borderBottomColor:"#e6ebf1"}}>
              <InputItem
                value={odd}
                onChange={(value) => {
                  this.setState({
                    odd:value
                  })
                }}
                placeholder="扫描或输入拣货单号"
              >
                拣货单
              </InputItem>
          </Flex.Item>
        </Flex>
        <Flex>
          <Flex.Item style={{borderBottomWidth:1,borderBottomColor:"#e6ebf1"}}>
              <InputItem
                value={ctn}
                onChange={(value) => {
                  this.setState({
                    ctn:value
                  })
                }}
                placeholder="扫描或输入箱号"
              >
                箱号
              </InputItem>
          </Flex.Item>
        </Flex>

        
        <Flex>
            <Flex.Item style={{borderBottomWidth:1,borderBottomColor:"#e6ebf1"}}>
              <InputItem
                value={part}
                onChange={(value) => {
                  this.setState({
                    part:value
                  })
                }}
                placeholder="扫描或输入零件号"
              >
                零件
              </InputItem>
            </Flex.Item>
        </Flex>

        <View style={{height:12}}></View>          

        <Flex>
          <Flex.Item style={{flex:3,paddingRight:6}}>
            <Button style={{height:36}} type="ghost" onPress={()=> { this.setState({visible:true})  } }><Text style={{fontSize:14}}>拆箱</Text></Button>  
          </Flex.Item>
          <Flex.Item style={{flex:3,paddingLeft:3,paddingRight:3}}>
            <Button style={{height:36}} type="ghost" onPress={()=> { this.setState({visible2:true})  } }><Text style={{fontSize:14}}>打印装箱清单</Text></Button>  
          </Flex.Item>
          <Flex.Item style={{flex:3,paddingLeft:6}}>
            <Button style={{height:36}} type="ghost" onPress={()=> {  this.importLogisticsNum()  } }><Text style={{fontSize:14}}>输入物流单号</Text></Button>  
          </Flex.Item>
        </Flex>

        <View style={{height:12}}></View>          


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

