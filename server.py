import database
import worksheet
import web

db = database.DB()
w = worksheet.Worksheet()

#web.config.debug = False
render = web.template.render('templates/')
        
urls = (
    '/worksheet', 'Worksheet',
    '/database', 'Database',
    '/', 'Index'
)

app = web.application(urls, globals())
#session = web.session.Session(app, web.session.DiskStore('sessions'), initializer={'admin': False})

class Worksheet:
    def POST(self):
        user_data = web.input(worksheet = 'None')
        return w.refresh(user_data.worksheet)
       
class Database:
    def GET(self):
        user_data = web.input(class_name = 'None', topic = 'None')
        return db.query(user_data.class_name, user_data.topic)

class Index:        
    def GET(self):
        return render.index()

if __name__ == "__main__":
    app.run()
