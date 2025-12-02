import { React, useEffect, useState } from 'react';
import style from '../css/filter.css';
import classNames from "classnames/bind";
import { adminList } from '../api/admin.js';
import { userList } from '../api/user.js';
import Show from '../components/show.jsx';
import service from '../utils/request.js';
const cls = classNames.bind(style);
function Filter(props) {
  // 接收admin的筛选条件
  let _filter = props.filter;
  const [filter, setFilter] = useState(_filter);

  let _data = props.data;
  const [data, setData] = useState(_data);

  const role = props.role;
  const statusList = () => { 
    if (role === 0) {
      return (
        <>
          <option value="">请选择</option>
          <option value="0">审批拒绝</option>
          <option value="1">待审批</option>
          <option value="2">审批通过</option>
        </>
      )
    }else { 
      return (
        <>
          <option value="1">待审批</option>
        </>
      )
    }
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
  useEffect(() => { 
    search();
  }, [filter]);
  const reset = () => { 
    setFilter({
      status: _filter.status,
      createTimeStart: '',
      createTimeEnd: '',
      approvalTimeStart: '',
      approvalTimeEnd: '',
      approvalProject: '',
      approvalDepartment: '',
    });
  };
  return (
    <div>
        <form action="" onSubmit={(e) => e.preventDefault()} className={cls('filter-form')}>
        <div className={cls('filter-item')}>
          <span className={cls('filter-title')}>筛选条件</span>
          <div className={cls('filter-item-row')}>
            <label htmlFor="props.status" className={cls('filter-label')}>审批状态：</label>
            <select className={cls('form-input')} value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
              {statusList()}
            </select>

            <label htmlFor="" className={cls('filter-label')}>创建时间：</label>
            <input type="datetime-local" className={cls('form-input')} value={filter.createTimeStart} onChange={(e) => setFilter({ ...filter, createTimeStart: e.target.value })} />
            <span>~</span>
            <input type="datetime-local" className={cls('form-input')} value={filter.createTimeEnd} onChange={(e) => setFilter({ ...filter, createTimeEnd: e.target.value })} />

            <label htmlFor="" className={cls('filter-label')}>审批时间：</label>
            <input type="datetime-local" className={cls('form-input')} value={filter.approvalTimeStart} onChange={(e) => setFilter({ ...filter, approvalTimeStart: e.target.value })} />
            <span>~</span>
            <input type="datetime-local" className={cls('form-input')} value={filter.approvalTimeEnd} onChange={(e) => setFilter({ ...filter, approvalTimeEnd: e.target.value })} />
          </div>

          <div className={cls('filter-item-row')}>
            <label htmlFor="" className={cls('filter-label')}>审批项目：</label>
            <input type="text" className={cls('form-input')} value={filter.approvalProject} onChange={(e) => setFilter({ ...filter, approvalProject: e.target.value })} />

            <label htmlFor="" className={cls('filter-label')}>审请部门：</label>
            <input type="text" className={cls('form-input')} value={filter.approvalDepartment} onChange={(e) => setFilter({ ...filter, approvalDepartment: e.target.value })} />

            <button onClick={search} className={cls('btn btn-search')}>查询</button>
            <button onClick={reset} className={cls('btn btn-reset')}>清空</button>
          </div>
        </div>
        
        

        

        

        

      </form>
    </div>
  )
}

export default Filter;