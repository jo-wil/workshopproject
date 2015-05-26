import database
import worksheet
import web

db = database.DB()
w = worksheet.Worksheet()

# renderts the html templates using web.py's templating engine
render = web.template.render('templates/')

# maps the urls to their handler classes        
urls = (
    '/worksheet', 'Worksheet',
    '/database', 'Database',
    '/admin', 'Admin',
    '/', 'Index'
)

# creates the app and the wsgi connector
app = web.application(urls, globals())
wsgi_app = app.wsgifunc()

# worksheet class
# this class takes in new worksheet latex and generates the pdf
class Worksheet:
    def POST(self):
        user_data = web.input(worksheet = 'None')
        return w.refresh(user_data.worksheet)

# database class
# this classes GET querys the database for the given class and topic
# this classes POST adds problems to the database       
class Database:
    def GET(self):
        user_data = web.input(class_name = 'None', topic = 'None')
        return db.query(user_data.class_name, user_data.topic)
    def POST(self):
        user_data = web.input(password = 'None', data = 'None')
        return db.insert(user_data.password, user_data.data)

# admin class 
# this classes GET just returns the admins html page
class Admin:
    def GET(self):
        return render.admin()

# index class 
# this classes GET just returns the index html page
class Index:        
    def GET(self):
        return render.index()

# start the dev server is python server.py is run
if __name__ == "__main__":
    app.run()
