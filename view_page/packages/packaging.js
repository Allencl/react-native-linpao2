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


// 包装中
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      no:"",   // 扫码单号


      defaultNum:0,  // 默认
      printNum:0,     // 打印


      visible:false,
      visible2:false,



    }

  }

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;


    // 监听扫码枪
    this.honeyWellPrint=DeviceEventEmitter.addListener('globalEmitter_honeyWell',function(key=""){
      // this.setState({
      //   no:key
      // })
    });
  }

  componentWillUnmount(){

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
    
    this.tableRef.initFunc({
      params:{
        lotOrOrder:no
      }
    });
  }


  /**
   * 包装完成
   * @returns 
   */
   passHandle=()=>{
    const that=this;
    const {navigation}=this.props;
    const _selectData=this.tableRef.getSelectData()
    const _sStorageIdList=_selectData.map(o=>o.sStorageId)   // 仓库ID

    if(Array.from(new Set(_sStorageIdList)).length>1){
      Toast.fail('必须是同一仓库！',1);
      return
    }

    WISHttpUtils.post("wms/packageTask/packageFinish",{
      params:_selectData
      // hideLoading:true
    },(result) => {
      let {code}=result;

      // console.log(result)
      if(code==200){
        Toast.success('包装完成！',1);
        that.tableRef.initFunc();
      }
    });  
    
   }


   /**
    * 打印 
    * @returns 
    */
   printFunc=()=>{

   }


  render() {
    let that=this;
    let {no,defaultNum,printNum,visible,visible2}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');




    return (
      <View style={{paddingLeft:8,paddingRight:8,paddingTop:16}}>

        <Modal
          title="包装完成"
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          footer={[
            {text:'确认',onPress:()=> {  this.passHandle()  } },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:38,marginBottom:22}}>
              <Text style={{fontSize:18}}>确认进行包装完成操作？</Text>
            </View>
          </ScrollView>
        </Modal>

        <Modal
          title="打印确认"
          transparent
          onClose={()=>{
            this.setState({visible2:false})
          }}
          maskClosable
          visible={visible2}
          closable
          footer={[
            {text:'打印',onPress:()=> {  this.printFunc()  } },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingTop:16}}>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:4,paddingTop:8,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>默认份数:</Text>
                  {/* <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{'未知'}</Text> */}
                  <View style={{flex:7}}>
                    <TextInput
                      editable={!false}
                      style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderWidth:1}}
                      value={String(defaultNum)}
                      keyboardType={"numeric"}
                      onChangeText={text => this.setState({defaultNum:text}) }
                    />  
                  </View>
                </Flex.Item>
              </Flex>
              <Flex style={{marginTop:8}}>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:4,paddingRight:8,paddingTop:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>打印份数:</Text>
                  <View style={{flex:7}}>
                    <TextInput
                      editable={!false}
                      style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderWidth:1}}
                      value={String(printNum)}
                      keyboardType={"numeric"}
                      onChangeText={text => this.setState({printNum:text}) }
                    />  
                  </View>
                  {/* <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{'未知'}</Text> */}
                </Flex.Item>    
              </Flex>

            </View>
          </ScrollView>
        </Modal>




        <View>
          <Flex>
            <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              <TextInput
                style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderBottomWidth:1}}
                value={no}
                placeholder={"请扫描或输入 送货单/批次号"}
                onChangeText={text => that.setState({no:text}) }
              /> 
            </Flex.Item>
            <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
              <TouchableOpacity onPress={() =>{ 
                this.setState({no:""});
                this.tableRef.initFunc({
                  params:{
                    lotOrOrder:""
                  }
                });
               }}>
                <Icon style={{fontSize:22}} name="delete" />
              </TouchableOpacity>
            </Flex.Item>
            <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
              <TouchableOpacity onPress={() =>  that.searchFunc() }>
                <Icon style={{fontSize:22,color:'blue'}} name="search" />
              </TouchableOpacity>

            </Flex.Item>
          </Flex>
        </View>


        <View style={{marginTop:2,marginBottom:0}}>
          <Flex>
            <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              <Button style={{height:36}} type="ghost" onPress={()=> { 
                if(!this.tableRef.getSelectData().length){
                  Toast.fail('请选择数据！',1);
                  return
                }
                
                this.passHandle();
              }}>包装完成</Button> 
            </Flex.Item>  
            {/* <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              <Button style={{height:36}} type="ghost" onPress={()=> this.setState({visible2:true}) }>标签打印</Button> 
            </Flex.Item>                                          */}
          </Flex>                 
        </View> 

        <WisFlexTablePage
          RequestURL="wms/packageTask/list"
          Parames={{taskStatus:5}}
          onRef={(ref)=>{ this.tableRef=ref }}
          maxHeight={height-340}
          renderBody={(row,index,callBack)=>{
            return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex>
                  <Flex.Item style={{flex:4,paddingLeft:2,paddingRight:2}}>
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
                  <Flex.Item style={{flex:12}}>
                    <Text>{row.sheetNo}</Text>
                  </Flex.Item> 

                  <Flex.Item style={{flex:18,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.packageTaskNo}</Text>
                  </Flex.Item>
                                
              </Flex>
              <Flex>
                <Flex.Item style={{flex:19,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.part}</Text>
                </Flex.Item> 
              </Flex>
              <Flex>
                <Flex.Item style={{flex:8,flexDirection:'row',paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text>包装数量: </Text>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{String(row.qty)}</Text>
                </Flex.Item>   
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.ddLoc}</Text>
                </Flex.Item>  
                                      
                </Flex>
                <Flex>
                <Flex.Item style={{flex:9,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.inboundBatch}</Text>
                </Flex.Item>  
                  <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left',textAlign:'right'}}>{(row.taskStatus=="0")?'待移库':''}</Text>
                  </Flex.Item>   
                </Flex>
            </View>
            )
          }}
        />



      </View>
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

