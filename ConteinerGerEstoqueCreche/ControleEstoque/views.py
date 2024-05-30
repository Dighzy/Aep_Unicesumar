from django.shortcuts import render, get_object_or_404
from django.views import View
from django.utils.decorators import method_decorator
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login as user_login, logout as user_logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache


@never_cache
@login_required
def categorias_movimento(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    return render(request, 'categorias_movimento.html')

@never_cache
@login_required
def categorias_produto(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    return render(request, 'categorias_produto.html')

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

@never_cache
@login_required
def lancamentos(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    return render(request, 'lancamentos.html')


def login(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Login inválido'}, status=400)
        
        user = authenticate(request, username=user.username, password=password)
        if user is not None:
            user_login(request, user)
            return HttpResponseRedirect('/estoque/')
        else:
            return JsonResponse({'error': 'Login invalido'}, status=400)
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


@never_cache
@login_required
def produtos(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    return render(request, 'produtos.html')

@never_cache
@login_required
def saida(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    return render(request, 'saida.html')

@never_cache
@login_required
def subcategorias_produto(request):
    request.session['previous_url'] = request.META.get('HTTP_REFERER')
    return render(request, 'subcategorias_produto.html')


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
        user = get_object_or_404(User, id=user_id)
        user.delete()
        return JsonResponse({'status': 'success'})
        
