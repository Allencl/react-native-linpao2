import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Flex,Checkbox,Modal,Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisInputSN} from '@wis_component/ul';
import {WisSelectFlex} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址


// 请指定发货区存放库位
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={

      storageList:[],  //库位
      realStorageList:[],  // 实际库位

      

      storageForm:[],  // 库位表单值
      realStorageForm:[],  // 库位表单值


        code:"1",  // 待发运库位
        storage:"",  // 实际待发运库位

        check:false,   // 是否自提
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;

    // this.initFunc();
    this.getStorageListFunc()
    
  }


  componentWillUnmount(){

  }


  /**
   * 初始化
   */
  initFunc=()=>{
    // const {list=[]}=this.props.route.params.routeParams;
    // let _row=list[0];
    // console.log(list)

    // this.setState({
    //   code:_row.locNo,  // 待发运库位
    //   storage:_row.locNo,  // 实际待发运库位
    // })
  }


  /**
   * 获取 库位
  */
  getStorageListFunc=()=>{
    const that=this;
    const {list=[]}=this.props.route.params.routeParams;
    let _json=list[0];

    WISHttpUtils.get('wms/loc/list',{
      params:{
        // storageId:list[0]["deliveryLocId"],
        storageId:_json["storageId"],
        status:"1",
        dlocType:"9"
      }
    },(result)=>{
      const {rows=[]}=result;
      let _row=rows.map(o=>Object.assign({_name:`${o.locNo}-${o.locName}`,id:o.tmBasLocId}));
      let _formValue=_row.filter(k=>k.id==_json.deliveryLocId);


      that.setState({
        storageList:_row,
        realStorageList:_row
      });

      that.props.form.setFieldsValue({
        "storageForm":_formValue,
        "realStorageForm":_formValue,
      });

    })

  }


  /**
   * 确定
  */
   confirmHandle=()=>{
    const that=this;
    const {check}=this.state;
    const {navigation} = this.props;
    const {list=[]}=this.props.route.params.routeParams;



    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)

          
        if(!value["realStorageForm"].length){
            Toast.fail('实际待发运库位为空！',1);
            return
          }

      } else{
        let _ids=list.map(k=>k.ttMmPickOrderId);
  
        let _json={
          "deliveryLocid": value["realStorageForm"][0].id,
          "ttMmPickOrderIds": _ids
        }


        // console.log(_json)

        WISHttpUtils.post("wms/pickOrder/moveLoc",{
          params:_json
          // hideLoading:true
        },(result) => {
          let {code}=result;

          // console.log(result)
          if(code==200){
            Toast.success("检验完成！",1);
            navigation.navigate("examine");
            DeviceEventEmitter.emit('globalEmitter_update_examineForwarding_table');
          }

        });  


        

      }
    });
  }  


  /**
   * 取消
   * @returns 
   */
   cancelFunc=()=>{
    let {navigation,form} = this.props;

    navigation.navigate("examine");

   }

  render() {
    let that=this;
    const {
      storageList,
      realStorageList,

      storageForm,
      realStorageForm,

        check
    }=this.state;

    let {visible,visible3}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>


        <View style={{marginTop:22}}>


          <WisSelectFlex 
            form={form} 
            name="storageForm"
            {...getFieldProps('storageForm',{
              rules:[{required:false }],
              initialValue:[]
            })} 
            error={getFieldError('storageForm')}  
            title="待发运库位（单选）"             
            lableName="待发运库位"
            textFormat={o=>o._name}
            labelFormat={o=>o._name}
            onChangeValue={(_list)=>{
              // that.reservoirChange(_list);
            }}
            onCleanValue={()=>{
              // this.cleanReservoirChange()
            }}
            data={storageList}
            disabled
          />

          <WisSelectFlex 
            form={form} 
            name="realStorageForm"
            requiredSign={true}
            {...getFieldProps('realStorageForm',{
              rules:[{required:true }],
              initialValue:[]
            })} 
            error={getFieldError('realStorageForm')}  
            title="实际待发运库位（单选）"             
            lableName="实际待发运库位"
            textFormat={o=>o._name}
            labelFormat={o=>o._name}
            onChangeValue={(_list)=>{
              // that.reservoirChange(_list);
            }}
            onCleanValue={()=>{
              this.props.form.setFieldsValue({
                "realStorageForm":[]
              });
            }}
            data={realStorageList}
            
          />         

            {/* <View style={{marginTop:18}}>
                <Checkbox
                    checked={check}
                    // style={{marginTop:12}}
                    onChange={event => {
                      this.setState({ check: event.target.checked });
                    }}
                >
                    <Text style={{fontSize:16,paddingLeft:6,color:"#000000d9"}}>是否自提</Text>
                </Checkbox>
            </View> */}
            
        </View>


        <View style={{marginTop:32,marginBottom:50}}>
          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=>{ this.confirmHandle() }}>确认移库</Button>          
            </Flex.Item>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=>{ this.cancelFunc() }}>取消</Button>          
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

