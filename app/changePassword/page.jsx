'use client';

import React from 'react';
import axios from '../../api/axios';
import { onFinishFailed } from '../../api/service';
import { Form, Input, Button, message } from 'antd';
import { create } from 'zustand';

export const useChangePasswordStore = create((set) => ({
  password: '',
  onFinish: async (password) => {
    try {
      const { data } = await axios.patch(`/auth/reset-password`, password);
      message.success('Success!');
      window.location.href = '/';
      return data;
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      message.error('Error!');
    }
  },
}));

const ChangePassword = () => {
  const { onFinish } = useChangePasswordStore();
  if (!localStorage.getItem('token')) {
    window.location.href = '/';
  }
  return (
    <div className="flex justify-center items-center mt-[150px]">
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={(password) => onFinish(password)}
        onFinishFailed={onFinishFailed}
        className="w-[325px] p-5 border border-[#d9d9d9] rounded-[5px] bg-[#f0f2f5]">
        <div>
          <span>Change Password</span>
        </div>
        <Form.Item
          label="Password"
          name="password"
          className="mt-5"
          rules={[{ required: true, message: 'Please input your new password!' }]}>
          <Input.Password placeholder="******" />
        </Form.Item>
        <Form.Item>
          <Button className="w-[100%]" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
