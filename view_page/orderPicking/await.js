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



// 拣货响应
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      visible:false,

      odd:"",  // 拣货单号

      pageTotal:0,   // 总数

    }

  }

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;



  }

  componentWillUnmount(){

  }


  /**
   * 初始化
   */
   initPage=()=>{

   }

   /**
    * 查询
  */
  searchFunc=()=>{
    const {odd}=this.state;

    this.tableRef.initFunc({
      params:{
        // lotAndPartNo:odd.trim()
      }
    });
  }


  /**
   * 获取 选中数据
   */
  getSelectTableData=()=>{
    return this.tableRef.getSelectData();
  }


  /**
   * 响应
   * @returns 
  */
  responseFunc=()=>{
    const that=this;
    const _selectData=this.tableRef.getSelectData();


    WISHttpUtils.post("wms/pickingTask/pickingTaskResponse",{
      method:"PUT",
      params:_selectData
      // hideLoading:true
    },(result) => {
      let {code}=result;

      if(code==200){
        Toast.success("响应完成！",1);
        that.searchFunc();
      }

    });  

  } 


  /**
   * 刷新
   * @returns 
  */
  refreshFunc=()=>{
    this.searchFunc();
  }


  render() {
    let that=this;
    let {odd,visible,pageTotal}=this.state;
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
            {text:'确认',onPress:()=> {  this.responseFunc()  } },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:18,marginBottom:22}}>
              <Text style={{fontSize:18}}>确认进行响应操作？？</Text>
            </View>
          </ScrollView>
        </Modal>


        <View>
          <Flex>
            <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              <TextInput
                style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderBottomWidth:1}}
                value={odd}
                placeholder={"请扫描或输入 拣货单"}
                onChangeText={text => this.setState({odd:text}) }
              /> 
            </Flex.Item>

            <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
              <TouchableOpacity onPress={() =>{ 
                this.setState({odd:""},()=>{
                  this.searchFunc();
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
        </View>



        <Flex>
          <Flex.Item style={{flex:6}}>
            <Text style={{fontSize:32,textAlign:'center'}}>{pageTotal}</Text>
          </Flex.Item>
          <Flex.Item style={{flex:3,paddingRight:6}}>
            <Button style={{height:36}} type="ghost" onPress={()=> {   
              const _selectData=this.tableRef.getSelectData();
              if(!_selectData.length){
                Toast.success("请选择数据！",1);
                return
              }
              this.setState({visible:true})
            }}><Text style={{fontSize:14}}>响应</Text></Button>  
          </Flex.Item>
          {/* <Flex.Item style={{flex:3,paddingLeft:6}}>
            <Button style={{height:36}} type="ghost" onPress={()=> { this.refreshFunc()  } }><Text style={{fontSize:14}}>刷新</Text></Button>  
          </Flex.Item> */}
        </Flex>

        <WisFlexTablePage
          RequestURL="wms/pickingTask/list"
          Parames={{taskStatus:0}}
          onRef={(ref)=>{ this.tableRef=ref }}
          maxHeight={height-300}
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
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>拣货单</Text>
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

