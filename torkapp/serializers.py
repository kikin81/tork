from rest_framework import serializers
from django.contrib.auth.models import User
from torkapp.models import TorqueStaticData, TorqueData

# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff')

class TorqueDataSerializer(serializers.HyperlinkedModelSerializer):
    # session = serializers.HyperlinkedRelatedField(view_name='session-list')

    class Meta:
        model = TorqueData
        fields = ('id', 'email', 'session', 'device_id', 'serialData', 'timestamp')

class TorqueSessionSerializer(serializers.Serializer):
    id = serializers.Field()
    session = serializers.CharField(required=True, max_length=100)