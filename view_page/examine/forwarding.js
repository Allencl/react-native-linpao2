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


// 移库发运区
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      visible:false,


      odd:"",  // 拣货单号


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
   * 移库
   * @returns 
   */
   moveFunc=()=>{
    let {navigation,form} = this.props;
    navigation.navigate("shipments");

    
   }





  render() {
    let that=this;
    let {visible,odd,part}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');




    return (
      <ScrollView style={{paddingLeft:8,paddingRight:8,paddingTop:16}}>

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
                    <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>拣货单号</Text>
                  </View>
                </Flex.Item>
                <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>复核完成时间</Text>
                </Flex.Item>
                <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>推荐发运区库位</Text>
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

        <Flex>
          <Flex.Item style={{flex:3,paddingRight:6}}>
            <Button type="ghost" onPress={()=> { this.moveFunc()  } }><Text style={{fontSize:14}}>移库</Text></Button>  
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
