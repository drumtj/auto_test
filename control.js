const {PythonShell} = require("python-shell");
const clipboardy = require('clipboardy');
const robot = require("robotjs");

const processWindows = require("node-process-windows");
//executeProcess에 "chcp 65001 | " 추가해야 한글 안깨짐

const { DModel, DStruct, K,U } = require('win32-api');
const ref = require('ref-napi');
const StructDi = require('ref-struct-di');
const Struct = StructDi(ref);
const knl32 = K.load();
const user32 = U.load();  // load all apis defined in lib/{dll}/api from user32.dll
// const user32 = U.load(['FindWindowExW'])  // load only one api defined in lib/{dll}/api from user32.dll

function getPid(title){
  return new Promise(resolve=>{
    PythonShell.run('win.py', {
      mode: 'json',
      // pythonOptions: ['-u'],
      args: ["getPid", title]
    }, function (err, results) {
      if (err) throw err;
      resolve(results[0]);
    });
  })
}
module.exports.getPid = getPid;

function focusWindow(pid){
  return new Promise(resolve=>{
    PythonShell.run('win.py', {
      mode: 'json',
      // pythonOptions: ['-u'],
      args: ["focus", pid]
    }, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      // console.log('results: %j', results);
      resolve(results[0]);
    });
  })
}
module.exports.focusWindow = focusWindow;

function getProcessList(){
  return new Promise(resolve=>{
    processWindows.getProcesses(function(err, processes) {
      // let list = [];
      // processes.forEach(function (p) {
      //   if(p.mainWindowTitle){
      //     list.push(p);
      //     console.log("PID: " + p.pid.toString());
      //     // console.log("MainWindowTitle: " + p.mainWindowTitle);
      //     console.log("ProcessName: " + p.processName);
      //   }
      // });
      // resolve(list);
      resolve(processes.filter(p=>!!p.mainWindowTitle))
    });
  })
}
module.exports.getProcessList = getProcessList;

function getWindowHandle(title){
  title = title + '\0';    // null-terminated string

  const lpszWindow = Buffer.from(title, 'ucs2');
  const hWnd = user32.FindWindowExW(0, 0, null, lpszWindow);

  if (typeof hWnd === 'number' && hWnd > 0
    || typeof hWnd === 'bigint' && hWnd > 0
    || typeof hWnd === 'string' && hWnd.length > 0
  ) {
    return hWnd;
  }
  return null;
}
module.exports.getWindowHandle = getWindowHandle;

function setWindowTitle(hWnd, title){
  if(hWnd == null) return false;

  const res = user32.SetWindowTextW(hWnd, Buffer.from(title+'\0', 'ucs2'))
  if (!res) {
    return true;
  }
  else {
    return false;
  }
}
module.exports.setWindowTitle = setWindowTitle;

function getWindowRect(hWnd){
  if (hWnd !== null) {
    let rect = new Struct(DStruct.RECT)();
    user32.GetWindowRect(hWnd, rect.ref());
    return {
      left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom,
      width:rect.right-rect.left, height:rect.bottom-rect.top
    }
  }
  return null;
}
module.exports.getWindowRect = getWindowRect;


function move(x, y){
  return new Promise(resolve=>{
    PythonShell.run('mouse.py', {
      mode: 'json',
      // pythonOptions: ['-u'],
      args: ["move", x, y]
    }, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      // console.log('results: %j', results);
      resolve(results[0]);
    });
  })
}
module.exports.move = move;

function moveSmooth(x, y){
  return new Promise(resolve=>{
    PythonShell.run('mouse.py', {
      mode: 'json',
      // pythonOptions: ['-u'],
      args: ["moveSmooth", x, y]
    }, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      // console.log('results: %j', results);
      resolve(results[0]);
    });
  })
}
module.exports.moveSmooth = moveSmooth;

//button:left,right,middle  double:false,true
function click(button, double){
  robotjs.mouseClick(button, double);
  return Promise.resolve(true);
}
module.exports.click = click;

function imageClick(btnImg){
  return new Promise(resolve=>{
    PythonShell.run('mouse.py', {
      mode: 'json',
      // pythonOptions: ['-u'],
      args: ["imageClick", btnImg]
    }, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      // console.log('results: %j', results);
      resolve(results[0]);
    });
  })
}
module.exports.imageClick = imageClick;

function typewrite(str){
  return new Promise(resolve=>{
    PythonShell.run('typewrite.py', {
      mode: 'text',
      // pythonOptions: ['-u'],
      args: [str]
    }, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      // console.log('results: %j', results);
      resolve();
    });
  })
}
module.exports.typewrite = typewrite;

function screenshot(filename, x, y, width, height){
  return new Promise(resolve=>{
    PythonShell.run('screenshot.py', {
      mode: 'json',
      // pythonOptions: ['-u'],
      args: [filename, x, y, width, height].filter(a=>a!==undefined)
    }, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      // console.log('results: %j', results);
      resolve(results[0]);
    });
  })
}
module.exports.screenshot = screenshot;

function key(com, a, b, c){
  return new Promise(resolve=>{
    PythonShell.run('key.py', {
      mode: 'json',
      // pythonOptions: ['-u'],
      args: [com, a, b, c].filter(a=>a!==undefined)
    }, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      // console.log('results: %j', results);
      resolve(results[0]);
    });
  })
}
module.exports.key = key;

function copy(data){
  clipboardy.writeSync(data);
  return Promise.resolve(true);
}
module.exports.copy = copy;

function paste(){
  return key("hotkey", "ctrl", "v");
}
module.exports.paste = paste;
