import { React, useState } from 'react';
import style from '../css/modalForm.css'; // 引入自定义样式
import { userAdd } from '../api/user.js';
import { message } from 'antd';
import classNames from "classnames/bind";
import { userList } from '../api/user.js';
import UploadImage  from './uploadImage.jsx';
import UploadExcel  from './uploadExcel.jsx';
const cls = classNames.bind(style);

function AddForm(props) {
  // 1. 状态管理：控制弹窗显示/隐藏 + 表单数据 + 错误信息
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    approvalProject: '',
    approvalContent: '',
    approvalDepartment: '',
    approvalDate: '',
    image: '',
    excel: ''
  });
  // 存储各字段错误信息
  const [errors, setErrors] = useState({});

  // 2. 表单数据同步：受控组件 onChange 事件
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 输入时实时清除对应字段的错误提示（提升用户体验）
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 3. 表单校验逻辑
  /**
   * 单个字段校验
   * @param {string} name 字段名
   * @param {string} value 字段值
   * @returns {string} 错误信息（空字符串表示无错误）
   */
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      // 审批项目：不能为空 + 不超过20字
      case 'approvalProject':
        if (!value.trim()) {
          error = '审批项目不能为空';
        } else if (value.length > 20) {
          error = `审批项目不能超过20字（当前${value.length}字）`;
        }
        break;
      // 申请内容：不能为空 + 不超过300字
      case 'approvalContent':
        if (!value.trim()) {
          error = '申请内容不能为空';
        } else if (value.length > 300) {
          error = `申请内容不能超过300字（当前${value.length}字）`;
        }
        break;
      // 申请部门：不能为空 + 三级级联格式（A-B-C）
      case 'approvalDepartment':
        const departmentReg = /^[^\s-]+-[^\s-]+-[^\s-]+$/; // 禁止空格、禁止连续横杠、禁止首尾横杠
        if (!value.trim()) {
          error = '申请部门不能为空';
        } else if (!departmentReg.test(value)) {
          error = '请输入三级级联格式（例：A部门-B子部门-C团队）';
        }
        break;
      // 申请日期：不能为空
      case 'approvalDate':
        if (!value) {
          error = '申请时间不能为空';
        }
        break;
      default:
        break;
    }
    return error;
  };

  /**
   * 整体表单校验（提交前调用）
   * @returns {boolean} 是否校验通过
   */
  const validateForm = () => {
    const newErrors = {};
    // 遍历所有表单字段进行校验
    Object.entries(formData).forEach(([key, value]) => {
      const fieldError = validateField(key, value);
      if (fieldError) {
        newErrors[key] = fieldError;
      }
    });
    // 更新错误信息状态
    setErrors(newErrors);
    // 无错误则校验通过
    return Object.keys(newErrors).length === 0;
  };

  // 4. 失去焦点时触发单个字段校验（实时反馈）
  const handleBlur = (name) => {
    const value = formData[name];
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  // 5. 弹窗操作：打开、关闭、提交
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // 重置表单数据和错误信息
    setFormData({
      approvalProject: '',
      approvalContent: '',
      approvalDepartment: '',
      approvalDate: '',
      image: '',
      excel: ''
    });
    setErrors({});
  };
  let _filter = props.filter;
  const [filter, setFilter] = useState(_filter);

  let _data = props.data;
  const [data, setData] = useState(_data);
  const search = async () => { 
      let result = [];
      result = await userList(filter.status, filter.createTimeStart, filter.createTimeEnd, filter.approvalTimeStart, filter.approvalTimeEnd, filter.approvalProject, filter.approvalDepartment);
      let _data = result.data.data;
      setData(_data);
      props.setData(_data)
    };
  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止默认表单提交

    // 提交前执行最终校验
    const isValidatePass = validateForm();
    if (!isValidatePass) {
      message.warning('表单填写不符合要求，请检查错误提示后重试');
      return; // 校验失败，不提交请求
    }

    // 校验通过，发起接口请求
    try {
      const result = await userAdd(formData);
      // 假设接口返回 code 为 truthy 时表示成功（根据实际接口调整）
      if (result.data.code) {
        message.success('新增成功');
        search();
      } else {
        message.error('新增失败：' + (result.data.msg || '未知错误'));
      }
    } catch (error) {
      message.error('提交失败：网络错误或服务器异常');
      console.error('提交错误详情：', error);
    } finally {
      closeModal(); // 无论成功失败，都关闭弹窗
    }
  };

  return (
    <div>
      <button onClick={openModal} className={cls('open-modal-btn')}>
        新增审批
      </button>

      {isModalOpen && (
        <div className={cls('modal-overlay')} onClick={closeModal}>
          <div className={cls('modal-content')} onClick={(e) => e.stopPropagation()}>
            <div className={cls('modal-header')}>
              <h3>新增审批表单</h3>
              <button className={cls('close-btn')} onClick={closeModal}>×</button>
            </div>
            {/* Form 表单 */}
            <form onSubmit={handleSubmit} className={cls('modal-form')}>
              {/* 审批项目 */}
              <div className={cls('form-item')}>
                <label htmlFor="approvalProject">审批项目：</label>
                <input
                  type="text"
                  id="approvalProject"
                  name="approvalProject"
                  value={formData.approvalProject}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('approvalProject')} // 失去焦点校验
                  maxLength={20} // 限制输入长度（配合校验）
                  required
                />
                {/* 错误提示 */}
                {errors.approvalProject && (
                  <span className={cls('error-message')}>{errors.approvalProject}</span>
                )}
              </div>

              {/* 申请内容 */}
              <div className={cls('form-item')}>
                <label htmlFor="approvalContent">申请内容：</label>
                <textarea
                  id="approvalContent"
                  name="approvalContent"
                  value={formData.approvalContent}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('approvalContent')} // 失去焦点校验
                  rows={4}
                  maxLength={300} // 限制输入长度（配合校验）
                  required
                />
                {/* 错误提示 + 字数统计 */}
                <div className={cls('form-footer-item')}>
                  {errors.approvalContent && (
                    <span className={cls('error-message')}>{errors.approvalContent}</span>
                  )}
                  <span className={cls('word-count')}>
                    {formData.approvalContent.length}/300 字
                  </span>
                </div>
              </div>

              {/* 申请部门 */}
              <div className={cls('form-item')}>
                <label htmlFor="approvalDepartment">申请部门：</label>
                <input
                  type="text"
                  id="approvalDepartment"
                  name="approvalDepartment"
                  value={formData.approvalDepartment}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('approvalDepartment')} // 失去焦点校验
                  placeholder="例：A部门-B子部门-C团队"
                  required
                />
                {/* 错误提示 */}
                {errors.approvalDepartment && (
                  <span className={cls('error-message')}>{errors.approvalDepartment}</span>
                )}
              </div>

              {/* 申请时间 */}
              <div className={cls('form-item')}>
                <label htmlFor="approvalDate">申请时间：</label>
                <input
                  type="datetime-local"
                  id="approvalDate"
                  name="approvalDate"
                  value={formData.approvalDate}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('approvalDate')} // 失去焦点校验
                  required
                />
                {/* 错误提示 */}
                {errors.approvalDate && (
                  <span className={cls('error-message')}>{errors.approvalDate}</span>
                )}
              </div>

              
              <div className={cls('form-item')}>
                <UploadImage
                  avatarUrl={formData.image}
                  setFormData={setFormData}
                  formData={formData}
                />
              </div>

              <div className={cls('form-item')}>
                <UploadExcel avatarUrl={formData.excel}
                  setFormData={setFormData}
                  formData={formData}
                />
              </div>

              {/* 表单底部按钮 */}
              <div className={cls('form-footer')}>
                <button type="button" className={cls('cancel-btn')} onClick={closeModal}>
                  取消
                </button>
                <button type="submit" className={cls('submit-btn')}>
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddForm;