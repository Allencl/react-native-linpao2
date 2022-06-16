import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Checkbox,Modal,Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace,Flex, Toast,Button } from '@ant-design/react-native';
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


// 发运
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      odd:"",   // 单号
      visible:false,

    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;




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
      // that.setState({odd:key})

    });

  }


  componentWillUnmount(){
    this.honeyWell.remove();

  }


  /**
   * 查询
   * @param {c} value 
   */
   searchFunc=()=>{
    const {odd}=this.state;
    
    // console.log(odd)
    // console.log(  )

    this.tableRef.initFunc({
      params:{
        pickOrderNo:odd
      }
    })
   }




  /**
   * 提交
   */
  passHandle=(value)=>{
    const that=this;
    const {navigation} = this.props;
    const _selectData=this.tableRef.getSelectData();
    let _list=_selectData.map(o=>Object.assign({pickOrderNo:o.pickOrderNo}));

    if(!_selectData.length){
      Toast.fail('请选择数据！',1);
      return
    }


    WISHttpUtils.post("wms/pickOrder/shipment",{
      params:_list
      // hideLoading:true
    },(result) => {
      let {code}=result;

      // console.log(result)
      if(code==200){
        Toast.success("发运完成！",1);
        that.tableRef.initFunc();
      }

    });  



  }  


  /**
   * 取消
   * @returns 
  */
   cancelFunc=()=>{
    //  console.log(1223)
   }


  render() {
    let that=this;
    let{odd,visible}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {width, height, scale} = Dimensions.get('window');
    

    return (
      <View style={{padding:8,backgroundColor:"#fff"}}>

        <Modal
          title="发运确认"
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          footer={[
            {text:'确认',onPress:()=> {  this.passHandle() } },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>
            <View style={{paddingLeft:12,marginTop:28,marginBottom:22}}>
              <Text style={{fontSize:18}}>确认发运？</Text>
            </View>
          </ScrollView>
        </Modal>
       

        <View>
          <Flex>
            <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              <TextInput
                style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderBottomWidth:1}}
                value={odd}
                placeholder={"扫描或输入 拣货单号"}
                onChangeText={text => that.setState({odd:text}) }
              /> 
            </Flex.Item>
            <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>
              <TouchableOpacity onPress={() =>{ 
                this.setState({odd:""});

                this.tableRef.initFunc({
                  params:{
                    pickOrderNo:""
                  }
                })

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


        <WisFlexTablePage
          RequestURL="wms/boxingInfo/list"
          Parames={{pickOrderStatus:'1'}}
          maxHeight={200}
          onRef={(ref)=>{ this.tableRef=ref }}
          // renderHead={()=>{
          //   return (
          //     <Flex>
          //       <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text></Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <View>
          //           <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>箱号</Text>
          //         </View>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>零件</Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>发运数量</Text>
          //       </Flex.Item>
          //       <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
          //         <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>物流单号</Text>
          //       </Flex.Item>               
          //     </Flex>
          //   )
          // }}
          renderBody={(row,index,callBack)=>{
            return (<View key={index} style={{paddingTop:4,paddingBottom:4,marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex>
                  <Flex.Item style={{flex:3,paddingLeft:2,paddingRight:2}}>
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
                  <Flex.Item style={{flex:26}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.boxNo}</Text>
                  </Flex.Item>                                       
              </Flex>
              <View style={{height:2}}></View>
              <Flex>
                <Flex.Item>
                  <Text numberOfLines={1}>{row.part}</Text>
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item>
                  <Text numberOfLines={1}>{String(row.qty)}</Text>
                </Flex.Item>
                <Flex.Item>
                  <Text numberOfLines={12}>{row.transfOrder}</Text>
                </Flex.Item>
              </Flex>
            </View>
            )
          }}
        />

        <View style={{marginTop:32,marginBottom:50}}>
          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=> this.passHandle() }>发运</Button>          
            </Flex.Item>
            {/* <Flex.Item style={{paddingLeft:6}}>
              <Button type="ghost" onPress={()=>{ this.cancelFunc() }}>取 消</Button>          
            </Flex.Item> */}
          </Flex>
        </View>  




                
      </View>
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

