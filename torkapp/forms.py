from django import forms

class UploadFileForm(forms.Form):
	email = forms.EmailField(max_length=50)
	profileName = forms.CharField(max_length=50, initial='BRZ')
	device_id = forms.CharField(max_length=50, initial='12345')
	session = forms.CharField(max_length=50, initial='10101010')
	file = forms.FileField()
