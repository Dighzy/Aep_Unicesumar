from ControleEstoque import views
from django.urls import path

urlpatterns = [
    path('origens/', views.OrigemView.as_view(), name='origens'),
    path('origens/<int:origem_id>/', views.OrigemView.as_view(), name='gerenciar_origem'),
    path('categorias/', views.CategoriaView.as_view(), name='categorias'), 
    path('categorias/<int:categoria_id>/', views.CategoriaView.as_view(), name='gerenciar_categoria'), 
    path('entrada/', views.EntradaView.as_view(), name='entrada'),
    path('estoque/', views.estoque, name='estoque'),
    path('lancamentos/', views.LancamentoView.as_view(), name='lancamentos'), 
    path('lancamentos/<int:lancamento_id>/', views.LancamentoView.as_view(), name='gerenciar_lancamento'),  
    path('', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('painel_usuario/', views.painel_usuario, name='painel_usuario'),
    path('produtos/', views.ProdutoView.as_view(), name='produtos'),
    path('produtos/<int:produto_id>/', views.ProdutoView.as_view(), name='gerenciar_produto'),
    path('saida/', views.SaidaView.as_view(), name='saida'),
    path('subcategorias/', views.SubCategoriaView.as_view(), name='subcategorias'), 
    path('subcategorias/<int:subcategoria_id>/', views.SubCategoriaView.as_view(), name='gerenciar_subcategoria'),  
    path('usuarios/', views.UsuarioView.as_view(), name='usuarios'),  # Rota genérica para operações POST
    path('usuarios/<int:user_id>/', views.UsuarioView.as_view(), name='gerenciar_usuario'),  # Rota específica para operações PUT, PATCH e DELETE
]
