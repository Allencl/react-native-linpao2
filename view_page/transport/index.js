import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Modal,Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace,Flex, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat,WisFlexTable } from '@wis_component/ul';   // ul 
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

      tableList:[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
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
      that.props.form.setFieldsValue({
        odd:key,
      });

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
    
    console.log(odd)
    // console.log(  )

    // this.tableRef.initFunc({
    //   params:{
    //     lotNo:odd
    //   }
    // })
   }




  /**
   * 提交
   */
  passHandle=(value)=>{
    const that=this;
    const {navigation} = this.props;

    console.log("eerrtt")
  }  


  /**
   * 取消
   * @returns 
  */
   cancelFunc=()=>{
     console.log(1223)
   }


  render() {
    let that=this;
    let{odd,tableList,visible}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {width, height, scale} = Dimensions.get('window');
    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>

        <Modal
          title="检验完成"
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          footer={[
            {text:'确认',onPress:()=> {} },
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:380,marginTop:12,marginBottom:12}}>

          </ScrollView>
        </Modal>
       

        <View>
          <Flex>
            <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              <TextInput
                style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderBottomWidth:1}}
                value={odd}
                placeholder={"扫描或输入拣货单号"}
                onChangeText={text => that.setState({odd:text}) }
              /> 
            </Flex.Item>
            <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>

              <TouchableOpacity onPress={() =>  that.searchFunc() }>
                <Icon style={{fontSize:22,color:'blue'}} name="search" />
              </TouchableOpacity>

            </Flex.Item>
          </Flex>
        </View>





        <WisFlexTable
          // title="待收货列表"
          maxHeight={height-360}
          data={tableList||[]}
          renderHead={()=>{
            return (
              <Flex>
                <Flex.Item style={{flex:3,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text></Text>
                </Flex.Item>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <View>
                    <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>箱号</Text>
                  </View>
                </Flex.Item>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>零件</Text>
                </Flex.Item>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>发运数量</Text>
                </Flex.Item>
                <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                  <Text numberOfLines={1} style={{textAlign:'left',fontWeight:'bold'}}>物流单号</Text>
                </Flex.Item>               
              </Flex>
            )
          }}
          renderBody={(row,index)=>{
            return (<View key={index} style={{marginBottom:10,borderBottomWidth:1,borderColor:'#e6ebf1'}}>
              <Flex >
                  <Flex.Item style={{flex:1,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.lineno}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row.part}</Text>
                  </Flex.Item>
                  <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                    <Text numberOfLines={1} style={{textAlign:'left'}}>{row._reservoirName}</Text>
                  </Flex.Item>
              </Flex>

            </View>
            )
          }}
        />

        <View style={{marginTop:32,marginBottom:50}}>
          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=> this.passHandle() }>提 交</Button>          
            </Flex.Item>
            <Flex.Item style={{paddingLeft:6}}>
              <Button type="ghost" onPress={()=>{ this.cancelFunc() }}>取 消</Button>          
            </Flex.Item>
          </Flex>
        </View>  




                
      </ScrollView>
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

