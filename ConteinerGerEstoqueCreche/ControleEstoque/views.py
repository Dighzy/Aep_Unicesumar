from django.shortcuts import render, get_object_or_404
from django.views import View
from django.utils.decorators import method_decorator
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login as user_login, logout as user_logout
from django.contrib.auth.models import User
from .models import Categoria, SubCategoria, Produto, CategoriasMovimento, Lancamentos
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.utils import timezone
import json

@method_decorator(login_required, name='dispatch')
class Categorias_Movimento(View):
    @method_decorator(never_cache)
    def get(self, request):
        # Mostrar
        categoria_movimento_id = request.GET.get('categoria_movimento_id', None)
        if categoria_movimento_id is not None:
            categoria_movimento = CategoriasMovimento.objects.get(id=categoria_movimento_id)
        else:
            categoria_movimento = None
        categorias_movimento = CategoriasMovimento.objects.all()
        return render(request, 'categorias_movimento.html', {'categorias_movimento': categorias_movimento, 'categoria_movimento': categoria_movimento})

    def post(self, request):
        # Inserir
        codigo = request.POST.get('codigo')
        descricao = request.POST.get('descricao')
        tipo_de_movimento = request.POST.get('tipo_de_movimento')
        categoria_movimento = CategoriasMovimento.objects.create(codigo=codigo, descricao=descricao, tipo_de_movimento=tipo_de_movimento)
        return JsonResponse({'id': categoria_movimento.id})

    def patch(self, request, categoria_movimento_id):
        # Atualizar Partes
        categoria_movimento = get_object_or_404(CategoriasMovimento, id=categoria_movimento_id)
        categoria_movimento.descricao = request.POST.get('descricao', categoria_movimento.descricao)
        categoria_movimento.tipo_de_movimento = request.POST.get('tipo_de_movimento', categoria_movimento.tipo_de_movimento)
        categoria_movimento.save()
        return JsonResponse({'status': 'success'})

    def put(self, request, categoria_movimento_id):
        # Atualizar Tudo
        categoria_movimento = get_object_or_404(CategoriasMovimento, id=categoria_movimento_id)
        categoria_movimento.codigo = request.POST.get('codigo')
        categoria_movimento.descricao = request.POST.get('descricao')
        categoria_movimento.tipo_de_movimento = request.POST.get('tipo_de_movimento')
        categoria_movimento.save()
        return JsonResponse({'status': 'success'})

    def delete(self, request, categoria_movimento_id):
        # Deletar
        categoria_movimento = get_object_or_404(CategoriasMovimento, id=categoria_movimento_id)
        categoria_movimento.delete()
        return JsonResponse({'status': 'success'})

@method_decorator(login_required, name='dispatch')
class Categorias_Produto(View):
    @method_decorator(never_cache)
    def get(self, request):
        # Mostrar
        categoria_id = request.GET.get('categoria_id', None)
        if categoria_id is not None:
            categoria = Categoria.objects.get(id=categoria_id)
        else:
            categoria = None
        categorias = Categoria.objects.all()
        return render(request, 'categorias_produto.html', {'categorias': categorias, 'categoria': categoria})

    def post(self, request):
        # Inserir
        codigo = request.POST.get('codigo')
        descricao = request.POST.get('descricao')
        categoria = Categoria.objects.create(codigo=codigo, descricao=descricao)
        return JsonResponse({'id': categoria.id})

    def patch(self, request, categoria_id):
        # Atualizar Partes
        categoria = get_object_or_404(Categoria, id=categoria_id)
        categoria.descricao = request.POST.get('descricao', categoria.descricao)
        categoria.save()
        return JsonResponse({'status': 'success'})

    def put(self, request, categoria_id):
        # Atualizar Tudo
        categoria = get_object_or_404(Categoria, id=categoria_id)
        categoria.codigo = request.POST.get('codigo')
        categoria.descricao = request.POST.get('descricao')
        categoria.save()
        return JsonResponse({'status': 'success'})

    def delete(self, request, categoria_id):
        # Deletar
        categoria = get_object_or_404(Categoria, id=categoria_id)
        categoria.delete()
        return JsonResponse({'status': 'success'})

@never_cache
@login_required
def entrada(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    return render(request, 'entrada.html')

@never_cache
@login_required
def estoque(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    return render(request, 'estoque.html')

@never_cache
@login_required
def lancamento(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    return render(request, 'lancamento.html')

@method_decorator(login_required, name='dispatch')
class LancamentosView(View):
    @method_decorator(never_cache)
    def get(self, request):
        # Mostrar
        lancamento_id = request.GET.get('lancamento_id', None)
        if lancamento_id is not None:
            lancamento = Lancamentos.objects.get(id=lancamento_id)
        else:
            lancamento = None
        lancamentos = Lancamentos.objects.all()
        return render(request, 'lancamentos.html', {'lancamentos': lancamentos, 'lancamento': lancamento})

    def post(self, request):
        # Inserir
        produto_id = request.POST.get('produto_id')
        total = request.POST.get('total')
        categoria_movimento_id = request.POST.get('categoria_movimento_id')
        usuario_id = request.POST.get('usuario_id')
        produto = Produto.objects.get(id=produto_id)
        categoria_movimento = CategoriasMovimento.objects.get(id=categoria_movimento_id)
        usuario = User.objects.get(id=usuario_id)
        lancamento = Lancamentos.objects.create(
            produto=produto, total=total, categoria_movimento=categoria_movimento,
            usuario=usuario, data_lancamento=timezone.now()
        )
        return JsonResponse({'codigo': lancamento.codigo})

    def patch(self, request, lancamento_id):
        # Atualizar Partes
        lancamento = get_object_or_404(Lancamentos, id=lancamento_id)
        lancamento.total = request.POST.get('total', lancamento.total)
        lancamento.save()
        return JsonResponse({'status': 'success'})

    def put(self, request, lancamento_id):
        # Atualizar Tudo
        lancamento = get_object_or_404(Lancamentos, id=lancamento_id)
        lancamento.produto_id = request.POST.get('produto_id')
        lancamento.total = request.POST.get('total')
        lancamento.categoria_movimento_id = request.POST.get('categoria_movimento_id')
        lancamento.usuario_id = request.POST.get('usuario_id')
        lancamento.data_lancamento = timezone.now()
        lancamento.save()
        return JsonResponse({'status': 'success'})

    def delete(self, request, lancamento_id):
        # Deletar
        lancamento = get_object_or_404(Lancamentos, id=lancamento_id)
        lancamento.delete()
        return JsonResponse({'status': 'success'})


def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
            if user is not None:
                user_login(request, user)
                return JsonResponse({'status': 'ok'}, status=200)
            else:
                return JsonResponse({'error': 'Login inválido'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Login inválido'}, status=400)
    else:
        return render(request, 'login.html')


def logout(request):
    user_logout(request)
    return HttpResponseRedirect('/')

@never_cache
@login_required
def painel_usuario(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    user = request.user
    return render(request, 'painel_usuario.html', {'user': user})


@method_decorator(login_required, name='dispatch')
class Produtos(View):
    @method_decorator(never_cache)
    def get(self, request):
        # Mostrar
        produto_id = request.GET.get('produto_id', None)
        if produto_id is not None:
            produto = Produto.objects.get(id=produto_id)
        else:
            produto = None
        produtos = Produto.objects.select_related('categoria', 'sub_categoria').all()
        return render(request, 'produtos.html', {'produtos': produtos, 'produto': produto})

    def post(self, request):
        # Inserir
        codigo = request.POST.get('codigo')
        descricao = request.POST.get('descricao')
        categoria_id = request.POST.get('categoria_id')
        sub_categoria_id = request.POST.get('sub_categoria_id')
        peso = request.POST.get('peso')
        unidade = request.POST.get('unidade')
        categoria = Categoria.objects.get(id=categoria_id)
        sub_categoria = SubCategoria.objects.get(id=sub_categoria_id)
        produto = Produto.objects.create(
            codigo=codigo, descricao=descricao, categoria=categoria,
            sub_categoria=sub_categoria, peso=peso, unidade=unidade
        )
        return JsonResponse({'id': produto.id})

    def patch(self, request, produto_id):
        # Atualizar Partes
        produto = get_object_or_404(Produto, id=produto_id)
        descricao = request.POST.get('descricao')
        peso = request.POST.get('peso')
        unidade = request.POST.get('unidade')
        categoria_id = request.POST.get('categoria_id')
        sub_categoria_id = request.POST.get('sub_categoria_id')

        if descricao is not None:
            produto.descricao = descricao
        if peso is not None:
            produto.peso = peso
        if unidade is not None:
            produto.unidade = unidade
        if categoria_id is not None:
            produto.categoria_id = categoria_id
        if sub_categoria_id is not None:
            produto.sub_categoria_id = sub_categoria_id

        produto.save()
        return JsonResponse({'status': 'success'})

    def put(self, request, produto_id):
        # Atualizar Tudo
        produto = get_object_or_404(Produto, id=produto_id)
        produto.codigo = request.POST.get('codigo')
        produto.descricao = request.POST.get('descricao')
        produto.categoria_id = request.POST.get('categoria_id')
        produto.sub_categoria_id = request.POST.get('sub_categoria_id')
        produto.peso = request.POST.get('peso')
        produto.unidade = request.POST.get('unidade')
        produto.save()
        return JsonResponse({'status': 'success'})

    def delete(self, request, produto_id):
        # Deletar
        produto = get_object_or_404(Produto, id=produto_id)
        produto.delete()
        return JsonResponse({'status': 'success'})

@never_cache
@login_required
def saida(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    return render(request, 'saida.html')

@method_decorator(login_required, name='dispatch')
class SubCategorias_Produto(View):
    @method_decorator(never_cache)
    def get(self, request):
        # Mostrar
        subcategoria_id = request.GET.get('subcategoria_id', None)
        if subcategoria_id is not None:
            subcategoria = SubCategoria.objects.get(id=subcategoria_id)
        else:
            subcategoria = None
        subcategorias = SubCategoria.objects.select_related('categoria').all()
        return render(request, 'subcategorias_produto.html', {'subcategorias': subcategorias, 'subcategoria': subcategoria})

    def post(self, request):
        # Inserir
        codigo = request.POST.get('codigo')
        descricao = request.POST.get('descricao')
        categoria_id = request.POST.get('categoria_id')
        categoria = Categoria.objects.get(id=categoria_id)
        subcategoria = SubCategoria.objects.create(codigo=codigo, descricao=descricao, categoria=categoria)
        return JsonResponse({'id': subcategoria.id})

    def patch(self, request, subcategoria_id):
        # Atualizar Partes
        subcategoria = get_object_or_404(SubCategoria, id=subcategoria_id)
        subcategoria.descricao = request.POST.get('descricao', subcategoria.descricao)
        subcategoria.categoria_id = request.POST.get('categoria_id', subcategoria.categoria_id)
        subcategoria.save()
        return JsonResponse({'status': 'success'})

    def put(self, request, subcategoria_id):
        # Atualizar Tudo
        subcategoria = get_object_or_404(SubCategoria, id=subcategoria_id)
        subcategoria.codigo = request.POST.get('codigo')
        subcategoria.descricao = request.POST.get('descricao')
        subcategoria.categoria_id = request.POST.get('categoria_id')
        subcategoria.save()
        return JsonResponse({'status': 'success'})

    def delete(self, request, subcategoria_id):
        # Deletar
        subcategoria = get_object_or_404(SubCategoria, id=subcategoria_id)
        subcategoria.delete()
        return JsonResponse({'status': 'success'})



@method_decorator(login_required, name='dispatch')
class Usuarios(View):
    @method_decorator(never_cache)
    # Mostrar
    def get(self, request):
        request.session['previous_url'] = request.META.get('HTTP_REFERER')
        user_id = request.GET.get('usuario_id', None)
        if user_id is not None:
            usuario = User.objects.get(id=user_id)
        else:
            usuario = None
        usuarios = User.objects.all()
        return render(request, 'usuarios.html', {'usuarios': usuarios, 'usuario': usuario})
    # Inserir
    def post(self, request):
        # Código para criar um novo usuário
        username = request.POST.get('username')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        is_superuser = request.POST.get('is_superuser') == 'true'
        user = User.objects.create_user(username=username, email=email, first_name=first_name, last_name=last_name, password=password, is_superuser=is_superuser)
        return JsonResponse({'id': user.id})
    # Atualizar Partes
    def patch(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)
        user.save()
        return JsonResponse({'status': 'success'})
    # Atualizar Tudo
    def put(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        user.username = request.POST.get('username')
        user.first_name = request.POST.get('first_name')
        user.last_name = request.POST.get('last_name')
        user.email = request.POST.get('email')
        user.is_superuser = request.POST.get('is_superuser') == 'true'
        user.set_password(request.POST.get('password'))
        user.save()
        return JsonResponse({'status': 'success'})
    # Deletar
    def delete(self, request, user_id):
        print(self, request, user_id)
        user = get_object_or_404(User, id=user_id)
        user.delete()
        return JsonResponse({'status': 'success'})
        
