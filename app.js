const control = require("./control.js");


async function test(){
  control.start();

  console.error("wait 5sec");
  await control.delay(5000);
  // console.log(await control.FindWindowByPid(39744))
  // console.log(await control.GetWindowList());
  // return;

  let s = await control.size();
  let bottomBox = {left:0, top:s.height-100, width:s.width, height:100};
  let step = {
    "search1": {
      img: "test.png",
      area: bottomBox,
      success: "search2",
      fail: "search1",
      action: async function(rect){
        await control.click(rect);
        await control.copy("TEST");
        await control.paste();
        await control.paste();
        await control.paste();
      }
    },
    "search2": {
      img: "test2.png",
      area: bottomBox,
      success: "search3",
      fail: "search1",
      count: 5
    },
    "search3": {
      img: "test3.png",
      area: bottomBox,
      success: "end",
      fail: "search2",
      count: 5
    }
  }

  let state = "search1", prevState;
  async function go(st){
    step[st].result = await control.locateOnScreenUntil(step[st].img,{
      region: step[st].area,
      grayscale: true,
      count: step[st].count
    });
    if(step[st].result){
      prevState = st;
      state = step[st].success;
      console.error("success", prevState, "=>", state);
      if(step[st].action){
        await step[st].action(step[st].result);
      }
      return Promise.resolve(true);
    }else{
      prevState = st;
      state = step[st].fail;
      console.error("fail", prevState, "=>", state);
      return Promise.resolve(false);
    }
  }


  while(1){
    if(await go(state)){
      console.error("found", prevState);
    }else{
      console.error("not found", prevState);
    }

    if(state == "end"){
      console.error("end");
      break;
    }
  }

  // let s = await control.size();
  // let region = {left:0, top:s.height-100, width:s.width, height:100};
  // let result;
  // while(1){
  //   result = await control.locateOnScreenUntil("test.png",{
  //     region,
  //     grayscale: true
  //   });
  //
  //   if(result){
  //     control.click(result);
  //     break;
  //
  //     result = await control.locateOnScreenUntil("test2.png",{
  //       region,
  //       grayscale: true
  //     });
  //
  //     if(result){
  //       result = await control.locateOnScreenUntil("test3.png",{
  //         region,
  //         grayscale: true
  //       });
  //     }
  //   }
  // }

  ////////////////////////////////////////////////////////////////////////////////////////
  // let hwnd = await control.FindWindowByTitle("계산기");
  // let rect = await control.GetWindowRect(hwnd);
  // let title = await control.GetWindowText(hwnd);
  // // await control.ShowWindow(hwnd, control.SW_TYPE.MAXIMIZE);
  // await control.SetForegroundWindow(hwnd);
  // // await control.SetWindowText(hwnd, "안녕");
  // if(rect){
  //   // await control.SetWindowPos(hwnd, rect.left + 200, rect.top);
  //   // await control.SetWindowSize(hwnd, rect.width + 200, rect.height);
  //   // await control.SetWindowRect(hwnd, rect.left, rect.top-300, rect.width-100, rect.height+100);
  //   // await control.screenshot("calc.png", rect);
  // }
  // console.error(hwnd, rect, title);

  control.stop();
  process.exit(0);
}


test();
