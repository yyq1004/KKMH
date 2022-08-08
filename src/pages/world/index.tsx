import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { queryWorld } from '@/services/user';
import { useRequest } from '@umijs/max';
import { Image } from 'antd';
import { Card, InfiniteScroll, Grid, Avatar, Ellipsis, PullToRefresh } from 'antd-mobile';
import { AntOutline } from 'antd-mobile-icons';

export default function Page() {
  const { data, loading } = useRequest(() => queryWorld(), { cacheKey: 'world' });
  const { data: redata, loading: recloading, run } = useRequest(() => queryWorld(), { manual: true, cacheKey: 'world2' });
  const [list, setList] = useState([]) as any;
  const [hasMore, setHasMore] = useState(true);
  async function loadMore() {
    await run();
    redata && setList([...list, ...redata.universalModels]);
    setHasMore(list.length < 3000);
  }
  useEffect(() => {
    data && setList([...list, ...data.universalModels])
  }, [loading])
  return (
    <div>
      <PullToRefresh onRefresh={async () => { await setList([]); }}>
        <Grid columns={2} gap={8} style={{ '--gap-vertical': '5px' }}>
          {
            (data && data.universalModels) && list.map((item: any, index: number) => {
              return <Grid.Item key={index}>
                <div className={styles.card}>
                  <Card bodyClassName={styles.customBody}
                    title={
                      <div className={styles.header}>
                        <AntOutline style={{ marginRight: '4px', color: '#1677ff' }} />
                        <Ellipsis direction='end' rows={2} content={item.post.title} />
                      </div>
                    }
                    style={{ borderRadius: '16px' }}
                  >
                    <div className={styles.content}>
                      <Image.PreviewGroup>
                        {
                          item.post.content && item.post.content.map((item2: any, idx: number) => {
                            return <span key={idx}>
                              {(item2.type != 1) ? <Image src={item2.content} width={30} height={30}></Image> : ""}
                            </span>
                          })
                        }
                      </Image.PreviewGroup>
                    </div>
                    <div className={styles.footer}>
                      <Avatar src={item.post.user.avatar_url} style={{ '--size': '30px', '--border-radius': '50%' }} fit='fill' />
                      <span className={styles.nickname}>{item.post.user.nickname}</span>
                    </div>
                  </Card>
                </div>
              </Grid.Item>
            })
          }
        </Grid>
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </PullToRefresh>
    </div>
  );
}

