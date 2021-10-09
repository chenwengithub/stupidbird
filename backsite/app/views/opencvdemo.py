import cv2

url = "rtsp://admin:chenwen5352@192.168.2.15/Streaming/Channels/2"
cap = cv2.VideoCapture(url)
i = 0
while (1):
    ret, frame = cap.read()
    k = cv2.waitKey(1)
    if k == 27:
        break
    cv2.imwrite('G:/' + str(i) + '.jpg', frame)
    i += 1
    # cv2.imshow("capture", frame)
cv2.destroyAllWindows()
cap.release()
