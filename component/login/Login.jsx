import './login.css';
import axios from '../../api/axios';
import React, { useState } from 'react';
import { onFinishFailed } from '../../api/service';
import { Form, Input, Button, message } from 'antd';

export const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const onFinish = async (values) => {
    try {
      const { data } = await axios.post(`/auth/${isRegistering ? 'register' : 'login'}`, values);
      message.success('Success!');
      localStorage.setItem('id', data.id);
      localStorage.setItem('token', data.fullname);
      localStorage.setItem('userAvatar', data.userAvatar);
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      message.error('Error!');
    }
  };

  return (
    <div className="flex justify-center items-center mt-[150px]">
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="w-[325px] p-5 border border-[#d9d9d9] rounded-[5px] bg-[#f0f2f5]">
        <div className="login-header">
          <span>{isRegistering ? 'Already have an account?' : "Don't have an account yet?"}</span>
          <Button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Login' : 'Register'}
          </Button>
        </div>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input placeholder="JGx1X@example.com" />
        </Form.Item>
        {isRegistering && (
          <Form.Item
            label="Full Name"
            name="fullname"
            rules={[{ required: true, message: 'Please input your full name!' }]}>
            <Input placeholder="John Doe" />
          </Form.Item>
        )}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password placeholder="******" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {!isRegistering ? 'Login' : 'Register'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
