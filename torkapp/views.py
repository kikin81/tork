from django.views.generic import FormView
from django.http import HttpResponse
from forms import UploadFileForm
from torkapp.models import TorqueStaticData, TorqueData
from django.contrib.auth.models import User
from torkapp.serializers import UserSerializer, TorqueDataSerializer, TorqueSessionSerializer
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
import logging
import json
import datetime
from rest_framework.decorators import list_route
from rest_framework import renderers
from django.http import Http404

logger = logging.getLogger(__name__)

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TorqueDataViewSet(viewsets.ModelViewSet):
    queryset = TorqueData.objects.all()
    serializer_class = TorqueDataSerializer

class TorqueDataSessionView(APIView):
    queryset = TorqueData.objects.all()
    serializer_class = TorqueDataSerializer

    def get(self, request, *args, **kwargs):
        qry = TorqueData.objects.raw('SELECT * FROM torkapp_torquedata WHERE session = %s', [kwargs['session']])
        serializer = TorqueDataSerializer(qry, many=True)
        return Response(serializer.data)

class TorqueSessionsListView(APIView):
    queryset = TorqueData.objects.all()
    serializer_class = TorqueSessionSerializer

    def get(self, request,  *args, **kwargs):
        q_str = 'SELECT id, session, email, timestamp, profileName as car, count(id) as readings FROM torkapp_torquedata'
        if request.user is not None:
            q_str += ' WHERE email = \'%s\'' % request.user.email
        q_str += ' GROUP BY session'
        q_str += ' ORDER BY timestamp ASC;'
        print q_str
        sessions = TorqueData.objects.raw(q_str)
        serializer = TorqueSessionSerializer(sessions, many=True);
        return Response(serializer.data)

class UploadForm(FormView):
    template_name = 'upload.html'
    form_class = UploadFileForm

    def form_valid(self, form):
        logger.debug("Managing Uploaded File")
        x = 1
        headerMap = {}
        for line in self.request.FILES['file']:
            curArray = line.split(",")
            i = 1
            curData = {}
            for data in curArray:
                if x == 1:
                    try:
                        logger.debug(data.strip())
                        endPos = data.rfind("(")
                        logger.debug("Pos: " + str(endPos))
                        if endPos != -1 and data[0:endPos].strip() != "G":
                            curDesc = data[0:endPos].strip()
                        else:
                            curDesc = data.strip()
                        headerMap[i] = TorqueStaticData.objects.get(desc=curDesc).http_code
                    except TorqueStaticData.DoesNotExist:
                        logger.warning(curDesc + " Does not exist in the database")
                        headerMap[i] = ""
                    else:
                        logger.debug(headerMap[i])
                else:
                    if headerMap[i] != "":
                        curData[headerMap[i]] = data.strip()
                i += 1
            x += 1
            line_data = json.dumps(curData)
            logger.debug(line_data)
            t = TorqueData(email=self.request.POST['email'],
                    session=self.request.POST['session'],
                    device_id=self.request.POST['device_id'],
                    profileName=self.request.POST['profileName'],
                    serialData=line_data)
            t.save()
            if x > 41:
                logger.debug("Hit 41")
                break
        return HttpResponse("OK!")
