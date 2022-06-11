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


// 零件 标签
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={


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
    * 删除
    * @returns 
    */
    deleteFunc=()=>{
        console.log("1111")
    }


    /**
     * 完成
     */
     accomplishFunc=()=>{
        let {navigation,form} = this.props;

        navigation.navigate("logistics");
     }
    


  render() {
    let that=this;
    let {visible,odd,part}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');




    return (
      <ScrollView style={{paddingLeft:8,paddingRight:8,paddingTop:16,backgroundColor:"#fff"}}>
      
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
                {text:'确认',onPress:()=> {    } },
                {text:'取消',onPress:()=>{}}
            ]}
            >
            <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
                <View style={{paddingLeft:12,marginTop:18,marginBottom:22}}>
                <Text style={{fontSize:18}}>确认删除？</Text>
                </View>
            </ScrollView>
            </Modal> */}

        <WisFlexTable
          // title="待收货列表"
          // maxHeight={360}
          data={[{},{},{}]}
          onRef={(ref)=>{ this.tableRef=ref }}
          maxHeight={height-376}
          renderHead={()=>{
            return (
              <Flex>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <View>
                    <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>零件</Text>
                  </View>
                </Flex.Item>
                <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>标签数量</Text>
                </Flex.Item>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>本次装箱数量</Text>
                </Flex.Item>
                <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}></Text>
                </Flex.Item>             
              </Flex>
            )
          }}
          renderBody={(row,index,callBack)=>{
            return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex>             
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.taskNo}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{'零件'}</Text>
                  </Flex.Item>     
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.taskPickingNumber}</Text>
                  </Flex.Item>    
                  <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <TouchableOpacity onPress={() =>{ 
                        this.deleteFunc()
                    }}>
                        <Icon style={{fontSize:28}} name={"rest"} />
                    </TouchableOpacity>
                  </Flex.Item>                               
              </Flex>

            </View>
            )
          }}
        />

        <View style={{height:22}}></View>

        <Flex style={{marginBottom:12}}>
            <Flex.Item style={{flex:3,paddingLeft:3,paddingRight:3}}>
                <Button type="ghost" onPress={()=> { this.accomplishFunc()  }}><Text style={{fontSize:14}}>完成</Text></Button>  
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

