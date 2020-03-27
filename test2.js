
//const wincmd = require("node-windows");
// const { snapshot } = require("process-list");

// let pyshell = new PythonShell('test.py');

var fsp = require("promise-fs");
var exec = require("child-process-promise").exec;
// PythonShell.defaultOptions = { scriptPath: './' };
const tesseract = require("node-tesseract-ocr");

const control = require("./control.js");


test();

//http://blog.naver.com/PostView.nhn?blogId=htblog&logNo=221510551432&parentCategoryNo=&categoryNo=99&viewDate=&isShowPopularPosts=true&from=search
async function test(){
  // let clickSuccess;// = await control.imageClick("test.png");
  // while(!clickSuccess){
  //   console.error("find image");
  //   clickSuccess = await control.imageClick("test.png");
  //   if(clickSuccess){
  //     await control.typewrite("rlaxowls");
  //   }
  // }

  // await control.key("press", "a");
  // await control.key("keyDown", "b");
  // await control.copy("sfsfsefsfd");
  // await control.key("hotkey", "ctrl", "v");
  // await control.paste();
  //
  
  //이부분 뭔가 오작동함.. 다른 언어를 써야할까 ?
  let processList = await control.getProcessList();

  // console.error({processList});
  await control.focusWindow(36948);
  // console.error(await control.getPid("계산기"));
  // return;

  let hWnd = control.getWindowHandle("계산기");

  let rect = control.getWindowRect(hWnd);
  console.error(rect);
  // await control.screenshot("sc4.png");
  if(0&&rect){
    await control.screenshot("sc6.png", rect.left, rect.top, rect.width, rect.height);
    tesseract.recognize("sc6.png", {
      lang: "kor",
      oem: 1,
      psm: 3,
      // tessedit_char_whitelist: "0123456789",
    })
    .then(text => {
      console.log("Result:", text)
    })
    .catch(error => {
      console.log(error.message)
    })
  }

}
