from ControleEstoque import views
from django.urls import path

urlpatterns = [
    path('categorias_movimento/', views.categorias_movimento, name='categorias_movimento'),
    path('categorias_produto/', views.categorias_produto, name='categorias_produto'),
    path('entrada/', views.entrada, name='entrada'),
    path('estoque/', views.estoque, name='estoque'),
    path('lancamento/', views.lancamento, name='lancamento'),
    path('lancamentos/', views.lancamentos, name='lancamentos'),
    path('', views.login, name='login'),
    path('painel_usuario/', views.painel_usuario, name='painel_usuario'),
    path('produtos/', views.produtos, name='produtos'),
    path('saida/', views.saida, name='saida'),
    path('subcategorias_produto', views.subcategorias_produto, name='subcategorias_produto'),
    path('usuarios', views.usuarios, name='usuarios'),
]
