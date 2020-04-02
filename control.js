// const {PythonShell} = require("python-shell");
const zerorpc = require("zerorpc");
const spawn = require('child_process').spawn;
// var client;

module.exports = class Control {

  client;
  isSettledDelay;
  isSettledRandomDelay;
  minDelay;
  maxDelay;
  childProcess;
  constructor(){
    this.client = new zerorpc.Client();
    this.client.connect("tcp://127.0.0.1:4242");

    console.error("spawn main.exe");
    this.childProcess = spawn("main.exe");

    // PythonShell.run('main.py', null, function (err, results) {
    //   if (err) throw err;
    //   console.error("run finish py");
    // });
  }

  destroy(){
    if(this.childProcess){
      this.childProcess.kill('SIGINT');
    }
  }

  // stop(){
  //   this.client.close();
  // }

  setDelay(delay){
    this.isSettledDelay = true;
    this.isSettledRandomDelay = false;
    this.minDelay = delay;
  }

  setRandomDelay(min, max){
    this.isSettledRandomDelay = true;
    this.isSettledDelay = false;
    this.minDelay = min;
    this.maxDelay = max;
  }

  _commonDelay(){
    if(this.isSettledRandomDelay){
      return this.delay(this.minDelay + Math.random() * (this.maxDelay-this.minDelay));
    }else if(this.isSettledDelay){
      if(this.minDelay <= 0){
        return Promise.resolve();
      }
      return this.delay(this.minDelay);
    }
    return Promise.resolve();
  }

  invoke(name, ...args){
    // console.error(name, args);
    // let argv = [name, ...args]
    return new Promise((resolve, reject)=>{
      try{
        if(this.client){
          this.client.invoke(name, ...args, (error, res, more)=>{
            if(error){
              reject(error);
              return;
            }

            // console.log(res);
            this._commonDelay().then(()=>{
              resolve(res);
            })
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



  size(){
    return this.invoke("size");
  }

  locateOnScreen(src, opt){
    opt = Object.assign({
      confidence: 0.8,
      region: null,//{left:0, top:0, width:10, height:10}
      grayscale: false
    }, opt||{})
    return this.invoke("locateOnScreen", src, opt.confidence, opt.region, opt.grayscale);
  }

  locateAllOnScreen(src, opt){
    opt = Object.assign({
      confidence: 0.8,
      region: null,//{left:0, top:0, width:10, height:10}
      grayscale: false
    }, opt||{})
    return this.invoke("locateAllOnScreen", src, opt.confidence, opt.region, opt.grayscale);
  }

  delay(n){
    return new Promise(resolve=>{
      setTimeout(resolve, n)
    })
  }

  locateOnScreenUntil(src, opt){
    opt = Object.assign({
      count: 60,
      delay: 100
    }, opt||{});
    return new Promise(async resolve=>{
      let result, c=0;
      while(!result){
        result = await this.locateOnScreen(src, opt);
        console.log(".");
        if(result){
          console.log("found", src, result);
          break;
        }
        if(c++ >= opt.count){
          break;
        }
        await this.delay(opt.delay);
      }

      resolve(result);
    })
  }

  _makePos(x, y){
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

  mouseDown(x, y){
    return this.invoke("mouseDown", this._makePos(x, y));
  }

  mouseUp(x, y){
    return this.invoke("mouseUp", this._makePos(x, y));
  }

  dragTo(x, y, duration){
    if(typeof duration === undefined){
      duration = y;
    }
    return this.invoke("dragTo", this._makePos(x, y), duration);
  }

  dragRel(x, y, duration){
    if(typeof duration === undefined){
      duration = y;
    }
    return this.invoke("dragRel", this._makePos(x, y), duration);
  }

  click(x, y, opt){
    if(typeof opt === undefined){
      opt = y;
    }
    opt = Object.assign({
      clicks: 1,
      interval: 0
    }, opt||{});
    return this.invoke("click", this._makePos(x, y), opt);
  }

  rightClick(x, y){
    return this.invoke("rightClick", this._makePos(x, y));
  }

  doubleClick(x, y){
    return this.invoke("doubleClick", this._makePos(x, y));
  }

  keyDown(key){
    return this.invoke("keyDown", key);
  }

  keyUp(key){
    return this.invoke("keyUp", key);
  }

  moveTo(x, y, sec){
    if(typeof sec === undefined){
      sec = y;
    }
    return this.invoke("moveTo", this._makePos(x, y), sec);
    // return invoke("moveTo", left, top, sec);
  }

  moveRel(x, y, duration){
    if(typeof duration === undefined){
      duration = y;
    }
    return this.invoke("moveRel", this._makePos(x, y), duration);
  }

  position(){
    return this.invoke("position");
  }

  //string|string[]
  press(key){
    return this.invoke("press", key);
  }

  center(rect){
    return {left:(rect.left||0)+rect.width/2, top:(rect.top||0)+rect.height/2};
  }

  randomPoint(rect, margin){
    margin = margin || 0;
    return {left:(rect.left||0)+margin+Math.random()*(rect.width-margin*2), top:(rect.top||0)+margin+Math.random()*(rect.height-margin*2)};
  }

  typewrite(str){
    return this.invoke("typewrite", str);
  }

  scroll(delta, x, y){
    return this.invoke("scroll", delta, this._makePos(x, y));
  }

  hotkey(...keys){
    // console.error(keys);
    return this.invoke("hotkey", keys);
  }

  copy(str){
    return this.invoke("copy", str);
  }

  paste(){
    return this.invoke("hotkey", ['ctrl', 'v']);
  }

  //region >  {left,top,width,height}
  screenshot(filename, region){
    return this.invoke("screenshot", filename, region);
  }

  FindWindowByTitle(title){
    return this.invoke("FindWindowByTitle", title);
  }

  FindWindowByClass(className){
    return this.invoke("FindWindowByClass", className);
  }

  GetWindowRect(hwnd){
    return this.invoke("GetWindowRect", hwnd);
  }

  GetWindowText(hwnd){
    return this.invoke("GetWindowText", hwnd);
  }

  SetForegroundWindow(hwnd){
    return this.invoke("SetForegroundWindow", hwnd);
  }

  static SW_TYPE = {
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

  ShowWindow(hwnd, sw_type){
    return this.invoke("ShowWindow", hwnd, typeof sw_type === "number" ? sw_type : Control.SW_TYPE.SHOW);
  }

  SetWindowText(hwnd, title){
    return this.invoke("SetWindowText", hwnd, title);
  }

  SetWindowPos(hwnd, x, y){
    return this.invoke("SetWindowPos", hwnd, x, y);
  }

  SetWindowSize(hwnd, width, height){
    return this.invoke("SetWindowSize", hwnd, width, height);
  }

  SetWindowRect(hwnd, x, y, width, height){
    return this.invoke("SetWindowRect", hwnd, x, y, width, height);
  }

  FindWindowByPid(pid){
    return this.invoke("FindWindowByPid", pid);
  }

  GetWindowList(){
    return this.invoke("GetWindowList");
  }
}

// module.exports = {
//   press, keyDown, keyUp, mouseDown, mouseUp, moveTo, moveRel, dragTo, dragRel, click, rightClick, doubleClick,
//   copy, paste, typewrite, hotkey, screenshot, center, randomPoint, position, size, locateAllOnScreen, locateOnScreen, locateOnScreenUntil,
//
//   FindWindowByTitle, FindWindowByClass, GetWindowRect, GetWindowText, SetForegroundWindow, ShowWindow, SW_TYPE, SetWindowText, SetWindowPos, SetWindowSize, SetWindowRect, FindWindowByPid,
//   GetWindowList,
//
//   start, stop, delay
// }
