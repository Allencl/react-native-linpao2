import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet,DeviceEventEmitter, ScrollView, View,Text,TextInput, Image,NativeModules,PermissionsAndroid   } from 'react-native';
import { Flex,Checkbox,Icon,InputItem,WingBlank,Modal, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import RNFS from "react-native-fs";


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross,WisInputSN,WisBluetooth} from '@wis_component/ul';
import {WisFormPhoto} from '@wis_component/form';   // form 
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {origin} from '@wis_component/origin';     // 服务地址


// 库区下拉
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={
        visible:false,  
        quarantineList:[],  // 库位数据
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentWillMount(){

  }

  componentDidMount(){
    let that=this;



  }


  componentWillUnmount(){
 
  }

  /**
   * 打开 弹框
   * @param {*} value 
   */
  openModle=()=>{
    const {data}=this.props;

    this.setState({
        visible:true,
        quarantineList:data.map(o=>Object.assign(o,{_checked:false}))
    })
  }




  /**
   * 库区选择 切换
   */
   cheCkquarantineFunc=(value,index)=>{
        const that=this;
        const {quarantineList}=this.state;

        this.setState({
            quarantineList:[]
        },()=>{
            that.setState({
                quarantineList:quarantineList.map((o,i)=>Object.assign(o,{_checked:(i==index)?(!value._checked):false}))
            })
        })
    }

    /**
     * 选中 库区
     */
    quarantineChange=()=>{
        const {onConfirm}=this.props;
        const {quarantineList}=this.state;

        let _selectObj=quarantineList.filter(o=>o._checked)[0];

        _selectObj && onConfirm && onConfirm(_selectObj)
    }



  render() {
    let that=this;
    let {quarantineList=[],visible}=this.state;
    let {navigation} = this.props;


    
    return (
        <Modal
          title="待检库位 (单选)"
          transparent
          onClose={()=>{
            this.setState({visible:false})
          }}
          maskClosable
          visible={visible}
          closable
          footer={[
            {text:'确认',onPress:()=> {
              that.quarantineChange()
            }},
            {text:'取消',onPress:()=>{}}
          ]}
        >
          <ScrollView style={{maxHeight:220,paddingTop:22}}>
            { quarantineList.map((o,i)=>{
              return (<View key={i}>
                <TouchableOpacity onPress={() =>{ 
                    that.cheCkquarantineFunc(o,i)
                }}>
                    <Flex>
                        <Flex.Item style={{flex:1,paddingBottom:5,paddingLeft:2,paddingRight:2}}>
                            <Checkbox
                                checked={o._checked}
                                onChange={event => {
                                    that.cheCkquarantineFunc(o,i)
                                }}
                            >
                            </Checkbox>
                        </Flex.Item>
                    <Flex.Item style={{flex:8,paddingBottom:4,paddingLeft:2,paddingRight:2}}>
                        <Text numberOfLines={1} style={{fontSize:14,textAlign:'left'}}>{`${o.locNo}-${o.locName}`}</Text>
                    </Flex.Item>
                    </Flex>
                </TouchableOpacity>
              </View>)
            })}
          </ScrollView>
        </Modal>
    );
  }
}


const styles = StyleSheet.create({

});



export default PageForm;

