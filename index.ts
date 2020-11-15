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
let cacheAge = 3600 * 24 

server.on('request', (request, response) => {
  const { method, url: path, headers } = request

  if(method !== 'GET') {
    response.statusCode = 405
    response.end(); 
    return;
  }
  
  const { pathname, search } = url.parse(path)

  let fileName = pathname.substr(1)
  if(fileName === '') {
    fileName = 'index.html'
  }
  fs.readFile(p.resolve(publicDir, fileName), (error, data) => {
    if(error) {
      if(error.errno === -2) {
        response.statusCode = 404
        fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
        response.end(data)
        })
      } else {
        response.statusCode = 500
        response.end('服务器错误,请联系管理员!')
      }
    } else {
      response.setHeader('Cache-Control', `public, max-age=${cacheAge}`)
      response.end(data)
    }
  })

})

server.listen(8080,() => {
  console.log('服务启动了.')
})