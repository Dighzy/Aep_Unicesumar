from django.contrib.auth import views as auth_views
from ControleEstoque import views
from django.urls import path

urlpatterns = [
    path('origens/', views.OrigemView.as_view(), name='origens'), # Rota genérica para operações POST
    path('origens/gerenciar/', views.OrigemView.as_view(), name='gerenciar_origem'), # Rota específica para operações PUT, PATCH e DELETE com parâmetro de consulta
    path('categorias/', views.CategoriaView.as_view(), name='categorias'), 
    path('categorias/<int:categoria_id>/', views.CategoriaView.as_view(), name='gerenciar_categoria'),
    path('embalagens/', views.EmbalagemView.as_view(), name='embalagem'),
    path('embalagens/<int:embalagem_id>/', views.EmbalagemView.as_view(), name='gerenciar_embalagem'), 
    # path('entrada/', views.EntradaView.as_view(), name='entrada'),
    path('estoque/', views.estoque, name='estoque'),
    path('lancamentos/', views.LancamentoView.as_view(), name='lancamentos'), 
    path('lancamentos/<int:lancamento_id>/', views.LancamentoView.as_view(), name='gerenciar_lancamento'),  
    path('', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('painel_usuario/', views.painel_usuario, name='painel_usuario'),
        path('reset_password/', auth_views.PasswordResetView.as_view(template_name="password_reset.html"), name='reset_password'),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name="password_reset_sent.html"), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name="password_reset_form.html"), name='password_reset_confirm'),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name="password_reset_complete.html"), name='password_reset_complete'),
    path('produtos/', views.ProdutoView.as_view(), name='produtos'),
    path('produtos/<str:produto_id>/', views.ProdutoView.as_view(), name='gerenciar_produto'),
    # path('saida/', views.SaidaView.as_view(), name='saida'),
    path('subcategorias/', views.SubCategoriaView.as_view(), name='subcategorias'), 
    path('subcategorias/<int:subcategoria_id>/', views.SubCategoriaView.as_view(), name='gerenciar_subcategoria'),  
    path('tipos/', views.TipoView.as_view(), name='tipos'), 
    path('tipos/<int:tipo_id>/', views.TipoView.as_view(), name='gerenciar_tipo'),  
    path('usuarios/', views.UsuarioView.as_view(), name='usuarios'),  # Rota genérica para operações POST
    path('usuarios/<int:user_id>/', views.UsuarioView.as_view(), name='gerenciar_usuario'),  # Rota específica para operações PUT, PATCH e DELETE
]
