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


// 移复检区
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      visible:false,

      dataList:[],

    }

  }

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;

    this.initPage();


    // 刷新table  
    this.updataList =DeviceEventEmitter.addListener('globalEmitter_updata_orderPicking_recheck',function(){
      that.initPage();
      // console.log("刷新了11211！")
    });

  }

  componentWillUnmount(){
    this.updataList.remove();
  }


  /**
   * 初始化
   */
   initPage=()=>{
    const that=this;

    WISHttpUtils.get("wms/pickingTask/appSelectPickToStockDToTask",{
      params:{}
      // hideLoading:true
    },(result) => {
      let {code,rows=[]}=result;

      // console.log(123221)
      // console.log(result)
      if(code==200){
        that.setState({dataList:rows.map(o=>Object.assign(o,{_checked:false})) })
      }

    });  
   }

  /**
   * 选中
   */
   cheCkquarantineFunc=(action,index)=>{
    const {dataList}=this.state;

    this.setState({
      dataList:dataList.map((o,i)=>{
        return Object.assign(o,{_checked:(i==index)?action:o._checked})
      })
    });
 }


  /**
   * 移至复核区
   * @returns 
  */
  moveFunc=()=>{
    const {dataList}=this.state;
    const {navigation}=this.props;
    const _selectData=dataList.filter(o=>o._checked);
    const _sStorageIdList=_selectData.map(o=>o.tmBasStorageDId)   // 仓库ID 

    if(!_selectData.length){
      Toast.fail('请选择数据！',1);
      return
    }


    if(Array.from(new Set(_sStorageIdList)).length>1){
      Toast.fail('多条移库，必须是同一个仓库！',2);
      return
    }


    navigation.navigate("recombination",{
      list:_selectData
    });



    
  } 




  render() {
    let that=this;
    let {visible,dataList}=this.state;
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
            {text:'确认',onPress:()=> {     } },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:18,marginBottom:22}}>
              <Text style={{fontSize:18}}>确认移至复检区？</Text>
            </View>
          </ScrollView>
        </Modal>



        <Flex>

          <Flex.Item style={{flex:6,paddingRight:6}}>
            <Text style={{paddingLeft:1}}>已完成下架任务行记录</Text>
          </Flex.Item>
          <Flex.Item style={{flex:3,paddingLeft:6}}>
            <Button style={{height:36}} type="ghost" onPress={()=> { this.initPage()  } }><Text style={{fontSize:14}}>刷新</Text></Button>  
          </Flex.Item>
        </Flex>

        <View style={{height:12}}></View>


        <WisFlexTable
          // title="待收货列表"
          // maxHeight={360}
          data={dataList||[]}
          onRef={(ref)=>{ this.tableRef=ref }}
          maxHeight={height-310}
          // renderHead={()=>{
          //   return (
          //     <Flex>
          //       <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text></Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <View>
          //           <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>任务编号</Text>
          //         </View>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>零件</Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>拣货数量</Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>拣货库位</Text>
          //       </Flex.Item>    
          //       {/* <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>推荐库区</Text>
          //       </Flex.Item>       */}
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>推荐库位</Text>
          //       </Flex.Item>               
          //     </Flex>
          //   )
          // }}
          renderBody={(row,index,callBack)=>{
            return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex>
                  <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <View>
                      <Checkbox
                        checked={row._checked}
                        onChange={event => {
                          // callBack && callBack(event.target.checked,index)
                          that.cheCkquarantineFunc(event.target.checked,index)
                        }}
                      >
                      </Checkbox>
                    </View>
                  </Flex.Item>                
                  <Flex.Item style={{flex:19,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.taskNo}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.actualPickingNumber}</Text>
                  </Flex.Item>  

 
                              
              </Flex>
              <Flex>
                <Flex.Item style={{flex:12,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.partName}</Text>
                </Flex.Item> 
              </Flex>

              <Flex>
              <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.dlocDName}</Text>
                </Flex.Item> 
                <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.locPName}</Text>
                </Flex.Item> 
              </Flex>
              <Flex>

              </Flex>           
            </View>
            )
          }}
        />

        <Flex style={{marginBottom:12}}>
          <Flex.Item style={{flex:3,paddingLeft:3,paddingRight:3}}>
            <Button style={{height:42}} type="ghost" onPress={()=> { this.moveFunc()   }}><Text style={{fontSize:14}}>移至复核区</Text></Button>  
          </Flex.Item>
          {/* <Flex.Item style={{flex:3,paddingLeft:3,paddingRight:3}}>
            <Button style={{height:36}} type="ghost" onPress={()=> {   }}><Text style={{fontSize:14}}>取消</Text></Button>  
          </Flex.Item> */}
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

