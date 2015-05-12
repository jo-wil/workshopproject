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
    '/admin', 'Admin',
    '/', 'Index'
)

app = web.application(urls, globals())
wsgi_app = app.wsgifunc()
#session = web.session.Session(app, web.session.DiskStore('sessions'), initializer={'admin': False})

class Worksheet:
    def POST(self):
        user_data = web.input(worksheet = 'None')
        return w.refresh(user_data.worksheet)
       
class Database:
    def GET(self):
        user_data = web.input(class_name = 'None', topic = 'None')
        return db.query(user_data.class_name, user_data.topic)
    def POST(self):
        user_data = web.input(password = 'None', data = 'None')
        return db.insert(user_data.password, user_data.data)
class Admin:
    def GET(self):
        return render.admin()

class Index:        
    def GET(self):
        return render.index()

if __name__ == "__main__":
    app.run()
