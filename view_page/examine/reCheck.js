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
import {brandPrimary} from './../../theme'; // 使用自定义样式


// 拣货响应
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      visible:false,

      showOrder:false,
      showPart:false,


      odd:"",  // 拣货单号
      part:"",  // 零件号

      // odd:"P202206160101",  // 拣货单号
      // part:"1001060-CA02",  // 零件号
      // 1001060-CA02
      // 1001550-CA02
      // 1001560-CA03
      // 1001570-CA03
      // 1001550-CA02


      pickOrder:{},   //  基础信息
      pickOrderdList:[],   // 拣货单 table


      partList:[],   // 零件列表

    }

  }

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;


    // this.initPage();
    // 
    this.updatePage=DeviceEventEmitter.addListener('globalEmitter_examine_reCheck_update_table',function(option){
      // that.initPage(option)
      that.searchFunc();  // 搜索拣货单号

      that.setState({
        part:"",  // 零件号
        partList:[],   // 零件列表
      });
    });

  }

  componentWillUnmount(){
    this.updatePage.remove();

  }


  /**
   * 初始化
   */
   initPage=()=>{
    const that=this;
    const {odd}=this.state;
    let _odd=odd.trim();

    if(!_odd){
      Toast.fail('请扫描或输入拣货号！',1);
      return
    }

    this.setState({
      pickOrder:{},
      pickOrderdList:[]
    });


    WISHttpUtils.get(`wms/pickOrderd/getOrderDetails/${_odd}`,{
      params:{}
      // hideLoading:true
    },(result) => {
      let {code,data={}}=result;
      console.log(result)


      if(!data){
        Toast.offline("无数据！",1);
        return
      }

      if(!data.pickOrderdList){
        Toast.offline("无数据！",1);
        return
      }

      if(code==200){
        // Toast.success(`${data.message}`,1);
        that.setState({
          showOrder:true,
          showPart:false,
          partList:[],

          pickOrder:data.pickOrder||{},
          pickOrderdList:(data.pickOrderdList||[]).map(k=>Object.assign(k,{
            _checked:false
          }))
        })


      }

    });  

   }

  /**
   * 查询 拣货单号
   * @param {c} value 
   */
   searchFunc=()=>{
    const {odd}=this.state;
    this.initPage();
   }

   /**
    * 查询 零件
    */
   searchPartFunc=()=>{
    const that=this;
    const {partList,part,pickOrder}=this.state;
    let {navigation,form} = this.props;
    let _part=part.trim();

    if(!pickOrder.ttMmPickOrderId){
      Toast.fail('请先通过拣货单号过滤！',1);
      return
    }

    if(!_part){
      Toast.fail('请扫描或输入零件号"！',1);
      return
    }

    WISHttpUtils.post('wms/pickOrderd/orderDetailCheck',{
      params:{
        ttMmPickOrderId:pickOrder.ttMmPickOrderId,
        partCode:_part
      }
      // hideLoading:true
    },(result) => {
      let {code,data={}}=result;
      let _list=(data.data||[]);

      // console.log(result)

      // if(!data){
      //   Toast.offline("无数据！",1);
      //   return
      // }

      // if(!data.pickOrderdList){
      //   Toast.offline("无数据！",1);
      //   return
      // }


      // 去重  ttMmPickOrderDId
      if(code==200){
        // 去重
        // partList.filter(j=>{
        //   _list.filter(k=>k.ttMmPickOrderDId==j.)
        // })

        that.setState({
          showOrder:false,
          showPart:true,
          partList:[]
        },()=>{
          that.setState({
            partList:_list.map(o=>Object.assign(o,{
              _boxQty:o.boxQty,
              _checked:false
            }))
          });
        })



        // Toast.success(`${data.message}`,1);
        // that.setState({
        //   pickOrderdList:(data.pickOrderdList||[]).map(k=>Object.assign(k,{
        //     _checked:false
        //   }))
        // })


      }

    });  

    // navigation.navigate("part");

   }


     /**
   * 选中
  */
  cheCkquarantineFunc=(action,index)=>{
    const {partList}=this.state;

    this.setState({
      partList:partList.map((o,i)=>{
        return Object.assign(o,{_checked:(i==index)?action:o._checked})
      })
    });
  }


  /**
   * 零件 选择完成
   * @returns 
   */
   passHandle=()=>{
    let {navigation,form} = this.props;
    const {partList=[],pickOrder}=this.state;
    // let _selectData=partList.filter(o=>o._checked);

    // if(!_selectData.length){
    //   Toast.offline("未选择数据！",1);
    //   return
    // }


    navigation.navigate("logistics",{
      pickOrder:pickOrder,
      list:partList
    });

   }


  /**
   * 修改 装箱数量
   * @returns 
   */
   takeChangeText=(text,index,row)=>{
    const {partList}=this.state;


    if( !isNaN(text) ){
      // console.log( Number(text) )
      if(Number(text)>row.boxQty){
        Toast.offline("不能大于本次装箱数量！",1);
        return
      }

      this.setState({
        partList:partList.map((o,i)=>{
          return (index==i)?Object.assign(o,{_boxQty:Number(text) }):o;
        })
      })

    }

   }

  render() {
    let that=this;
    let {visible,odd,part,partList,pickOrderdList,showOrder,showPart}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');




    return (
      <ScrollView style={{paddingLeft:8,paddingRight:8,paddingTop:8}}>



        <Flex>
          <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
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
                this.setState({
                  odd:"",
                  pickOrderdList:[],   // 拣货单 table
                  pickOrder:{}
                },()=>{
                  // this.initPage();
                });
               }}>
                <Icon style={{fontSize:22}} name="delete" />
              </TouchableOpacity>
          </Flex.Item>
          <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
            <TouchableOpacity onPress={() =>  this.searchFunc() }>
              <Icon style={{fontSize:22,color:brandPrimary}} name="search" />
            </TouchableOpacity>
          </Flex.Item>          
        </Flex>
        <Flex>
            <Flex.Item style={{flex:8,borderBottomWidth:1,borderBottomColor:"#e6ebf1"}}>
              <InputItem
                value={part}
                onChange={(value) => {
                  this.setState({
                    part:value
                  })
                }}
                placeholder="请扫描或输入 零件标签号"
              >
        
              </InputItem>
            </Flex.Item>
            <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
              <TouchableOpacity onPress={() =>{ 
                this.setState({
                  part:"",
                  partList:[],   // 零件列表
                },()=>{
                  // this.searchPartFunc()
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
              <Icon style={{fontSize:22,color:brandPrimary}} name="search" />
            </TouchableOpacity>
          </Flex.Item>  

        </Flex>

        <View style={{height:6}}></View>          

        { showOrder ?
          <WisFlexTable
            // title="待收货列表"
            // maxHeight={360}
            data={pickOrderdList||[]}
            // maxHeight={height-376}
            // renderHead={()=>{
            //   return (
            //     <Flex>
            //       {/* <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
            //         <Text></Text>
            //       </Flex.Item> */}
            //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
            //         <View>
            //           <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>零件</Text>
            //         </View>
            //       </Flex.Item>
            //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
            //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>拣货数量</Text>
            //       </Flex.Item>
            //       <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
            //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>已复核数量</Text>
            //       </Flex.Item>
            //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
            //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>箱号</Text>
            //       </Flex.Item>             
            //     </Flex>
            //   )
            // }}
            renderBody={(row,index,callBack)=>{
              return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
                <Flex>
                    {/* <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                      <View>
                        <Checkbox
                          checked={row._checked}
                          onChange={event => {
                            callBack && callBack(event.target.checked,index)
                            that.cheCkquarantineFunc(event.target.checked,index)
                          }}
                        >
                        </Checkbox>
                      </View>
                    </Flex.Item> */}
                    <Flex.Item style={{flex:22,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                      <Text numberOfLines={1} style={{textAlign:'left'}}>{row.part}</Text>
                    </Flex.Item>
    
    
                    {/* <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                      <Text numberOfLines={1} style={{textAlign:'left'}}>{row.pickingMsg}</Text>
                    </Flex.Item>                                */}
                </Flex>
                <Flex>
                    <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                      <Text numberOfLines={1} style={{textAlign:'left'}}>{`拣货数量:${row.boxQty}`}</Text>
                    </Flex.Item>  
                </Flex>
                <Flex>
                  <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{`已复核数量:${row.boxedQty}`}</Text>
                  </Flex.Item>  
                </Flex>

              </View>
              )
            }}
          />
          :
          <View></View>
        }
        
        { showPart ?   
          <View>
            <WisFlexTable
              // title="待收货列表"
              // maxHeight={360}
              data={partList||[]}
              // maxHeight={height-376}
              // renderHead={()=>{
              //   return (
              //     <Flex>
              //       {/* <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              //         <Text></Text>
              //       </Flex.Item> */}
              //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              //         <View>
              //           <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>零件</Text>
              //         </View>
              //       </Flex.Item>
              //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>拣货数量</Text>
              //       </Flex.Item>
              //       <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>已复核数量</Text>
              //       </Flex.Item>
              //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>箱号</Text>
              //       </Flex.Item>             
              //     </Flex>
              //   )
              // }}
              renderBody={(row,index,callBack)=>{
                return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
                  <Flex>
                      {/* <Flex.Item style={{flex:2,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                        <View>
                          <Checkbox
                            checked={row._checked}
                            onChange={event => {
                              // callBack && callBack(event.target.checked,index)
                              this.cheCkquarantineFunc(event.target.checked,index)
                            }}
                          >
                          </Checkbox>
                        </View>
                      </Flex.Item> */}
                      <Flex.Item style={{flex:22,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                        <Text numberOfLines={1} style={{textAlign:'left'}}>{`${row.partNo}${row.partName}`}</Text>
                      </Flex.Item>
      
      
                      {/* <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                        <Text numberOfLines={1} style={{textAlign:'left'}}>{row.pickingMsg}</Text>
                      </Flex.Item>                                */}
                  </Flex>
                  {/* <Flex>
                      <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                        <Text numberOfLines={1} style={{textAlign:'left'}}>{`拣货数量:${row.boxQty}`}</Text>
                      </Flex.Item>  
                  </Flex> */}
                  <Flex> 
                    <Flex.Item style={{flex:6,flexDirection:'row',marginBottom:8}}>
                      <Text style={{marginTop:9,marginRight:6}}>本次装箱数量 </Text>
                      <TextInput
                        editable={( (row.canModifBoxQty!="0")?true:false )}
                        style={{height:38,width:120,borderColor:'#d9d9d9',borderRadius:4,borderWidth:1}}
                        value={String(row._boxQty)}
                        keyboardType={"numeric"}
                        onChangeText={text => this.takeChangeText(text,index,row)}
                      />  
                    </Flex.Item>
                    {/* <Flex.Item style={{flex:6}}>
                      <Text></Text>
                    </Flex.Item> */}
                  </Flex>

                </View>
                )
              }}
            />
            { (partList||[]).length ?
              <View style={{marginTop:6,paddingBottom:6}}>
                <Flex>
                  <Flex.Item style={{}}>
                    <Button style={{height:38}} type="ghost" onPress={()=> this.passHandle() }>完成</Button>          
                  </Flex.Item>
                </Flex>
              </View>
              :
              <View></View>
            }
          </View>
          :
          <View></View>
      }    

      <View style={{height:12}}><Text></Text></View>
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

