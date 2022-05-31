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


import TaskPage from './task.js';   // 任务下发
import DetailedPage from './detailed.js';   // 配料清单
import SearchPage from './search.js';   // 查询清单




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
   * 设置 基础信息
   * @param {*} index 
   */
  setBase=(option)=>{
    this.setState({
      baseCofig:option
    });
  }

  /**
   * tabs 切换
   * @returns 
   */
   tabsChange(index){
      const {baseCofig}=this.state;

      this.setState({
        tabsPage:index
      });

      // 配料清单
      if(index==1){
        this.detailedPageRef.searchData(baseCofig);
      }

      // 配料查询
      if(index==2){
        this.searchPageRef.searchData(baseCofig);
      }

   }

  render() {
    let that=this;
    let{tabsPage,config,show}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');
    let routeParams=this.props.route.params.routeParams;



    const tabs = [
      { title: '任务下发' },
      { title: '配料清单' },
      { title: '配料查询' }
    ];

    return ( show ?
      <View style={{height:height,backgroundColor:"#fff"}}>
        <Tabs tabs={tabs} 
          animated={false}
          onChange={(obj,index)=>{
            this.tabsChange(index)
          }}
        >
          <View>
            <TaskPage 
              onGetPageIndex={()=>{
                return that.state.tabsPage
              }}
              onSetBase={(option)=>{
                that.setBase(option);
              }}
            />
          </View>
          <View>
            <DetailedPage 
              onRef={(ref)=>{this.detailedPageRef=ref}}
            />
          </View>
          <View>
            <SearchPage 
              onRef={(ref)=>{this.searchPageRef=ref}}
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

