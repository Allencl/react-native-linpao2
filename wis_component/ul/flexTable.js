import React, { Component } from 'react';
import { TouchableOpacity,StyleSheet,Text, View } from 'react-native';
import { Card, WhiteSpace, WingBlank,Icon } from '@ant-design/react-native';

class TableComponent extends Component {
    constructor(props) {
        super(props);

        this.state={
            dataList:[]
        };
    }


    render() {
        let that=this;
        let {title='',data,renderBody} = this.props;
        let {dataList}=this.state;

        return (
            <View style={{padding:10,borderWidth:1,borderColor:'#e6ebf1',borderRadius:6,backgroundColor:'#fff'}}>
                { title ?
                    <View style={{paddingBottom:16}}>
                        <Text style={{fontSize:13,fontWeight:'600',color:"#1890ff"}}>{title}</Text>
                    </View>:
                    <View></View>                
                }


                { (data || dataList).map((o)=>{
                    return renderBody(o)
                })}
            </View>
        );
    }
}


const styles=StyleSheet.create({

});


export default TableComponent;
