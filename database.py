import sqlite3
import json
import sys
import hashlib

# database class
class DB:

    # creates the table if it doesnt exist
    def __init__(self):
        conn = sqlite3.connect('application.db')
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS Problems (problem TEXT UNIQUE, solution TEXT, class INTEGER, topic TEXT, level INTEGER)''')
        conn.commit()
        conn.close()
    
    # selects the problems that match the given class and topic  
    def query(self, class_name, topic):
        conn = sqlite3.connect('application.db')
        c = conn.cursor()  
        c.execute("SELECT problem, solution FROM Problems WHERE class = ? AND topic = ? ORDER BY level", (class_name,topic))
        rows = c.fetchall()
        conn.close()
        result = []
        for row in rows:
           result.append({'problem':row[0],'solution':row[1]})
        return json.dumps(result)

    # inserts the data into the the database if the password is correct
    def insert(self, password, data):
        if hashlib.sha1(password).hexdigest() == '18929adffe5569c0acb809132c315a7e06154f97':
            return self.parse_data(data)
        return 'Incorrect Password!'

    # this is a "private" function that parses the data format and adds the problems to the db
    def parse_data(self, data):
        data_rows = data.split('\n')[:-1]
      
        # data validation and normalization
        index = 0
        valid_rows = []
        for row in data_rows:
            row = row.split('\t')
            if len(row) != 5:
               return 'Line ' + str(index + 1) + ' has ' + str(len(row)) + ' columns, should have 5'
            problem = row[0]
            problem = problem.strip()
            
            solution = row[1]
            solution = solution.strip()
            
            class_num = row[2]
            class_num = class_num.strip()
            try:
                class_num = int(class_num)
            except:
                return 'Error parsing class num for row ' + str(index + 1)
                  
            topic = row[3]
            topic = topic.strip()
            topic = topic.lower()
            topic = topic.replace(' ','');
                
            level = row[4]
            level.strip()
            try:
                level = int(level)
            except:
                return 'Error parsing level for row ' + str(index + 1)
                
            valid_rows.append([problem, solution, class_num, topic, level])
            index += 1
      
        # database access
        conn = sqlite3.connect('application.db')
        c = conn.cursor()  
        
        index = 0
        for row in valid_rows:
            try:
                c.execute("INSERT INTO Problems VALUES(?,?,?,?,?)", (row[0],row[1],row[2],row[3],row[4]))
            except sqlite3.Error, e:
                return 'Error: ' + e.args[0] + ', on line ' + str(index + 1)
            index += 1
        
        conn.commit()
        conn.close()

        return 'Okay'


# this is called if the database file is used from the command line, it is similar to the insert function called from the web
def upload():
    db = DB()    
    f = open(sys.argv[1],'r')
    data_file = f.read()
    f.close()
    print db.parse_data(data_file)

# this is executed if python database.py <filename> is run   
if __name__ == "__main__" and len(sys.argv) == 2:
    upload()
