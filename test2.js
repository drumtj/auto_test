const robot = require("robotjs");
//const wincmd = require("node-windows");
// const { snapshot } = require("process-list");
const processWindows = require("node-process-windows");
// const Iconv = require('iconv').Iconv;
// const iconv  = require('iconv-lite');
// const { Transform } = require("stream");
// const WindowInfo = require("window-info").default;
const { DModel, DStruct, K,U } = require('win32-api');
const ref = require('ref-napi');
const StructDi = require('ref-struct-di');
const Struct = StructDi(ref);

const knl32 = K.load();
const user32 = U.load();  // load all apis defined in lib/{dll}/api from user32.dll
// const user32 = U.load(['FindWindowExW'])  // load only one api defined in lib/{dll}/api from user32.dll

const title = '계산기\0';    // null-terminated string

const lpszWindow = Buffer.from(title, 'ucs2');
const hWnd = user32.FindWindowExW(0, 0, null, lpszWindow);

if (typeof hWnd === 'number' && hWnd > 0
  || typeof hWnd === 'bigint' && hWnd > 0
  || typeof hWnd === 'string' && hWnd.length > 0
) {
  console.log('buf: ', hWnd);

  // Change title of the Calculator
  // const res = user32.SetWindowTextW(hWnd, Buffer.from('Node-Calculator\0', 'ucs2'))

  // if ( ! res) {
  //   console.log('SetWindowTextW failed')
  // }
  // else {
  //   console.log('window title changed')
  // }

  for(var o in user32){
    console.error(o);
  }
  let rect = new Struct(DStruct.RECT)();
  user32.GetWindowRect(hWnd, rect.ref());
  var screenSize = robot.getScreenSize();
  console.error(rect.left, rect.top, rect.right, rect.bottom, screenSize);

  // user32.BringWindowToTop(hWnd);
  // user32.ShowWindow(hWnd, 5);
  // user32.UpdateWindow(hWnd);

  // robot.moveMouse(rect.left+100, rect.top+20);
  // robot.mouseToggle("down");
  // robot.dragMouse(789, 500);
  // robot.mouseToggle("up");

  // snapshot('pid', 'name').then(tasks=>{
  //   tasks.forEach(task=>{
  //     console.log(task);
  //   });
  // });

  // iconv.extendNodeEncodings();

  processWindows.getProcesses(function(err, processes) {
    processes.forEach(function (p) {
      if(p.mainWindowTitle){
        console.log("PID: " + p.pid.toString());
        console.log("MainWindowTitle: " + p.mainWindowTitle);
        console.log("ProcessName: " + p.processName);
      }
    });
  });





  // wincmd.list(function(svc){
  //   console.log(svc);
  // },true);

  // console.error(WindowInfo);
  // return;
  //
  // (async () => {
  //   const wi = new WindowInfo({
  //     delay: 1000,
  //   })
  //   let receivedData = 0
  //   const limit = 1
  //   wi
  //     .pipe(new Transform({
  //       transform(data, enc, next) {
  //         if (receivedData < limit) {
  //           this.push(data)
  //         } else {
  //           // limit reached
  //           wi.destroy()
  //         }
  //         receivedData++
  //         next()
  //       },
  //       objectMode: true,
  //       highWaterMark: 0, // disable receiving buffering
  //     }))
  //     .pipe(new Transform({
  //       transform(data, enc, next) {
  //         this.push(JSON.stringify([
  //           ['winid', 'App Name', 'Window Title', 'pid'],
  //           ...data,
  //         ]))
  //         console.log(data);
  //         next()
  //       },
  //       writableObjectMode: true,
  //     }))
  //     .pipe(process.stdout)
  // })()
}
