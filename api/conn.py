import mysql.connector


db = mysql.connector.connect(
    host="localhost",
    port=12345,
    user="root",
    password="root",
    database="vehicle_detection"
)
cursor = db.cursor()