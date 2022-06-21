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
import {WisSelectFlex} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址


// 物料信息
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
        packaging:[],    // 包装
        longNum:"",   // 长    
        widthNum:"",   // 宽
        heightNum:"",  // 高
        weight:"",     // 重量
        code:"",  // 物料单号
     


        packagingList:[],   // 包装数据
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
    this.packagingListFunc();
  }


  componentWillUnmount(){

  }

  /**
   * 初始化
   */
  initFunc=()=>{
    const {list=[]}=this.props.route.params.routeParams;

    console.log("asas-1111")
    console.log(list)
  }

  /**
   * 获取包装数据
  */
  packagingListFunc=()=>{
    const that=this;
    const {list=[]}=this.props.route.params.routeParams;


      WISHttpUtils.get('wms/package/list?status=1',{
        params:{

        }
      },(result)=>{
          const {rows=[]}=result;
          let _list=rows.map(o=>Object.assign({_name:`${o.packageNo}-${o.packageName}`,id:o.tmBasPackageId}));

          that.setState({
            packagingList:_list
          });

          that.props.form.setFieldsValue({
            "packaging":_list.filter(j=>j.id==list[0]["tmBasPackageId"]) 
          }); 
          
      })

  }



  /**
   * 确定
  */
   confirmHandle=()=>{
    const that=this;
    const {navigation} = this.props;
    const {list=[],pickOrder={}}=this.props.route.params.routeParams;



    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        // Toast.fail('必填字段未填！');
        // console.log(error)

        if(!value["longNum"]){
          Toast.fail('长不能为空！',1);
          return
        }

        if(!value["widthNum"]){
            Toast.fail('宽不能为空！',1);
            return
        }

        if(!value["heightNum"]){
            Toast.fail('高不能为空！',1);
            return
        }    
        
        if(!value["weight"]){
            Toast.fail('重量不能为空！',1);
            return
        }          


      } else{

        let _longNum=Number(value["longNum"]);
        let _widthNum=Number(value["widthNum"]);
        let _heightNum=Number(value["heightNum"]);
        let _weight=Number(value["weight"]);


        if(!_longNum || (!Number.isInteger(_longNum)) ){
            Toast.fail('长必须是大于0的整数！',1);
            return
        }

        if(!_widthNum || (!Number.isInteger(_widthNum)) ){
            Toast.fail('宽必须是大于0的整数！',1);
            return
        }

        if(!_heightNum || (!Number.isInteger(_heightNum)) ){
            Toast.fail('高必须是大于0的整数！',1);
            return
        }

        if(!_weight || (!Number.isInteger(_weight)) ){
            Toast.fail('重量必须是大于0的整数！',1);
            return
        }

        // 求和
        function sum(arr) {
          var s = 0;
          arr.forEach(function(val, idx, arr) {
            s += val;
          }, 0);
          return s;
        };
        const _partNoList=list.map(o=>o.partNo)   // partNo

        let _jsonList=[{
          "boxNum": "1",
          "hight": _heightNum,
          "items": list.map(g=>Object.assign({
            boxQty:g._boxQty,
            ttMmPickOrderDId:g.ttMmPickOrderDId,
            version:g.version
          })),
          "tmBasPackageId": value["packaging"][0]["id"],
          "weight": _weight,
          "width": _widthNum,
          "length": _longNum,
          "parentVersion": pickOrder.version,
          "singlePacQty": sum(list.map(p=>p._boxQty)),
          "ttMmPickOrderId": pickOrder.ttMmPickOrderId,
          "varietyQty": Array.from(new Set(_partNoList)).length
        }];


        // console.log( pickOrder )
        // console.log(_jsonList)
        // return
        WISHttpUtils.post("wms/pickOrderd/orderPartsReviewBoxing",{
          params:_jsonList
          // hideLoading:true
        },(result) => {
          let {code}=result;

          // console.log(result)
          if(code==200){
            Toast.success("操作成功！",1);

            navigation.navigate("examine");
            DeviceEventEmitter.emit('globalEmitter_examine_reCheck_update_table');
          }

        });  











      }
    });
  }  





  render() {
    let that=this;
    const {
        packaging,
        longNum,     
        widthNum,   
        heightNum,  
        weight,     
        code,  
    }=this.state;
    const {packagingList}=this.state;
    let {visible,visible3}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>


        <View style={{marginTop:2}}>


            <WisSelectFlex 
                form={form} 
                name="packaging"
                {...getFieldProps('packaging',{
                rules:[{required:false }],
                initialValue:[]
                })} 
                error={getFieldError('packaging')}  
                title="使用包装（单选）"             
                lableName="使用包装"
                textFormat={o=>o._name}
                labelFormat={o=>o._name}
                onChangeValue={(_list)=>{
                    // that.warehouseChange(_list);
                }}
                data={packagingList}
            />

            <WisInput  
              form={form} 
              name="longNum"   
              requiredSign={true}
              type="number"
              {...getFieldProps('longNum',{
                  rules:[{required:true}],
                  initialValue:longNum
              })} 
              placeholder="请输入大于0的整数"
              error={getFieldError('longNum')}               
              lableName="长"
            /> 

            <WisInput  
              form={form} 
              name="widthNum"   
              requiredSign={true}
              type="number"
              {...getFieldProps('widthNum',{
                  rules:[{required:true}],
                  initialValue:widthNum
              })} 
              placeholder="请输入大于0的整数"
              error={getFieldError('widthNum')}               
              lableName="宽"
            />  

            
            <WisInput  
              form={form} 
              name="heightNum"   
              requiredSign={true}
              type="number"
              {...getFieldProps('heightNum',{
                  rules:[{required:true}],
                  initialValue:heightNum
              })} 
              placeholder="请输入大于0的整数"
              error={getFieldError('heightNum')}               
              lableName="高"
            /> 

            <WisInput  
              form={form} 
              name="weight"   
              requiredSign={true}
              type="number"
              {...getFieldProps('weight',{
                  rules:[{required:true}],
                  initialValue:weight
              })} 
              placeholder="请输入大于0的整数"
              error={getFieldError('weight')}               
              lableName="重量(KG)"
            />    

            {/* <WisInput  
              form={form} 
              name="code"   
              {...getFieldProps('code',{
                  rules:[{required:false}],
                  initialValue:code
              })} 
              error={getFieldError('code')}               
              lableName="物流单号"
            />              */}

            
        </View>


        <View style={{marginTop:32,marginBottom:50}}>
          <Flex>
            <Flex.Item style={{paddingRight:6}}>
              <Button type="ghost" onPress={()=>{ this.confirmHandle() }}>复核完成并打印装箱单</Button>          
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

