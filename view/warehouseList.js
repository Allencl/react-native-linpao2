import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Modal,Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace,Flex, Toast,Button } from '@ant-design/react-native';
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


// 选择仓库
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      list:[],  // 仓库
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    const that=this;


    this.getWarehouseFunc();   // 获取仓库
    this.initFunc();

  }


  componentWillUnmount(){

    // this.getWarehouseFunc();   // 获取仓库
    // this.initFunc();

  }

  /**
   * 初始化
   */
  initFunc=()=>{
    this.getCompanyList()  // 获取所有公司
    this.getOrderType()   // 获取所有 订单类型
    this.getTakeType()   // 获取所有 收货类型
    this.getUnits()      // 获取 所有单位

    this.boxPileFunc();  // 获取箱型
  }

  /**
   * 箱型
   */
   boxPileFunc=()=>{
    WISHttpUtils.get("system/dict/data/type/boxing_type",{
      params:{
  
      },
        // hideLoading:true
    },(result)=>{
        // console.log(result)
        const {data=[]}=result;
        AsyncStorage.setItem("buffer_boxing_type",JSON.stringify(data));     
    })    
  }

    /**
     * 获取 仓库
    */
    getWarehouseFunc=()=>{

        let that=this;

        WISHttpUtils.get("system/user/selectUserStore",{
            params:{

            }
        },(result={})=>{

            const {rows=[],code}=result

            that.setState({
                list:[]
            },()=>{
                that.setState({
                    list:rows
                })
            })
        })


    }



    /**
     * 绑定 菜单
    */
    getMenuFunc=(option)=>{
        const that=this;
        const {tmBasStorageId}=option;

        WISHttpUtils.get(`system/user/selectStorage/${tmBasStorageId}`,{
            params:{

            }
        },(result)=>{
            that.getMenuData();
        })
    }

    /**
     * 获取 菜单
    */
    getMenuData=()=>{
        const that=this;
        const {navigation}=this.props

        WISHttpUtils.get(`system/menu/getRouters/A/2527`,{
            params:{
        
            }
            },(result)=>{
                const {data=[]}=result;

                // console.log(result)
              
                if(data.length){
                    let _list=(data[0]["children"])||[];
                    AsyncStorage.setItem("menu_buffer_list",JSON.stringify(_list));

                    Toast.success("进入首页！",1);
                    setTimeout(()=>{
                      navigation.navigate('Home'); 
                    },500)   
                }      
        })
    }



    /**
     * 获取 所有单位
    */
    getUnits=()=>{
        WISHttpUtils.get("system/dict/data/type/base_unit",{
            params:{
        
            },
            // hideLoading:true
        },(result)=>{
            // console.log(result)
            const {data=[]}=result;
            AsyncStorage.setItem("buffer_units",JSON.stringify(data));     
        })         
    }
    
    /**
     * 获取所有 收货类型
    */
    getTakeType=()=>{
        WISHttpUtils.get("system/dict/data/type/asn_status",{
            params:{
        
            },
            // hideLoading:true
        },(result)=>{
            // console.log(result)

            const {data=[]}=result;
            AsyncStorage.setItem("buffer_take_type",JSON.stringify(data));     
        })          
    }
    
    
    /**
     * 获取所有订单 类型
    */
    getOrderType=()=>{
        const that=this;

        WISHttpUtils.get("system/dict/data/type/po_type",{
            params:{
        
            },
            // hideLoading:true
        },(result)=>{
            // console.log(result)

            const {data=[]}=result;
            // console.log(result)
            AsyncStorage.setItem("buffer_order_type",JSON.stringify(data));     
        })  
    }


    /**
     * 获取  所有公司
     */
    getCompanyList=()=>{
        const that=this;

        WISHttpUtils.get("wms/suppl/list?status=1",{
            params:{
        
            },
            // hideLoading:true
        },(result)=>{
            // console.log(result)

            const {rows=[]}=result;
            AsyncStorage.setItem("buffer_company_list",JSON.stringify(rows));     
        })         
    }

  render() {
    let that=this;
    let{list=[]}=this.state;
    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;

    
    return (
      <ScrollView style={{paddingLeft:12,paddingRight:12,backgroundColor:"#fff"}}>

        {/* <View>

          <Flex>
            <Flex.Item style={{flex:8,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
              <TextInput
                style={{height:38,borderColor:'#d9d9d9',borderRadius:4,borderBottomWidth:1}}
                value={odd}
                placeholder={"扫描或输入 送货单/批次号"}
                onChangeText={text => that.setState({odd:text}) }
              /> 
            </Flex.Item>
            <Flex.Item style={{flex:1,paddingLeft:2,paddingRight:2}}>

              <TouchableOpacity onPress={() =>  that.searchFunc() }>
                <Icon style={{fontSize:22,color:'blue'}} name="search" />
              </TouchableOpacity>

            </Flex.Item>
          </Flex>
        </View> */}



       <View style={{marginTop:8,paddingBottom:32}}>     

            { (list||[]).map((o,i)=>{
                return (<TouchableOpacity key={String(i)} onPress={() =>  this.getMenuFunc(o) }>
                    <Flex style={{marginTop:8,marginBottom:8,paddingTop:12,paddingBottom:12,borderColor:'#1890ff',borderWidth:1,borderRadius:4}}>
                        <Flex.Item style={{flex:1,flexDirection:"row",justifyContent:'flex-end'}}>
                            <Icon name="cloud" color="#ffad33"/>
                        </Flex.Item>
                        <Flex.Item style={{flex:6}}>
                            <Text numberOfLines={1} style={{fontSize:15,paddingLeft:8}}>{`${o.storageNo}${o.storageName}`}</Text>
                        </Flex.Item>
                    </Flex>
                </TouchableOpacity>
                )})         
            }

        </View>





                
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({

});



export default createForm()(PageForm);

