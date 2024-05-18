from django.shortcuts import render

def categorias_movimento(request):
    return render(request, 'categorias_movimento.html')

def categorias_produto(request):
    return render(request, 'categorias_produto.html')

def entrada(request):
    return render(request, 'entrada.html')

def estoque(request):
    return render(request, 'estoque.html')

def lancamento(request):
    return render(request, 'lancamento.html')

def lancamentos(request):
    return render(request, 'lancamentos.html')

def login(request):
    return render(request, 'login.html')

def painel_usuario(request):
    return render(request, 'painel_usuario.html')

def produtos(request):
    return render(request, 'produtos.html')

def saida(request):
    return render(request, 'saida.html')

def subcategorias_produto(request):
    return render(request, 'subcategorias_produto.html')

def usuarios(request):
    return render(request, 'usuarios.html')
