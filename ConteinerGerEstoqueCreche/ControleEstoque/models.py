from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Categoria(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    descricao = models.CharField(max_length=100)

    class Meta:
        db_table = 'CE_Categoria'

class SubCategoria(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    descricao = models.CharField(max_length=100)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='subcategorias')

    class Meta:
        db_table = 'CE_SubCategoria'

class Produto(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    descricao = models.TextField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    sub_categoria = models.ForeignKey(SubCategoria, on_delete=models.CASCADE)
    peso = models.DecimalField(max_digits=6, decimal_places=2)
    unidade = models.CharField(max_length=10)

    class Meta:
        db_table = 'CE_Produto'


class CategoriasMovimento(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    descricao = models.CharField(max_length=100)
    tipo_de_movimento = models.CharField(max_length=50)

    class Meta:
        db_table = 'CE_Categorias_Movimento'


class Lancamentos(models.Model):
    codigo = models.AutoField(primary_key=True)
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    categoria_movimento = models.ForeignKey('CategoriasMovimento', on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    data_lancamento = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'CE_Lancamentos'


class Estoque(models.Model):
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE)
    contabil_real = models.DecimalField(max_digits=10, decimal_places=2)
    contabil = models.DecimalField(max_digits=10, decimal_places=2)
    primeiro_movimento = models.DateTimeField(default=timezone.now)
    ultimo_movimento = models.DateTimeField(default=timezone.now)
    categoria_movimento = models.ForeignKey('CategoriasMovimento', on_delete=models.CASCADE)

    class Meta:
        db_table = 'CE_Estoque'
