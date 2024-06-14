from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class TipoProduto(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.PositiveIntegerField(unique=True)
    descricao = models.CharField(max_length=50, unique=True)
    
    class Meta:
        db_table = 'ce_tipo'

    def __str__(self):
        return self.descricao


class Categoria(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.PositiveIntegerField(unique=True)
    descricao = models.CharField(max_length=100)
    tipo = models.ForeignKey(TipoProduto, on_delete=models.CASCADE, related_name='categorias')

    class Meta:
        db_table = 'ce_categoria'

    def __str__(self):
        return f'{str(self.codigo).zfill(4)} - {self.descricao}'

class SubCategoria(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=10, unique=True)
    descricao = models.CharField(max_length=100)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)

    class Meta:
        db_table = 'ce_subcategoria'

    def __str__(self):
        return f'{str(self.codigo).zfill(4)} - {self.descricao}'

class EmbalagemProduto(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.PositiveIntegerField(unique=True)
    descricao = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'ce_embalagem'
    
    def __str__(self):
        return f'{self.codigo} - {self.descricao}'


class Produto(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=20, unique=True)
    descricao = models.TextField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    sub_categoria = models.ForeignKey(SubCategoria, on_delete=models.CASCADE)
    tipo_peso = models.CharField(max_length=2, null=True, blank=True)  
    peso = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True) 
    unidade = models.PositiveIntegerField() 
    unidade_real = models.PositiveIntegerField() 
    tipo = models.ForeignKey(TipoProduto, on_delete=models.SET_NULL, null=True, blank=True)
    embalagem = models.ForeignKey(EmbalagemProduto, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        db_table = 'ce_produto'
    
    def __str__(self):
        return f'{self.codigo} - {self.descricao}'


class Origem(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.PositiveIntegerField(unique=True)
    descricao = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)

    class Meta:
        db_table = 'ce_origem'

    def __str__(self):
        return f'{str(self.codigo).zfill(4)} - {self.descricao}'


class Lancamentos(models.Model):
    codigo = models.AutoField(primary_key=True)
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    origem = models.ForeignKey('Origem', on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    data_lancamento = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'ce_lancamentos'


class Estoque(models.Model):
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE)
    contabil_real = models.DecimalField(max_digits=10, decimal_places=2)
    contabil = models.DecimalField(max_digits=10, decimal_places=2)
    primeiro_movimento = models.DateTimeField(default=timezone.now)
    ultimo_movimento = models.DateTimeField(default=timezone.now)
    origem = models.ForeignKey('Origem', on_delete=models.CASCADE)

    class Meta:
        db_table = 'ce_estoque'
