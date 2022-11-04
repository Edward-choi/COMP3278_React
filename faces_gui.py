import urllib
import numpy as np
import mysql.connector
import cv2
import pyttsx3
import pickle
from datetime import datetime
import sys
import PySimpleGUI as sg

# 1 Create database connection
myconn = mysql.connector.connect(host="localhost", user="root", passwd="jamesmysql", database="facerecognition")
date = datetime.utcnow()
now = datetime.now()
weekday = datetime.today().weekday() #used in class_time
weekOfTheYear = datetime.today().isocalendar().week #used in information
current_time = now.strftime("%H:%M:%S")
currentTimeDelta = datetime.now().hour*3600 + datetime.now().minute*60 + datetime.now().second
classWithinHour = None
classWithinHourInfo = None
cursor = myconn.cursor(buffered = True)


#2 Load recognize and read label from model
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read("train.yml")

labels = {"person_name": 1}
with open("labels.pickle", "rb") as f:
    labels = pickle.load(f)
    labels = {v: k for k, v in labels.items()}

# create text to speech
engine = pyttsx3.init()
rate = engine.getProperty("rate")
engine.setProperty("rate", 175)

# Define camera and detect face
face_cascade = cv2.CascadeClassifier('haarcascade/haarcascade_frontalface_default.xml')
cap = cv2.VideoCapture(0)


# 3 Define pysimplegui setting
layout =  [
    [sg.Text('Setting', size=(18,1), font=('Any',18),text_color='#1c86ee' ,justification='left')],
    [sg.Text('Confidence'), sg.Slider(range=(0,100),orientation='h', resolution=1, default_value=60, size=(15,15), key='confidence')],
    [sg.OK(), sg.Cancel()]
      ]
win = sg.Window('Attendance System',
        default_element_size=(21,1),
        text_justification='right',
        auto_size_text=False).Layout(layout)
event, values = win.Read()
if event is None or event =='Cancel':
    exit()
args = values
gui_confidence = args["confidence"]
win_started = False

# 4 Open the camera and start face recognition
while True:
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.5, minNeighbors=5)

    for (x, y, w, h) in faces:
        print(x, w, y, h)
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = frame[y:y + h, x:x + w]
        # predict the id and confidence for faces
        id_, conf = recognizer.predict(roi_gray)

        # If the face is recognized
        if conf >= gui_confidence:
            # print(id_)
            # print(labels[id_])
            font = cv2.QT_FONT_NORMAL
            id = 0
            id += 1
            name = labels[id_]
            current_name = name
            color = (255, 0, 0)
            stroke = 2
            cv2.putText(frame, name, (x, y), font, 1, color, stroke, cv2.LINE_AA)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), (2))

            # Find the student information in the database.
            select = "SELECT users.userID, name, year, major FROM users JOIN students ON students.userID = users.userID WHERE name='%s'" % (name)
            name = cursor.execute(select)
            result = cursor.fetchall()
            # print(result)
            data = "error"

            for x in result:
                data = x

            # If the student's information is not found in the database
            if data == "error":
                # the student's data is not in the database
                print("The student", current_name, "is NOT FOUND in the database.")

            # If the student's information is found in the database
            else:
                #update login history
                loginHistUpdate =  "INSERT INTO login_hist(UserID, login_time, logout_time) VALUES(%s, now(), now())" % (result[0][0])
                cursor.execute(loginHistUpdate)
                myconn.commit()

                #find class within one hour
                select = "SELECT classID FROM students_take_classes where userID = %s" % result[0][0]
                getStudentTakesClassesID = cursor.execute(select)
                StudentTakesClassesID = cursor.fetchall()
                print(StudentTakesClassesID)
                select = "SELECT * FROM class_time WHERE day_of_week = %s" % weekday
                getClassTime = cursor.execute(select)
                classTime = cursor.fetchall()
                print(classTime)
                for i in range(len(StudentTakesClassesID)):    
                    if (len(classTime) > 0):
                        for j in range (len(classTime)):
                            if (StudentTakesClassesID[i][0] == classTime[j][0] and classTime[j][2].total_seconds() - currentTimeDelta <= 3600 and classTime[j][2].total_seconds() - currentTimeDelta >= 0): 
                                classWithinHour = classTime[j] #get the class within 1 hour
                                # get info of the class within hour
                                select = "SELECT * FROM information WHERE classID = %s AND week = %s" % (classWithinHour[0], weekOfTheYear)
                                getClassWithinHourInfo = cursor.execute(select)
                                classWithinHourInfo = cursor.fetchall()
                                #print(classWithinHour)
                                #print(classWithinHourInfo)


        # If the face is unrecognized
        else: 
            color = (255, 0, 0)
            stroke = 2
            font = cv2.QT_FONT_NORMAL
            cv2.putText(frame, "UNKNOWN", (x, y), font, 1, color, stroke, cv2.LINE_AA)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), (2))
            hello = ("Your face is not recognized")
            print(hello)
            engine.say(hello)
            # engine.runAndWait()

    # GUI
    imgbytes = cv2.imencode('.png', frame)[1].tobytes() 
    if not win_started:
        win_started = True
        layout = [
            [sg.Text('Attendance System Interface', size=(30,1))],
            [sg.Image(data=imgbytes, key='_IMAGE_')],
            [sg.Text('Confidence'),
                sg.Slider(range=(0, 100), orientation='h', resolution=1, default_value=60, size=(15, 15), key='confidence')],
            [sg.Exit()]
        ]
        win = sg.Window('Attendance System',
                default_element_size=(14, 1),
                text_justification='right',
                auto_size_text=False).Layout(layout).Finalize()
        image_elem = win.FindElement('_IMAGE_')
    else:
        image_elem.Update(data=imgbytes)

    event, values = win.Read(timeout=20)
    if event is None or event == 'Exit':
        break
    gui_confidence = values['confidence']

        
win.Close()
cap.release()
