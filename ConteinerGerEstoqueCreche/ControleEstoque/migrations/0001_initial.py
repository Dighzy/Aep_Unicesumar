# Generated by Django 5.0.6 on 2024-06-13 09:37

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('codigo', models.PositiveIntegerField(unique=True)),
                ('descricao', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'ce_categoria',
            },
        ),
        migrations.CreateModel(
            name='Origem',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('codigo', models.PositiveIntegerField(unique=True)),
                ('descricao', models.CharField(max_length=100)),
                ('tipo_de_movimento', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'ce_origem',
            },
        ),
        migrations.CreateModel(
            name='TipoProduto',
            fields=[
                ('codigo', models.PositiveIntegerField(primary_key=True, serialize=False, unique=True)),
                ('descricao', models.CharField(max_length=50, unique=True)),
            ],
            options={
                'db_table': 'ce_tipo_produto',
            },
        ),
        migrations.CreateModel(
            name='Produto',
            fields=[
                ('codigo', models.CharField(max_length=20, primary_key=True, serialize=False, unique=True)),
                ('descricao', models.TextField()),
                ('peso', models.DecimalField(decimal_places=2, max_digits=6)),
                ('unidade', models.CharField(max_length=10)),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ControleEstoque.categoria')),
            ],
            options={
                'db_table': 'ce_produto',
            },
        ),
        migrations.CreateModel(
            name='Lancamentos',
            fields=[
                ('codigo', models.AutoField(primary_key=True, serialize=False)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('data_lancamento', models.DateTimeField(default=django.utils.timezone.now)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('origem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ControleEstoque.origem')),
                ('produto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ControleEstoque.produto')),
            ],
            options={
                'db_table': 'ce_lancamentos',
            },
        ),
        migrations.CreateModel(
            name='Estoque',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contabil_real', models.DecimalField(decimal_places=2, max_digits=10)),
                ('contabil', models.DecimalField(decimal_places=2, max_digits=10)),
                ('primeiro_movimento', models.DateTimeField(default=django.utils.timezone.now)),
                ('ultimo_movimento', models.DateTimeField(default=django.utils.timezone.now)),
                ('origem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ControleEstoque.origem')),
                ('produto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ControleEstoque.produto')),
            ],
            options={
                'db_table': 'ce_estoque',
            },
        ),
        migrations.CreateModel(
            name='SubCategoria',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('codigo', models.CharField(max_length=10, unique=True)),
                ('descricao', models.CharField(max_length=100)),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ControleEstoque.categoria')),
            ],
            options={
                'db_table': 'ce_subcategoria',
            },
        ),
        migrations.AddField(
            model_name='produto',
            name='sub_categoria',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ControleEstoque.subcategoria'),
        ),
        migrations.AddField(
            model_name='produto',
            name='tipo',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='ControleEstoque.tipoproduto'),
        ),
        migrations.AddField(
            model_name='categoria',
            name='tipo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='categorias', to='ControleEstoque.tipoproduto'),
        ),
    ]
