// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // 配置代理：所有以 "/api" 开头的请求，都转发到本地后端 8080 端口
  app.use(
    '/api', // 前端请求的前缀（可自定义，比如 '/api' 或 '/backend'）
    createProxyMiddleware({
      target: 'http://localhost:8080', // 本地后端服务地址（端口按实际修改）
      changeOrigin: true, // 允许跨域（关键配置）
      pathRewrite: {
        '^/api': '' // 重写路径：去掉请求前缀 "/api"（核心！）
        // 举例：前端请求 "/api/approval/filter" → 转发后变成 "http://localhost:8080/approval/filter"
      }
    })
  );
};