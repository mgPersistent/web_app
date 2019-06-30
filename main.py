from flask import(
    Flask, url_for, redirect, render_template, request, make_response, abort
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


@app.route('/data.csv')
def download_csv():
    with sqlite3.connect('database.db') as con:
        con.row_factory = sqlite3.Row
        cur = con.cursor()
        cur.execute('select * from employee')
        rows = cur.fetchall()
        csv = ''
        for row in rows:
            csv += ','.join([row['id'], row['name'], row['dob'], row['gender'], row['email'], row['contact']])
            csv += '\n'
        return make_response(csv, 200, {'content-type': 'text/csv'})


@app.route('/emp', methods=['POST'])
def add():
    data = request.form['data']
    employee = json.loads(data)
    if not add_employee(employee):
        return make_response("Bad Request",400)
    return make_response("Created!!", 201)


@app.route('/emp', methods=['PUT'])
def update():
    pre_id = request.form['pre_id']
    data = request.form['data']
    employee = json.loads(data)
    if not update_employee(pre_id, employee):
        return make_response("Bad Request", 400)
    return make_response("Updated!!", 202)


@app.route('/emp', methods=['DELETE'])
def delete():
    pre_id = request.form['pre_id']
    with sqlite3.connect('database.db') as con:
        cur = con.cursor()
        cur.execute("delete from employee where id=?", (pre_id,))
        con.commit()
    return make_response("Deleted!!", 200)


def get_employees():
    with sqlite3.connect('database.db') as con:
        con.row_factory = sqlite3.Row
        cur = con.cursor()
        cur.execute('select * from employee')
        rows = cur.fetchall()
        return rows


def add_employee(employee):
    with sqlite3.connect('database.db') as con:
        try:
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

        except sqlite3.IntegrityError:
            return False
    return True


def update_employee(pre_id, employee):
    with sqlite3.connect('database.db') as con:
        try:
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
        except sqlite3.IntegrityError:
            return False
    return True


if __name__ == '__main__':
    app.run()
