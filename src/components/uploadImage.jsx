import React, { useState , useEffect } from 'react';
import { Upload, Image} from 'antd'; // 对应 el-upload、img、Plus 图标
import { PlusOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface'; // 类型定义（TS 可选）
import 'antd/dist/reset.css'; // AntD 样式重置
import style from '../css/uploadImage.css';
import classNames from "classnames/bind";
const cls = classNames.bind(style);
function UploadImage(props) {
  // 对应 Vue 中的 employee.image（头像地址，用于回显）
  const imageUrl = props.formData.image;
  const [avatarUrl, setAvatarUrl] = useState(imageUrl);
  
  // 对应 Vue 中的 token（用于请求头）
  const token = localStorage.getItem('token'); // 假设 token 存在本地存储
  useEffect(() => {
    setAvatarUrl(props.formData.image);
  }, [props.formData.image]);
  // 对应 el-upload 的 :on-success（上传成功回调）
  const handleAvatarSuccess = (response, file) => {
    // 后端返回的图片地址，替换为你的接口实际返回字段（比如 response.data.url）
    setAvatarUrl(response.data);
    props.setFormData({ ...props.formData, image: response.data });
    console.log('上传成功，头像地址：', response.data);
  };

  // 对应 el-upload 的 :before-upload（上传前校验）
  const beforeAvatarUpload = (file) => {
    const isImage = file.type.startsWith('image/'); // 仅允许图片
    const isLt2M = file.size / 1024 / 1024 < 2; // 限制 2MB 以内

    if (!isImage) {
      alert('请选择图片文件！');
      return false; // 阻止上传
    }
    if (!isLt2M) {
      alert('图片大小不能超过 2MB！');
      return false; // 阻止上传
    }
    return true; // 允许上传
  };

  return (
    <>
      <label htmlFor="">图片上传：</label>
      <Upload
        className={cls('avatar-uploader')}
        action="/api/upload/image" // 直接指定后端接口地址（和 el-upload 的 action 完全一致）
        showUploadList={false} // 对应 el-upload 的 :show-file-list="false"
        onSuccess={handleAvatarSuccess} // 上传成功回调
        beforeUpload={beforeAvatarUpload} // 上传前校验
        headers={{ token }} // 携带 token 请求头（和 el-upload 的 :headers 一致）
      >
        {/* 头像回显：有地址显示图片，无地址显示 Plus 图标（和 Vue 逻辑一致） */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt=""
            style={{ width: '90px', height: '90px', objectFit: 'cover' }} 
          />
        ) : (
          <div className={cls('avatar-uploader-icon')}>
              <PlusOutlined style={{ fontSize: '18px', padding: '30px'}} />
          </div>
        )}
      </Upload>

      
    </>
  );
};

export default UploadImage;