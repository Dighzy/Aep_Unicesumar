import os
import psycopg2
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Importa dados das tabelas de um arquivo SQL'

    def handle(self, *args, **options):
        tables = [
            'ce_tipo_produto',
            'ce_categoria',
            'ce_subcategoria',
            'ce_produto',
            'ce_origem'
        ]
        input_file = 'exported_data.sql'

        conn = psycopg2.connect(
            dbname=settings.DATABASES['default']['NAME'],
            user=settings.DATABASES['default']['USER'],
            password=settings.DATABASES['default']['PASSWORD'],
            host=settings.DATABASES['default']['HOST'],
            port=settings.DATABASES['default']['PORT'],
        )

        with open(input_file, 'r', encoding='utf-8') as f:
            for table in tables:
                cursor = conn.cursor()
                # Encontrar a parte relevante no arquivo de entrada
                for line in f:
                    if line.startswith(f"-- Dados da tabela {table}"):
                        break
                cursor.copy_expert(f"COPY {table} FROM STDIN WITH (FORMAT CSV, HEADER TRUE)", f)
                cursor.close()

        conn.close()

        self.stdout.write(self.style.SUCCESS(f'Dados importados com sucesso de {input_file}'))
