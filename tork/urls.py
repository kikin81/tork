from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import admin
admin.autodiscover()
from django.contrib.auth.models import User
from rest_framework import routers
from torkapp.views import UserViewSet, TorqueDataViewSet

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tork', TorqueDataViewSet)

urlpatterns = patterns('',
    url(r'^api/rest/v1/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^upload/', include('torkapp.urls')),
)

urlpatterns += patterns('django.contrib.flatpages.views',
    (r'^(?P<url>.*/)$', 'flatpage'),
)

urlpatterns += staticfiles_urlpatterns()
