# Generated by Django 5.0.6 on 2024-06-08 22:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ControleEstoque', '0009_alter_origem_table'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='origem',
            name='id',
        ),
        migrations.AlterField(
            model_name='origem',
            name='codigo',
            field=models.PositiveIntegerField(primary_key=True, serialize=False, unique=True),
        ),
    ]
