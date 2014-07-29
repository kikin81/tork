from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request):
	for key in request.POST:
		value = request.POST[key]
	# loop through keys and values
	for key, value in request.POST.iteritems():
		print "Key " + key + " value: " + value
	return HttpResponse("OK!")
