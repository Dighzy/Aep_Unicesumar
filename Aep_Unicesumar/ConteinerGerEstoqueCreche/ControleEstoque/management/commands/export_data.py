import os
import psycopg2
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Exporta dados das tabelas para um arquivo SQL'

    def handle(self, *args, **options):
        tables = [
            'ce_tipo',
            'ce_categoria',
            'ce_subcategoria',
            'ce_embalagem',
            'ce_produto',
            'ce_origem'
        ]
        output_file = 'exported_data.sql'

        conn = psycopg2.connect(
            dbname=settings.DATABASES['default']['NAME'],
            user=settings.DATABASES['default']['USER'],
            password=settings.DATABASES['default']['PASSWORD'],
            host=settings.DATABASES['default']['HOST'],
            port=settings.DATABASES['default']['PORT'],
        )
        
        with open(output_file, 'w', encoding='utf-8') as f:
            for table in tables:
                cursor = conn.cursor()
                f.write(f"-- Dados da tabela {table}\n")
                cursor.copy_expert(f"COPY {table} TO STDOUT WITH (FORMAT CSV, HEADER TRUE, FORCE_QUOTE *)", f)
                f.write('\n')
                cursor.close()

        conn.close()

        self.stdout.write(self.style.SUCCESS(f'Dados exportados com sucesso para {output_file}'))
