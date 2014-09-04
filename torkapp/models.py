from django.db import models

# Create your models here.

class TorqueStaticData(models.Model):
    desc = models.CharField(max_length=255)
    #odb_code = models.CharField(max_length=2)
    http_code = models.CharField(max_length=10)

class TorqueData(models.Model):
    email = models.EmailField(max_length=254,blank=True)
    session = models.CharField(max_length=255, db_index=True)
    device_id = models.CharField(max_length=255)
    profileName = models.CharField(max_length=255, blank=True, null=True)
    profileFuelType = models.CharField(max_length=255, blank=True, null=True)
    profileWeight = models.CharField(max_length=255, blank=True, null=True)
    profileVe = models.CharField(max_length=255, blank=True, null=True)
    profileFuelCost = models.CharField(max_length=255, blank=True, null=True)
    serialData =  models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField()
