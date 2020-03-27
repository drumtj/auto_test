# import pyautogui as PAG
from pywinauto import Application
from subprocess import check_output
# import json
# import random
# import time
import sys
# x,y = PAG.position();
# print(json.dumps({"x":x,"y":y}));

def get_pid(name):
    return check_output(["pidof",name])

if __name__ == '__main__':
    com = sys.argv[1]
    a = sys.argv[2]

    if com == "focus":
        app = Application().connect(process=int(a))
        app.top_window().set_focus()
        print("true")
    elif com == "getPid":
        # 이부분이 title 이 아닌 process name으로 찾는데?  title로 찾는 방법 찾아보자
        print(get_pid(a))


    sys.exit()
