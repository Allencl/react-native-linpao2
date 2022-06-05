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


// 待移库
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      no:"",   // 扫码单号



    }

  }

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;


    // 刷新table
    this.updataList =DeviceEventEmitter.addListener('globalEmitter_updata_packagesList',function(){
      that.tableRef.initFunc();
    });


    // 监听扫码枪
    this.honeyWellPrint=DeviceEventEmitter.addListener('globalEmitter_honeyWell',function(key=""){
      this.setState({
        no:key
      })
    });
  }

  componentWillUnmount(){
    this.honeyWellPrint.remove();
    this.updataList.remove();
  }


  /**
   * 初始化
   */
   initPage=()=>{
      this.tableRef.initFunc();
   }

  /**
   * 查询
   * @returns 
   */
  searchFunc=()=>{
    const {no}=this.state;
    
    console.log(no)
  }




  /**
   * 移库
   * @returns 
   */
   passHandle=()=>{
    const {navigation}=this.props;
    const _selectData=this.tableRef.getSelectData();
    const _sStorageIdList=_selectData.map(o=>o.sStorageId)   // 仓库ID

    if(!_selectData.length){
      Toast.fail('请至少选择一条数据！',1);
      return
    }


    if(Array.from(new Set(_sStorageIdList)).length>1){
      Toast.fail('多条移库，必须是同一仓库！',2);
      return
    }


    navigation.navigate('packagesDetailed',{
      data:_selectData
    }); 
    
   }


  render() {
    let that=this;
    let {no}=this.state;
    let {navigation,form} = this.props;




    return (
      <ScrollView style={{paddingLeft:8,paddingRight:8,paddingTop:16}}>

        <View>
          <Flex>
            <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              <TextInput
                style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderBottomWidth:1}}
                value={no}
                placeholder={"扫描或输入 送货单/批次号"}
                onChangeText={text => that.setState({no:text}) }
              /> 
            </Flex.Item>
            <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>

              <TouchableOpacity onPress={() =>  that.searchFunc() }>
                <Icon style={{fontSize:22,color:'blue'}} name="search" />
              </TouchableOpacity>

            </Flex.Item>
          </Flex>
        </View>



        <WisFlexTablePage
          RequestURL="wms/packageTask/list"
          Parames={{taskStatus:0}}
          onRef={(ref)=>{ this.tableRef=ref }}
          maxHeight={420}
          renderBody={(row,index,callBack)=>{
            return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex>
                  <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
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
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.packageTaskNo}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:12,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.part}</Text>
                  </Flex.Item>       
                  <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left',textAlign:'right'}}>{(row.taskStatus=="0")?'待移库':'未知'}</Text>
                  </Flex.Item>                               
              </Flex>
              <Flex>
                <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{' '}</Text>
                </Flex.Item>  
                <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.qty}</Text>
                </Flex.Item>   
                <Flex.Item style={{flex:9,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.ddLoc}</Text>
                </Flex.Item>  
                <Flex.Item style={{flex:9,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.inboundBatch}</Text>
                </Flex.Item>                                        
                </Flex>
            </View>
            )
          }}
        />


        <View style={{marginTop:16,marginBottom:50}}>
          <Button type="ghost" onPress={()=> this.passHandle() }>移 库</Button>          
        </View> 

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

