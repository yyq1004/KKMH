import React, { useState } from 'react';
import './index.less';
import { Tabs, Grid } from 'antd-mobile'
import { connect } from '@umijs/max';
import { useNavigate } from '@umijs/max';
import useLongPress from "./LongPress";
import { CloseOutline } from 'antd-mobile-icons';

const Page = ({dispatch,list,hisList}) => {
  const navigate = useNavigate();
  const [flag,setFlag]=useState(false)
  const getClick=(id,title)=>{navigate(`/chapter?id=${id}&title=${title}`)}
  const removeList=(id)=>{dispatch({type: 'collect/unCollect',payload:id});setFlag(false)}//删除收藏
  const removeHList=(id)=>{dispatch({type: 'history/unHistory',payload:id});setFlag(false)}//删除历史
  const longPressHandler = useLongPress(() => { setFlag(true) },() => {}) // 结束长按事件
  return (
    <div>
      <Tabs>
        <Tabs.Tab title='收藏' key='fruits'>
          <Grid columns={3} gap={8}>
            {list.map(item => {
              return <Grid.Item key={item.title}  >
                <CloseOutline style={flag?{position: "relative",left:"110",top:"0",display:"block"}:{display:"none"}} onClick={()=>removeList(item.id)}/>
                <div {...longPressHandler}>
                  <div className="img" onClick={()=>getClick(item.id,item.title)}><img src={item.cover_image_url}></img></div>
                  <div className="title">{item.title}</div>
                </div>
              </Grid.Item>
            })}
          </Grid>
        </Tabs.Tab>
        <Tabs.Tab title='历史' key='vegetables'>
        <Grid columns={3} gap={8}>
            {hisList.map(item => {
              return <Grid.Item key={item.title}  >
                <CloseOutline style={flag?{position: "relative",left:"110",top:"0",display:"block"}:{display:"none"}} onClick={()=>removeHList(item.id)}/>
                <div {...longPressHandler}>
                  <div className="img" onClick={()=>getClick(item.id,item.title)}><img src={item.cover_image_url}></img></div>
                  <div className="title">{item.title}</div>
                </div>
              </Grid.Item>
            })}
          </Grid>
          
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}

export default connect(({ collect,history }) => ({
  list: collect.list,
  hisList: history.hisList
}))(Page);
