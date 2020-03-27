import pyautogui as PAG
# import json
# import random
# import pyperclip
# pyperclip.copy('클릭보드에 들어갈 내용')
import time
import sys
# x,y = PAG.position();
# print(json.dumps({"x":x,"y":y}));

def trim(s):
    s.strip()
    return s

if __name__ == '__main__':
    a = sys.argv[1]
    l = len(sys.argv)
    if l >= 3:
        b = sys.argv[2]
    if l >= 4:
        c = sys.argv[3]

    # print(a + b)
    # print(list(map(trim, b.split(','))))
    # sys.exit()

    if a == "press":
        PAG.press(list(map(trim, b.split(','))))
    elif a == "keyDown":
        PAG.keyDown(b)
    elif a == "keyUp":
        PAG.keyUp(b)
    elif a == "hotkey":
        PAG.hotkey(b, c)
    print("true")
    sys.exit()
