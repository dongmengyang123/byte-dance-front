import service from '../utils/request.js';
export const userList = (status, createTimeStart, createTimeEnd, approvalTimeStart, approvalTimeEnd, approvalProject, approvalDepartment) => service.get(`/user/list?status=${status}&createTimeStart=${createTimeStart}&createTimeEnd=${createTimeEnd}&approvalTimeStart=${approvalTimeStart}&approvalTimeEnd=${approvalTimeEnd}&approvalProject=${approvalProject}&approvalDepartment=${approvalDepartment}`);

export const userAdd = (data) => service.post('/user/insert', data);

export const userSearch = (id) => service.get(`/user/search/${id}`);

export const userEdit = (data) => service.put('/user/update', data);
