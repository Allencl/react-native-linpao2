import React, { Component } from 'react';
import { TouchableOpacity,DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text,   } from 'react-native';
import { Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button,Tabs } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 


import ReCheckPage from './reCheck.js';   // 复核
import EncasementPage from './encasement.js';   // 装箱
import ForwardingPage from './forwarding.js';   // 移库发运区





// 拣货
class Page extends Component {
  constructor(props) {
    super(props);

    this.state={
      tabsPage:0,
      show:true,
      baseCofig:{
        // isEnd: true,
        // taskId: 22
      },
      config:{}
    }

  }

  componentWillMount(){

  }


  componentDidMount(){
    const that=this;



  }

  componentWillUnmount(){
    // this.changeTabsPage.remove();
  }





  /**
   * tabs 切换
   * @returns 
   */
   tabsChange=(index)=>{
      const {baseCofig}=this.state;

      // console.log(index)
      this.setState({
        tabsPage:index
      });

      // // 待移库
      // if(index==0){
      //   this.awaitPageRef.initPage();
      // }

      // // 包装中
      // if(index==1){
      //   this.SoldOutPagePage.initPage();
      // }

   }

  render() {
    let that=this;
    let{tabsPage,config,show}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');
    let routeParams=this.props.route.params.routeParams;



    const tabs = [
      { title: '复核' },
      { title: '装箱信息' },
      { title: '移库发运区' },
    ];

    return ( show ?
      <View style={{height:height,backgroundColor:"#fff"}}>
        <Tabs 
          page={tabsPage}
          tabs={tabs} 
          animated={false}
          onChange={(obj,index)=>{
            this.tabsChange(index)
          }}
        >
          <View style={{height:340}}>
            <ReCheckPage 
              navigation={navigation}
              onRef={(ref)=>{this.reCheckRef=ref}}
            />
          </View>
          <View>
            <EncasementPage 
              navigation={navigation}
              onRef={(ref)=>{this.encasementRef=ref}}
            />
          </View>
          <View>
            <ForwardingPage 
              navigation={navigation}
              onRef={(ref)=>{this.forwardingRef=ref}}
            />
          </View>
        </Tabs> 
      </View>
      :
      <View></View>
    );
  }
}



export default Page;

