from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.utils.decorators import method_decorator
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login as user_login, logout as user_logout
from django.contrib.auth.models import User
from .models import Categoria, SubCategoria, Produto, Origem, Lancamentos, TipoProduto
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.utils import timezone
import json

@method_decorator(login_required, name='dispatch')
class OrigemView(View):
    @method_decorator(never_cache)
    def get(self, request):
        # Mostrar
        categorias_movimento = Origem.objects.all()
        return render(request, 'origens.html', {'categorias_movimento': categorias_movimento})

    def post(self, request):
        # Inserir
        data = json.loads(request.body)
        codigo = data.get('codigo')
        descricao = data.get('descricao')
        tipo_de_movimento = data.get('tipo_de_movimento')
        categoria_movimento = Origem.objects.create(codigo=codigo, descricao=descricao, tipo_de_movimento=tipo_de_movimento)
        return JsonResponse({'id': categoria_movimento.id})

    def patch(self, request, categoria_movimento_id):
        # Atualizar Partes
        categoria_movimento = get_object_or_404(Origem, id=categoria_movimento_id)
        data = json.loads(request.body)
        categoria_movimento.descricao = data.get('descricao', categoria_movimento.descricao)
        categoria_movimento.tipo_de_movimento = data.get('tipo_de_movimento', categoria_movimento.tipo_de_movimento)
        categoria_movimento.save()
        return JsonResponse({'status': 'success'})

    def put(self, request, categoria_movimento_id):
        # Atualizar Tudo
        categoria_movimento = get_object_or_404(Origem, id=categoria_movimento_id)
        data = json.loads(request.body)
        categoria_movimento.codigo = data.get('codigo')
        categoria_movimento.descricao = data.get('descricao')
        categoria_movimento.tipo_de_movimento = data.get('tipo_de_movimento')
        categoria_movimento.save()
        return JsonResponse({'status': 'success'})

    def delete(self, request, categoria_movimento_id):
        # Deletar
        categoria_movimento = get_object_or_404(Origem, id=categoria_movimento_id)
        categoria_movimento.delete()
        return JsonResponse({'status': 'success'})
@method_decorator(login_required, name='dispatch')
class CategoriaView(View):
    @method_decorator(never_cache)
    def get(self, request):
        categorias = Categoria.objects.all()
        return render(request, 'categorias.html', {'categorias': categorias})

    def post(self, request):
        codigo = request.POST.get('codigo')
        descricao = request.POST.get('descricao')
        categoria = Categoria.objects.create(codigo=codigo, descricao=descricao)
        return JsonResponse({'id': categoria.id})

    def patch(self, request, categoria_id):
        categoria = get_object_or_404(Categoria, id=categoria_id)
        categoria.descricao = request.POST.get('descricao', categoria.descricao)
        categoria.save()
        return JsonResponse({'status': 'success'})

    def put(self, request, categoria_id):
        categoria = get_object_or_404(Categoria, id=categoria_id)
        categoria.codigo = request.POST.get('codigo')
        categoria.descricao = request.POST.get('descricao')
        categoria.save()
        return JsonResponse({'status': 'success'})

    def delete(self, request, categoria_id):
        categoria = get_object_or_404(Categoria, id=categoria_id)
        categoria.delete()
        return JsonResponse({'status': 'success'})

@method_decorator(login_required, name='dispatch')
class EntradaView(View):
    @method_decorator(never_cache)
    def get(self, request):
        lancamentos_entrada = Lancamentos.objects.filter(
            categoria_movimento_id__tipo_de_movimento='Entrada'
        ).select_related('produto', 'categoria_movimento', 'usuario')

        return render(request, 'entrada.html', {'lancamentos_entrada': lancamentos_entrada})

    def post(self, request):
        produto_id = request.POST.get('produto_id')
        total = request.POST.get('total')
        categoria_movimento_id = request.POST.get('categoria_movimento_id')
        usuario_id = request.POST.get('usuario_id')
        produto = Produto.objects.get(id=produto_id)
        categoria_movimento = Origem.objects.get(id=categoria_movimento_id)
        usuario = User.objects.get(id=usuario_id)
        lancamento = Lancamentos.objects.create(
            produto=produto,
            total=total,
            categoria_movimento=categoria_movimento,
            usuario=usuario
        )
        return JsonResponse({'id': lancamento.id})

@never_cache
@login_required
def estoque(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    return render(request, 'estoque.html')


@method_decorator(login_required, name='dispatch')
class LancamentoView(View):
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
        categoria_movimento = Origem.objects.get(id=categoria_movimento_id)
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
class ProdutoView(View):
    @method_decorator(never_cache)
    def get(self, request):
        produtos = Produto.objects.all()
        return render(request, 'produtos.html', {'produtos': produtos})

    def post(self, request):
        codigo = request.POST.get('codigo')
        descricao = request.POST.get('descricao')
        categoria_id = request.POST.get('categoria_id')
        sub_categoria_id = request.POST.get('sub_categoria_id')
        peso = request.POST.get('peso')
        unidade = request.POST.get('unidade')
        tipo_id = request.POST.get('tipo_id')
        categoria = get_object_or_404(Categoria, id=categoria_id)
        sub_categoria = get_object_or_404(SubCategoria, id=sub_categoria_id)
        tipo = get_object_or_404(TipoProduto, id=tipo_id)
        produto = Produto.objects.create(
            codigo=codigo, descricao=descricao, categoria=categoria,
            sub_categoria=sub_categoria, peso=peso, unidade=unidade, tipo=tipo
        )
        return JsonResponse({'id': produto.id})

    def patch(self, request, produto_id):
        produto = get_object_or_404(Produto, id=produto_id)
        produto.descricao = request.POST.get('descricao', produto.descricao)
        produto.save()
        return JsonResponse({'status': 'success'})

    def put(self, request, produto_id):
        produto = get_object_or_404(Produto, id=produto_id)
        produto.codigo = request.POST.get('codigo')
        produto.descricao = request.POST.get('descricao')
        produto.save()
        return JsonResponse({'status': 'success'})

    def delete(self, request, produto_id):
        produto = get_object_or_404(Produto, id=produto_id)
        produto.delete()
        return JsonResponse({'status': 'success'})

@method_decorator(login_required, name='dispatch')
class SaidaView(View):
    @method_decorator(never_cache)
    def get(self, request):
        # Filtrar os lançamentos com tipo de movimento igual a 'entrada'
        lancamentos_entrada = Lancamentos.objects.filter(categoria_movimento_id__tipo_de_movimento='Saída').select_related('produto','categoria_movimento','usuario')
        return render(request, 'saida.html', {'lancamentos_entrada': lancamentos_entrada})
    
    def post(self, request):
        # Inserir
        produto_id = request.POST.get('produto_id')
        total = request.POST.get('total')
        categoria_movimento_id = request.POST.get('categoria_movimento_id')
        usuario_id = request.POST.get('usuario_id')
        produto = Produto.objects.get(id=produto_id)
        categoria_movimento = Origem.objects.get(id=categoria_movimento_id)
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

@method_decorator(login_required, name='dispatch')
class SubCategoriaView(View):
    @method_decorator(never_cache)
    def get(self, request):
        subcategorias = SubCategoria.objects.all()
        return render(request, 'subcategorias.html', {'subcategorias': subcategorias})

    def post(self, request):
        codigo = request.POST.get('codigo')
        descricao = request.POST.get('descricao')
        categoria_id = request.POST.get('categoria_id')
        categoria = get_object_or_404(Categoria, id=categoria_id)
        subcategoria = SubCategoria.objects.create(codigo=codigo, descricao=descricao, categoria=categoria)
        return JsonResponse({'id': subcategoria.id})

    def patch(self, request, subcategoria_id):
        subcategoria = get_object_or_404(SubCategoria, id=subcategoria_id)
        subcategoria.descricao = request.POST.get('descricao', subcategoria.descricao)
        subcategoria.save()
        return JsonResponse({'status': 'success'})

    def put(self, request, subcategoria_id):
        subcategoria = get_object_or_404(SubCategoria, id=subcategoria_id)
        subcategoria.codigo = request.POST.get('codigo')
        subcategoria.descricao = request.POST.get('descricao')
        subcategoria.save()
        return JsonResponse({'status': 'success'})

    def delete(self, request, subcategoria_id):
        subcategoria = get_object_or_404(SubCategoria, id=subcategoria_id)
        subcategoria.delete()
        return JsonResponse({'status': 'success'})


class UsuarioView(View):
    @method_decorator(never_cache)
    # Mostrar
    def get(self, request):
        if not request.user.is_superuser:
            previous_url = request.session.get('previous_url', '/')
            return redirect(previous_url)  # Redireciona para a URL anterior ou para a página raiz

        request.session['previous_url'] = request.path  # Atualiza a URL atual
        user_id = request.GET.get('usuario_id', None)
        if user_id is not None:
            usuario = User.objects.get(id=user_id)
        else:
            usuario = None
        usuarios = User.objects.all()
        return render(request, 'usuarios.html', {'usuarios': usuarios, 'usuario': usuario})

    # Inserir
    def post(self, request):
        if not request.user.is_superuser:
            previous_url = request.session.get('previous_url', '/')
            return JsonResponse({'error': 'Permission denied'}, status=403)

        data = json.loads(request.body)
        username = data.get('username')  # Adicionado
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        is_superuser = data.get('is_superuser', False)

        user = User.objects.create_user(
            username=username,  # Modificado
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            is_superuser=is_superuser
        )
        return JsonResponse({'id': user.id})

    # Atualizar Partes    
    def patch(self, request, user_id):
        if not request.user.is_superuser:
            previous_url = request.session.get('previous_url', '/')
            return JsonResponse({'error': 'Permission denied'}, status=403)

        user = get_object_or_404(User, id=user_id)
        data = json.loads(request.body)
        user.username = data.get('username', user.username)  # Adicionado
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        if 'is_superuser' in data:
            user.is_superuser = data['is_superuser']
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        user.save()
        return JsonResponse({'status': 'success'})

    # Atualizar Tudo   
    def put(self, request, user_id):
        if not request.user.is_superuser:
            previous_url = request.session.get('previous_url', '/')
            return JsonResponse({'error': 'Permission denied'}, status=403)

        user = get_object_or_404(User, id=user_id)
        data = json.loads(request.body)
        user.username = data.get('username', user.username)  # Adicionado
        user.first_name = data.get('first_name')
        user.last_name = data.get('last_name')
        user.email = data.get('email')
        user.is_superuser = data.get('is_superuser', False)
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        user.save()
        return JsonResponse({'status': 'success'})

    # Deletar    
    def delete(self, request, user_id):
        if not request.user.is_superuser:
            previous_url = request.session.get('previous_url', '/')
            return JsonResponse({'error': 'Permission denied'}, status=403)

        user = get_object_or_404(User, id=user_id)
        user.delete()
        return JsonResponse({'status': 'success'})

        
