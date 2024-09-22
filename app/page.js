'use client';

import { Login } from '../component/login/Login';
import { sideBarItems, columns } from '../mock';
import React, { useEffect, useState } from 'react';
import { deleteUser, getUsers } from '../api/service';
import { UsersTable } from '../component/usersTable/usersTable';
import { FilesTable } from '../component/filesTable/filesTable';

const { Content, Sider } = Layout;
import { Layout, Menu } from 'antd';

import { create } from 'zustand';

export const useHomeStore = create((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));

const Home = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const token = localStorage.getItem('token');
  const { users, setUsers } = useHomeStore();

  function handleMenuClick(item) {
    setSelectedMenuItem(item.key);
  }

  const handleDelete = (user) => {
    deleteUser(user.id);
  };

  useEffect(() => {
    if (token) {
      getUsers().then((data) => {
        setUsers(data);
      });
    }
  }, [token]);

  return (
    <Layout className="min-h-[100vh]">
      {!token ? (
        <Login />
      ) : (
        token && (
          <Content className="mt-[150px] mb-[150px]  pl-[300px] pr-[300px]">
            <Layout className="pt-[12px] pb-[12px]  bg-[#ffffff] rounded-[8px]">
              <Sider className="bg-[#ffffff]" width={200}>
                <Menu
                  mode="inline"
                  selectedKeys={[selectedMenuItem]}
                  defaultOpenKeys={['sub1']}
                  onClick={handleMenuClick}
                  className="h-[100%]"
                  items={sideBarItems}
                />
              </Sider>
              <Content className=" pr-[24px] pl-[24px] min-h-[280px]">
                {selectedMenuItem === '1' ? (
                  <UsersTable users={users} columns={columns} onDelete={handleDelete} />
                ) : (
                  <FilesTable />
                )}
              </Content>
            </Layout>
          </Content>
        )
      )}
    </Layout>
  );
};

export default Home;
