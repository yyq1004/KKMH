import { FC, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from '@umijs/max'
import styles from '@/layouts/index.less'
import { NavBar, SearchBar, TabBar } from 'antd-mobile'
import { AppOutline, UnorderedListOutline, ContentOutline, UserOutline, SearchOutline } from 'antd-mobile-icons'
import '@/assets/iconfont/iconfont.css'

const Layout: FC = () => {
  const navigate = useNavigate()
  const [SearchParams] = useSearchParams()
  const [activeKey, setActiveKey] = useState('home')
  const includesArr = ['/', '/renew', '/book', '/me']
  const location = useLocation()
  const getNav = () => {
    if (includesArr.includes(location.pathname)) {
      let newtitle = '首页'
      switch (location.pathname) {
        case '/':
          return (
            <NavBar backArrow={false} className={styles.Navbar}>
              <SearchBar placeholder="自动获取光标" onSearch={val => navigate(`/search/?title=搜索&val=${val}`)} />
              <img
                onClick={() => {
                  navigate('/world?title=世界')
                }}
                className={styles.world}
                src={require('@/assets/images/world.png')}
              />
            </NavBar>
          )
        case '/renew':
          return (
            <NavBar backArrow={false} className={styles.Navbar}>
              热播更新{' '}
              <SearchOutline
                onClick={() => {
                  navigate('/search?title=搜索')
                }}
                className={styles.search}
              />
            </NavBar>
          )
        case '/book':
          return (
            <NavBar backArrow={false} className={styles.Navbar}>
              书架
            </NavBar>
          )
        case '/me':
          return (
            <NavBar backArrow={false} className={styles.Navbar}>
              我的
            </NavBar>
          )
      }
      return (
        <NavBar backArrow={false} className={styles.Navbar}>
          {newtitle}
        </NavBar>
      )
    } else {
      return (
        <NavBar className={styles.Navbar} back="返回" onBack={back}>
          {' '}
          {SearchParams.get('title')}
        </NavBar>
      )
    }
  }
  const tabs = [
    {
      key: '',
      title: '首页',
      icon: <AppOutline />
    },
    {
      key: 'renew',
      title: '更新',
      icon: <UnorderedListOutline />
    },
    {
      key: 'book',
      title: '书架',
      icon: <ContentOutline />
    },
    {
      key: 'me',
      title: '我的',
      icon: <UserOutline />
    }
  ]
  const back = () => {
    navigate(-1)
  }
  const tabChange = (key: string) => {
    navigate(`/${key}`)
    setActiveKey(key)
  }

  return (
    <div>
      {getNav()}
      <div className={styles.content}></div>
      <Outlet />
      <div className={styles.content2}></div>
      <TabBar className={styles.adsdasd} onChange={event => tabChange(event)}>
        {tabs.map(item => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  )
}

export default Layout
