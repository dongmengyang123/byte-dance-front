import { React, useState } from 'react';
import style from '../css/modalForm.css'; // 引入自定义样式
import { userAdd } from '../api/user.js';
import { message } from 'antd';
import classNames from "classnames/bind";
import { userList, userSearch } from '../api/user.js';
import { adminSearch } from '../api/admin.js';

const cls = classNames.bind(style);

function SearchForm(props) {
  // 1. 状态管理：控制弹窗显示/隐藏 + 表单数据 + 错误信息
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    approvalProject: '',
    approvalContent: '',
    approvalDepartment: '',
    createTime: '',
    approvalTime: '',
    status: '',
    id: '',
    image:''
  });

  const id = props.id;
  const role = props.role;

  // 5. 弹窗操作：打开、关闭、提交
  const openModal = async () => {
    setIsModalOpen(true);
    let result;
    // 发送请求查询数据
    if (role === 0) {
      result = await userSearch(id);
    } else { 
      result = await adminSearch(id);
    } 
    if (result.data.code) { 
      setFormData(result.data.data);
    } else { 
      message.error('系统出错了');
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    // 重置表单数据和错误信息
    setFormData({
      approvalProject: '',
      approvalContent: '',
      approvalDepartment: '',
      createTime: '',
      approvalTime: '',
      status: '',
      id: '',
      image: '',
      excel: ''
    });
  };


  return (
    <div>
      <button onClick={openModal} className={cls('search-btn')}>
        查看
      </button>

      {isModalOpen && (
        <div className={cls('modal-overlay')} onClick={closeModal}>
          <div className={cls('modal-content')} onClick={(e) => e.stopPropagation()}>
            <div className={cls('modal-header')}>
              <h3>查看详情</h3>
              <button className={cls('close-btn')} onClick={closeModal}>×</button>
            </div>

            {/* Form 表单 */}
            <form className={cls('modal-form')}>
              {/* 审批项目 */}
              <div className={cls('form-item')}>
                <label htmlFor="approvalProject">审批项目：</label>
                <input
                  type="text"
                  id="approvalProject"
                  name="approvalProject"
                  value={formData.approvalProject}
                  maxLength={20} // 限制输入长度（配合校验）
                  required
                  readOnly // 明确只读，解决警告
                />
              </div>

              {/* 申请内容 */}
              <div className={cls('form-item')}>
                <label htmlFor="approvalContent">申请内容：</label>
                <textarea
                  id="approvalContent"
                  name="approvalContent"
                  value={formData.approvalContent}
                  rows={4}
                  maxLength={300} // 限制输入长度（配合校验）
                  required
                  readOnly // 明确只读，解决警告
                />
              </div>

              {/* 申请部门 */}
              <div className={cls('form-item')}>
                <label htmlFor="approvalDepartment">申请部门：</label>
                <input
                  type="text"
                  id="approvalDepartment"
                  name="approvalDepartment"
                  value={formData.approvalDepartment}
                  required
                  readOnly // 明确只读，解决警告
                />
              </div>

              {/* 申请时间 */}
              <div className={cls('form-item')}>
                <label htmlFor="createTime">申请时间：</label>
                <input
                  type="datetime-local"
                  id="createTime"
                  name="createTime"
                  value={formData.createTime}
                  required
                  readOnly // 明确只读，解决警告
                />

              </div>

              <div className={cls('form-item')}>
                <label htmlFor="">查看头像：</label>
                <img src={formData.image} style={{ width: '90px', height: '90px', objectFit: 'cover' }} alt="" />
              </div>

              <div className={cls('form-item')}>
                <label htmlFor="excel"></label>
                <a  style={{color: 'blue'}} href={formData.excel || '-'} target="_blank"> {formData.excel ? '查看附件' : '无附件'}</a>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
