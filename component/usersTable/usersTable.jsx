import React, { useMemo, useCallback } from 'react';
import { changeAvatar, updateUser } from '../../api/service';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Layout, Table, Modal, Avatar, message, Input, Space, Button, Upload } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { create } from 'zustand';
import './usersTable.css';

const { Content } = Layout;
const { Search } = Input;

const useUsersTableStore = create((set, get) => ({
  searchText: '',
  avatarFile: null,
  editingUser: null,
  modalVisible: false,
  setModalVisible: (modalVisible) => set({ modalVisible }),
  setEditingUser: (editingUser) => set({ editingUser }),
  setSearchText: (searchText) => set({ searchText }),
  setAvatarFile: (avatarFile) => set({ avatarFile }),
  handleUserClick: (user) => {
    set({ editingUser: user });
    set({ modalVisible: true });
  },
  copyText: (text) => {
    navigator.clipboard.writeText(text);
    message.success('Text copied to clipboard');
  },
}));

export const UsersTable = ({ users, columns, onDelete }) => {
  const {
    searchText,
    avatarFile,
    editingUser,
    modalVisible,
    setModalVisible,
    setEditingUser,
    setSearchText,
    setAvatarFile,
    handleUserClick,
    copyText,
  } = useUsersTableStore();

  const closeModal = () => {
    setModalVisible(false);
    setEditingUser(null);
    setAvatarFile(null);
  };

  const handleDeleteMemoized = useCallback(
    async (user) => {
      Modal.confirm({
        title: 'Confirm',
        content: `Are you sure you want to delete user ${user.fullname}?`,
        async onOk() {
          if (localStorage.getItem('token') === user.fullname) {
            message.error('You cannot delete yourself.');
          } else {
            await onDelete(user);
            await message.success(`User ${user.fullname} deleted successfully.`);
            window.location.reload();
          }
        },
        onCancel() {},
      });
    },
    [onDelete],
  );

  const handleUpdateUserMemoized = useCallback(async () => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      console.log(avatarFile);
      await changeAvatar(editingUser.id, formData);
    }
    await updateUser(editingUser.id, editingUser);
    closeModal();
    message.success(`User ${editingUser.fullname} updated successfully.`);
  }, [avatarFile, editingUser, closeModal]);

  const columnsWithActions = [
    ...columns,
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, user) => (
        <DeleteOutlined style={{ color: 'red' }} onClick={() => handleDeleteMemoized(user)} />
      ),
    },
  ];

  const filteredData = useMemo(() => {
    return users.filter((user) => user.fullname.toLowerCase().includes(searchText.toLowerCase()));
  }, [users, searchText]);

  return (
    <div>
      <Layout className="pt-[12px] pb-[12px] rounded-[8px]">
        <Content className="min-h-[280px] pl-[24px] pr-[24px] ">
          <Space className="searchInput">
            <Search
              placeholder="Search by name"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={(value) => setSearchText(value)}
            />
          </Space>
          <Table
            dataSource={searchText ? filteredData : users}
            columns={columnsWithActions}
            onRow={(record) => ({
              onClick: () => handleUserClick(record),
            })}
          />
          <Modal
            title="User Information"
            visible={modalVisible}
            onCancel={closeModal}
            footer={[
              <Button key="cancel" onClick={closeModal}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleUpdateUserMemoized}>
                Save Changes
              </Button>,
            ]}>
            {editingUser && (
              <div>
                <p>
                  <strong>ID:</strong> {editingUser.id}
                </p>
                <p>
                  <strong>Avatar:</strong>
                  {avatarFile ? (
                    <Avatar src={URL.createObjectURL(avatarFile)} />
                  ) : (
                    <Avatar src={editingUser.userAvatar} />
                  )}
                  <Upload
                    accept="image/*"
                    beforeUpload={(file) => {
                      setAvatarFile(file);
                      return false;
                    }}
                    showUploadList={false}>
                    <Button>Change Avatar</Button>
                  </Upload>
                </p>
                <p>
                  <strong>Phone:</strong>{' '}
                  <div className="email-input">
                    <Input
                      name="phone"
                      value={editingUser.phone}
                      onChange={(e) => {
                        setEditingUser({
                          ...editingUser,
                          phone: e.target.value,
                        });
                      }}
                    />
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => {
                        copyText(editingUser.phone);
                      }}
                    />
                  </div>
                </p>
                <p>
                  <strong>Full Name:</strong>{' '}
                  <div className="email-input">
                    <Input
                      name="fullname"
                      value={editingUser.fullname}
                      onChange={(e) => {
                        setEditingUser({
                          ...editingUser,
                          fullname: e.target.value,
                        });
                      }}
                    />
                    <Button
                      type="text"
                      onClick={() => {
                        copyText(editingUser.fullname);
                      }}
                      icon={<CopyOutlined />}
                    />
                  </div>
                </p>
                <p>
                  <strong>Email:</strong>
                  <div className="email-input">
                    <Input
                      name="email"
                      value={editingUser.email}
                      onChange={(e) => {
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        });
                      }}
                    />
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => {
                        copyText(editingUser.email);
                      }}
                    />
                  </div>
                </p>
              </div>
            )}
          </Modal>
        </Content>
      </Layout>
    </div>
  );
};
