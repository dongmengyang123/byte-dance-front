// src/utils/request.js
import axios from 'axios';

// 创建 axios 实例（统一配置）
const service = axios.create({
  // 基础路径：本地后端服务的「域名+端口」（核心！）
  // 假设你的本地后端端口是 8080（根据实际后端端口修改！）
  baseURL: '/api',
  timeout: 5000, // 请求超时时间（5秒没响应就报错）
  headers: {
    'Content-Type': 'application/json' // 告诉后端请求体是 JSON 格式（大多数后端需要）
  }
});

export default service; // 导出配置好的 axios 实例