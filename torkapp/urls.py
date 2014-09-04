from django.conf.urls import patterns, url

from torkapp import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^$', views.upload_file, name='upload_file')
)
