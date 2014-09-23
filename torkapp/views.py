from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse
from .forms import UploadFileForm
from torkapp.models import TorqueStaticData
from torkapp.models import TorqueData
import logging
import json
import datetime
logger = logging.getLogger(__name__)

def index(request):
    #if request.method == 'GET':
    #    return HttpResponse("OK!")
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            handle_uploaded_file(request.FILES['file'])
            return HttpResponse("OK!")
    else:
        form = UploadFileForm()
    return render_to_response('upload.html', {'form': form})

def upload_file(f):
    logger.debug("Managing Uploaded File")

    x = 1
    headerMap = {}
    dataMap = {}
    for line in f:
        curArray = line.split(",")
        i = 1
        curData = {}
        for data in curArray:
            if x == 1:
                try:
                    print data.strip()
                    endPos = data.rfind("(")
                    print "Pos: ", endPos
                    if endPos != -1 and data[0:endPos].strip() != "G":
                        curDesc = data[0:endPos].strip()
                    else:
                        curDesc = data.strip()
                    headerMap[i] = TorqueStaticData.objects.get(desc=curDesc).http_code
                except TorqueStaticData.DoesNotExist:
                    print curDesc + " Does not exist in the database"
                    headerMap[i] = ""
                else:
                    print headerMap[i]
            else:
                if headerMap[i] != "":
                    curData[headerMap[i]] =data.strip()
            i += 1
        dataMap[x] = curData
        x += 1
    logger.debug(json.dumps(dataMap))
    entry = TorqueData(email="lara.m.victor@gmail.com",session="1234567890",device_id="0987654321",profileName="Subaru WRX",serialData=json.dumps(dataMap))
    entry.save()
