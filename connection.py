import sqlite3

con = None


def createDB():
    with sqlite3.connect('database.db') as con:
        con.execute('DROP TABLE IF EXISTS employee ')
        con.execute('CREATE TABLE IF NOT EXISTS employee(id TEXT PRIMARY KEY, name TEXT, dob TEXT,gender Text,contact TEXT,email TEXT,image BLOB)')

