// Local browser smoke test. Uses only generated fixtures and a mocked API; never starts Spring.
const fs = require('fs');
const path = require('path');
const http = require('http');
const os = require('os');
const { spawn } = require('child_process');
const WebSocket = require('ws');

(async () => {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'backend/target/image-test-results');
  const fixture = name => fs.readFileSync(path.join(output, name + '-after.img')).toString('base64');
  const product = { id: 62, nome: 'Teste local de imagens', descricao: 'Fotos geradas pelos testes locais.',
    categoria: 'Roupas', conservacao: 'Bom', marca: 'Teste', preco: 10, statusAnuncio: 'DISPONIVEL',
    foto: fixture('large-jpeg'), foto2: fixture('transparent-png'), foto3: fixture('portrait-png'), foto4: fixture('exif-6') };
  const mock = `<script>window.fetch=async function(url){const p=${JSON.stringify(product)};
    return new Response(JSON.stringify(String(url).includes('/api/products/62')?p:String(url).includes('/api/products')?[p]:[]),{status:200,headers:{'Content-Type':'application/json'}});};</script>`;
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const relative = url.pathname.replace(/^\/+/, '');
    let file = path.resolve(root, 'build', relative);
    if (!file.startsWith(path.join(root, 'build') + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory())
      file = path.join(root, 'build/index.html');
    const ext = path.extname(file);
    res.setHeader('Content-Type', ({'.js':'application/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml'})[ext] || 'application/octet-stream');
    res.setHeader('Content-Security-Policy', "default-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'none'");
    res.end(ext === '.html' ? fs.readFileSync(file,'utf8').replace('<head>', '<head>' + mock) : fs.readFileSync(file));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'adp-image-browser-'));
  const executable = process.env.IMAGE_TEST_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const chrome = spawn(executable, ['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check',
    '--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'], { windowsHide:true, stdio:'ignore' });
  let socket;
  try {
    const activePort = path.join(profile, 'DevToolsActivePort');
    for (let i=0; i<100 && !fs.existsSync(activePort); i++) await new Promise(r=>setTimeout(r,100));
    const port = fs.readFileSync(activePort,'utf8').split('\n')[0];
    const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    socket = new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
    await new Promise(resolve=>socket.once('open',resolve));
    let seq=0; const pending=new Map();
    socket.on('message', raw=>{ const msg=JSON.parse(raw); if(pending.has(msg.id)) {
      const {resolve,reject}=pending.get(msg.id); pending.delete(msg.id);
      msg.error?reject(new Error(JSON.stringify(msg.error))):resolve(msg.result);
    }});
    const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
    const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
    await send('Page.navigate',{url:`http://127.0.0.1:${server.address().port}/produto/62`});
    let images=[];
    for(let i=0;i<100;i++) {
      images=await evaluate(`Array.from(document.images).filter(i=>i.src.startsWith('data:image/')).map(i=>({type:i.src.slice(0,22),width:i.naturalWidth,height:i.naturalHeight,loaded:i.complete&&i.naturalWidth>0}))`);
      if(images.length>=5 && images.every(i=>i.loaded)) break;
      await new Promise(r=>setTimeout(r,100));
    }
    if(images.length<5 || images.some(i=>!i.loaded)) throw new Error('Image decoding failed: '+JSON.stringify(images));
    fs.writeFileSync(path.join(output,'browser-desktop.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
    await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    const mobileImageWidth = await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>resolve(document.querySelector('img[alt="produto"]').getBoundingClientRect().width)))`);
    if (mobileImageWidth < 300 || mobileImageWidth > 390) throw new Error('Mobile gallery is not visible: '+mobileImageWidth);
    fs.writeFileSync(path.join(output,'browser-mobile-width.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
    // Check the legacy MIME string used by native clients in the browser too (not a native device test).
    const legacyPng = await evaluate(`new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image.naturalWidth);image.onerror=()=>resolve(0);image.src='data:image/jpeg;base64,${product.foto2}';})`);
    const report={page:'/produto/62',images,mobileImageWidth,legacyPngWidth:legacyPng,nativeDeviceTested:false};
    fs.writeFileSync(path.join(output,'browser-report.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally { if(socket) socket.close(); chrome.kill(); server.close(); }
})().catch(error=>{ console.error(error);process.exitCode=1; });
