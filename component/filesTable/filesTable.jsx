import React, { useEffect } from 'react'
import './filesTable.css'
import { Layout, message, Upload, Image } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { deleteFile, getFiles, getBase64 } from '../../api/service'
import { create } from 'zustand'

const { Content } = Layout

export const useFilesTableStore = create((set) => ({
  fileList: [],
  previewImage: '',
  previewOpen: false,
  setPreviewOpen: (previewOpen) => set({ previewOpen }),
  setPreviewImage: (previewImage) => set({ previewImage }),
  setFileList: (fileList) => set({ fileList }),
  handlePreview: async (file) => {
    if (!file.url && !file.preview) {
      const previewImage = await getBase64(file.originFileObj)
      set({ previewImage, previewOpen: true })
    } else {
      set({ previewImage: file.url || file.preview, previewOpen: true })
    }
  },
  handleChange: ({ fileList }) => set({ fileList }),
  handleDeleteFile: async (file) => {
    try {
      await deleteFile(file.id || file.response.id)
      message.success('File deleted successfully')
    } catch (error) {
      message.error('Error deleting file')
      console.log('Error deleting file:', error)
    }
  },
}))

export const FilesTable = () => {
  const {
    fileList,
    previewImage,
    previewOpen,
    handlePreview,
    handleChange,
    handleDeleteFile,
    setFileList,
    setPreviewOpen,
  } = useFilesTableStore()

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFiles()
        setFileList(data)
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <Layout className="pt-[12px] pb-[12px] rounded-[10px]">
        <Content className="pl-[24px] pr-[24px] min-h-[280px] overflow-auto">
          <Upload
            action="http://localhost:5555/file"
            listType="picture-card"
            fileList={fileList}
            onRemove={handleDeleteFile}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: setPreviewOpen,
              }}
              src={previewImage}
            />
          )}
        </Content>
      </Layout>
    </div>
  )
}
