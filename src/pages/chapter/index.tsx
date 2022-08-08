import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { getChapter } from '@/services/user';
import { Tabs, Toast, Button, Popup, Space, TextArea, Form, Dialog, Input, ImageViewer, Card } from 'antd-mobile'
import { StarOutline, UpOutline, DownOutline, StarFill } from 'antd-mobile-icons'
import { useSearchParams, useNavigate, useRequest } from '@umijs/max';
import ImageUploader, { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import { mockUpload } from './utils';
import { connect } from '@umijs/max';

const Page = ({ dispatch, list, elist, hisList }) => {
  const [SearchParams] = useSearchParams();
  const navigate = useNavigate();
  let id = Number(SearchParams.get("id"));
  const { data: cdata, loading } = useRequest(() => getChapter(SearchParams.get('id')!), { cacheKey: 'chapter' });

  const [plist, setList] = useState([]) as any;
  const [Lists, setLists] = useState([]) as any;
  const [visible1, setVisible1] = useState(false);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([{ url: '' },]);
  const [isList, setIsList] = useState(true)
  //初始化
  useEffect(() => {
    setIsList(isStore())
  }, [])
  const storeHandle = (data: any) => {
    const mast = localStorage.getItem("userinfo") as any

    if (mast) {
      if (isStore()) {
        //已收藏
        setIsList(false)
        dispatch({ type: 'collect/unCollect', payload: data.id });
      } else {
        //未收藏  
        setIsList(true)
        dispatch({ type: 'collect/isCollect', payload: data });
      }
    } else {
      navigate("/login")
    }


  }
  //dva中是否存在,是否收藏，返回true，则收藏,返回false，则未收藏
  function isStore() {
    return list.some((item: any) => {
      return item.id == id
    })
  }
  const onFinish = (values: any) => {
    values.id = cdata.topic_info.id;
    dispatch({
      type: "evaluate/save",
      payload: { values }
    })
    Dialog.alert({
      content: "评论成功",
      closeOnMaskClick: true,
    })
    setVisible1(false);
  }
  const GoContent = (locked_code: string, need_vip: boolean, id: string, title: string, val: string) => {
    if (locked_code == '200' && !need_vip) {
      navigate(`/content/${id}?title=${title}&val=${val}`)
    } else if (need_vip) {
      Toast.show({
        content: '当前是vip章节,升级会员后方可解锁观看',
        maskClickable: false,
        duration: 2000,
      })
    } else {
      Toast.show({
        content: '当前是付费章节,付费后方可解锁观看',
        maskClickable: false,
        duration: 2000,
      })
    }
  }
  useEffect(() => {
    cdata && setLists([...cdata.topic_info.comics])
  }, [cdata])

  useEffect(() => {
    if (!Lists) return;
    dispatch({
      type: "chaplist/save",
      payload: Lists
    })
  }, [Lists])
  useEffect(() => {
    if (!cdata) return;
    dispatch({
      type: "history/isHistory",
      payload: cdata.topic_info
    })
  }, [cdata])
  return (
    <div>
      <img className={styles.maximg} src={cdata && cdata.topic_info.cover_image_url} />
      <div className={styles.detail}>
        <div className={styles.pic}>
          <img className={styles.minimg} src={cdata && cdata.topic_info.vertical_image_url} />
        </div>
        <div className={styles.detright}>
          <h2 className={styles.title}>{cdata && cdata.topic_info.title}</h2>
          <p className={styles.descript}>作者：{cdata && cdata.topic_info.user.nickname}</p>
          <p>人气：{cdata && cdata.topic_info.popularity_info}</p>
          <p>类型：{cdata && cdata.topic_info.tags.map((item: any, index: number) => {
            return <span key={index}>{item}</span>
          })}</p>
          {
            cdata && <div className={styles.collect} onClick={() => storeHandle(cdata.topic_info)} >
              收藏
              {!isList ? <StarOutline /> : <StarFill color='var(--adm-color-danger)' />}
            </div>
          }
        </div>
      </div>
      <div className={styles.intro}>
        <h2 className={styles.introtit}>漫画简介</h2>
        <span>{cdata && cdata.topic_info.description}</span>
      </div>
      {/* 章节排序 */}
      <div className={styles.sort}>
        <Button color='success' size='mini' onClick={() => { setLists([...Lists.reverse()]) }}>切换顺序</Button>
      </div>
      <Tabs>
        <Tabs.Tab title='章节列表' key='lists'>
          {
            Lists && Lists.map((item: any, index: number) => {
              return <div key={index} className={styles.listitem} onClick={() => GoContent(item.locked_code, item.need_vip, item.id, item.title, SearchParams.get("id")!)}>
                <div>
                  <img className={styles.listimg} src={item.cover_image_url} />
                </div>
                <div>
                  <h3 className={styles.listitle}>{item.title}</h3>

                  <p className={styles.data}><span className={styles.span}>{item.label_info ? item.label_info.text : ""}{(item.locked_code == 10103) ? '付费章节' : ""}</span>{item.created_at}</p>
                </div>
              </div>
            })
          }
        </Tabs.Tab>
        <Tabs.Tab title='评价留言' key='message'>
          <Button block color='primary' size='large' onClick={() => { setVisible1(true) }} className={styles.evaluate}>
            去评价
          </Button>
          <Space direction='vertical'>
            <Popup visible={visible1} onMaskClick={() => { setVisible1(false) }} bodyStyle={{ minHeight: '40vh' }}>
              <Form onFinish={onFinish} footer={<Button block type='submit' color='primary' size='large'>提交</Button>}>
                <Form.Item name='text'>
                  <TextArea defaultValue={''} showCount />
                </Form.Item>
                <Form.Item name='id'>
                </Form.Item>

                <Form.Item name='url'>
                  <ImageUploader value={fileList} onChange={setFileList} upload={mockUpload} />
                </Form.Item>
              </Form>
            </Popup>
          </Space>
        </Tabs.Tab>
      </Tabs>
      {elist && elist.map((item: any, index: number) => {
        if (item.id == cdata.topic_info.id) {
          return <div key={index}>
            <Card>
              <div className={styles.content}>内容：{item.text}</div>
              {
                item.url && item.url.map((item2: any, index1: number) => {
                  return <span className={styles.image} onClick={() => { setVisible1(true) }} key={index1}>
                    <img src={item2.url} className={styles.imagess}></img>
                  </span>
                })
              }
            </Card>
          </div>
        }

      })
      }
    </div>
  );
}



export default connect(({ evaluate, chaplist, collect, history }) => ({
  elist: evaluate.elist,
  cLists: chaplist.cLists,
  list: collect.list,
  hisList: history.hisList
}))(Page);


