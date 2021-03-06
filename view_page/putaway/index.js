import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Modal,Icon,Checkbox,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace,Flex, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat,WisFlexTablePage } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisInputSN} from '@wis_component/ul';
import {WisFormPhoto} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址
import {brandPrimary} from './../../theme'; // 使用自定义样式


// 上架
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      odd:"",   // 单号
      visible:false,
      visible2:false,

      rowData:{},  // 行数据
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;


    this.updateTable=DeviceEventEmitter.addListener('globalEmitter_update_putaway_table',function(key=""){
      // that.tableRef.initFunc();
      that.searchFunc();
    });



    // 监听扫码枪
    this.honeyWell=DeviceEventEmitter.addListener('globalEmitter_honeyWell',function(key=""){

      // 判断设备
      // if( !(/^\d{2}\.\d{2}\.\d{2}\.\d{2}$/.test(key)) ){
      //   Toast.fail('错误设备编号！');
      //   return
      // }
      

      // let _key=key;
      // if(key&&key.length>11){
      //   _key =(key.split("-")[0]).slice(3);
      // }

      // console.log(_key)
      // that.props.form.setFieldsValue({
      //   odd:key,
      // });

    });

  }


  componentWillUnmount(){
    this.honeyWell.remove();
    this.updateTable.remove();

  }


  /**
   * 查询
   * @param {c} value 
   */
   searchFunc=()=>{
    const {odd}=this.state;
    
    // console.log(odd)
    // console.log(  )
    // this.tableRef.initFunc();

    this.tableRef.initFunc({
      params:{
        lotAndPartNo:odd.trim()
      }
    });


    // this.tableRef.initFunc({
    //   params:{
    //     lotNo:odd
    //   }
    // })
   }




  /**
   * 批量 上架
   * @returns 
   */
   putawayFunc=()=>{
    const {navigation,form} = this.props;
    const _selectData=this.tableRef.getSelectData();

    if(!_selectData.length){
      Toast.fail('请至少选择一条数据！',1);
      return
    }


    let _dBasStorageId=_selectData.map(o=>o.dBasStorageId);

    // 必须是同一仓库
    if(Array.from(new Set(_dBasStorageId)).length>1){
      Toast.fail('必须是同一仓库！',1);
      return
    }


    // 不合格品只能和不合格品一同上架
    let _taskType=_selectData.map(o=>o.taskType);

    if(Array.from(new Set(_taskType)).length>1){
      Toast.fail('不合格品只能和不合格品一同上架！',1);
      return
    }

    navigation.navigate('putawayDetailedAll',{rows:_selectData})

   }



  render() {
    let that=this;
    let{odd,rowData,visible,visible2}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {width, height, scale} = Dimensions.get('window');

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>

        <View>

          <Flex>
            <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              <TextInput
                style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderBottomWidth:1}}
                value={odd}
                placeholder={"请扫描或输入 批次号/零件号"}
                onChangeText={text => that.setState({odd:text}) }
              /> 
            </Flex.Item>

            <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
              <TouchableOpacity onPress={() =>{ 
                this.setState({odd:""});
                this.tableRef.initFunc({
                  params:{
                    lotAndPartNo:""
                  }
                });
               }}>
                <Icon style={{fontSize:22}} name="delete" />
              </TouchableOpacity>
            </Flex.Item>

            <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>

              <TouchableOpacity onPress={() =>  that.searchFunc() }>
                <Icon style={{fontSize:22,color:brandPrimary}} name="search" />
              </TouchableOpacity>

            </Flex.Item>
          </Flex>
        </View>

        <Flex style={{marginBottom:12,marginTop:12}}>
          <Flex.Item style={{flex:2}}>
            <Button 
              style={{height:32}} 
              onPress={()=>{ 
                this.putawayFunc()
              }} 
              size="small" 
              type="ghost"
            >
              <Text style={{paddingTop:4,fontSize:14}}>批量上架</Text>
            </Button>  
          </Flex.Item>
          <Flex.Item style={{flex:6}}></Flex.Item>
        </Flex>


        <WisFlexTablePage
          RequestURL="wms/mmTask/list"
          Parames={{taskByStatus:'1'}}
          onRef={(ref)=>{ this.tableRef=ref }}
          maxHeight={height-306}
          onCheckedAll={true}
          onRowClick={(row)=> navigation.navigate('putawayDetailed',{row:row}) }

          // onRowClick={(row)=> navigation.navigate('putawayDetailed',{row:row}) }
          // renderHead={()=>{
          //   return (
          //     <Flex>
          //       <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text></Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <View>
          //           <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>任务号</Text>
          //         </View>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>零件名称</Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>供应商</Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>推荐库位</Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>上架数量</Text>
          //       </Flex.Item>                
          //     </Flex>
          //   )
          // }}
          renderBody={(row,index,callBack)=>{
            return (<View key={index} style={{paddingTop:4,paddingBottom:4,marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
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
                  <Flex.Item style={{flex:25,paddingLeft:2}}>
                    {/* <TouchableOpacity onPress={() =>{ 
                      // that.setState({
                      //   visible:true,
                      //   rowData:row
                      // })
                      navigation.navigate('putawayDetailed',{row:row})
                    }}>
                      <Text numberOfLines={1} style={{textAlign:'left'}}>{row.taskNo||''}</Text>
                    </TouchableOpacity> */}
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.taskNo||''}</Text>

                  </Flex.Item>
                  {/* <Flex.Item style={{flex:1}}></Flex.Item>  */}
                              
              </Flex>
              {/* <View style={{height:2}}></View> */}
              <Flex style={{paddingBottom:2,paddingTop:2}}>
                <Flex.Item style={{flex:3,flexDirection:"row",paddingLeft:2,paddingRight:2}}>
                  <Text>推荐库位: </Text>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.dLocName||''}</Text>
                </Flex.Item> 
                <Flex.Item style={{flex:3,flexDirection:"row",paddingLeft:2,paddingRight:2}}>
                  <Text>上架数量: </Text>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{String(row.taskQty||'')}</Text>
                </Flex.Item> 
              </Flex>
              <Flex>
                <Flex.Item style={{flex:12,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{`${row.partNo||''} ${row.partName||''}`}</Text>
                </Flex.Item>
              </Flex>
              {/* <View style={{height:2}}></View> */}
              <Flex>
                <Flex.Item style={{flex:12,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.supplName||''}</Text>
                </Flex.Item> 

                <Flex.Item style={{flex:1,flexDirection:'row-reverse',paddingBottom:5,paddingLeft:2,paddingRight:0}}>
                  <Icon style={{fontSize:24}} name="right" />
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



export default createForm()(PageForm);

