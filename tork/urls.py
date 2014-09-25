from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^app/', include('torkapp.urls')),
)

urlpatterns += patterns('django.contrib.flatpages.views',
    (r'^(?P<url>.*/)$', 'flatpage'),
)

urlpatterns += staticfiles_urlpatterns()
