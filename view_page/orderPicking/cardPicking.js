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


// 小车拣货
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
      visible:false,
      visible2:false,
      visible3:false,


      tableList:[],   // 

    }

  }

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;

    this.initPage();


    this.updatePage=DeviceEventEmitter.addListener('globalEmitter_update_cardPicking',function(){
      // console.log("刷新了2111！！！！")
      that.initPage();
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
    // 
    // console.log(555);

    WISHttpUtils.post("wms/pickingTask/selectByTaskStatus",{
      params:["0","10"]
      // hideLoading:true
    },(result) => {
      let {code,rows}=result;

      // console.log(77777);
      // console.log(result);
      if(code==200){
        that.setState({tableList:rows})
      }
    }); 


   }


  /**
   * 响应
   * @returns 
  */
  responseFunc=()=>{
    console.log('响应')
  } 


  /**
   * 刷新
   * @returns 
  */
  refreshFunc=()=>{
    this.tableRef.initFunc();
  }


  /**
   * 开始拣货 
   * @returns 
   */
  beginFunc=()=>{
    const {navigation,form} = this.props;
    const {list=[]}=this.props.route.params.routeParams;


    // console.log("2222")
    // console.log(list)
    // console.log(JSON.stringify(list))


    // return
    // WISHttpUtils.post("wsm/pickingTask/newPickingOffTheShelf",{
    //   params:{}
    //   // hideLoading:true
    // },(result) => {
    //   let {code,rows=[]}=result;

    //   // console.log(77777);
    //   console.log(result);
    //   if(code==200){

    //   }
    // }); 
    navigation.navigate("logisticWorker",{
      active:"startPicking"
    });
  }

  /**
   * 切换 小车   
   * @returns 
   */
   changeCardFunc=()=>{
    const {navigation,form} = this.props;

    navigation.navigate("carBinding");
    DeviceEventEmitter.emit('globalEmitter_clean_cardValue');
  }

  /**
   * 移动至  复核区
   * @returns 
  */
  moveFunc=()=>{
    const {navigation,form} = this.props;

    navigation.navigate("orderPicking");
    DeviceEventEmitter.emit('globalEmitter_orderPicking_change_tabsPage',2);

    setTimeout(()=>{
      DeviceEventEmitter.emit('globalEmitter_updata_orderPicking_recheck');
    },200)

  }


  render() {
    let that=this;
    let {visible,visible2,visible3,tableList}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');
    const {odd}=this.props.route.params.routeParams;





    return (
      <ScrollView style={{paddingLeft:8,paddingRight:8,paddingTop:16,backgroundColor:'#fff'}}>


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
            {text:'确认',onPress:()=> { }},
            {text:'取消',onPress:()=>{ }}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:18,marginBottom:22}}>
              <Text style={{fontSize:18}}>开始拣货？</Text>
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
            {text:'确认',onPress:()=> { }},
            {text:'取消',onPress:()=>{ }}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:18,marginBottom:22}}>
              <Text style={{fontSize:18}}>切换小车？</Text>
            </View>
          </ScrollView>
        </Modal>

        <Modal
          title="确认"
          transparent
          onClose={()=>{
            this.setState({visible3:false})
          }}
          maskClosable
          visible={visible3}
          closable
          footer={[
            {text:'确认',onPress:()=> { }},
            {text:'取消',onPress:()=>{ }}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:18,marginBottom:22}}>
              <Text style={{fontSize:18}}>移动至复核区？</Text>
            </View>
          </ScrollView>
        </Modal>

        <Flex style={{marginBottom:16}}>
          <Flex.Item>
            <Text>{`小车号或器具号:${odd}`}</Text>
          </Flex.Item>
          <Flex.Item>
            <Text style={{textAlign:'right'}}>{`已拣行数:${tableList.length}`}</Text>
          </Flex.Item>          
        </Flex>


        <Flex style={{marginBottom:12}}>
          <Flex.Item style={{flex:10,paddingLeft:3,paddingRight:3}}>
            <Button style={{height:36}} type="ghost" onPress={()=> { this.beginFunc()   }}><Text style={{fontSize:14}}>开始拣货</Text></Button>  
          </Flex.Item>
          <Flex.Item style={{flex:10,paddingLeft:3,paddingRight:3}}>
            <Button style={{height:36}} type="ghost" onPress={()=> { this.changeCardFunc()  }}><Text style={{fontSize:14}}>切换小车</Text></Button>  
          </Flex.Item>
          <Flex.Item style={{flex:12,paddingLeft:3,paddingRight:3}}>
            <Button style={{height:36}} type="ghost" onPress={()=> { this.moveFunc() }}><Text style={{fontSize:14}}>移至复核区</Text></Button>  
          </Flex.Item>
        </Flex>

        <WisFlexTable
          title="小车拣货记录行"
          // maxHeight={360}
          data={tableList||[]}
          onRef={(ref)=>{ this.tableRef=ref }}
          // maxHeight={height-376}
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
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>拣货时间</Text>
          //       </Flex.Item>             
          //     </Flex>
          //   )
          // }}
          renderBody={(row,index,callBack)=>{
            return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex>
                  {/* <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
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
                  </Flex.Item>                 */}
                  <Flex.Item style={{flex:20,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.taskNo||''}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:6,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{String(row.taskPickingNumber||'')}</Text>
                </Flex.Item>  
              </Flex>
              <Flex>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{row.part||''}</Text>
                </Flex.Item>  
              </Flex>

              <Flex>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left'}}>{String(row.pickingTaskCreateTime||'')}</Text>
                </Flex.Item>  
              </Flex>
            </View>
            )
          }}
        />


        <View heigh={{height:20}}>
          <Text></Text>
        </View>

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

