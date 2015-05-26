import subprocess

# this class creates the pdf
class Worksheet:

    # this function creates the pdf and saves it as worksheet.pdf
    # this function returns the result of that process
    def refresh(self, data):
        with open('./static/worksheets/worksheet.txt','w') as f:
            f.write(data)
            f.close()
        ret = subprocess.call(['pdflatex', '-halt-on-error', '-output-directory', './static/worksheets' ,'worksheet.txt'])
        return ret
