INSERT INTO ce_tipo_produto (codigo, descricao) VALUES
(1, 'Alimento'),
(2, 'Material de Limpeza'),
(3, 'Material Escolar');

INSERT INTO ce_categoria (codigo, descricao, tipo_id) VALUES
(1, 'Perecível', 1),
(2, 'Não Perecível', 1),
(3, 'Produtos de Limpeza Geral', 2),
(4, 'Papelaria', 3),
(5, 'Organização', 3),
(6, 'Arte e Pintura', 3),
(7, 'Acessórios e Utilitários', 3);

INSERT INTO ce_subcategoria (codigo, descricao, categoria_id) VALUES
(1, 'Frutas', 1),                -- Subcategoria 'Frutas' na categoria 'Perecível'
(2, 'Grãos', 2),                 -- Subcategoria 'Grãos' na categoria 'Não Perecível'
(3, 'Detergentes', 3),           -- Subcategoria 'Detergentes' na categoria 'Produtos de Limpeza Geral'
(4, 'Sabões', 3),                -- Subcategoria 'Sabões' na categoria 'Produtos de Limpeza Geral'
(5, 'Desinfetantes', 3),         -- Subcategoria 'Desinfetantes' na categoria 'Produtos de Limpeza Geral'
(6, 'Limpa Vidros', 3),          -- Subcategoria 'Limpa Vidros' na categoria 'Produtos de Limpeza Geral'
(7, 'Multiuso', 3),              -- Subcategoria 'Multiuso' na categoria 'Produtos de Limpeza Geral'
(8, 'Esponjas', 3),              -- Subcategoria 'Esponjas' na categoria 'Produtos de Limpeza Geral'
(9, 'Panos de Limpeza', 3),      -- Subcategoria 'Panos de Limpeza' na categoria 'Produtos de Limpeza Geral'
(10, 'Escovas', 3),              -- Subcategoria 'Escovas' na categoria 'Produtos de Limpeza Geral'
(11, 'Rodos', 3),                -- Subcategoria 'Rodos' na categoria 'Produtos de Limpeza Geral'
(12, 'Baldes', 3),               -- Subcategoria 'Baldes' na categoria 'Produtos de Limpeza Geral'
(13, 'Produtos para Cozinha', 3),-- Subcategoria 'Produtos para Cozinha' na categoria 'Produtos de Limpeza Geral'
(14, 'Produtos para Banheiro', 3),-- Subcategoria 'Produtos para Banheiro' na categoria 'Produtos de Limpeza Geral'
(15, 'Produtos para Roupas', 3), -- Subcategoria 'Produtos para Roupas' na categoria 'Produtos de Limpeza Geral'
(16, 'Cadernos', 4),             -- Subcategoria 'Cadernos' na categoria 'Papelaria'
(17, 'Blocos de Notas', 4),      -- Subcategoria 'Blocos de Notas' na categoria 'Papelaria'
(18, 'Folhas de Papel (A4, A3, etc.)', 4),-- Subcategoria 'Folhas de Papel (A4, A3, etc.)' na categoria 'Papelaria'
(19, 'Lápis', 4),                -- Subcategoria 'Lápis' na categoria 'Papelaria'
(20, 'Canetas', 4),              -- Subcategoria 'Canetas' na categoria 'Papelaria'
(21, 'Marcadores', 4),           -- Subcategoria 'Marcadores' na categoria 'Papelaria'
(22, 'Borrachas', 4),            -- Subcategoria 'Borrachas' na categoria 'Papelaria'
(23, 'Apontadores', 4),          -- Subcategoria 'Apontadores' na categoria 'Papelaria'
(24, 'Pastas', 5),               -- Subcategoria 'Pastas' na categoria 'Organização'
(25, 'Agendas', 5),              -- Subcategoria 'Agendas' na categoria 'Organização'
(26, 'Clipes', 5),               -- Subcategoria 'Clipes' na categoria 'Organização'
(27, 'Grampeadores', 5),         -- Subcategoria 'Grampeadores' na categoria 'Organização'
(28, 'Fichários', 5),            -- Subcategoria 'Fichários' na categoria 'Organização'
(29, 'Lápis de Cor', 6),         -- Subcategoria 'Lápis de Cor' na categoria 'Arte e Pintura'
(30, 'Canetinhas', 6),           -- Subcategoria 'Canetinhas' na categoria 'Arte e Pintura'
(31, 'Tintas', 6),               -- Subcategoria 'Tintas' na categoria 'Arte e Pintura'
(32, 'Pincéis', 6),              -- Subcategoria 'Pincéis' na categoria 'Arte e Pintura'
(33, 'Papéis para Desenho', 6),  -- Subcategoria 'Papéis para Desenho' na categoria 'Arte e Pintura'
(34, 'Mochilas', 7),             -- Subcategoria 'Mochilas' na categoria 'Acessórios e Utilitários'
(35, 'Estojos', 7),              -- Subcategoria 'Estojos' na categoria 'Acessórios e Utilitários'
(36, 'Réguas', 7),               -- Subcategoria 'Réguas' na categoria 'Acessórios e Utilitários'
(37, 'Tesouras', 7),             -- Subcategoria 'Tesouras' na categoria 'Acessórios e Utilitários'
(38, 'Adesivos', 7);             -- Subcategoria 'Adesivos' na categoria 'Acessórios e Utilitários'

INSERT INTO ce_produto (codigo, peso, unidade, categoria_id, sub_categoria_id, descricao, tipo_id) VALUES
('ALP001', 1.00, 'kg', 1, 1, 'Maçã', 1),
('ALP002', 1.00, 'kg', 1, 1, 'Banana', 1),
('ALNP001', 5.00, 'kg', 2, 2, 'Arroz', 1),
('ALNP002', 1.00, 'kg', 2, 2, 'Feijão', 1),
('LIM001', 0.50, 'litro', 3, 3, 'Detergente Líquido', 2),
('LIM002', 1.00, 'kg', 3, 4, 'Sabão em Pó', 2),
('LIM003', 0.10, 'unidade', 3, 8, 'Esponja de Aço', 2),
('LIM004', 0.20, 'unidade', 3, 9, 'Pano de Limpeza', 2),
('LIM005', 0.50, 'litro', 3, 13, 'Limpador de Cozinha', 2),
('LIM006', 0.75, 'litro', 3, 14, 'Desinfetante de Banheiro', 2),
('ESC001', 0.50, 'unidade', 4, 16, 'Caderno Universitário', 3),
('ESC002', 0.20, 'unidade', 4, 17, 'Bloco de Notas', 3),
('ESC003', 0.02, 'unidade', 4, 19, 'Lápis Preto', 3),
('ESC004', 0.01, 'unidade', 4, 20, 'Caneta Azul', 3),
('ESC005', 0.10, 'unidade', 5, 24, 'Pasta A4', 3),
('ESC006', 0.30, 'unidade', 5, 25, 'Agenda 2024', 3),
('ESC007', 0.30, 'unidade', 6, 29, 'Lápis de Cor', 3),
('ESC008', 0.25, 'unidade', 6, 31, 'Tinta Guache', 3),
('ESC009', 0.75, 'unidade', 7, 34, 'Mochila Escolar', 3),
('ESC010', 0.15, 'unidade', 7, 35, 'Estojo Escolar', 3);

INSERT INTO ce_origem (id, codigo, descricao, tipo_de_movimento) VALUES
(1, 1, 'Bazar', 'Saída'),
(2, 2, 'Compra', 'Entrada'),
(3, 3, 'Doação', 'Entrada'),
(4, 4, 'Ajuste a Maior', 'Entrada'),
(5, 5, 'Ajuste a Menor', 'Saída'),
(6, 6, 'Descarte', 'Saída');