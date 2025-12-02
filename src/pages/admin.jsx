import { React, useState } from 'react';
import Filter from '../components/filter.jsx';
import Show from '../components/show.jsx';
export default function Admin(props) {
  // 对应筛选条件
  const [filter, setFilter] = useState({
            status: '1',
            createTimeStart: '',
            createTimeEnd: '',
            approvalTimeStart: '',
            approvalTimeEnd: '',
            approvalProject: '',
            approvalDepartment: '',
  });
  
  // 要渲染的数据
  const [data, setData] = useState([]);
  
  
  return (
    <div>
      <div><Filter filter={filter} setFilter={setFilter} data={data} setData={setData} role={props.role} /></div>
      <div><Show data={data} role={props.role} filter={filter} setFilter={setFilter} setData={setData} /></div>
    </div>
   
  )
}
