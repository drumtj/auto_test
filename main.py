import zerorpc
import pyautogui as pa
# import json
import random
import sys

class Control(object):

    def size(self):
        s = pa.size()
        # print(s)
        # return s
        return {"width":s[0], "height":s[1]}

    def locateOnScreen(self, url, confidence, rect=None, grayscale=False):

        #rect = PAG.locateOnScreen(url, confidence=confidence, region=rect, grayscale=grayscale)
        # print(url, confidence, rect, grayscale)

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


    def test(self, a):
        return "hi~, %s" % a

    @zerorpc.stream
    def streaming_range(self, fr, to):
        return range(fr, to)

    def error_test(self):
        raise Exception(":P")

try:
    s = zerorpc.Server(Control())
    s.bind("tcp://0.0.0.0:4242")
    s.run()

except KeyboardInterrupt:
    print('process quit')
