import os
import psycopg2
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Importa dados das tabelas de um arquivo SQL'

    def handle(self, *args, **options):
        input_file = 'exported_data.sql'

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
            
            cursor = conn.cursor()
            cursor.execute(sql_content)
            
            conn.commit()
            cursor.close()
        except Exception as e:
            conn.rollback()
            self.stderr.write(self.style.ERROR(f"Erro ao importar dados: {e}"))
        finally:
            conn.close()

        self.stdout.write(self.style.SUCCESS(f'Dados importados com sucesso de {input_file}'))
