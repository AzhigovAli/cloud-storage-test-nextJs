'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

import { Avatar, Dropdown, Layout, Typography } from 'antd';
const { Header } = Layout;
import { UserOutlined } from '@ant-design/icons';
import { menu } from '../mock';

const inter = Inter({ subsets: ['latin'] });
export default function RootLayout({ children }) {
  const token = localStorage.getItem('token');
  const userAvatar = localStorage.getItem('userAvatar');
  const { originalname } = JSON.parse(userAvatar);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header className="flex items-center justify-between relative">
          <Link href="/">
            <Typography strong className="text-[#fff] text-[28px]">
              Cloud Storage
            </Typography>
          </Link>
          <Dropdown overlay={menu} placement="bottomRight">
            <div className="gap-2 flex cursor-pointer items-center">
              <Typography strong className="text-[#fff]">
                {token}
              </Typography>
              {originalname ? (
                <img src={originalname} className="w-[40px] h-[40px] rounded-[50%]" />
              ) : (
                <Avatar
                  className="text-[#f56a00] bg-[#fde3cf]"
                  icon={<UserOutlined />}
                  preview={false}
                />
              )}
            </div>
          </Dropdown>
        </Header>
        {children}
      </body>
    </html>
  );
}
