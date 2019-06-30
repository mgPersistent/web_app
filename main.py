from flask import(
    Flask, url_for, redirect, render_template, request, abort
)
import connection
import sqlite3
import json

app = Flask(__name__)
connection.createDB()


@app.route('/')
def index():
    employees = get_employees()
    return render_template('index.html', employees=employees)


@app.route('/add', methods=['POST'])
def add():
    data = request.form['data']
    employee = json.loads(data)
    add_employee(employee)
    return "Created!!", 201


@app.route('/update', methods=['POST'])
def update():
    pre_id = request.form['pre_id']
    data = request.form['data']
    employee = json.loads(data)
    update_employee(pre_id, employee)
    return "Updated!!", 202


def get_employees():
    with sqlite3.connect('database.db') as con:
        cur = con.cursor()
        cur.execute('select * from employee')
        rows = cur.fetchall()
        return rows


def update_employee(pre_id, employee):
    with sqlite3.connect('database.db') as con:
        cur = con.cursor()
        cur.execute("UPDATE employee set id=?,name=?,dob=?,gender=?,email=?,contact=?,image=? where id=?", (
            employee['id'],
            employee['name'],
            employee['dob'],
            employee['gender'],
            employee['email'],
            employee['contact'],
            employee['image'],
            pre_id
        ))
        con.commit()

def add_employee(employee):
    with sqlite3.connect('database.db') as con:
        cur = con.cursor()
        cur.execute("INSERT INTO employee(id,name,dob,gender,email,contact,image)VALUES(?, ?, ?, ?, ?, ?, ?)", (
            employee['id'],
            employee['name'],
            employee['dob'],
            employee['gender'],
            employee['email'],
            employee['contact'],
            employee['image']
        ))
        con.commit()


if __name__ == '__main__':
    app.run(debug=True)