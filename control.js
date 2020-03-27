const {PythonShell} = require("python-shell");
const clipboardy = require('clipboardy');
const robot = require("robotjs");



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
