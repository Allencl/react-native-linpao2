import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Flex,Modal,Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisInputSN} from '@wis_component/ul';
import {WisFormPhoto} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址


// 绑定小车
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={

      code:"",  // 小车编号
     

    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;



    this.updateCard=DeviceEventEmitter.addListener('globalEmitter_clean_cardValue',function(){
      that.props.form.setFieldsValue({
        "code":""
      });
    });

  }


  componentWillUnmount(){
    this.updateCard.remove();
  }


  /**
   * 初始化
   * @param {*} value 
   */
  initFunc=()=>{
    // const {}=this.props.route.params.routeParams;

    // console.log(row)
    // this.setState({
    //   code:"1",  
    //   name:"1",   
    //   planNum:"1",  
    //   orderNum:"1", 
    //   storage:"1",  
    //   realStorage:"1",  
    // })
  }


  /**
   * 刷新数据
   */
  updatePage=()=>{
    const that=this;

    WISHttpUtils.get("wms/pickingTask/list",{
      params:{

      },
      // hideLoading:true
    },(result) => {
      let {code}=result;

      // console.log(77777);
      // console.log(result);
      if(code==200){
        that.confirmHandle()
      }
    }); 

  }


  /**
   * 绑定校验
  */
   confirmHandle=()=>{
    const that=this;
    const {navigation} = this.props;


    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)

        if(!value["code"]){
          Toast.fail('小车编号不能为空！',1);
          return
        }
      } else{ 
        
        // navigation.navigate("cardPicking");

        // let _json=Object.assign(row,{
        //     acceptsQty:_acceptsQty,
        //     concessionQty:_concessionQty,
        //     concessionReason:value.concessionText,
        //     unacceptsQty:_unacceptsQty,
        //     unacceptsReason:value.disqualificationText
        // })

        // console.log(55555);

        let _odd=value["code"].trim();

        WISHttpUtils.get(`wms/appliance/appBindingSelect/${_odd}`,{
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
            that.bindingCard(data,_odd);
          }

        });  

      }
    });
  }  


  /**
   * 绑定
   * @returns 
   */
   bindingCard=(result={},_odd)=>{
    const {data=[]}=this.props.route.params.routeParams;
    let {navigation,form} = this.props;

    // console.log(
    //   {
    //     pickings:data,     //[选中列表数据]
    //     appliance:result,  // 返回的数据
    //   }
    // )
    WISHttpUtils.post("wms/pickingTask/bdApplianceSelect",{
      method:"PUT",
      params:{
        pickings:data,     //[选中列表数据]
        appliance:result,  // 返回的数据
      }
      // hideLoading:true
    },(result) => {
      let {code}=result;

      // console.log(77777);
      // console.log(result);
      if(code==200){
        Toast.success("绑定完成！",1);
        navigation.navigate("cardPicking",{
          odd:_odd,
          list:data
        });
      }
    }); 
   
   
   }


   /**
    * 绑定  小车
    * @returns 
    */
  aaaaa=()=>{
 
  } 


  render() {
    let that=this;
    const {
      code,  
    }=this.state;
    let {visible,visible3}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>


        <View style={{marginTop:22}}>

            <WisInput  
              form={form} 
              name="code"   
              requiredSign={true}
              {...getFieldProps('code',{
                  rules:[{required:true}],
                  initialValue:code
              })} 
              placeholder="扫描或输入 小车号"
              error={getFieldError('code')}               
              // lableName="小车号"
              
            /> 
            
        </View>


        <View style={{marginTop:32,marginBottom:50}}>
          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=>{ this.updatePage() }}>确定</Button>          
            </Flex.Item>
            <Flex.Item style={{paddingLeft:6}}>
              <Button type="ghost" onPress={()=>{ 
                navigation.navigate("orderPicking");
                DeviceEventEmitter.emit('globalEmitter_updata_orderPicking_soldOut_table');
               }}>取消</Button>          
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

