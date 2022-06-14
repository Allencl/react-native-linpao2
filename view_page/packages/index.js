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


import AwaitPage from './await.js';   // 待移库
import PackagingPage from './packaging.js';   // 包装中






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

  componentWillUnmount(){

  }

  componentDidMount(){
   
  }



  /**
   * tabs 切换
   * @returns 
   */
   tabsChange=(index)=>{
      const {baseCofig}=this.state;

      // console.log(index)
      // // this.setState({
      // //   tabsPage:index
      // // });

      // 待移库
      if(index==0){
        this.awaitPageRef.initPage();
      }

      // 包装中
      if(index==1){
        this.packagingPageRef.initPage();
      }

   }

  render() {
    let that=this;
    let{tabsPage,config,show}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');
    let routeParams=this.props.route.params.routeParams;



    const tabs = [
      { title: '待移库' },
      { title: '包装中' },
    ];

    return ( show ?
      <View style={{height:height,backgroundColor:"#fff"}}>
        <Tabs tabs={tabs} 
          animated={false}
          onChange={(obj,index)=>{
            // this.tabsChange(index)
          }}
        >
          <View>
            <AwaitPage 
              navigation={navigation}
              onRef={(ref)=>{this.awaitPageRef=ref}}
            />
          </View>
          <View>
            <PackagingPage 
              navigation={navigation}
              onRef={(ref)=>{this.packagingPageRef=ref}}
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

