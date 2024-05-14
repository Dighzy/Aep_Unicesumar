# Aep_Unicesumar
Projeto Aep da unicesumar

# OBJETIVO
O objetivo deste documento é descrever detalhadamente a especificação e modelagem do software dedicado ao almoxarifado e controle de estoque da creche. Esta documentação busca fornecer uma compreensão clara dos requisitos funcionais e não funcionais do sistema, juntamente com uma representação visual de sua arquitetura e design. O foco principal será na gestão eficiente de estoque, incluindo o acompanhamento de entrada e saída de itens e registro de doações recebidas. Espera-se que esta documentação sirva como um guia abrangente para o desenvolvimento, implementação e manutenção do software, garantindo que o almoxarifado da creche opere de forma organizada e eficaz, otimizando o uso de recursos e minimizando desperdícios.

# CONTEXTO
O projeto consiste no desenvolvimento de um software dedicado ao controle de estoque e gerenciamento de doações para uma creche. Esta creche desempenha um papel crucial na comunidade, oferecendo cuidados e educação para crianças em idade pré-escolar. No entanto, a gestão eficiente dos recursos, incluindo alimentos, materiais educativos e outros itens doados, tornou-se um desafio devido ao crescimento das doações e à falta de um sistema automatizado de controle de estoque. Com este software, esse controle vai se tornar mais simples e objetivo.
 
 # REQUISITOS
### Lista de Requisitos do Sistema:

1. ID	REQUISITO	TIPO	DESCRITIVO
2. FU01	Cadastrar usuário	FU	Permite o cadastro de novos usuários no sistema.
3. FU02	Cadastrar produto	FU	Permite o cadastro de novos produtos no sistema.
4. FU03	Cadastrar categoria de produto	FU	Permite o cadastro de novas categorias de produtos.
5. FU04	Cadastrar subcategoria de produto	FU	Permite o cadastro de novas subcategorias de produtos.
6. FU05	Consultar estoque	FU	Permite a consulta do estoque atual.
7. FU06	Registrar entrada	FU	Permite o registro de entrada de produtos no estoque.
8. FU07	Registrar saída	FU	Permite o registro de saída de produtos do estoque.
9. FU08	Cadastrar categoria de movimento	FU	Permite o cadastro de novas categorias de movimento.
10. NF01	Amarrar categoria a subcategoria	NF	Toda categoria deve ser amarrada a uma subcategoria e vice-versa, exceto a categoria de movimento de estoque.
11. NF02	Informações do usuário	NF	Todo usuário deve possuir nome, sobrenome, e-mail e senha.
12. FU09	Resetar senha	FU	O usuário pode resetar sua própria senha clicando em ‘esqueci minha senha’ ou no painel do usuário em ‘envie-me um link de redefinição de senha’.
13. NF03	Login do usuário	NF	O usuário deve fazer login com o login de usuário gerado, que é a concatenação entre o nome ‘.’ e sobrenome em minúsculas.
14. NF04	Senha do usuário	NF	A senha deve conter no mínimo 8 caracteres.
15. NF05	Produto e categoria	NF	Todo produto deve ser amarrado a uma categoria de produto e consequentemente a uma subcategoria de produto.
16. NF06	Código do produto	NF	Todo código de produto deve ser gerado a partir da concatenação do prefixo do código da categoria ao qual ele pertence com um número sequencial.
17. NF07	Produto do tipo pack	NF	Todo produto do tipo pack deve ter o tipo de embalagem selecionada e a quantidade de unidades base do pack informada.
18. NF08	Produto não pack	NF	Um produto que não é do tipo pack tem seu valor base como sendo a unidade e seu tipo de embalagem como sendo unidade.
19. NF09	Tipos de embalagem	NF	Os tipos de embalagem são apenas caixa, saco ou bandeja.
20. NF10	Saída de produto	NF	A quantidade de saída de um produto não pode ser inferior ao saldo disponível em estoque.
21. NF11	Tipo de usuário	NF	Todo usuário pode ser ou do tipo usuário, ou do tipo administrador.
22. FU10	Acesso do administrador	FU	O tipo administrador tem acesso ao modulo usuários que permite o cadastro de novos usuários.
