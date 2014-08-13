from django.db import models

# Create your models here.

class TorqueStaticData(models.Model):
    desc = models.CharField(max_length=255)
    odb_code = models.CharField(max_length=2)
    http_code = models.CharField(max_length=10)
