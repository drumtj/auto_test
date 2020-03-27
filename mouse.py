import pyautogui as PAG
# import json
import random
import sys
# x,y = PAG.position();
# print(json.dumps({"x":x,"y":y}));

def findPos(url):
    rect = PAG.locateOnScreen(url)
    # if(str(type(rect)) == "None"):
    if(rect == None):
        return None, None
    x = random.uniform(rect.left+2, rect.left + rect.width - 2)
    y = random.uniform(rect.top+2, rect.top + rect.height - 2)
    return x, y

def moveSmooth(x,y):
    if(x==None or y==None): return "false"
    PAG.moveTo(x, y, random.uniform(0.5,1))
    return "true"

def move(x,y):
    if(x==None or y==None): return "false"
    PAG.moveTo(x, y)
    return "true"

def click(x,y):
    if(moveSmooth(x,y) == "true"):
        PAG.click()
        return "true"
    return "false"

def clickBtn(url):
    x,y = findPos(url)
    return click(x,y)


if __name__ == '__main__':
    a = sys.argv[1]
    l = len(sys.argv)
    if l >= 3:
        b = sys.argv[2]
    elif l >= 4:
        c = sys.argv[3]
    # rect = PAG.locateOnScreen("btn.png");
    # print(rect);
    # x,y = findPos("btn.png")
    # move(x,y)
    # print(sys.argv[1])
    if a == "imageClick":
        print(clickBtn(b))
    elif a == "move":
        print(move(int(b), int(c)))
    elif a == "moveSmooth":
        print(moveSmooth(int(b), int(c)))
    sys.exit()
