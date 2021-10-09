import cv2
import time
from django.http import HttpResponse
from datetime import datetime
import os


def connect():
    print('connect')
    return HttpResponse('success')


def live():
    cap = cv2.VideoCapture("rtsp://admin:chenwen5352@192.168.2.15//Streaming/Channels/1")
    ret, frame = cap.read()
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        cv2.imshow('live', frame)
        k = cv2.waitKey(1)
        if k == 27:
            break
        return HttpResponse('success')
    cv2.destroyAllWindows()
    return HttpResponse('success')


def reconnect():
    print('reconnect')
    return HttpResponse('success')


def status():
    print('status')
    return HttpResponse('success')


def hide():
    cv2.destroyAllWindows()
    return HttpResponse('success')


def catch(key, type):
    path = os.path.abspath(os.path.dirname(__file__)).split('backsite')[
               0] + 'pictures' + '\\' + type + '\\' + datetime.now().strftime('%Y-%m-%d') + '/'
    if not os.path.exists(path):
        os.makedirs(path)
    cap = cv2.VideoCapture("rtsp://admin:chenwen5352@192.168.2.15//Streaming/Channels/1")
    ret, frame = cap.read()
    cv2.imwrite(
        path + key + '.jpg',
        frame)
    print(key + '.jpg')
    cap.release()
    return HttpResponse('success')


def release():
    cv2.destroyAllWindows()
    return HttpResponse('success')
