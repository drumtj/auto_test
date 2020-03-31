const control = require("./control.js");


async function test(){
  control.start();

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

  let hwnd = await control.FindWindowByTitle("계산기");
  let rect = await control.GetWindowRect(hwnd);
  let title = await control.GetWindowText(hwnd);
  await control.ShowWindow(hwnd);
  await control.SetForegroundWindow(hwnd);
  // await control.SetWindowText(hwnd, "안녕");
  if(rect){
    await control.SetWindowPos(hwnd, rect.left + 200, rect.top);
  }
  // await control.screenshot("calc.png", rect);
  console.error(hwnd, rect, title);

  control.stop();
  process.exit(0);
}


test();
