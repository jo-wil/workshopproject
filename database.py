import sqlite3
import json
import sys

class DB:

    def __init__(self):
        conn = sqlite3.connect('application.db')
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS Problems (problem TEXT UNIQUE, solution TEXT, class INTEGER, topic TEXT, level INTEGER)''')
        conn.commit()
        conn.close()
      
    def query(self,class_name,topic):
        conn = sqlite3.connect('application.db')
        c = conn.cursor()  
        c.execute("SELECT problem, solution FROM Problems WHERE class = ? AND topic = ? ORDER BY level", (class_name,topic))
        rows = c.fetchall()
        conn.close()
        result = []
        for row in rows:
           result.append({'problem':row[0],'solution':row[1]})
        return json.dumps(result)
      
    def parse_data(self, data):
        data_rows = data.split('\n')
      
        # data validation and normalization
        index = 0
        valid_rows = []
        for row in data_rows:
            row = row.split(',')
            if len(row) == 5: # to get rid of the last line
                problem = row[0]
                problem = problem.strip()
            
                solution = row[1]
                solution = solution.strip()
            
                class_num = row[2]
                class_num = class_num.strip()
                try:
                    class_num = int(class_num)
                except:
                    return 'Error parsing class num for row ' + str(index)
                   
                topic = row[3]
                topic = topic.strip()
                topic = topic.lower()
                topic = topic.replace(' ','');
                
                level = row[4]
                level.strip()
                try:
                    level = int(level)
                except:
                    return 'Error parsing level for row ' + str(index)
                
                valid_rows.append([problem, solution, class_num, topic, level])
                index += 1
      
        # database access
        conn = sqlite3.connect('application.db')
        c = conn.cursor()  
        
        for row in valid_rows:
            try:
                c.execute("INSERT INTO Problems VALUES(?,?,?,?,?)", (row[0],row[1],row[2],row[3],row[4]))
            except sqlite3.Error, e:
                return 'Error %s:' % e.args[0]
        
        conn.commit()
        conn.close()

        return 'Okay'

def upload():
    db = DB()    
    f = open(sys.argv[1],'r')
    data_file = f.read()
    f.close()
    print db.parse_data(data_file)
   
if __name__ == "__main__" and len(sys.argv) == 2:
    upload()
