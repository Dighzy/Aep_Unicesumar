# Generated by Django 5.0.6 on 2024-06-09 22:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ControleEstoque', '0012_merge_20240608_1959'),
    ]

    operations = [
        migrations.RenameField(
            model_name='estoque',
            old_name='categoria_movimento',
            new_name='origem',
        ),
        migrations.RenameField(
            model_name='lancamentos',
            old_name='categoria_movimento',
            new_name='origem',
        ),
    ]
