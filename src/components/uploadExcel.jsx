// 1. 从 antd 导入主组件（移除 FileOutlined）
import { Upload, Button, List, Card, message } from 'antd';
// 2. 从 @ant-design/icons 合并导入两个图标（避免重复）
import { FileOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
// import cls from 'classnames';
import style from '../css/uploadImage.css';
import classNames from "classnames/bind";
import { Typography } from 'antd';
const { Link } = Typography; // 从 Typography 中获取 Link 组件
const cls = classNames.bind(style);
// 附件上传组件
function UploadExcel(props) {
  const excelUrl = props.formData.excel;
  const [avatarUrl, setAvatarUrl] = useState(excelUrl);

   useEffect(() => {
     setAvatarUrl(props.formData.excel);
   }, [props.formData.excel]);
  


  // 上传前校验：仅允许Excel文件，限制大小（示例5MB）
  const beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      || file.type === 'application/vnd.ms-excel';
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isExcel) {
      message.error('请上传Excel文件（.xlsx/.xls格式）！');
      return false;
    }
    if (!isLt5M) {
      message.error('Excel文件大小不能超过5MB！');
      return false;
    }
    return true;
  };

  // 上传成功回调：保存后端返回的文件信息
  const handleUploadSuccess = (response, file) => {
    // 后端返回的图片地址，替换为你的接口实际返回字段（比如 response.data.url）
    setAvatarUrl(response.data);
    props.setFormData({ ...props.formData, excel: response.data });
    console.log('上传成功，文件地址：', response.data);
  };


  // 点击文件打开（新标签页跳转OSS地址）
  const handleFileClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className={cls('excel-upload-container')}>
      <Upload
        className={cls('excel-uploader')}
        action="/api/upload/image" // 后端附件上传接口（区别于图片接口）
        showUploadList={false} // 隐藏默认上传列表，自定义显示
        beforeUpload={beforeUpload}
        onSuccess={handleUploadSuccess}
        multiple // 支持多文件上传
        accept=".xlsx,.xls" // 仅允许Excel文件（前端过滤）
      >
        <Button icon={<PlusOutlined />} type="primary">
          选择Excel文件
        </Button>
      </Upload>

      {/* 已上传文件列表（自定义回显） */}
      {avatarUrl ? (
        <div>
          <Link
            href={excelUrl}
            target="_blank"
            onClick={() => handleFileClick(excelUrl)} // 可选：添加额外逻辑
          >
            打开文件
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default UploadExcel;