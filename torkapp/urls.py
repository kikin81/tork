from django.conf.urls import patterns, url, include
from rest_framework import routers
from views import UserViewSet, TorqueDataViewSet, TorqueDataSessionView, TorqueSessionsListView, UploadForm

# Routers provide an easy way of automatically determining the URL conf.
router = routers.SimpleRouter()
router.register(r'users', UserViewSet)
router.register(r'tork', TorqueDataViewSet)

urlpatterns = patterns('',
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/sessions/$', TorqueSessionsListView.as_view(), name='all-sessions'),
    url(r'^api/v1/sessions/(?P<session>[0-9]+)/$', TorqueDataSessionView.as_view(), name='session-list'),
    url(r'^api-auth/', include('rest_framework.urls',namespace='rest_framework')),
    url(r'^upload/', UploadForm.as_view())
)
