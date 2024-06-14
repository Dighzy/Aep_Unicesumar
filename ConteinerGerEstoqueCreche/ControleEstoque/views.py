from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.utils.decorators import method_decorator
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login as user_login, logout as user_logout
from django.contrib.auth.models import User
from .models import Categoria, SubCategoria, Produto, Origem, Lancamentos, TipoProduto, EmbalagemProduto
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.utils import timezone
from django.db import IntegrityError, transaction
import json

class CategoriaView(View):
    @method_decorator(login_required, name='dispatch')
    def get(self, request):
        categorias = Categoria.objects.all()
        tipos = TipoProduto.objects.all()
        categoria_id = request.GET.get('categoria_id', None)
        if categoria_id is not None:
            categoria = get_object_or_404(Categoria, codigo=categoria_id)
        else:
            categoria = None
        return render(request, 'categorias.html', {
            'categorias': categorias,
            'tipos': tipos,
            'categoria': categoria
        })

    def post(self, request):
        data = json.loads(request.body)
        codigo = data.get('codigo')
        descricao = data.get('descricao')
        tipo_id = data.get('tipo_id')

        tipo = get_object_or_404(TipoProduto, codigo=tipo_id)
        
        try:
            with transaction.atomic():
                categoria = Categoria.objects.create(
                    codigo=codigo, 
                    descricao=descricao, 
                    tipo=tipo
                )
            return JsonResponse({'id': categoria.codigo})
        except IntegrityError:
            return JsonResponse({'error': 'Código de categoria já existe.'}, status=400)

    def patch(self, request, categoria_id):
        categoria = get_object_or_404(Categoria, codigo=categoria_id)
        data = json.loads(request.body)
        categoria.descricao = data.get('descricao', categoria.descricao)
        tipo_id = data.get('tipo_id')

        tipo = get_object_or_404(TipoProduto, codigo=tipo_id)
        categoria.tipo = tipo
        categoria.save()
        
        return JsonResponse({'status': 'success'})

    def put(self, request, categoria_id):
        categoria = get_object_or_404(Categoria, codigo=categoria_id)
        data = json.loads(request.body)
        categoria.codigo = data.get('codigo')
        categoria.descricao = data.get('descricao')
        tipo_id = data.get('tipo_id')

        tipo = get_object_or_404(TipoProduto, codigo=tipo_id)
        categoria.tipo = tipo
        categoria.save()
        
        return JsonResponse({'status': 'success'})

    def delete(self, request, categoria_id):
        categoria = get_object_or_404(Categoria, codigo=categoria_id)
        categoria.delete()
        return JsonResponse({'status': 'success'})
        

class EmbalagemView(View):
    @method_decorator(login_required, name='dispatch')
    def get(self, request):
        embalagens = EmbalagemProduto.objects.all()
        tipos = TipoProduto.objects.all()
        embalagem_id = request.GET.get('embalagem_id', None)
        if embalagem_id is not None:
            embalagem = get_object_or_404(EmbalagemProduto, codigo=embalagem_id)
        else:
            embalagem = None
        return render(request, 'embalagens.html', {
            'embalagens': embalagens,
            'tipos': tipos,
            'embalagem': embalagem
        })

    def post(self, request):
        data = json.loads(request.body)
        codigo = data.get('codigo')
        descricao = data.get('descricao')

        try:
            with transaction.atomic():
                embalagem = EmbalagemProduto.objects.create(
                    codigo=codigo, 
                    descricao=descricao
                )
            return JsonResponse({'id': embalagem.codigo})
        except IntegrityError:
            return JsonResponse({'error': 'Código de embalagem já existe.'}, status=400)

    def patch(self, request, embalagem_id):
        embalagem = get_object_or_404(EmbalagemProduto, codigo=embalagem_id)
        data = json.loads(request.body)
        embalagem.descricao = data.get('descricao', embalagem.descricao)
        embalagem.save()
        
        return JsonResponse({'status': 'success'})

    def put(self, request, embalagem_id):
        embalagem = get_object_or_404(EmbalagemProduto, codigo=embalagem_id)
        data = json.loads(request.body)
        embalagem.codigo = data.get('codigo')
        embalagem.descricao = data.get('descricao')
        embalagem.save()
        
        return JsonResponse({'status': 'success'})

    def delete(self, request, embalagem_id):
        embalagem = get_object_or_404(EmbalagemProduto, codigo=embalagem_id)
        embalagem.delete()
        return JsonResponse({'status': 'success'})


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
        origem = Origem.objects.get(id=categoria_movimento_id)
        usuario = User.objects.get(id=usuario_id)
        lancamento = Lancamentos.objects.create(
            produto=produto, total=total, origem=origem,
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

@method_decorator(login_required, name='dispatch')
class OrigemView(View):
    def get(self, request):
        origens = Origem.objects.all()
        origem_id = request.GET.get('origem_id', None)
        if origem_id is not None:
            origem = get_object_or_404(Origem, codigo=origem_id)
        else:
            origem = None
        return render(request, 'origens.html', {
            'origens': origens,
            'origem': origem
        })

    def post(self, request):
        data = json.loads(request.body)
        codigo = data.get('codigo')
        descricao = data.get('descricao')
        tipo = data.get('tipo')

        try:
            with transaction.atomic():
                origem = Origem.objects.create(
                    codigo=codigo, 
                    descricao=descricao,
                    tipo=tipo
                )
            return JsonResponse({'codigo': origem.codigo})
        except IntegrityError:
            return JsonResponse({'error': 'Código de origem já existe.'}, status=400)

    def patch(self, request):
        origem_id = request.GET.get('origem_id')
        origem = get_object_or_404(Origem, codigo=origem_id)
        data = json.loads(request.body)
        origem.codigo = data.get('codigo', origem.codigo)
        origem.descricao = data.get('descricao', origem.descricao)
        origem.tipo = data.get('tipo', origem.tipo)
        origem.save()
        
        return JsonResponse({'status': 'success'})

    def put(self, request):
        origem_id = request.GET.get('origem_id')
        origem = get_object_or_404(Origem, codigo=origem_id)
        data = json.loads(request.body)
        origem.codigo = data.get('codigo')
        origem.descricao = data.get('descricao')
        origem.tipo = data.get('tipo')
        origem.save()
        
        return JsonResponse({'status': 'success'})

    def delete(self, request):
        origem_id = request.GET.get('origem_id')
        origem = get_object_or_404(Origem, codigo=origem_id)
        origem.delete()
        return JsonResponse({'status': 'success'})

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
        embalagens = EmbalagemProduto.objects.all()
        categorias = Categoria.objects.all()
        subcategorias = SubCategoria.objects.all()
        tipos = TipoProduto.objects.all()

        produto_codigo = request.GET.get('produto_id', None)
        if produto_codigo is not None:
            produto = get_object_or_404(Produto, codigo=produto_codigo)
        else:
            produto = None
        
        context = {
            'produtos': produtos,
            'produto': produto,
            'embalagens': embalagens,
            'categorias': categorias,
            'subcategorias': subcategorias,
            'tipos': tipos,
        }
        return render(request, 'produtos.html', context)

    def post(self, request):
        try:
            data = json.loads(request.body)
            codigo = data.get('codigo')
            descricao = data.get('descricao')
            categoria_id = data.get('categoria_id')
            sub_categoria_id = data.get('sub_categoria_id')
            peso = data.get('peso')
            unidade = data.get('unidade')
            tipo_id = data.get('tipo_id')
            embalagem_id = data.get('embalagem_id')
            tipo_peso = data.get('tipo_peso')

            categoria = get_object_or_404(Categoria, pk=categoria_id)
            sub_categoria = get_object_or_404(SubCategoria, pk=sub_categoria_id)
            tipo = get_object_or_404(TipoProduto, pk=tipo_id)
            embalagem = get_object_or_404(EmbalagemProduto, pk=embalagem_id) if embalagem_id else None

            with transaction.atomic():
                produto = Produto.objects.create(
                    codigo=codigo,
                    descricao=descricao,
                    categoria=categoria,
                    sub_categoria=sub_categoria,
                    peso=peso,
                    unidade=unidade,
                    tipo=tipo,
                    embalagem=embalagem,
                    tipo_peso=tipo_peso
                )
            return JsonResponse({'id': produto.codigo}, status=201)
        except IntegrityError:
            return JsonResponse({'error': 'Código de produto já existe.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    def patch(self, request, produto_codigo):
        produto = get_object_or_404(Produto, codigo=produto_codigo)
        data = json.loads(request.body)
        produto.descricao = data.get('descricao', produto.descricao)
        produto.categoria = get_object_or_404(Categoria, codigo=data.get('categoria_id', produto.categoria.codigo))
        produto.sub_categoria = get_object_or_404(SubCategoria, codigo=data.get('sub_categoria_id', produto.sub_categoria.codigo))
        produto.tipo = get_object_or_404(TipoProduto, codigo=data.get('tipo_id', produto.tipo.codigo))
        produto.peso = data.get('peso', produto.peso)
        produto.unidade = data.get('unidade', produto.unidade)
        produto.save()
        return JsonResponse({'status': 'success'})

    def put(self, request, produto_codigo):
        produto = get_object_or_404(Produto, codigo=produto_codigo)
        data = json.loads(request.body)
        produto.codigo = data.get('codigo')
        produto.descricao = data.get('descricao')
        produto.categoria = get_object_or_404(Categoria, codigo=data.get('categoria_id'))
        produto.sub_categoria = get_object_or_404(SubCategoria, codigo=data.get('sub_categoria_id'))
        produto.tipo = get_object_or_404(TipoProduto, codigo=data.get('tipo_id'))
        produto.peso = data.get('peso')
        produto.unidade = data.get('unidade')
        produto.save()
        return JsonResponse({'status': 'success'})

    def delete(self, request, produto_codigo):
        produto = get_object_or_404(Produto, codigo=produto_codigo)
        produto.delete()
        return JsonResponse({'status': 'success'})


class SubCategoriaView(View):
    @method_decorator(login_required, name='dispatch')
    def get(self, request):
        subcategorias = SubCategoria.objects.all()
        categorias = Categoria.objects.all()
        subcategoria_id = request.GET.get('subcategoria_id', None)
        if (subcategoria_id is not None):
            subcategoria = get_object_or_404(SubCategoria, codigo=subcategoria_id)
        else:
            subcategoria = None
        return render(request, 'subcategorias.html', {
            'subcategorias': subcategorias,
            'categorias': categorias,
            'subcategoria': subcategoria
        })

    def post(self, request):
        data = json.loads(request.body)
        codigo = data.get('codigo')
        descricao = data.get('descricao')
        categoria_id = data.get('categoria_id')

        categoria = get_object_or_404(Categoria, codigo=categoria_id)
        
        try:
            with transaction.atomic():
                subcategoria = SubCategoria.objects.create(
                    codigo=codigo, 
                    descricao=descricao, 
                    categoria=categoria
                )
            return JsonResponse({'id': subcategoria.codigo})
        except IntegrityError:
            return JsonResponse({'error': 'Código de subcategoria já existe.'}, status=400)

    def patch(self, request, subcategoria_id):
        subcategoria = get_object_or_404(SubCategoria, codigo=subcategoria_id)
        data = json.loads(request.body)
        subcategoria.descricao = data.get('descricao', subcategoria.descricao)
        categoria_id = data.get('categoria_id')

        categoria = get_object_or_404(Categoria, codigo=categoria_id)
        subcategoria.categoria = categoria
        subcategoria.save()
        
        return JsonResponse({'status': 'success'})

    def put(self, request, subcategoria_id):
        subcategoria = get_object_or_404(SubCategoria, codigo=subcategoria_id)
        data = json.loads(request.body)
        subcategoria.codigo = data.get('codigo')
        subcategoria.descricao = data.get('descricao')
        categoria_id = data.get('categoria_id')

        categoria = get_object_or_404(Categoria, codigo=categoria_id)
        subcategoria.categoria = categoria
        subcategoria.save()
        
        return JsonResponse({'status': 'success'})

    def delete(self, request, subcategoria_id):
        subcategoria = get_object_or_404(SubCategoria, codigo=subcategoria_id)
        subcategoria.delete()
        return JsonResponse({'status': 'success'})


class TipoView(View):
    @method_decorator(login_required, name='dispatch')
    def get(self, request):
        tipos = TipoProduto.objects.all()
        tipo_id = request.GET.get('tipo_id', None)
        if tipo_id is not None:
            tipo = get_object_or_404(TipoProduto, codigo=tipo_id)
        else:
            tipo = None
        return render(request, 'tipos.html', {
            'tipos': tipos,
            'tipo': tipo
        })

    def post(self, request):
        data = json.loads(request.body)
        codigo = data.get('codigo')
        descricao = data.get('descricao')

        try:
            with transaction.atomic():
                tipo = TipoProduto.objects.create(
                    codigo=codigo, 
                    descricao=descricao
                )
            return JsonResponse({'id': tipo.codigo})
        except IntegrityError:
            return JsonResponse({'error': 'Código de tipo já existe.'}, status=400)

    def patch(self, request, tipo_id):
        tipo = get_object_or_404(TipoProduto, codigo=tipo_id)
        data = json.loads(request.body)
        tipo.codigo = data.get('codigo', tipo.codigo)
        tipo.descricao = data.get('descricao', tipo.descricao)
        tipo.save()
        
        return JsonResponse({'status': 'success'})

    def put(self, request, tipo_id):
        tipo = get_object_or_404(TipoProduto, codigo=tipo_id)
        data = json.loads(request.body)
        tipo.codigo = data.get('codigo')
        tipo.descricao = data.get('descricao')
        tipo.save()
        
        return JsonResponse({'status': 'success'})

    def delete(self, request, tipo_id):
        tipo = get_object_or_404(TipoProduto, codigo=tipo_id)
        tipo.delete()
        return JsonResponse({'status': 'success'})


class UsuarioView(View):
    @method_decorator(never_cache)
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

    def post(self, request):
        if not request.user.is_superuser:
            return JsonResponse({'error': 'Permission denied'}, status=403)

        data = json.loads(request.body)
        username = data.get('username')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        is_superuser = data.get('is_superuser', False)

        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password
        )
        user.is_superuser = is_superuser
        user.save()

        return JsonResponse({'id': user.id})

    def patch(self, request, user_id):
        if not request.user.is_superuser:
            return JsonResponse({'error': 'Permission denied'}, status=403)

        user = get_object_or_404(User, id=user_id)
        data = json.loads(request.body)
        user.username = data.get('username', user.username)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        if 'is_superuser' in data:
            user.is_superuser = data['is_superuser']
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        user.save()
        return JsonResponse({'status': 'success'})

    def put(self, request, user_id):
        if not request.user.is_superuser:
            return JsonResponse({'error': 'Permission denied'}, status=403)

        user = get_object_or_404(User, id=user_id)
        data = json.loads(request.body)
        user.username = data.get('username', user.username)
        user.first_name = data.get('first_name')
        user.last_name = data.get('last_name')
        user.email = data.get('email')
        user.is_superuser = data.get('is_superuser', False)
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        user.save()
        return JsonResponse({'status': 'success'})

    def delete(self, request, user_id):
        if not request.user.is_superuser:
            return JsonResponse({'error': 'Permission denied'}, status=403)

        user = get_object_or_404(User, id=user_id)
        user.delete()
        return JsonResponse({'status': 'success'})
        
