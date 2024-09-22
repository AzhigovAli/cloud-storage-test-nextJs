'use client';

import './profile.css';
import React, { useEffect } from 'react';
import axios from '../../api/axios';
import { Avatar, Form, Button, Layout, Typography, message, Upload } from 'antd';
import Link from 'next/link'; // Исправленный импорт для Link
import { UserOutlined } from '@ant-design/icons';
import { changeAvatar } from '../../api/service';
import { create } from 'zustand';
const { Paragraph } = Typography;

// Хук состояния профиля с использованием zustand
export const useProfileStore = create((set) => ({
  user: null,
  fields: {
    email: '',
    fullname: '',
    password: '',
    phone: '',
    avatarFile: null,
  },
  setUser: (user) => set({ user }),
  setFields: (fields) => set({ fields }),
  handleAvatarChange: (event) =>
    set((state) => ({ fields: { ...state.fields, avatarFile: event.target.files[0] } })),
  updateUser: async (fields) => {
    try {
      await axios.put(`/users/${localStorage.getItem('id')}`, {
        email: fields.email,
        fullname: fields.fullname,
        password: fields.password,
        phone: fields.phone,
      });
      message.success('Пользователь успешно обновлен');
    } catch (error) {
      message.error('Ошибка обновления пользователя');
      console.log('Ошибка обновления пользователя:', error);
    }
  },
}));

// Компонент профиля
const Profile = () => {
  const { user, setUser, fields, setFields, handleAvatarChange, updateUser } = useProfileStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${localStorage.getItem('id')}`);
        const userData = response.data;
        setUser(userData);
        setFields({
          email: userData.email,
          fullname: userData.fullname,
          password: userData.password,
          phone: userData.phone,
          avatarFile: null,
        });
      } catch (error) {
        console.log('Ошибка получения пользователя:', error);
      }
    };
    fetchUser();
  }, [setUser, setFields]);

  return (
    <Layout className="pt-[12px] pb-[12px] bg-[#ffffff] rounded-[8px]">
      <div className="flex justify-center items-center mt-[150px]">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          className="w-[325px] p-5 border border-[#d9d9d9] rounded-[5px] bg-[#f0f2f5]">
          {fields.avatarFile ? (
            <Avatar
              className="user-avatar text-[#f56a00] bg-[#fde3cf]"
              src={URL.createObjectURL(fields.avatarFile)}
            />
          ) : (
            <Avatar
              className="user-avatar text-[#f56a00] bg-[#fde3cf]"
              icon={<UserOutlined />}
              preview={false}
              src={user?.userAvatar}
            />
          )}
          <Form.Item>
            <Upload
              className="flex justify-center"
              accept="image/*"
              beforeUpload={async (file) => {
                handleAvatarChange({ target: { files: [file] } });
                await changeAvatar(localStorage.getItem('id'), file);
                return false;
              }}
              showUploadList={false}>
              <Button>Change Avatar</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Email">
            <Paragraph
              className="pt-[5px]"
              editable={{
                onChange: (value) => setFields({ ...fields, email: value }),
              }}>
              {fields.email}
            </Paragraph>
          </Form.Item>
          <Form.Item label="Fullname">
            <Paragraph
              className="pt-[5px]"
              editable={{
                onChange: (value) => setFields({ ...fields, fullname: value }),
              }}>
              {fields.fullname}
            </Paragraph>
          </Form.Item>
          <Form.Item label="Password">
            <Paragraph
              className="pt-[5px]"
              editable={{
                onChange: (value) => setFields({ ...fields, password: value }),
              }}>
              {fields.password}
            </Paragraph>
          </Form.Item>
          <Form.Item label="Phone">
            <Paragraph
              className="pt-[5px]"
              editable={{
                onChange: (value) => setFields({ ...fields, phone: value }),
              }}
              type="number">
              {fields.phone}
            </Paragraph>
          </Form.Item>
          <Form.Item>
            <Button
              className="w-[100%] mt-[10px]"
              type="primary"
              onClick={() => updateUser(fields)}>
              Save Changes
            </Button>
            <Link href="/">
              <Button className="w-[100%] mt-[10px]">Back</Button>
            </Link>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default Profile;
