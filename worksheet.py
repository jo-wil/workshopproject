import subprocess

class Worksheet:

    def refresh(self, data):
        with open('./static/worksheets/worksheet.txt','w') as f:
            f.write(data)
            f.close()
        ret = subprocess.call(['pdflatex', '-halt-on-error', '-output-directory', './static/worksheets' ,'worksheet.txt'])
        return ret
