// 1. 根据 url 返回不同的文件
// 2. 处理查询参数
// 3. 匹配任意文件
// 4. 处理不存在的文件
// 5. 处理非 get 请求
// 6. 添加缓存选项
// 7. 响应内容启用 gzip
import * as http from 'http';
import * as fs from 'fs';
import * as p from 'path';
import * as url from 'url';

const server = http.createServer();
const publicDir = p.resolve(__dirname, 'public');

server.on('request', (request, response) => {
  const { method, url: path, headers } = request

  const { pathname, search } = url.parse(path)

  switch(pathname){
    case '/index.html':
      response.setHeader('Content-Type', 'text/html; charset=utf-8;')
      fs.readFile(p.resolve(publicDir, 'index.html'), (error, data) => {
        if(error) {
          throw error;
        }
        response.end(data.toString())
      });
      break; 
    case '/main.js':
      response.setHeader('Content-Type', 'text/javascript; charset=utf-8;')
      fs.readFile(p.resolve(publicDir, 'main.js'), (error, data) => {
        if(error) {
          throw error;
        }
        response.end(data.toString())
      });
      break; 
    case '/style.css':
      response.setHeader('Content-Type', 'text/css; charset=utf-8;')
      fs.readFile(p.resolve(publicDir, 'style.css'), (error, data) => {
        if(error) {
          throw error;
        }
        response.end(data.toString())
      });
      break; 
    default:
      response.statusCode = '404'
      response.end()
  }

})

server.listen(8080,() => {
  console.log('服务启动了.')
})