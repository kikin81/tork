from django.conf.urls import patterns, url

from torkapp import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index')
)
