import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useRequest, useNavigate } from '@umijs/max';
import { queryHome, queryHomeRectopics, queryHomeTopics,queryContent} from "@/services/user";
import { Swiper, Grid,Image} from 'antd-mobile';
import '@/assets/iconfont/iconfont.css';

export default function Page() {
  const { data, loading } = useRequest(() => queryHome(), { cacheKey: 'HomeBanners' })
  const { data: recdata, loading: recloading } = useRequest(() => queryHomeRectopics(), { cacheKey: 'HomeRectopics' })
  const { data: topcdata, loading: toploading } = useRequest(() => queryHomeTopics(), { cacheKey: 'HomeTopics' })
  const navigate = useNavigate();
  const [list, setList] = useState([]) as any;
  const [flag, setFlag] = useState(true) as any;
  const [id,setId] = useState("1");
  const { data: cdata, loading: cloading,run} = useRequest(() => queryContent(id), { refreshDeps:[id]})
  const gochapter=(id:string)=>{
    setId(id);
    run();
    if(cdata.code==200){
      navigate(`/content/${id}?title=${cdata.comic_info.title}&val=${cdata.topic_info.id}`);
    }
  }
  useEffect(() => {
    flag ? (recdata && setList([...recdata.topics])) : (topcdata && setList([...topcdata.list]));
  }, [flag, loading])
  return (
    <div className={styles.home}>
      {/*轮播图 */}
      {data && data.banners && <Swiper loop={true} autoplay={true}>{data.banners.map((item: any, index: number) => (
        <Swiper.Item key={index}>
          <div className={styles.content} onClick={()=>gochapter(item.target_id)}  >
            <img className={styles.img} src={item.image_url} />
          </div>
        </Swiper.Item>
      ))}</Swiper>}
      {/*榜单  分类 原创投稿*/}
      {data &&
        <div className={styles.BS}>
          <div className={styles.rank} onClick={() => { navigate('/rank?title=排行榜') }}>
            <img src={require("@/assets/images/rank.png")} /><br />排行榜</div>
          <div className={styles.sort} onClick={() => { navigate('/sort?title=分类') }}>
            <img src={require("@/assets/images/sort.png")} /><br />分类</div>
        </div>
      }
      {/*原创投稿*/}
      {
        (recdata && topcdata && data) && <div className={styles.YC}>
          <div>
            <span className={styles.yctg}>原创投稿 </span>
            <span className={styles.bjzx} style={{ color: flag ? "powderblue" : "" }} onClick={() => setFlag(true)}>编辑推荐</span>
            <span className={styles.bjzx} style={{ color: flag ? "" : "powderblue" }} onClick={() => setFlag(false)}>最新上架</span>
          </div>
          <div className={styles.rec_topics}>
            {
              list && list.map((item: any) => {
                return (<div className={styles.topics} key={item.id}>
                  <div className={styles.yclist} onClick={() => { navigate(`/chapter?id=${item.id}&title=${item.title}`) }}>
                    <div>
                      <img className={styles.cover_image} src={item.vertical_image_url} />
                      <div className={styles.nickname}>{item.likes_count.includes("万") ? item.user.nickname : item.tags}</div>
                      <div className={styles.likes_count}>{item.likes_count.includes("万") ? item.likes_count : ""}</div>
                    </div>
                    <div className={styles.title}>{item.title}</div>
                  </div>
                </div>)
              })
            }
          </div>
        </div>
      }
      {/* 这漫画令我上头 */}
      <div className={styles.discovery}>
        {data && data.discovery_modules.map((item1: any) => {
          return <div className={styles.modules} key={item1.title}>
            <h2 className={styles.h2}>{item1.title}</h2>
            <Grid columns={2} gap={8} >
              {item1.topics && item1.topics.map((item2: any) => {
                return <Grid.Item key={item2.id} onClick={()=>{navigate(`/chapter?title=${item2.title}&id=${item2.id}`) }}>
                    <div className={styles.verti}> 
                      <Image  src={item2.vertical_image_url} width={185} height={200} fit='fill'></Image>      
                      <p className={styles.item2tages}>{item2.tags}</p>
                      <p className={styles.usernickname}>{item2.user.nickname}</p>
                      <p className={styles.dianzan}><i className='iconfont icon-dianzan'></i>{item2.likes_count}</p>
                    </div>
                </Grid.Item>
              })
              }
            </Grid>
          </div>
        })}
      </div>
    </div>
  );
}
