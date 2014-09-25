from django.conf.urls import patterns, url, include
from rest_framework import routers
from views import UserViewSet, TorqueDataViewSet, TorqueSessionsViewSet, UploadForm

# Routers provide an easy way of automatically determining the URL conf.
router = routers.SimpleRouter()
router.register(r'users', UserViewSet)
router.register(r'tork', TorqueDataViewSet)
router.register(r'sessions', TorqueSessionsViewSet, base_name="sessions")

urlpatterns = patterns('',
    url(r'^api/rest/v1/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls',namespace='rest_framework')),
    url(r'^upload/', UploadForm.as_view())
)
