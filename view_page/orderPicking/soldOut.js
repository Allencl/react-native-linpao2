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


// 移复检区
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      visible:false,
      visible2:false,
      visible3:false,

      cardText:'',  // 绑定小车


      pageTotal:0,   // 总数



    }

  }

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;



    // 刷新table    
    this.updataList =DeviceEventEmitter.addListener('globalEmitter_updata_orderPicking_soldOut_table',function(){
      that.tableRef.initFunc();

      console.log("APP-----------33333")

    });

  }

  componentWillUnmount(){
    this.updataList.remove();
  }


  /**
   * 初始化
   */
   initPage=(data=[])=>{
    // let _json=data[0];

    // WISHttpUtils.post("wms/pickingTask/selPickOffTheShelfStatus",{
    //   params:_json
    //   // hideLoading:true
    // },(result) => {
    //   let {code}=result;

    //   if(code==200){
    //     console.log(result)

    //   }

    // });  

   }


  /**
   * 拣货
   * @returns 
  */
  orderPickingFunc =()=>{
    let {navigation,form} = this.props;
    let _selectData= this.tableRef.getSelectData();

    if(!_selectData.length){
      Toast.offline("未选择数据！",1);
      return
    }

    if(_selectData.length>1){
      Toast.offline("只能选择一条数据！",1);
      return
    }



    WISHttpUtils.post("wms/pickingTask/selPickOffTheShelfStatus",{
      params:_selectData[0]
      // hideLoading:true
    },(result) => {
      let {code}=result;

      if(code==200){
        navigation.navigate("logisticWorker",{
          row:_selectData[0]
        });
      }

    });  

    
    

  } 


  /**
   * 取消响应
   * @returns 
  */
   responseCancel=()=>{
    let {navigation,form} = this.props;
    const _selectData=this.tableRef.getSelectData();

    // console.log(_selectData)
    // return
    // if(!_selectData.length){
    //   Toast.fail('请至少选择一条数据！',1);
    //   return
    // }
    navigation.navigate("cancelResponse",{
      data:_selectData
    });


  }


  /**
   * 小车 拣货
   * @returns 
   */
  cardOrderPicking=()=>{
    const that=this;
    let {navigation,form} = this.props;
    let _selectData= this.tableRef.getSelectData();


    if(!_selectData.length){
      Toast.offline("未选择数据！",1);
      return
    }


    this.setState({
      cardText:'',
      visible:true
    })
    // navigation.navigate("carBinding",{
    //   data:_selectData
    // });

  }


  /**
   * 绑定小车  
   * @returns 
  */
  bindingCardFunc=()=>{
    const that=this;
    const {cardText}=this.state;

    if(!cardText){
      Toast.offline("小车号不能为空！",1);
      return
    }


    WISHttpUtils.get(`wms/appliance/appBindingSelect/${cardText}`,{
      params:{
        // carUtensilNo:value["code"].trim()
      }
      // hideLoading:true
    },(result) => {
      let {stateCode,data}=result;


      if(stateCode==20){
        Toast.fail(`[${value["code"]}]已被其他人绑定了！`,1);
      }

      if(stateCode==10 || stateCode==30){
        that.bindingCardSubmit(data,cardText);
      }

    });  


  }

  /**
   * 绑定小车  提交
   * @returns 
  */
  bindingCardSubmit=(option={},_odd)=>{
    const that=this;
    let {navigation,form} = this.props;
    let _selectData= this.tableRef.getSelectData();


    // console.log(
    //   {
    //     pickings:_selectData,     //[选中列表数据]
    //     appliance:option,  // 返回的数据
    //   }
    // )

    // 绑定小车
    WISHttpUtils.post("wms/pickingTask/bdApplianceSelect",{
      method:"PUT",
      params:{
        pickings:_selectData,     //[选中列表数据]
        appliance:option,  // 返回的数据
      }
      // hideLoading:true
    },(result) => {
      let {code}=result;

      // console.log(77777);
      // console.log(result);
      if(code==200){
        Toast.success("绑定完成！",1);
        // DeviceEventEmitter.emit('globalEmitter_updata_orderPicking_soldOut_table');
        that.tableRef.initFunc();

        that.setState({visible:false})

        navigation.navigate("cardPicking",{
          odd:_odd,
          list:_selectData
        });
      }
    }); 
  }

  render() {
    let that=this;
    let {visible,visible2,visible3,pageTotal,cardText}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');




    return (
      <ScrollView style={{paddingLeft:8,paddingRight:8,paddingTop:16}}>


        <Modal
          title="绑定小车"
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          // footer={[
          //   {text:'确认',onPress:()=> {  
          //     return false
          //   }},
          //   {text:'取消',onPress:()=>{}}
          // ]}
        >
          <ScrollView>
            <View style={{marginTop:18,marginBottom:22}}>

              <TextInput
                // editable={( (row.canModifReceiptQty!="0")?true:false )}
                style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderWidth:1}}
                value={String(cardText)}
                // keyboardType={"numeric"}
                placeholder="请扫描或输入 小车号"
                onChangeText={text => this.setState({cardText:text.trim() }) }
              />  

            </View>

            <View>
              <Button style={{height:42,paddingLeft:2,paddingRight:2}} type="ghost" onPress={()=> {
                this.bindingCardFunc();
              }}>
                <Text style={{fontSize:14}}>绑定小车</Text>
              </Button>               
            </View>
          </ScrollView>
        </Modal>





        <Flex>
          <Flex.Item style={{flex:3}}>
            <Text style={{fontSize:32,textAlign:'center'}}>{pageTotal}</Text>
          </Flex.Item>
          <Flex.Item style={{flex:3,paddingRight:0}}>
            <Button style={{height:36,paddingLeft:2,paddingRight:2}} type="ghost" onPress={()=> {
              this.orderPickingFunc()

            }}><Text style={{fontSize:14}}>拣货</Text></Button>          
          </Flex.Item>
          <Flex.Item style={{flex:3,paddingLeft:6}}>
            <Button style={{height:36,paddingLeft:2,paddingRight:2}} type="ghost" onPress={()=>{
              this.cardOrderPicking();
            }}><Text style={{fontSize:14}}>小车拣货</Text></Button>          
          </Flex.Item>
          <Flex.Item style={{flex:3,paddingLeft:6}}>
            <Button style={{height:36,paddingLeft:2,paddingRight:2}} type="ghost" onPress={()=>{ this.responseCancel() }}><Text style={{fontSize:14}}>取消响应</Text></Button>          
          </Flex.Item>
        </Flex>
        {/* <View style={{height:2}}></View> */}


        <WisFlexTablePage
          RequestURL="wms/pickingTask/list"
          Parames={{taskStatus:10}}
          onRef={(ref)=>{ this.tableRef=ref }}
          maxHeight={height-306}
          onInitHandle={(result)=>{
            this.setState({pageTotal:result.total})
            // console.log(result.total)
          }}
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
          //       <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>计划数量</Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>拣货库位</Text>
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
                          callBack && callBack(event.target.checked,index)
                          // that.cheCkquarantineFunc(event.target.checked,i)
                        }}
                      >
                      </Checkbox>
                    </View>
                  </Flex.Item>                
                  <Flex.Item style={{flex:19,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.taskNo}</Text>
                  </Flex.Item>
   
                  <Flex.Item style={{flex:16,flexDirection:'row',paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text>计划数量: </Text>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.taskPickingNumber}</Text>
                  </Flex.Item> 
                              
              </Flex>
              <Flex>
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.part}</Text>
                  </Flex.Item>  
              </Flex>
              <Flex>
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.locPName}</Text>
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

