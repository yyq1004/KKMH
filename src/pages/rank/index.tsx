import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useRequest } from '@umijs/max';
import { SideBar, Card, Ellipsis, Image } from 'antd-mobile'
import { getcol, getexactrank } from '@/services/user'
import { Link } from '@umijs/max';
import { useNavigate } from '@umijs/max';
export default function Page() {
  //存储点击榜单的id
  const [emitrun, setemitrun] = useState(9)
  const navigate = useNavigate()
  //获取所有榜单title和id
  const { data, error, run, loading } = useRequest(() => {
    return getcol();
  }, {
    cacheKey: 'data',
  });

  //获取对应榜单的具体数据 ,userequest返回的必须是promise  之前用了三目运算符，匹配失败的时候会返回一个空字符，到时出错
  const { data: exadata, run: exarun, loading: exalodaing, error: exaerr } = useRequest(() => {
    return getexactrank(emitrun);
  }, {
    //manual 手动触发请求
    manual: true,
    //设置缓存的key
    cacheKey: 'exadata',
  });
  //获取点击哪个榜单，榜单的id，触发获取对应榜单数据
  const changerank = (e: any) => {
    setemitrun(e)
  }
  useEffect(() => {
    exarun()
  }, [emitrun])
  useEffect(() => {
    run();
    exarun()
  }, [])
  //跳转到详情页
  const todetail = (e: any, title: any) => {
    navigate(`/chapter?id=${e}&title=${title}`)
  }
  const checkDataExist = () => {
    if (data&&!data.rank_type && exadata) {
      return  <div>
      <div className={styles.bigimg}><Image src={exadata && exadata.rank_info.topics[0].cover_image_url} width={375} height={200} fit='fill' /></div>
      <div className={styles.smallimg}> <Image src={require('@/assets/images/rank.png')} fit='fill' />
        <h1 className={styles.texrcolor}>  {exadata && exadata.rank_info.title}</h1>
        <h5 className={styles.texrcolor}> 下次更新： {exadata && exadata.rank_info.next_update_date ? exadata.rank_info.next_update_date : '暂未确定时间'}</h5>
      </div>
      <div className={styles.centerbox}>
        <SideBar className={styles.sidebar} onChange={(e) => changerank(e)}>
          {!loading && data && data.rank_types.map((item: any) => (
            <SideBar.Item key={item.rank_id} title={item.title} />
          ))}
        </SideBar>
        <ul>
          {exadata && exadata.rank_info.topics.map(item => {
            return <li className={styles.everycartoon} key={item.id} >
              <div>
                <Card title={item.title}  onHeaderClick={(e) => todetail(item.id, item.title)}>
                  <div className={styles.textandimg}>
                    <Image src={item.cover_image_url} width={100} height={100} fit='fill'   style={{ borderRadius: 16 }} onClick={(e) => todetail(item.id, item.title)}/>
                    <div>
                      <span  onClick={(e) => todetail(item.id, item.title)}>作者：{item.user.nickname}</span><hr />
                      <span  onClick={(e) => todetail(item.id, item.title)}>标签：{item.tags}</span></div></div>
                  <span>简介：<Ellipsis direction='end' rows={2} content={item.description} expandText='展开'
                    collapseText='收起' /></span>
                </Card>

              </div>
            </li>

          })}
        </ul>
      </div>
    </div >
    }
    else {
      return <><div className={styles.fulfillingbouncingcirclespinner}>
      <div className={styles.circle}></div>
      <div className={styles.orbit}></div>
  
    </div>
        <h2 className={styles.loadingtips}>加载中，请稍后</h2></>
    }
  }
  return (
    <div>{checkDataExist()}</div>
  );
}
