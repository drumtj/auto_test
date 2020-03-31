import zerorpc
import pyautogui as pa
# import json
import random
import sys
# from numbers import Number
import win32gui, win32api, win32con

class Control(object):

    def position():
        return pa.position()

    def typewrite(self, str, interval):
        if interval == None: interval = 0
        return pa.typewrite(str, interval)

    def keyDown(self, key):
        return pa.keyDown(key)

    def keyUp(self, key):
        return pa.keyUp(key)

    def press(self, key):
        return pa.press(key)

    def moveTo(self, pos, duration):
        # if duration == None : duration = 0
        # pa.moveTo(x, y, duration)
        if pos != None:
            pos = (pos['left'], pos['top'])
        if duration == None: duration = 0
        return pa.moveTo(pos, duration=duration)

    def moveRel(self, pos, duration):
        if pos != None:
            pos = (pos['left'], pos['top'])
        if duration == None: duration = 0
        return pa.moveRel(pos, duration=duration)

    def mouseDown(self, pos):
        if pos != None:
            pos = (pos['left'], pos['top'])
        return pa.mouseDown(pos)

    def mouveUp(self, pos):
        if pos != None:
            pos = (pos['left'], pos['top'])
        return pa.mouveUp(pos)

    def dragTo(self, pos, duration):
        if pos != None:
            pos = (pos['left'], pos['top'])
        if duration == None: duration = 0
        return pa.dragTo(pos, duration=duration)

    def dragRel(self, pos, duration):
        if pos != None:
            pos = (pos['left'], pos['top'])
        if duration == None: duration = 0
        return pa.dragRel(pos, duration=duration)

    def click(self, pos, opt):

        # return pos;
        if pos != None:
            pos = (pos['left'], pos['top'])
        #     elif 'x' in pos.keys() != None:
        #         pos = (pos['x'], pos['y'])
        #     else:
        #         pos = None
        return pa.click(pos, clicks=opt['clicks'], interval=opt['interval'])

    def rightClick(self, pos):
        if pos != None:
            pos = (pos['left'], pos['top'])
        return pa.rightClick(pos)

    def doubleClick(self, pos):
        if pos != None:
            pos = (pos['left'], pos['top'])
        return pa.doubleClick(pos)

    def size(self):
        s = pa.size()
        # print(s)
        # return s
        return {"width":s[0], "height":s[1]}

    def locateOnScreen(self, url, confidence, rect=None, grayscale=False):
        if confidence == None :
            confidence = 0.8

        region = None
        if rect != None:
            region = (rect['left'], rect['top'], rect['width'], rect['height'])

        result = pa.locateOnScreen(url, confidence, region=region, grayscale=grayscale)
        if result != None:
            result = {"left":result[0], "top":result[1], "width":result[2], "height":result[3]}
        # print(result, type(result))
        return result

    def locateAllOnScreen(self, url, confidence, rect=None, grayscale=False):
        if confidence == None :
            confidence = 0.8

        region = None
        if rect != None:
            region = (rect['left'], rect['top'], rect['width'], rect['height'])

        locations = list(pa.locateAllOnScreen(url, confidence, region=region, grayscale=grayscale))
        result = []
        for location in locations:
            result.append({"left":location[0], "top":location[1], "width":location[2], "height":location[3]})
        return result

    def scroll(self, delta, pos):
        if pos != None:
            pos = (pos['left'], pos['top'])
            return pa.scroll(delta, pos)
        else:
            return pa.scroll(delta)

    def hotkey(self, keys):
        # return **keys
        return pa.hotkey(*keys)

    def screenshot(self, filename, region):
        if region != None:
            region = (region['left'], region['top'], region['width'], region['height'])
            pa.screenshot(filename, region=region)
        else:
            pa.screenshot(filename)

    def FindWindowByTitle(self, title):
        try:
            return win32gui.FindWindow(None, title)
        except win32gui.error:
            return None

    def FindWindowByClass(self, className):
        try:
            return win32gui.FindWindow(title, None)
        except win32gui.error:
            return None

    def GetWindowRect(self, hwnd):
        try:
            if hwnd == None: return None
            left, top, right, bottom = win32gui.GetWindowRect(hwnd)
            width = right - left
            height = bottom - top
            return {'top': top, 'left': left, 'width': width, 'height': height}
        except win32gui.error:
            return None

    def GetWindowText(self, hwnd):
        try:
            if hwnd == None: return None
            return win32gui.GetWindowText(hwnd)
        except win32gui.error:
            return None

    def SetForegroundWindow(self, hwnd):
        try:
            if hwnd == None: return None
            return win32gui.SetForegroundWindow(hwnd)
        except win32gui.error:
            return None

    def ShowWindow(self, hwnd, swtype):
        try:
            if hwnd == None: return None
            return win32gui.ShowWindow(hwnd, swtype);
        except win32gui.error:
            return None

    def SetWindowText(self, hwnd, title):
        try:
            if hwnd == None: return None
            return win32gui.SetWindowText(hwnd, title);
        except win32gui.error:
            return None

    def SetWindowPos(self, hwnd, x, y):
        try:
            left, top, right, bottom = win32gui.GetWindowRect(hwnd)
            width = right - left
            height = bottom - top
            return win32gui.SetWindowPos(hwnd, win32con.HWND_TOPMOST, x, y, width, height, win32con.SWP_NOZORDER)
        except win32gui.error:
            return None

    # @zerorpc.stream
    # def streaming_range(self, fr, to):
    #     return range(fr, to)
    #
    # def error_test(self):
    #     raise Exception(":P")



try:
    s = zerorpc.Server(Control())
    s.bind("tcp://0.0.0.0:4242")
    s.run()

except KeyboardInterrupt:
    print('process quit')
