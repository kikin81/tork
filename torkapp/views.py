from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse
from .forms import UploadFileForm
from torkapp.models import TorqueStaticData, TorqueData
from django.contrib.auth.models import User
from torkapp.serializers import UserSerializer, TorqueDataSerializer
from rest_framework import viewsets
import logging
import json
import datetime
logger = logging.getLogger(__name__)

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TorqueDataViewSet(viewsets.ModelViewSet):
    queryset = TorqueData.objects.all()
    serializer_class = TorqueDataSerializer

def index(request):
    #if request.method == 'GET':
    #    return HttpResponse("OK!")
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            upload_file(request.FILES['file'])
            return HttpResponse("OK!")
    else:
        form = UploadFileForm()
    return render_to_response('upload.html', {'form': form})

def upload_file(f):
    logger.debug("Managing Uploaded File")
    x = 1
    headerMap = {}
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
                    curData[headerMap[i]] = data.strip()
            i += 1
        x += 1
        line_data = json.dumps(curData)
        logger.debug(line_data)
        t = TorqueData(email="lara.m.victor@gmail.com", session="1234567890", device_id="0987654321", profileName="Subaru WRX", serialData=line_data)
        t.save()
        if x > 41:
            print "Hit 41"
            break
