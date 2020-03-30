const {PythonShell} = require("python-shell");
const zerorpc = require("zerorpc");
var client;

function start(){
  if(!client){
    client = new zerorpc.Client();
    client.connect("tcp://127.0.0.1:4242");
  }

  PythonShell.run('main.py', null, function (err, results) {
    if (err) throw err;
    console.error("run finish py");
  });
}

function invoke(name, ...args){
  // console.error(name, args);
  // let argv = [name, ...args]
  return new Promise((resolve, reject)=>{
    client.invoke(name, ...args, (error, res, more)=>{
      if(error){
        reject(error);
        return;
      }

      // console.log(res);
      resolve(res);
    })
  })
}

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

//list(pyautogui.locateAllOnScreen('books.png'))
//click
//move
//drag
//typewrite
//keyUp
//keyDown
//hotkey
//press


async function test(){
  let s = await size();
  let region = {left:0, top:s.height-100, width:s.width, height:100};
  let result;
  while(1){
    result = await locateOnScreenUntil("test.png",{
      region,
      grayscale: true
    });

    if(result){
      result = await locateOnScreenUntil("test2.png",{
        region,
        grayscale: true
      });

      if(result){
        result = await locateOnScreenUntil("test3.png",{
          region,
          grayscale: true
        });
      }
    }
  }
}


start();
test();
