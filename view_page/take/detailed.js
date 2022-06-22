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
import {brandPrimary} from './../../theme'; // 使用自定义样式


// import {origin} from '@wis_component/origin';     // 服务地址
// import a from '@ant-design/react-native/lib/modal/alert';

import SelectReservoir from './select.js';  // 选择库区 下拉框


// ASN 收货单 明细
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      _pageIndex:0,  // 
      visible:false,  
      visible2:false,
      visible3:false,


      basicData:{},  // 基础信息
      _company:'',   // 公司
      _orderType:'',  // 订单类型
      _takeState:'',   // 收货状态


      rowData:{},   // 行数据
      waitReceivingList:[],  // 待收货列表 
      completeList:[],   // 已完成

      quarantineList:[],   // 待检列表 库区数据
      quarantineBufferRow:{},  // 库区选中 行
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;

    this.initFunc();



    // 刷新
    this.update =DeviceEventEmitter.addListener('globalEmitter_update_take_list',function(option){
      that.updateFunc(option._odd)
    });

  }


  componentWillUnmount(){
    this.update.remove();
  }


  /**
   * 更新单据
   */
   updateFunc=(odd)=>{
    const that=this;
    let {navigation,form} = this.props;
    const {ToastExample}=NativeModules;


    // const {odd}=this.props.route.params.routeParams;

    // console.log(odd)
    this.setState({
      basicData:{},
      waitReceivingList:[],
      completeList:[]
    });


    WISHttpUtils.get(`wms/poOrderPart/getOrderDetails/${odd}`,{
      params:{

      }
    },(result)=>{
      const {code,msg,data={}}=result;

      // console.log(result)

      if(code==210){
        // console.log("2222-111")
        ToastExample.show(`${data.message}!`);
        navigation.navigate('take'); 
        DeviceEventEmitter.emit('globalEmitter_update_take_index');

        return
      }

      that.initFunc(data)


    })     
   }



  /**
   * 初始化
   * @returns 
   */
  initFunc=(_data)=>{
    const that=this;
    const {data}=this.props.route.params.routeParams;
    const {poOrder={},poOrderPartList=[],msg}=_data || data;


    
    // console.log(23322)
    // console.log( data )
    if(!poOrderPartList.length){
      msg && Toast.info(`${msg}！`,1);
      this.setState({
        basicData:{},
        waitReceivingList:[],
        completeList:[]
      });
      return
    }



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


          // console.log(rows)

          let _newData=_newList.map((o)=>{
            let _bufferData=rows.filter(k=>o.locId==k.tmBasLocId)[0]||{};
              return Object.assign(o,{
                _takeNumber:o.receiveQty,  // 收货数量
                _tmBasLocId:_bufferData.tmBasLocId,
                _reservoirName:`${_bufferData.locNo}-${_bufferData.locName}`
              })
          })
       

          that.setState({
            quarantineList:rows
          })

          // console.log(1232211)
          // console.log(_newData)
          that.setState({
            basicData:poOrder,
            waitReceivingList:_newData.filter(o=>o.detailStatus!='60'),
            completeList:_newData.filter(o=>o.detailStatus=='60')
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
    // console.log(value)
    this.setState({
      waitReceivingList:waitReceivingList.map((o,i)=>{
        return (o.canModifReceiptQty=="0") ? Object.assign(o,{_checked:false}) : Object.assign(o,{_checked:value})
      })
    });
  }


  /**
   * 切换 收货数
   * @returns 
   */
  takeChangeText=(value,index,row)=>{
    const that=this;
    const {waitReceivingList}=this.state;

    let _value=Number(value);

    if(_value>row.receiveQty){
      Toast.fail('收货数量不能大于可收货数量！',1);
      return
    }
    

    that.setState({
      // waitReceivingList:[]
    },()=>{
      this.setState({
        waitReceivingList:waitReceivingList.map((o,i)=>{
          return (i==index) ? Object.assign(o,{_takeNumber:_value}):o
        })
      })
    })
  }

  // /**
  //  * 库区选择 切换
  //  */
  // cheCkquarantineFunc=(value,index)=>{
  //   const that=this;
  //   const {quarantineList}=this.state;

  //   this.setState({
  //     quarantineList:[]
  //   },()=>{
  //     that.setState({
  //       quarantineList:quarantineList.map((o,i)=>Object.assign(o,{_checked:(i==index)?value:false}))
  //     })
  //   })
  // }

  /**
   * 选中  库区
   */
  //  quarantineChange=()=>{
  //     const that=this;
  //     const {waitReceivingList,quarantineList,quarantineBufferRow}=this.state;


  //     let _selectData=quarantineList.filter(o=>o._checked)[0];
  //     let _newList= waitReceivingList.map((o,i)=>{
  //       return (i==quarantineBufferRow._index)?Object.assign(o,{
  //         _tmBasLocId:_selectData.tmBasLocId,
  //         _reservoirName:`${_selectData.locNo}-${_selectData.locName}`
  //       })
  //       :o
  //     });

  //     // console.log(_newList)
  //     this.setState({
  //       waitReceivingList:_newList
  //     })
  //  }


  /**
   * 选择 库位
   * @param {*} value 
  */
  selectReservoirFunc=()=>{
    this.selectReservoirRef.openModle()
  }

  /**
    * 确认库位
    * @param {*} value 
  */
  reservoirConfirm=(option)=>{
    const that=this;
    const {_pageIndex,waitReceivingList}=this.state;

    let _newList=waitReceivingList.map((o,i)=>{
      return (i==_pageIndex)?
          Object.assign(o,{
            _tmBasLocId:option.tmBasLocId,
            _reservoirName:`${option.locNo}-${option.locName}`
          })
        :o;
    });


    this.setState({
      waitReceivingList:[]
    },()=>{
      that.setState({waitReceivingList:_newList})
    })

  }


  /**
   * 批量收货
   * @returns 
   */
  batchTakeFunc=()=>{
    const that=this;
    const {odd}=this.props.route.params.routeParams;
    const {waitReceivingList,basicData}=this.state;
    let _list=waitReceivingList.filter(o=>o._checked)

    let _json=_list.map(o=>Object.assign({
      dlocId: o.dlocId,
      locId: o.locId,
      receiveQty: o._takeNumber,
      ttMmOrmPoId: o.ttMmOrmPoId,
      ttMmOrmPoPartId: o.ttMmOrmPoPartId,
      version: o.version,
      parentVersion:basicData.version,
    }))

    // console.log(_json)
    WISHttpUtils.post("wms/poOrderPart/receiveOrderParts",{
      params:_json
    },(result)=>{
      const {code}=result;

      // console.log(result)
      if(code==200){
        Toast.success("操作成功！",1);
        that.updateFunc(odd)
      }
 
    })

  }


  render() {
    let that=this;
    let{visible,visible2,visible3,basicData,rowData,_company,_orderType,_takeState,completeList=[],waitReceivingList=[],quarantineList=[]}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {odd}=this.props.route.params.routeParams;


    
    return (
      <ScrollView style={{padding:8,backgroundColor:'#fff'}}>


        {/* <Modal
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
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>

          </ScrollView>
        </Modal> */}

        <SelectReservoir 
          data={quarantineList||[]}
          onRef={(ref)=>{ this.selectReservoirRef=ref }}
          onConfirm={(option)=>{
            that.reservoirConfirm(option)
          }}
        />


        <Modal
          title={"批量收货"}
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          footer={[
            {text:'确认',onPress:()=> this.batchTakeFunc() },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <View style={{paddingLeft:12,marginTop:38,marginBottom:22}}>
            <Text style={{fontSize:18}}>确认是否进行批量收货操作？</Text>
          </View>
        </Modal>



        {/* <Modal
          title="待检库位 (单选)"
          transparent
          onClose={()=>{
            this.setState({visible3:false})
          }}
          maskClosable
          visible={visible3}
          closable
          footer={[
            {text:'确认',onPress:()=> {
              that.quarantineChange()
            }},
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
        </Modal> */}
        
        <View style={{padding:10,borderWidth:1,borderColor:'#e6ebf1',borderRadius:6,backgroundColor:'#fff'}}>
          {/* <View style={{paddingBottom:12}}>
            <Text style={{fontSize:13,fontWeight:'600',color:"#1890ff"}}>基础信息</Text>
          </View> */}

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

          </Flex> 
          <Flex>
            <Flex.Item style={{paddingLeft:2,paddingRight:2}}>
              <Text numberOfLines={1} style={{textAlign:'left'}}>{`收货行数: ${waitReceivingList.length}/${completeList.length}`}</Text>
            </Flex.Item>
          </Flex>  
        </View>

        <View style={{height:12}}></View>


        <WisFlexTable
          title="待收货列表"
          // maxHeight={360}
          data={waitReceivingList||[]}
          onCheckedAll={(value)=> that.onCheckedAll(value) }
          renderBody={(row,index)=>{
            return (<View key={index} style={{marginBottom:16,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex >
                  <Flex.Item style={{flex:1,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    { (row.canModifReceiptQty!="0") ? 
                      <Checkbox
                        checked={row._checked}
                        onChange={event => {
                          that.checkBoxFunc(event.target.checked,index)
                        }}
                      >
                      </Checkbox>
                      :
                      <Text></Text>
                    }
                  </Flex.Item>
                  <Flex.Item style={{flex:1,paddingBottom:5,paddingLeft:6,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left',color:brandPrimary}}>{row.lineno}</Text>
                  </Flex.Item>
              
                  <Flex.Item style={{flex:10,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row._reservoirName}</Text>
                    {/* <TouchableOpacity onPress={() =>{ 
                        that.setState({
                          _pageIndex:index
                        })
                        that.selectReservoirFunc()
                      }}
                    >
                      <View style={{borderColor:'#d9d9d9',paddingLeft:6,paddingRight:6,borderWidth:1,borderRadius:6}}>
                        <Text numberOfLines={1} style={{textAlign:'left'}}>{row._reservoirName}</Text>
                      </View>
                    </TouchableOpacity> */}
                </Flex.Item>
              </Flex>
              <Flex>
                {/* <Flex.Item style={{flex:1,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{''}</Text>
                </Flex.Item>   */}
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.partNo}</Text>
                </Flex.Item>
                <Flex.Item style={{flex:12,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.partName}</Text>
                </Flex.Item>
              </Flex>
              <Flex>

              </Flex>
              <Flex>
                {/* <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text></Text>
                </Flex.Item>                 */}
                <Flex.Item style={{flex:5,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <TextInput
                    editable={( (row.canModifReceiptQty!="0")?true:false )}
                    style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderWidth:1}}
                    value={String(row._takeNumber)}
                    keyboardType={"numeric"}
                    onChangeText={text =>{ 
                      if( !isNaN(text) ){
                        this.takeChangeText(text,index,row)
                      }
                    }}
                  />               
                </Flex.Item>
                <Flex.Item style={{flex:15,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
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
                      // that.setState({visible2:true})

                      // console.log(that.state.rowData)
                      navigation.navigate('singleTake',Object.assign(
                        that.state.rowData,{
                          _odd:odd,
                          _basicData:basicData,
                          _quarantineList:quarantineList
                        }) );    

                    })

                }} style={{height:36}} size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>逐条收货</Text></Button>
              </Flex.Item>
              <Flex.Item style={{ paddingLeft:2, paddingRight:2 }}>
                <Button style={{height:36}} onPress={()=>{ 
                  if(waitReceivingList.filter(o=>o._checked).length){
                    this.setState({visible:true})
                  }else{
                    Toast.fail('未选择单据！',1);
                  }
                }} size="small" type="ghost"><Text style={{paddingTop:4,fontSize:14}}>批量收货</Text></Button>
              </Flex.Item>
          </Flex>
        <View style={{height:12}}></View>


        <WisFlexTable
          title="已收货"
          data={completeList||[]}
          renderBody={(row,index)=>{
            return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex>
                  <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left',color:"#1890ff"}}>{row.lineno}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:12,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row._reservoirName}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'center'}}>{` ${row.receivedQty}/${row.baseQty} (${row._unitName})`}</Text>
                  </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item style={{flex:10,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.partNo}</Text>
                </Flex.Item>
                <Flex.Item style={{flex:15,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.partName}</Text>
                </Flex.Item>
              </Flex>
            </View>
            )
          }}
        />

        <View style={{height:60}}>
          <Text>{" "}</Text>
        </View>
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({

});



export default createForm()(PageForm);

