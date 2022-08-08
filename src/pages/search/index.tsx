import { useRequest } from '@umijs/max'
import React, { useState,useEffect } from 'react'
import { Button, SearchBar, Space,Popup, List, Card, Ellipsis } from 'antd-mobile' //Ellipsis文本省略 Popup弹出层
import './index.less'
import { useNavigate,useSearchParams } from '@umijs/max';
export default function Page() {
  const navigate = useNavigate();
  const [SearchParams] = useSearchParams();
  const [visible2, setVisible2] = useState(false)
  const [tag, setTag] = useState<string>(SearchParams.get('val')?SearchParams.get('val')!:'斗罗大陆')
  const [his, setHis] = useState<any>([]) //搜索历史
  const [sort, setSort] = useState<number>(0)
  const { data, run, loading } = useRequest('/api/v2/pweb/home') //获取分类标签
  const { data: data1 } = useRequest(`/api/v1/search/topic?q=${tag}&f=5&size=10`, { refreshDeps: [tag] }) //依赖刷新    监听搜索框变化
  const { data: data2 } = useRequest(`/api/v1/search/by_tag?since=0&count=24&f=3&tag=${sort}&sort=1&query_category={"update_status":0} `, { refreshDeps: [sort] }) //监听tag变化
  useEffect(()=>{
    setHis([...his,SearchParams.get('val')]);
  },[SearchParams.get('val')])
  while (data) {
    const rendersort = data2.topics.map((item:any, index:number) => {
      //创建分类页面
      return (
        <div className="detail" key={index}  onClick={() => navigate(`/chapter?id=${item.id}&title=${item.title}`)}>
          <img src={item.vertical_image_url} alt="" />
          <div className="info">
            <Space direction="vertical" justify="evenly" block>
              <p>书名：{item.title}</p>
              <p>作者：{item.user.nickname}</p>
              <Ellipsis direction="end" content={'简介：' + item.description} rows={2} />
            </Space>
          </div>
        </div>
      )
    })
    return (
      <div className="search">
        <SearchBar
          className="searchbar"
          placeholder="请输入内容"
          showCancelButton
          onFocus={() => {
            setVisible2(true)
          }}
          onBlur={() => {
            setVisible2(false)
          }}
          onSearch={(value: string) => {
            setTag(value)
            setHis([value, ...his])
            setSort(0) //每次点击搜索将sort等于0,让分类停止渲染
          }}
        />
        <Popup
          visible={visible2}
          onMaskClick={() => {
            setVisible2(false)
          }}
          position="top"
          bodyStyle={{ height: '40vh' }}
          mask={false}
        >
          <List header="搜索历史">
            {his.map((item:any, index:number) => {
              return (
                <p
                  key={index}
                  onClick={() => {
                    setTag(item)
                    setSort(0)
                  }}
                >
                  {item}
                </p>
              )
            })}
          </List>
        </Popup>

        <Card title="分类">
          <Space wrap>
            {data.categories.map((item, index) => {
              return (
                <Button
                  size="mini"
                  color="primary"
                  key={index}
                  onClick={() => {
                    setSort(item.tagId)
                  }}
                >
                  {item.title}
                </Button>
              )
            })}
          </Space>
        </Card>

        <Card title="搜索结果">
          <div className="result">
            {data1.hit.map((item:any, index:number) => {
              if (sort == 0) {
                return (
                  <div className="detail" key={index} onClick={() => navigate(`/chapter?id=${item.id}&title=${item.title}`)}>
                    <img src={item.vertical_image_url} alt="" />
                    <div className="info">
                      <Space direction="vertical" justify="evenly" block>
                        <p>书名：{item.title}</p>
                        <p>作者：{item.user.nickname}</p>
                        <Ellipsis direction="end" content={'简介：' + item.description} rows={2} />
                      </Space>
                    </div>
                  </div>
                )
              } else return rendersort
            })}
          </div>
        </Card>
      </div>
    )
  }
}
