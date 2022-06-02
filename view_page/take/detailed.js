import React, { Component } from 'react';
import {TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import {Modal,Card,Flex,Checkbox, Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisInputSN,WisBluetooth,WisFlexTable} from '@wis_component/ul';
import {WisFormPhoto} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址
import a from '@ant-design/react-native/lib/modal/alert';


// ASN 收货单 明细
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      visible:false,  
      visible2:false,
      visible3:false,


      basicData:{},  // 基础信息
      _company:'',   // 公司
      _orderType:'',  // 订单类型
      _takeState:'',   // 收货状态


      rowData:{},   // 行数据
      waitReceivingList:[],  // 待收货列表 
      quarantineList:[],   // 待检列表 库区数据
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;

    this.initFunc()
  }


  componentWillUnmount(){

  }



  /**
   * 初始化
   * @returns 
   */
  initFunc=()=>{
    const that=this;
    const {data}=this.props.route.params.routeParams;
    const {poOrder={},poOrderPartList=[]}=data;

    
    // console.log(23322)
    // console.log( data )


    this.setState({
      basicData:poOrder,
    })

    // 公司
    AsyncStorage.getItem("buffer_company_list").then((option)=>{
      let _data=JSON.parse(option);
      let company= _data.filter(o=>o.tmBasSupplId==poOrder.tmBasSupplId)[0];

      that.setState({
        _company:`${company.supplNo}-${company.supplName}`
      })

    })


    // 单据类型
    AsyncStorage.getItem("buffer_order_type").then((option)=>{
      let _typeData=JSON.parse(option);
      let _json=_typeData.filter(o=>o.dictValue==poOrder["poType"])[0];

      that.setState({
        _orderType:`${_json.dictValue}-${_json.dictLabel}`
      })
    })


    // 收货状态
    AsyncStorage.getItem("buffer_take_type").then((option)=>{
      let _takeData=JSON.parse(option);
      let _json=_takeData.filter(o=>o.dictValue==poOrder["asnStatus"])[0];

      // console.log(_json)
      that.setState({
        _takeState:`${_json.dictValue}-${_json.dictLabel}`
      })
      
    })


    // 单位
    AsyncStorage.getItem("buffer_units").then((option)=>{
      let _unitsData=JSON.parse(option);

      let _newList=poOrderPartList.map(o=> Object.assign(o,{
        _checked:false,
        _unitName:_unitsData.filter(j=>o.dictValue==j.unit)[0]['dictLabel']
      }))



      // 获取库区  下拉
      if(poOrderPartList.length){
        WISHttpUtils.get('wms/loc/list',{
          params:{
            stotageId:poOrderPartList[0]["storageId"],
            dlocType:3
          },
          
        },(result)=>{
          const {rows=[]}=result;  

          let _newData=_newList.map((o)=>{
            let _bufferData=rows.filter(k=>o.locId==k.tmBasLocId)[0]||{};
            return Object.assign(o,{
              _tmBasLocId:_bufferData.tmBasLocId,
              _reservoirName:`${_bufferData.locNo}-${_bufferData.locName}`
            })
          })
          

          that.setState({
            quarantineList:rows
          })


          that.setState({
            basicData:poOrder,
            waitReceivingList:_newData
          })

    
        })
      }





    })




    

  }

  /**
   * cheak box 切换
   * @param {*} value 
   * @param {*} index 
  */
  checkBoxFunc=(value,index)=>{
    const that=this;
    const {waitReceivingList}=this.state;

    this.setState({
      waitReceivingList:waitReceivingList.map((o,i)=>{
        return (i==index) ? Object.assign(o,{_checked:value}):o
      })
    });
  }


  /**
   * 全选
   * @param {*} value 
   * @param {*} index 
   */
  onCheckedAll=(value)=>{
    const that=this;
    const {waitReceivingList}=this.state;

    this.setState({
      waitReceivingList:waitReceivingList.map((o,i)=> Object.assign(o,{_checked:value}) )
    });


  }


  /**
   * 切换 收货数
   * @returns 
   */
  takeChangeText=(value,index)=>{
    const that=this;
    const {waitReceivingList}=this.state;

    let _value=Number(value);

    // console.log( _value )
    that.setState({
      waitReceivingList:[]
    },()=>{
      this.setState({
        waitReceivingList:waitReceivingList.map((o,i)=>{
          return (i==index) ? Object.assign(o,{_takeNumber:_value}):o
        })
      })
    })
  }

  /**
   * 库区选择 切换
   */
  cheCkquarantineFunc=(value,index)=>{
    const that=this;
    const {quarantineList}=this.state;

    this.setState({
      quarantineList:[]
    },()=>{
      that.setState({
        quarantineList:quarantineList.map((o,i)=>Object.assign(o,{_checked:(i==index)?value:false}))
      })
    })
  }

  /**
   * 批量收货
   * @returns 
   */
  batchTakeFunc=()=>{


  }


  render() {
    let that=this;
    let{visible,visible2,visible3,basicData,rowData,_company,_orderType,_takeState,waitReceivingList,quarantineList}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:'#fff'}}>


        <Modal
          title="逐条收货"
          transparent
          onClose={()=>{
            this.setState({visible2:false})
          }}
          maskClosable
          visible={visible2}
          closable
          footer={[
            {text:'确认',onPress:()=> {} },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:380,paddingLeft:12,marginTop:12,marginBottom:12}}>
            <View style={{paddingTop:16}}>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>ASN:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{basicData.asnNo}</Text>
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>行号:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData.lineno}</Text>
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>物料:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData.part}</Text>
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>名称:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>显示在物料</Text>
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>单位:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData._unitName}</Text>
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>计划数量:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData.receiveQty}</Text>
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>已收数量:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData.receivedQty}</Text>
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>收货数量:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>{rowData.receiveQty}</Text>
                </Flex.Item>    
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>待检库位:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>未知</Text>
                </Flex.Item>  
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>质检标准:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>无数据</Text>
                </Flex.Item>  
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>包装方案:</Text>
                  <Text style={{flex:7,fontSize:16,paddingLeft:6}} numberOfLines={1}>无数据</Text>
                </Flex.Item> 
              </Flex>
              <Flex>
                <Flex.Item style={{flexDirection:"row"}}>
                  <Text style={{flex:3,paddingRight:8,marginBottom:8,paddingTop:8,fontSize:16,fontWeight:'bold',textAlign:'right'}}>LPN:</Text>
                  <View style={{flex:7,}}>
                    <TextInput
                      style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderWidth:1}}
                      value={""}
                      placeholder={"请输入HU号"}
                      // onChangeText={text => that.takeChangeText(text,index)}
                    />  
                  </View>
                </Flex.Item>  
              </Flex>
            </View>
          </ScrollView>
        </Modal>



        <Modal
          title="批量收货"
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          footer={[
            {text:'确认',onPress:()=> that.batchTakeFunc() },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <View style={{paddingLeft:12,marginTop:38,marginBottom:22}}>
            <Text style={{fontSize:18}}>确认是否进行批量收货操作？</Text>
          </View>
        </Modal>



        <Modal
          title="待检库位 (单选)"
          transparent
          onClose={()=>{
            this.setState({visible3:false})
          }}
          maskClosable
          visible={visible3}
          closable
          footer={[
            {text:'确认',onPress:()=> {} },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:220,paddingTop:22}}>
            { quarantineList.map((o,i)=>{
              return (<View key={i}>
                <Flex>
                  <Flex.Item style={{flex:1,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Checkbox
                      checked={o._checked}
                      onChange={event => {
                        that.cheCkquarantineFunc(event.target.checked,i)
                      }}
                    >
                    </Checkbox>
                  </Flex.Item>
                  <Flex.Item style={{flex:8,paddingBottom:4,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{fontSize:14,textAlign:'left'}}>{`${o.locNo}-${o.locName}`}</Text>
                  </Flex.Item>
                </Flex>
              </View>)
            })}
          </ScrollView>
        </Modal>
        
        <View style={{padding:10,borderWidth:1,borderColor:'#e6ebf1',borderRadius:6,backgroundColor:'#fff'}}>
          <View style={{paddingBottom:12}}>
            <Text style={{fontSize:13,fontWeight:'600',color:"#1890ff"}}>基础信息</Text>
          </View>

          <Flex style={{marginBottom:10}}>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>{basicData.asnNo}</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>{_takeState}</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'center'}}>{_orderType}</Text>
            </Flex.Item>
          </Flex>

          <Flex style={{marginBottom:10}}>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>{_company}</Text>
            </Flex.Item>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'right'}}>收货行数：4/10未知</Text>
            </Flex.Item>
          </Flex>   
        </View>

        <View style={{height:12}}></View>


        <WisFlexTable
          title="待收货列表"
          // maxHeight={360}
          data={waitReceivingList}
          onCheckedAll={(value)=> that.onCheckedAll(value) }
          renderBody={(row,index)=>{
            return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex >
                  <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Checkbox
                      checked={row._checked}
                      onChange={event => {
                        that.checkBoxFunc(event.target.checked,index)
                      }}
                    >
                    </Checkbox>
                  </Flex.Item>
                  <Flex.Item style={{flex:1,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.lineno}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.part}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>


                    <TouchableOpacity onPress={() =>{ 
                        that.setState({
                          quarantineList:[]
                        },()=>{
                          that.setState({
                            quarantineList:quarantineList.map(j=>Object.assign(j,{_checked:(j.tmBasLocId==row._tmBasLocId)?true:false}))
                          })
                        })

                        that.setState({visible3:true}) 
                      }}
                    >
                      <View style={{borderColor:'#d9d9d9',paddingLeft:6,paddingRight:6,borderWidth:1,borderRadius:6}}>
                        <Text numberOfLines={1} style={{textAlign:'left'}}>{row._reservoirName}</Text>
                      </View>
                    </TouchableOpacity>
                  </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item style={{flex:5,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text></Text>
                </Flex.Item>                
                <Flex.Item style={{flex:5,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <TextInput
                    editable={!false}
                    style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderWidth:1}}
                    value={ (row._takeNumber!=undefined)?String(row._takeNumber):String(row.receiveQty)}
                    keyboardType={"numeric"}
                    onChangeText={text => that.takeChangeText(text,index)}
                  />               
                </Flex.Item>
                <Flex.Item style={{flex:18,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{` ${row.receivedQty}/${row.baseQty} （${row._unitName}）`}</Text>
                </Flex.Item>
              </Flex>
            </View>
            )
          }}
        />


        <View style={{height:12}}></View>
          <Flex style={{backgroundColor:"#fff"}}>
              <Flex.Item style={{ paddingLeft:2, paddingRight:2 }}>
                <Button onPress={()=>{

                    if(!waitReceivingList.filter(o=>o._checked).length){
                      Toast.fail({content:'未选择单据！',duration:1});
                      return
                    }

                    if(waitReceivingList.filter(o=>o._checked).length>1){
                      Toast.fail({content:'最多选择一条！',duration:1});
                      return
                    }

                    that.setState({
                      rowData:(waitReceivingList.filter(o=>o._checked)[0])
                    },()=>{
                      that.setState({visible2:true})

                      console.log(that.state.rowData)
                    })

                }} style={{height:36}} size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>逐条收货</Text></Button>
              </Flex.Item>
              <Flex.Item style={{ paddingLeft:2, paddingRight:2 }}>
                <Button style={{height:36}} onPress={()=>{ 
                  if(waitReceivingList.filter(o=>o._checked).length){
                    this.setState({visible:true})
                  }else{
                    Toast.fail('未选择单据！');
                  }
                }} size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>批量收货</Text></Button>
              </Flex.Item>
          </Flex>
        <View style={{height:12}}></View>


        <WisFlexTable
          title="已收货"
          data={waitReceivingList}
          renderBody={(row,index)=>{
            return (<View key={index}>
                <Flex style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
                  <Flex.Item style={{flex:1,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.lineno}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:7,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.part}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'center'}}>{` ${row.receivedQty}/${row.baseQty} (${row._unitName})`}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:5,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>S111库位</Text>
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

});



export default createForm()(PageForm);

