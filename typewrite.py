import pyautogui as PAG
# import json
# import random
import time
import sys
# x,y = PAG.position();
# print(json.dumps({"x":x,"y":y}));



if __name__ == '__main__':
    time.sleep(1)
    PAG.typewrite(sys.argv[1], interval=0.25)
    sys.exit()
