import web
import subprocess
import database

db = database.DB()

render = web.template.render('templates/')
        
urls = (
    '/worksheet', 'Worksheet',
    '/database', 'Database',
    '/', 'Index'
)

app = web.application(urls, globals())

class Worksheet:
    def POST(self):
       user_data = web.input(worksheet = 'None')
       with open('./static/worksheets/worksheet.txt','w') as f:
          f.write(user_data.worksheet)
          f.close()
       ret = subprocess.call(['pdflatex', '-halt-on-error', '-output-directory', './static/worksheets' ,'worksheet.txt'])
       return ret

class Database:
    def GET(self):
       user_data = web.input(class_name = 'None', topic = 'None')
       return db.query(user_data.class_name, user_data.topic)
 
class Index:        
    def GET(self):
        return render.index()

if __name__ == "__main__":
    app.run()
