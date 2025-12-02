import { React, useState } from 'react';
import style from '../css/header.css';
import classNames from "classnames/bind";
const cls = classNames.bind(style);
function Header(props) {

  let _role = props.role;
  const [role,setRole] = useState(_role);
  const changeRole = () => {
    let _role = role
    _role = _role === 0 ? 1 : 0;
    setRole(_role);
    props.setRole(_role);
  };
  return (
    <header>
      <div className={cls('header')}>
        <h1>审批查询页</h1>
        <h5>当前用户：</h5>
        <span>{props.role === 0 ? '申请人' : '审批人'}</span>
        <button onClick={changeRole}>切换用户</button>
      </div>
    </header>
  );
}

export default Header;