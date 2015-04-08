import sqlite3
import json
import sys

class DB:

   def __init__(self):
      conn = sqlite3.connect('application.db')
      c = conn.cursor()
      c.execute('''CREATE TABLE IF NOT EXISTS Problems (problem TEXT UNIQUE, solution TEXT, class TEXT, topic TEXT, level TEXT)''')
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
      
   def parse_file(self, filename):
      f = open(filename,'r')
      new_problems = f.read()
      f.close()
      new_problems = new_problems.split('\n')
      
      # database access
      conn = sqlite3.connect('application.db')
      c = conn.cursor()  
      for problem in new_problems:
         p = problem.split(',')
         if len(p) == 5:
            for index in p:
               index.strip()
            try:
               c.execute("INSERT INTO Problems VALUES(?,?,?,?,?)", (p[0].strip(),p[1].strip(),p[2].strip(),p[3].strip(),p[4].strip()))
            except:
               p = None
      conn.commit()
      conn.close()

def upload():
   db = DB()      
   db.parse_file(sys.argv[1])
   
if __name__ == "__main__" and len(sys.argv) == 2:
   upload()
