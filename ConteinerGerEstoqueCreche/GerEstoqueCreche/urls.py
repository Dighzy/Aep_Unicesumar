from ControleEstoque import views
from django.urls import path

urlpatterns = [
    path('categorias_movimento/', views.Categorias_Movimento.as_view(), name='categorias_movimento'),
    path('categorias_movimento/<int:categoria_movimento_id>/', views.Categorias_Movimento.as_view(), name='gerenciar_categoria_movimento'),
    path('categorias_produto/', views.Categorias_Produto.as_view(), name='categorias_produto'), 
    path('categorias_produto/<int:categoria_id>/', views.Categorias_Produto.as_view(), name='gerenciar_categoria_produto'), 
    path('entrada/', views.Entrada.as_view(), name='entrada'),
    path('estoque/', views.estoque, name='estoque'),
    path('lancamento/', views.lancamento, name='lancamento'),
    path('lancamentos/', views.LancamentosView.as_view(), name='lancamentos'), 
    path('lancamentos/<int:lancamento_id>/', views.LancamentosView.as_view(), name='gerenciar_lancamento'),  
    path('', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('painel_usuario/', views.painel_usuario, name='painel_usuario'),
    path('produtos/', views.Produtos.as_view(), name='produtos'),
    path('produtos/<int:produto_id>/', views.Produtos.as_view(), name='gerenciar_produto'),
    path('saida/', views.Saida.as_view(), name='saida'),
    path('subcategorias_produto/', views.SubCategorias_Produto.as_view(), name='subcategorias_produto'), 
    path('subcategorias_produto/<int:subcategoria_id>/', views.SubCategorias_Produto.as_view(), name='gerenciar_subcategoria_produto'),  
    path('usuarios/', views.Usuarios.as_view(), name='usuarios'),  # Rota genérica para operações POST
    path('usuarios/<int:user_id>/', views.Usuarios.as_view(), name='gerenciar_usuario'),  # Rota específica para operações PUT, PATCH e DELETE
]
