import { React, useState } from 'react';
import style from '../css/show.css';
import classNames from "classnames/bind";
import SearchForm from './searchForm';
import EditForm from './editForm';
import { adminPass, adminReject, adminList } from '../api/admin.js';
import { message, Modal } from 'antd';
import { userList } from '../api/user.js';
const cls = classNames.bind(style);
function Show(props) {
  // const data = props.data;
  const role = props.role;
  let _filter = props.filter;
  const [filter, setFilter] = useState(_filter);

  let _data = props.data;
  const [data, setData] = useState(_data);
  const pass = async (id) => { 
    const result = await adminPass(id);
    if (result.data.code) { 
      message.success('已通过');
      // 通过之后要重新查询一次
      search();  
    } else { 
      message.error('系统异常');
    }
  }

  const reject = async (id) => {
    Modal.confirm({
      title: '确认拒绝',
      content: '您确定要拒绝此申请吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const result = await adminReject(id);
        if (result.data.code) {
          message.success('已拒绝');
          search();
        } else {
          message.error('系统异常');
        }
      },
      onCancel: () => {
        // 用户取消操作
        message.info('已取消');
      }
    });
  }

  const search = async () => { 
      let result = [];
      if (role === 0) {
        result = await userList(filter.status, filter.createTimeStart, filter.createTimeEnd, filter.approvalTimeStart, filter.approvalTimeEnd, filter.approvalProject, filter.approvalDepartment);
      } else { 
        result = await adminList(filter.status, filter.createTimeStart, filter.createTimeEnd, filter.approvalTimeStart, filter.approvalTimeEnd, filter.approvalProject, filter.approvalDepartment);
      }
      let _data = result.data.data;
      setData(_data);
      props.setData(_data)
    };
  const showButtons = (id) => {
    if (role === 0) {
      return (
        <div className={cls('button-container')}>
          <SearchForm id={id} role={role} />
          <EditForm id={id} filter={props.filter} setFilter={props.setFilter} data={data} setData={props.setData} />
        </div>
      )
    } else {
      return (
        <div className={cls('button-container')}>
          <SearchForm id={id} role={role} /> <button className={cls('pass-button')} onClick={() => pass(id)}>通过</button> <button className={cls('reject-button')} onClick={() => reject(id)} >拒绝</button>
        </div>
      )
    }
  }

  return (
    <div className={cls('table-container')}>
      <table className='show-table'>
        <thead>
          <tr>
            <th>审批状态</th>
            <th>创建时间</th>
            <th>审批时间</th>
            <th>审批项目</th>
            <th>申请部门</th>
            <th>头像</th>
            <th>查看附件</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {
            _data.map((item, index) => (
              <tr key={index}>
                <td>{
                  { 0: '审批拒绝', 1: '待审批', 2: '审批通过' }[item.status] || '-'}
                </td>
                <td>{item.createTime || '-'}</td>
                <td>{item.approvalTime || '-'}</td>
                <td><span
                  title={item.approvalContent || '无申请内容'}
                  style={{ cursor: 'pointer' }} // 可选：鼠标变成指针，提示可悬浮
                >
                  {item.approvalProject || '-'}
                </span></td>
                <td>{item.approvalDepartment || '-'}</td>
                <td><img src={item.image || '-'} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} /></td>
                <td><a style={{ color: item.excel ? 'blue' : 'gray' }} href={item.excel || '-'} target="_blank"> {item.excel ? '查看附件' : '无附件'}</a></td>
                <td>{showButtons(item.id)}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
export default Show;