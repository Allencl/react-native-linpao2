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
import AsyncStorage from '@react-native-async-storage/async-storage';


// 装箱信息
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      visible:false,   
      visible2:false,
      visible3:false,

      pickOrder:{},   //  base
      pickOrderdList:[],   // table
      pickOrderBoxingList:[],   

      bufferPickOrderBoxingList:[], // 缓存

      odd:"P202206160103",  // 拣货单号
      ctn:"P2022061200602206170046",   // 箱号
      part:"1001550-CA03",  // 零件号


      num:"",  // 物流单号

    }

  }

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;

    this.initFunc();


    // 刷新页面   C:\codeAllen\react-native-linpao2\view_page\examine\encasement.js
    this.updatePage=DeviceEventEmitter.addListener('globalEmitter_examine_update_table',function(){
      that.searchFunc()
    });

  }

  componentWillUnmount(){
    this.updatePage.remove();
  }

  /**
   * 查询 单号
   */
   searchFunc=()=>{
      const {odd}=this.state;

      // console.log("刷新了啊啊啊啊")
      this.initFunc()
   }


  /**
   * 查询 箱号
   */
  searchCtnFunc=()=>{
    const {ctn,bufferPickOrderBoxingList}=this.state;
    let _text=ctn.trim();
    let _list=bufferPickOrderBoxingList.filter(o=>o.boxNo==_text);

    if(!_list.length){
      Toast.offline("无数据！",1);
    }
    this.setState({
      pickOrderBoxingList:_list
    });
  }
   

  /**
   * 查询 零件号
   */
   searchPartFunc=()=>{
    const {part,bufferPickOrderBoxingList}=this.state;
    let _text=part.trim();
    let _list=bufferPickOrderBoxingList.filter(o=>o.partNo==_text);

    if(!_list.length){
      Toast.offline("无数据！",1);
    }
    this.setState({
      pickOrderBoxingList:_list
    });



  }
   
  
  /**
   * 初始化
  */
  initFunc=()=>{
    const that=this;
    const {odd}=this.state;

    this.setState({
      pickOrder:{}, 
      pickOrderdList:[],   
      pickOrderBoxingList:[],
      bufferPickOrderBoxingList:[]
    });

    // console.log(odd)
    WISHttpUtils.get(`wms/pickOrderd/getOrderDetails/${odd.trim()}`,{
      params:{}
      // hideLoading:true
    },(result) => {
      let {code,data}=result;
      // console.log(result)


      if(!data){
        Toast.offline("无数据！",1);
        return
      }

      if(!data.pickOrderBoxingList){
        Toast.offline("无数据！",1);
        return
      }

      if(code==200){
        // Toast.success(`${data.message}`,1);


        // 



        // 装箱类型
        AsyncStorage.getItem("buffer_boxing_type").then((option)=>{
          let _boxingTypeData=JSON.parse(option);

          that.setState({
            pickOrder:data.pickOrder, 
            pickOrderdList:data.pickOrderdList,   
            pickOrderBoxingList:data.pickOrderBoxingList.map(k=>Object.assign(k,{
              _checked:false,
              _boxingTypeValue:_boxingTypeData.filter(j=>j.dictValue==k.boxingType)[0]["dictLabel"]
            })),   
          },()=>{
            that.setState({
              bufferPickOrderBoxingList:that.state.pickOrderBoxingList
            })
          })
        })

      }

    });  
  }


  /**
   * 选中
  */
  cheCkquarantineFunc=(action,index)=>{
    const {pickOrderBoxingList}=this.state;

    this.setState({
      pickOrderBoxingList:pickOrderBoxingList.map((o,i)=>{
        return Object.assign(o,{_checked:(i==index)?action:o._checked})
      })
    });
  }


  /**
   * 拆箱
   * @returns 
   */
   separateFunc=()=>{
    const that=this;
    const {pickOrderBoxingList}=this.state;
    let _selectData=pickOrderBoxingList.filter(o=>o._checked);

    if( !_selectData.length ){
      Toast.offline("未选择数据！",1);
      return
    }

    if( _selectData.length>1 ){
      Toast.offline("只能选择一条数据！",1);
      return
    }



    // wms/boxingInfo/unboxing
    // console.log(_selectData)
    // console.log("才开")

    let _json={
      boxNo: _selectData[0]["boxNo"],
      ttMmBoxingInfoId: _selectData[0]["ttMmBoxingInfoId"],
      version: _selectData[0]["version"],
    }

    // console.log(_json)
    WISHttpUtils.post("wms/boxingInfo/unboxing",{
      params: _json
      // hideLoading:true
    },(result) => {
      let {code,msg}=result;

      // console.log(result)
      if(code==200){
        Toast.success(`${msg}`,1);
        that.searchFunc()
      }

    });  



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
    const {pickOrderBoxingList}=this.state;
    let _selectData=pickOrderBoxingList.filter(o=>o._checked);

    if(!_selectData.length){
      Toast.fail('请选择数据！',1);
      return
    }


    navigation.navigate('logisticsNum',{
      list:_selectData
    }); 
    
   }
  

  render() {
    let that=this;
    let {visible,visible2,visible3,odd,ctn,part,num}=this.state;
    const {pickOrderBoxingList,bufferPickOrderBoxingList}=this.state;
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
            {text:'确认',onPress:()=> {    } },
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
          <Flex.Item style={{flex:8,borderBottomWidth:1,borderBottomColor:"#e6ebf1"}}>
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
                  this.setState({odd:""},()=>{
                    that.initFunc()
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
        {/* <Flex>
          <Flex.Item style={{flex:8,borderBottomWidth:1,borderBottomColor:"#e6ebf1"}}>
              <InputItem
                value={ctn}
                onChange={(value) => {
                  this.setState({
                    ctn:value
                  })
                }}
                placeholder="请扫描或输入 箱号"
              >
                
              </InputItem>
          </Flex.Item>
          <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
              <TouchableOpacity onPress={() =>{ 
                this.setState({ctn:""},()=>{
                  this.setState({
                    pickOrderBoxingList:bufferPickOrderBoxingList
                  })
                });
                // this.tableRef.initFunc({
                //   params:{
                //     // lotOrOrder:""
                //   }
                // });
               }}>
                <Icon style={{fontSize:22}} name="delete" />
              </TouchableOpacity>
          </Flex.Item>
          <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
            <TouchableOpacity onPress={() =>  this.searchCtnFunc() }>
              <Icon style={{fontSize:22,color:'blue'}} name="search" />
            </TouchableOpacity>
          </Flex.Item>    
        </Flex> */}
        {/* <Flex>
          <Flex.Item style={{flex:8,borderBottomWidth:1,borderBottomColor:"#e6ebf1"}}>
              <InputItem
                value={part}
                onChange={(value) => {
                  this.setState({
                    part:value
                  })
                }}
                placeholder="请扫描或输入 零件号"
              >
              </InputItem>
          </Flex.Item>
          <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
              <TouchableOpacity onPress={() =>{ 
                this.setState({part:""},()=>{
                  this.setState({
                    pickOrderBoxingList:bufferPickOrderBoxingList
                  })
                });
                // this.tableRef.initFunc({
                //   params:{
                //     // lotOrOrder:""
                //   }
                // });
               }}>
                <Icon style={{fontSize:22}} name="delete" />
              </TouchableOpacity>
          </Flex.Item>
          <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
            <TouchableOpacity onPress={() =>  this.searchPartFunc() }>
              <Icon style={{fontSize:22,color:'blue'}} name="search" />
            </TouchableOpacity>
          </Flex.Item>    
        </Flex> */}


        <View style={{height:12}}></View>          

        <Flex>
          <Flex.Item style={{flex:3,paddingRight:6}}>
            <Button style={{height:36}} type="ghost" onPress={()=> { this.separateFunc()  } }><Text style={{fontSize:14}}>拆箱</Text></Button>  
          </Flex.Item>
          {/* <Flex.Item style={{flex:3,paddingLeft:3,paddingRight:3}}>
            <Button style={{height:36}} type="ghost" onPress={()=> { this.setState({visible2:true})  } }><Text style={{fontSize:14}}>打印装箱清单</Text></Button>  
          </Flex.Item> */}
          <Flex.Item style={{flex:3,paddingLeft:6}}>
            <Button style={{height:36}} type="ghost" onPress={()=> {  this.importLogisticsNum()  } }><Text style={{fontSize:14}}>输入物流单号</Text></Button>  
          </Flex.Item>
        </Flex>

        <View style={{height:12}}></View>          


        <WisFlexTable
          // title="待收货列表"
          // maxHeight={360}
          data={pickOrderBoxingList||[]}
          onRef={(ref)=>{ this.tableRef=ref }}
          maxHeight={height-320}
          // renderHead={()=>{
          //   return (
          //     <Flex>
          //       <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text></Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <View>
          //           <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>拣货单号</Text>
          //         </View>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>箱号</Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>装箱类型</Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>零件明细</Text>
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
                  <Flex.Item style={{flex:26,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.pickOrderNo}</Text>
                  </Flex.Item>  
                  <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row._boxingTypeValue}</Text>
                </Flex.Item>                            
              </Flex>
              <Flex>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.boxNo}</Text>
                </Flex.Item>  
              </Flex>
              <Flex>
  
              </Flex>
              <Flex>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.part}</Text>
                </Flex.Item>  
              </Flex>
            </View>
            )
          }}
        />


        {/* <View style={{height:12}}><Text></Text></View> */}

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

