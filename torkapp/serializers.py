from rest_framework import serializers
from django.contrib.auth.models import User
from torkapp.models import TorqueStaticData, TorqueData

# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff')

class TorqueDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TorqueData
        fields = ('id','email', 'session', 'device_id', 'serialData', 'timestamp')