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
import {brandPrimary} from './../../theme'; // 使用自定义样式


// 移库发运区
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      visible:false,


      visible2:false,
      cardText:'',

      odd:"",  // 拣货单号
      // odd:"P202206120051"


    }

  }

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;

    this.updateTable=DeviceEventEmitter.addListener('globalEmitter_update_examineForwarding_table',function(key=""){
      that.tableRef.initFunc();
      // console.log("刷新了！！！")
    });

  }

  componentWillUnmount(){
    this.updateTable.remove();

  }


  /**
   * 查询
   */
   searchFunc=()=>{
    const {odd}=this.state;

    this.tableRef.initFunc({
      params:{
        pickOrderNo:odd
      }
    });
   }


  /**
   * 移库
   * @returns 
   */
   moveFunc=()=>{
    const {navigation}=this.props;
    const _selectData=this.tableRef.getSelectData();
    const _sStorageIdList=_selectData.map(o=>o.storageId)   // 仓库ID

    if(!_selectData.length){
      Toast.fail('请选择数据！',1);
      return
    }


    if(Array.from(new Set(_sStorageIdList)).length>1){
      Toast.fail('多条移库，必须是同一个仓库！',2);
      return
    }


    navigation.navigate("shipments",{
      list:_selectData
    });

   }


  /**
   * 输入物流单号 
   */
   importLogisticsNum=()=>{
    let {navigation,form} = this.props;
    let _selectData=this.tableRef.getSelectData();


    if(!_selectData.length){
      Toast.fail('请选择数据！',1);
      return
    }


    // navigation.navigate('logisticsNum',{
    //   list:_selectData
    // }); 


    // console.log(_selectData)

    this.setState({
      visible2:true
    })
    
   }


  /**
   * 保存运输 单号
   * @returns 
   */
   saveFunc=()=>{
    const that=this;
    const {cardText}=this.state;
    let _selectData=this.tableRef.getSelectData();
    let _cardText=cardText.trim();

    if(!_cardText){
      Toast.fail('物流单号不能为空！',1);
      return
    }


    let _json=_selectData.map(o=>Object.assign({
        "id": o.ttMmPickOrderId,
        "transfOrder": _cardText,
        // "orderRemark": "备注",
        "version": o.version /*列表查询到的version*/
    }));

    // console.log(JSON.stringify(_json))
    WISHttpUtils.post("wms/pickOrder/shipment",{
      params:_json
      // hideLoading:true
    },(result) => {
      let {code}=result;

      // console.log(result)
      if(code==200){
        Toast.success("操作成功！",2);
        that.searchFunc();

        that.setState({
          visible2:false
        });
      }

    }); 

    // console.log(_selectData)
   }

  render() {
    let that=this;
    let {visible,odd,part,visible2,cardText}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');




    return (
      <ScrollView style={{paddingLeft:8,paddingRight:8,paddingTop:4}}>


        <Modal
          title="输入物流单号"
          transparent
          onClose={()=>{
            this.setState({visible2:false})
          }}
          maskClosable
          visible={visible2}
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
                placeholder="请扫描或输入 物流单号"
                onChangeText={text => this.setState({cardText:text.trim() }) }
              />  

            </View>

            <View>
              <Button style={{height:42,paddingLeft:2,paddingRight:2}} type="ghost" onPress={()=> {
                this.saveFunc();
              }}>
                <Text style={{fontSize:14}}>保存</Text>
              </Button>               
            </View>
          </ScrollView>
        </Modal>



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
                this.setState({odd:""});

                this.tableRef.initFunc();
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
              <TouchableOpacity onPress={() =>  this.searchFunc() }>
                <Icon style={{fontSize:22,color:brandPrimary}} name="search" />
              </TouchableOpacity>
            </Flex.Item>  


        </Flex>
        <View style={{height:4}}></View>          

        <Flex>
          <Flex.Item style={{flex:3,paddingRight:6}}>
            {/* <Button style={{height:36}} type="ghost" onPress={()=> { this.separateFunc()  } }><Text style={{fontSize:14}}>拆箱</Text></Button>   */}
          </Flex.Item>
          {/* <Flex.Item style={{flex:3,paddingLeft:3,paddingRight:3}}>
            <Button style={{height:36}} type="ghost" onPress={()=> { this.setState({visible2:true})  } }><Text style={{fontSize:14}}>打印装箱清单</Text></Button>  
          </Flex.Item> */}
          <Flex.Item style={{flex:3,paddingLeft:6}}>
            <Button style={{height:36}} type="ghost" onPress={()=> {  this.importLogisticsNum()  } }><Text style={{fontSize:14}}>输入物流单号</Text></Button>  
          </Flex.Item>
        </Flex>



        <WisFlexTablePage
          RequestURL="wms/pickOrder/listMove"
          Parames={{pickOrderStatus:'60'}}
          onRef={(ref)=>{ this.tableRef=ref }}
          maxHeight={height-396}
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
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>复核完成时间</Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>推荐发运区库位</Text>
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
                  <Flex.Item style={{flex:28,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.pickOrderNo }</Text>
                  </Flex.Item>
     
                             
              </Flex>
              <Flex>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.reviewEndDate}</Text>
                </Flex.Item> 
              </Flex>
              <Flex>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.locNo}</Text>
                  </Flex.Item>  
              </Flex>
            </View>
            )
          }}
        />

        <Flex style={{marginTop:12}}>
          <Flex.Item style={{flex:3,paddingRight:6}}>
            <Button type="ghost" onPress={()=> { this.moveFunc()  } }><Text style={{fontSize:14}}>移库</Text></Button>  
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

