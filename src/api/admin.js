import service from '../utils/request.js';
export const adminList = (status, createTimeStart, createTimeEnd, approvalTimeStart, approvalTimeEnd, approvalProject, approvalDepartment) => service.get(`/admin/list?status=${status}&createTimeStart=${createTimeStart}&createTimeEnd=${createTimeEnd}&approvalTimeStart=${approvalTimeStart}&approvalTimeEnd=${approvalTimeEnd}&approvalProject=${approvalProject}&approvalDepartment=${approvalDepartment}`);

export const adminSearch = (id) => service.get(`/admin/search/${id}`);

export const adminPass = (id) => service.put(`/admin/pass/${id}`);
export const adminReject = (id) => service.put(`/admin/reject/${id}`);
