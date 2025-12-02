import { React, useState } from 'react';
import Filter from '../components/filter.jsx';
import Show from '../components/show.jsx';
import style from '../css/filter.css';
import AddForm from '../components/addForrm.jsx';
import classNames from "classnames/bind";
const cls = classNames.bind(style);
export default function User(props) {
  // 对应筛选条件
  const [filter, setFilter] = useState({
    status: '',
    createTimeStart: '',
    createTimeEnd: '',
    approvalTimeStart: '',
    approvalTimeEnd: '',
    approvalProject: '',
    approvalDepartment: '',
  });

  // 要渲染的数据
  const [data, setData] = useState([]);

  // 展示新增表单
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <div><Filter filter={filter} setFilter={setFilter} data={data} setData={setData} role={props.role} /></div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '40px' }}>
        {/* <button className={cls('btn btn-insert')} onClick={openModal}>新增审批</button> */}
        <AddForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} filter={filter} setFilter={setFilter} data={data} setData={setData} />
      </div>
      <div><Show data={data} role={props.role} filter={filter} setFilter={setFilter} setData={setData} /></div>
    </div>

  )
}
