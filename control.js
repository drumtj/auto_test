// const {PythonShell} = require("python-shell");
const zerorpc = require("zerorpc");
const spawn = require('child_process').spawn;
var client;

function start(){
  if(!client){
    client = new zerorpc.Client();
  }
  client.connect("tcp://127.0.0.1:4242");

  spawn("main.exe");

  // PythonShell.run('main.py', null, function (err, results) {
  //   if (err) throw err;
  //   console.error("run finish py");
  // });
}

function stop(){
  if(client){
    client.close();
  }
}

function invoke(name, ...args){
  // console.error(name, args);
  // let argv = [name, ...args]
  return new Promise((resolve, reject)=>{
    try{
      if(client){
        client.invoke(name, ...args, (error, res, more)=>{
          if(error){
            reject(error);
            return;
          }

          // console.log(res);
          resolve(res);
        })
      }else{
        reject("선언된 client가 없음. 반드시 start()함수를 처음에 실행하세요");
      }
    }catch(e){
      reject(e)
    }
  })
}


///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////



function size(){
  return invoke("size");
}

function locateOnScreen(src, opt){
  opt = Object.assign({
    confidence: 0.8,
    region: null,//{left:0, top:0, width:10, height:10}
    grayscale: false
  }, opt||{})
  return invoke("locateOnScreen", src, opt.confidence, opt.region, opt.grayscale);
}

function locateAllOnScreen(src, opt){
  opt = Object.assign({
    confidence: 0.8,
    region: null,//{left:0, top:0, width:10, height:10}
    grayscale: false
  }, opt||{})
  return invoke("locateAllOnScreen", src, opt.confidence, opt.region, opt.grayscale);
}

function delay(n){
  return new Promise(resolve=>{
    setTimeout(resolve, n)
  })
}

function locateOnScreenUntil(src, opt){
  opt = Object.assign({
    count: 60,
    delay: 100
  }, opt||{});
  return new Promise(async resolve=>{
    let result, c=0;
    while(!result){
      result = await locateOnScreen(src, opt);
      console.log(".");
      if(result){
        console.log("found", src, result);
        break;
      }
      if(c++ >= opt.count){
        break;
      }
      await delay(opt.delay);
    }

    resolve(result);
  })
}

function _makePos(x, y){
  let pos;
  if(typeof x === "number"){
    pos = {left:x, top:y};
  }else{
    if(x['x']){
      pos = {left:x.x, top:x.y};
    }else{
      pos = x;
    }
  }
  return pos;
}

function mouseDown(x, y){
  return invoke("mouseDown", _makePos(x, y));
}

function mouseUp(x, y){
  return invoke("mouseUp", _makePos(x, y));
}

function dragTo(x, y, duration){
  if(typeof duration === undefined){
    duration = y;
  }
  return invoke("dragTo", _makePos(x, y), duration);
}

function dragRel(x, y, duration){
  if(typeof duration === undefined){
    duration = y;
  }
  return invoke("dragRel", _makePos(x, y), duration);
}

function click(x, y, opt){
  if(typeof opt === undefined){
    opt = y;
  }
  opt = Object.assign({
    clicks: 1,
    interval: 0
  }, opt||{});
  return invoke("click", _makePos(x, y), opt);
}

function rightClick(x, y){
  return invoke("rightClick", _makePos(x, y));
}

function doubleClick(x, y){
  return invoke("doubleClick", _makePos(x, y));
}

function keyDown(key){
  return invoke("keyDown", key);
}

function keyUp(key){
  return invoke("keyUp", key);
}

function moveTo(x, y, sec){
  if(typeof sec === undefined){
    sec = y;
  }
  return invoke("moveTo", _makePos(x, y), sec);
  // return invoke("moveTo", left, top, sec);
}

function moveRel(x, y, duration){
  if(typeof duration === undefined){
    duration = y;
  }
  return invoke("moveRel", _makePos(x, y), duration);
}

function position(){
  return invoke("position");
}

//string|string[]
function press(key){
  return invoke("press", key);
}

function center(rect){
  return {left:(rect.left||0)+rect.width/2, top:(rect.top||0)+rect.height/2};
}

function randomPoint(rect, margin){
  margin = margin || 0;
  return {left:(rect.left||0)+margin+Math.random()*(rect.width-margin*2), top:(rect.top||0)+margin+Math.random()*(rect.height-margin*2)};
}

function typewrite(str){
  return invoke("typewrite", str);
}

function scroll(delta, x, y){
  return invoke("scroll", delta, _makePos(x, y));
}

function hotkey(...keys){
  // console.error(keys);
  return invoke("hotkey", keys);
}

function copy(str){
  return invoke("copy", str);
}

function paste(){
  return invoke("hotkey", ['ctrl', 'v']);
}

//region >  {left,top,width,height}
function screenshot(filename, region){
  return invoke("screenshot", filename, region);
}

function FindWindowByTitle(title){
  return invoke("FindWindowByTitle", title);
}

function FindWindowByClass(className){
  return invoke("FindWindowByClass", className);
}

function GetWindowRect(hwnd){
  return invoke("GetWindowRect", hwnd);
}

function GetWindowText(hwnd){
  return invoke("GetWindowText", hwnd);
}

function SetForegroundWindow(hwnd){
  return invoke("SetForegroundWindow", hwnd);
}

const SW_TYPE = {
  FORCEMINIMIZE: 11,
  HIDE: 0,
  MAXIMIZE: 3,
  MINIMIZE: 6,
  RESTORE: 9,
  SHOW: 5,
  SHOWDEFAULT: 10,
  SHOWMAXIMIZED: 3,
  SHOWMINIMIZED: 2,
  SHOWMINNOACTIVE: 7,
  SHOWNA: 8,
  SHOWNOACTIVATE: 4,
  SHOWNORMAL: 1
}

function ShowWindow(hwnd, sw_type){
  return invoke("ShowWindow", hwnd, typeof sw_type === "number" ? sw_type : SW_TYPE.SHOW);
}

function SetWindowText(hwnd, title){
  return invoke("SetWindowText", hwnd, title);
}

function SetWindowPos(hwnd, x, y){
  return invoke("SetWindowPos", hwnd, x, y);
}

function SetWindowSize(hwnd, width, height){
  return invoke("SetWindowSize", hwnd, width, height);
}

function SetWindowRect(hwnd, x, y, width, height){
  return invoke("SetWindowRect", hwnd, x, y, width, height);
}

function FindWindowByPid(pid){
  return invoke("FindWindowByPid", pid);
}

function GetWindowList(){
  return invoke("GetWindowList");
}

module.exports = {
  press, keyDown, keyUp, mouseDown, mouseUp, moveTo, moveRel, dragTo, dragRel, click, rightClick, doubleClick,
  copy, paste, typewrite, hotkey, screenshot, center, randomPoint, position, size, locateAllOnScreen, locateOnScreen, locateOnScreenUntil,

  FindWindowByTitle, FindWindowByClass, GetWindowRect, GetWindowText, SetForegroundWindow, ShowWindow, SW_TYPE, SetWindowText, SetWindowPos, SetWindowSize, SetWindowRect, FindWindowByPid,
  GetWindowList,

  start, stop, delay
}
