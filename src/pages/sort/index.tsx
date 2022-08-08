import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useRequest, useNavigate } from '@umijs/max';
import { getsort, searchsort } from '@/services/user'
import { Image, InfiniteScroll, FloatingBubble } from 'antd-mobile'
import { LocationOutline } from 'antd-mobile-icons'
import styles1 from '@/pages/rank/index.less'
export default function Page() {
  const navigate = useNavigate()
  const [first, setfirstatt] = useState(0)
  const [second, secondatt] = useState(1)
  const [third, thirdatt] = useState(1)
  const [count, setcount] = useState(24)
  const [active, setactive] = useState([0, 1, 0])
  const [hasMore, setHasMore] = useState(true)
  const [isshow, setshow] = useState(false)  
  async function loadMore() {
    if (count - detdata.topics.length <= 6) {
      setcount(count + 6)
      await run()
    }
    else setHasMore(false)
  }
  const { data: cdata, error, loading, run: exarun } = useRequest(() => {
    return getsort();
  }, {
    cacheKey: 'data',
  });
  const { data: detdata, loading: detloading, run } = useRequest(() => {
    return searchsort(count, first, second, third);
  }, {
    cacheKey: 'data2',
  });
  const gete1 = (e: any) => {
    setfirstatt(e.target.childNodes[1].innerHTML)
  }
  const gete2 = (e: any) => {
    secondatt(e.target.childNodes[2].innerHTML)
  }
  const gete3 = (e: any) => {
    thirdatt(e.target.childNodes[1].innerHTML)
  }
  useEffect(() => {
    run()
    setactive([first, second, third])
  }, [first, second, third])
  useEffect(() => {
    run();
    exarun()
    window.addEventListener('scroll', bindHandleScroll)//对scroll进行事件监听，或得页面滚动距离
  }, [])
  const bindHandleScroll = (e) => {
    let top = e.srcElement.documentElement.scrollTop
    top > 1000 ? setshow(true) : setshow(false)
  }

  const todetaill = (e: any, title) => {
    navigate(`/chapter?id=${e}&title=${title}`)
  }
  const clickbubble = () => {
    window.scrollTo(0, 0)
  }
  const checkDataExist = () => {
    if (cdata&&cdata.update_status && detdata) {
      return <div className={styles.bigbox}>
        <div className={styles.sortlist}>
          <ul className={styles.s1} onClick={(e) => gete1(e)}>
            {cdata && cdata.tags && cdata.tags.map((item: any) => {
              return <li key={item.title} style={{ borderBottom: (item.tag_id == active[0]) ? "1px solid red" : "none" }}>{item.title}<span style={{ display: 'none' }}>{item.tag_id}</span></li>
            })}
          </ul>
          <hr style={{ clear: 'both' }}></hr>
          <ul className={styles.s1} onClick={(e) => gete2(e)}>
            {!loading && cdata && cdata.update_status.map(item => {
              return <li key={item.code} style={{ borderBottom: (item.code == active[1]) ? "1px solid red" : "none" }}>{item.description} <span style={{ display: 'none' }}>{item.code}</span></li>
            })}
          </ul>
          <div style={{ clear: 'both' }}></div>
          <ul className={styles.s1} onClick={(e) => gete3(e)}>
            <li style={{ borderBottom: (active[2] == 1) ? "1px solid red" : "none" }}>推荐 <span style={{ display: 'none' }}>1</span></li>
            <li style={{ borderBottom: (active[2] == 2) ? "1px solid red" : "none" }}>最火热 <span style={{ display: 'none' }}>2</span></li>
            <li style={{ borderBottom: (active[2] == 3) ? "1px solid red" : "none" }}>新上架 <span style={{ display: 'none' }}>3</span></li>
          </ul>
        </div>
        <br></br>
        <div >
          <ul className={styles.detailsortlist}>
            {detdata && detdata.topics.map((item) => {
              return <li key={item.id} className={styles.innersort} onClick={(e) => todetaill(item.id, item.title)}>
                <Image src={item.vertical_image_url} width={100} height={120} fit='fill' />
                {item.title} <br></br>{item.sub_title}
              </li>
            })}
          </ul>
        </div>
        <FloatingBubble
          style={{
            '--initial-position-bottom': '60px',
            '--initial-position-right': '24px',
            '--edge-distance': '24px',
            display: isshow ? 'block' : 'none'
          }}
          onClick={clickbubble}
        >
          <LocationOutline fontSize={32} />
        </FloatingBubble>
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={100} />
      </div>
    }
    else {
      return <><div className={styles1.fulfillingbouncingcirclespinner}>
        <div className={styles1.circle}></div>
        <div className={styles1.orbit}></div>

      </div>
        <h2 className={styles1.loadingtips}>加载中，请稍后</h2></>
    }
  }

  return (
    <div>{checkDataExist()}</div>
  );
}
