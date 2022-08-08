import React, { useState, useEffect } from 'react';
import './index.less';
import { Form, Input, Button, Dialog, Toast } from 'antd-mobile'
import { connect, useNavigate } from '@umijs/max';
import { register } from "@/services/user";
import { Vertify } from '@alex_xu/react-slider-vertify';
import { withSuccess } from 'antd/lib/modal/confirm';

const Demo = ({ dispatch }) => {
  const navigate = useNavigate();
  const [state, setState] = useState('');
  const [flag,setFlag] = useState(false);
  const onFinish = async (values: any) => {
    console.log(values);
    if (values.password == values.repassword) {
      const res = await register({ username: values.username, password: values.password })
      console.log(res);
      if (res.status == 200) {
        Toast.show({
          content: '注册成功',
          maskClickable: false,
          duration: 2000,
        })
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else if (res.status == 400) {
              setFlag(false);
        Dialog.alert({
          content: res.msg,
        })
      }
    } else {
      setFlag(false);
      Dialog.alert({
        content: "两次密码不一致,重新输入",
      })
    }
  };
  return <div>
    <Form
      onFinish={onFinish}
      layout='horizontal'
      footer={
        <div>
          <Vertify width={375} height={100} onSuccess={()=>setFlag(true)} onFail={() => setFlag(false)} onRefresh={() =>setFlag(false)} />
          <Button block disabled={!flag} type='submit' color='success' size='large'>
            提交
          </Button>
        </div>
      }
    >
      <Form.Header>注册账号</Form.Header>
      <Form.Item
        name='username'
        label='姓名'
        rules={[{ required: true, message: '姓名不能为空' }]}
      >
        <Input placeholder='请输入姓名' />
      </Form.Item>
      <Form.Item
        name='password'
        label='密码'
        rules={[{ required: true, message: '密码不能为空' }]}
      >
        <Input placeholder='请输入密码' type='password' />
      </Form.Item>
      <Form.Item
        name='repassword'
        label='密码'
        rules={[{ required: true, message: '密码不能为空' }]}
      >
        <Input placeholder='请输入密码' type='password' />
      </Form.Item>
    </Form>

  </div>
}
export default connect(({ user }) => ({
  users: user.users,
}))(Demo);
