import pyautogui as PAG
# import json
# import random
import sys
# x,y = PAG.position();
# print(json.dumps({"x":x,"y":y}));
# from PIL import ImageGrab


if __name__ == '__main__':
    if(len(sys.argv) == 2):
        PAG.screenshot(sys.argv[1])
    else:
        x = int(sys.argv[2])
        y = int(sys.argv[3])
        width = int(sys.argv[4])
        height = int(sys.argv[5])
        PAG.screenshot(sys.argv[1], region=(x,y,width,height))
        # image = ImageGrab.grab(bbox=(x,y,width,height))
        # image.save(sys.argv[1])

    print("true")
    sys.exit()
