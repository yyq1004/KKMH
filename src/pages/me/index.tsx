import user from '@/models/user';
import { connect } from '@umijs/max';
import { useNavigate, useRequest } from '@umijs/max';
import { Card, Space, Image } from 'antd-mobile';
import { AddOutline, RightOutline } from 'antd-mobile-icons';
import './index.less';
import { message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useState } from 'react';

const Page = () => {
  const { data } = useRequest('/api/v1/graph/pc/feeds/getRecommendFeed?uid=0&webTokenId=1615007958330_FFwnyURnzD0rgO2&since=0&limit=20 ')
  const navigate = useNavigate()
  const mast = localStorage.getItem("userinfo") as any;
  const shujia = () => {
    navigate('/book')
  }
  const shijie = () => {
    navigate('/world')
  }
  const outLogin = () => {
    localStorage.removeItem("userinfo");
    localStorage.removeItem("url");
    navigate("/login");
  }
  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, url => {
        localStorage.setItem("url", url)
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    mast ? <div>
      <img src="https://tse4-mm.cn.bing.net/th/id/OIP-C.PblCAZjGQhdLpHc3AyEjVgHaIG?pid=ImgDet&rs=1" alt="" />
    </div> : <div onClick={(e: any) => { e.stopPropagation(); navigate("/login"); }}>
      <img src="https://tse4-mm.cn.bing.net/th/id/OIP-C.PblCAZjGQhdLpHc3AyEjVgHaIG?pid=ImgDet&rs=1" alt="" />
    </div>
  );
  console.log(data);
  return (
    <div className="title">
      <Card title="用户信息">
        <div className='info'>
          <div className='clicle'>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {localStorage.getItem("url") ? <img src={localStorage.getItem("url")!} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>

          </div>
          {
            mast ?
              <div className='login' onClick={() => outLogin()}>{JSON.parse(mast).nick} </div>
              : <div className='login' onClick={() => navigate("/login")}>请先登录</div>
          }
        </div>
      </Card>
      <span onClick={shijie}>更多</span>
      {data && (
        <Card title="世界">
          <div className="world">
            <Space justify="evenly" block>
              {
                data.universalModels && data.universalModels.map((item: any, index: number) => {
                  if (index < 4) {
                    return <div className="bookinfo" key={index}>
                      <Image src={item.post.recommendCover.picOriginalUrl} width={77.5} height={120} fit='fill'></Image>
                    </div>
                  }
                })
              }
            </Space>
          </div>
        </Card>
      )}
      <span onClick={shujia}>
        <RightOutline fontSize={16} />
      </span>
      {data && (
        <Card title="书架">
          <div className="world">
            <Space justify="evenly" block>
              {
                data.universalModels && data.universalModels.map((item: any, index: number) => {
                  if (index > 3 && index <8) {
                    return <div className="bookinfo" key={index}>
                      <Image src={item.post.recommendCover.picOriginalUrl} width={77.5} height={120} fit='fill'></Image>
                    </div>
                  }
                })
              }
            </Space>
          </div>
        </Card>
      )}
    </div>
  )
}
export default connect(({ user }) => ({
  user: user.user,
}))(Page);
