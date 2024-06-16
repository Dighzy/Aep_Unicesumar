from django.contrib.auth import views as auth_views
from ControleEstoque import views
from django.urls import path

# URLs de Autenticação
auth_patterns = [
    path('', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('painel_usuario/', views.painel_usuario, name='painel_usuario'),
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name="password_reset.html"), name='reset_password'),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name="password_reset_sent.html"), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name="password_reset_form.html"), name='password_reset_confirm'),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name="password_reset_complete.html"), name='password_reset_complete'),
]

# URLs de Produtos e Categorias
product_patterns = [
    path('produtos/', views.ProdutoView.as_view(), name='produtos'),
    path('produtos/<str:produto_id>/', views.ProdutoView.as_view(), name='gerenciar_produto'),
    path('categorias/', views.CategoriaView.as_view(), name='categorias'), 
    path('categorias/<int:categoria_id>/', views.CategoriaView.as_view(), name='gerenciar_categoria'),
    path('subcategorias/', views.SubCategoriaView.as_view(), name='subcategorias'), 
    path('subcategorias/<int:subcategoria_id>/', views.SubCategoriaView.as_view(), name='gerenciar_subcategoria'),
    path('tipos/', views.TipoView.as_view(), name='tipos'), 
    path('tipos/<int:tipo_id>/', views.TipoView.as_view(), name='gerenciar_tipo'),
    path('embalagens/', views.EmbalagemView.as_view(), name='embalagem'),
    path('embalagens/<int:embalagem_id>/', views.EmbalagemView.as_view(), name='gerenciar_embalagem'), 
]

# URLs de Entradas, Saídas e Lançamentos
transaction_patterns = [
    path('entradas/', views.EntradaView.as_view(), name='entradas'),  # Rota genérica para operações POST e GET
    path('entradas/<int:entrada_id>/', views.EntradaView.as_view(), name='gerenciar_entrada'),  # Rota específica para operações PUT, PATCH e DELETE
    path('saidas/', views.SaidaView.as_view(), name='saidas'),  # Rota genérica para operações POST e GET
    path('saidas/<int:saida_id>/', views.SaidaView.as_view(), name='gerenciar_saida'),  # Rota específica para operações PUT, PATCH e DELETE
    path('lancamentos/', views.LancamentoView.as_view(), name='lancamentos'),  # Rota genérica para operações POST e GET
    path('lancamentos/<int:lancamento_id>/', views.LancamentoView.as_view(), name='gerenciar_lancamento'),  # Rota específica para operações PUT, PATCH e DELETE
]

# URLs de Estoque
stock_patterns = [
    path('estoque/', views.estoque, name='estoque'),
]

# URLs de Origens
origin_patterns = [
    path('origens/', views.OrigemView.as_view(), name='origens'),  # Rota genérica para operações POST
    path('origens/gerenciar/', views.OrigemView.as_view(), name='gerenciar_origem'),  # Rota específica para operações PUT, PATCH e DELETE com parâmetro de consulta
]

# URLs de Usuários
user_patterns = [
    path('usuarios/', views.UsuarioView.as_view(), name='usuarios'),  # Rota genérica para operações POST
    path('usuarios/<int:user_id>/', views.UsuarioView.as_view(), name='gerenciar_usuario'),  # Rota específica para operações PUT, PATCH e DELETE
]

# Padrões de URL combinados
urlpatterns = auth_patterns + product_patterns + transaction_patterns + stock_patterns + origin_patterns + user_patterns
