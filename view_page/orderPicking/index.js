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


import AwaitPage from './await.js';   // 拣货响应
import SoldOutPage from './soldOut.js';   // 拣货下架
import RecheckPage from './recheck.js';   // 移复检区





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


    // 改变 tabs page
    this.changeTabsPage =DeviceEventEmitter.addListener('globalEmitter_orderPicking_change_tabsPage',function(index){

      index && that.setState({tabsPage:index})
    });
  }

  componentWillUnmount(){
    this.changeTabsPage.remove();
  }





  /**
   * tabs 切换
   * @returns 
   */
   tabsChange=(index)=>{
      const {baseCofig}=this.state;


      this.setState({
        tabsPage:index
      });


      // // 拣货下架
      // if(index==1){
      //   let _selectData=this.awaitPageRef.getSelectTableData();

      //   if(!_selectData.length){
      //     Toast.offline("拣货响应，未选择数据！",1);
      //   }

      //   if(_selectData.length>1){
      //     Toast.offline("拣货响应，只能选择一条数据！",1);
      //   }

      //   if(_selectData.length==1){
      //     this.SoldOutPagePage.initPage(_selectData)
      //   }
      // }

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
      { title: '拣货响应' },
      { title: '拣货下架' },
      { title: '移复检区' },
    ];

    return ( show ?
      <View style={{height:height,backgroundColor:"#fff"}}>
        <Tabs 
          page={tabsPage}
          tabs={tabs} 
          animated={false}
          onTabClick={(obj,index)=>{
            this.tabsChange(index)
          }}
          onChange={(obj,index)=>{
            // console.log(obj)
            // console.log(index)

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
            <SoldOutPage 
              navigation={navigation}
              onRef={(ref)=>{this.SoldOutPagePage=ref}}
            />
          </View>
          <View>
            <RecheckPage 
              navigation={navigation}
              onRef={(ref)=>{this.RecheckPage=ref}}
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

