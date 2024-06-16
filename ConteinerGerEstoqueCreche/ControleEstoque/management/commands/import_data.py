import os
import psycopg2
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import connection
from django.contrib.auth.models import User
from ControleEstoque.models import Produto, Estoque  # Ajuste o import conforme necessário

class Command(BaseCommand):
    help = 'Reseta, reinicializa e importa dados das tabelas de um arquivo SQL e cria usuários'

    def handle(self, *args, **options):
        input_file = 'exported_data.sql'

        tables = [
            'ce_estoque',
            'ce_lancamento',
            'ce_produto',
            'ce_subcategoria',
            'ce_categoria',
            'ce_tipo',
            'ce_embalagem',
            'ce_origem',
        ]

        def reset_and_reinitialize_tables(cursor):
            for table in tables:
                cursor.execute(f'DELETE FROM {table};')
                cursor.execute(f"""
                    DO $$ 
                    DECLARE
                        seq_name TEXT;
                        col_exists BOOLEAN;
                    BEGIN
                        SELECT EXISTS (
                            SELECT 1 
                            FROM information_schema.columns 
                            WHERE table_name='{table}' 
                            AND column_name='id'
                        ) INTO col_exists;
                        
                        IF col_exists THEN
                            SELECT pg_get_serial_sequence('{table}', 'id') INTO seq_name;
                            IF seq_name IS NOT NULL THEN
                                EXECUTE 'ALTER SEQUENCE ' || seq_name || ' RESTART WITH 1;';
                            END IF;
                        END IF;
                    END $$;
                """)

        with connection.cursor() as cursor:
            try:
                # Resetando e reinicializando as tabelas
                reset_and_reinitialize_tables(cursor)

                # Alterando a coluna unidade_real na tabela ce_produto
                cursor.execute('ALTER TABLE ce_produto ALTER COLUMN unidade_real SET DEFAULT 1;')

                self.stdout.write(self.style.SUCCESS('Todas as tabelas foram deletadas, os índices reinicializados, e a coluna unidade_real foi alterada para ter o valor padrão 1.'))

                # Conectando ao banco de dados usando psycopg2
                conn = psycopg2.connect(
                    dbname=settings.DATABASES['default']['NAME'],
                    user=settings.DATABASES['default']['USER'],
                    password=settings.DATABASES['default']['PASSWORD'],
                    host=settings.DATABASES['default']['HOST'],
                    port=settings.DATABASES['default']['PORT'],
                )

                try:
                    with open(input_file, 'r', encoding='utf-8') as f:
                        sql_content = f.read()
                    
                    cursor_psycopg = conn.cursor()
                    cursor_psycopg.execute(sql_content)
                    
                    conn.commit()
                    cursor_psycopg.close()
                except Exception as e:
                    conn.rollback()
                    self.stderr.write(self.style.ERROR(f"Erro ao importar dados: {e}"))
                finally:
                    conn.close()

                self.stdout.write(self.style.SUCCESS(f'Dados importados com sucesso de {input_file}'))

                # Lista de usuários para criar
                usuarios = [
                    {"username": "diogo.hajjar", "first_name": "Diogo", "last_name": "Hajjar", "email": "diogohajjar@example.com"},
                    {"username": "joao.macarenhas", "first_name": "João", "last_name": "Macarenhas", "email": "joaomacarenhas@example.com"},
                    {"username": "gabriel.carvalho", "first_name": "Gabriel", "last_name": "Carvalho", "email": "gabrielcarvalho17@outlook.com"}
                ]

                # Criar cada usuário
                for usuario in usuarios:
                    if not User.objects.filter(username=usuario["username"]).exists():
                        User.objects.create_user(
                            username=usuario["username"],
                            first_name=usuario["first_name"],
                            last_name=usuario["last_name"],
                            email=usuario["email"],
                            password="12345"
                        )

                self.stdout.write(self.style.SUCCESS('Usuários criados com sucesso!'))

                # Criar registros de estoque para cada produto
                produtos = Produto.objects.all()
                for produto in produtos:
                    Estoque.objects.create(produto=produto, contabil_real=0, contabil=0, primeiro_movimento=None, ultimo_movimento=None)

                self.stdout.write(self.style.SUCCESS('Registros de estoque criados para todos os produtos!'))

            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Erro ao resetar e reinicializar tabelas: {e}"))
