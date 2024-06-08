from django.db import migrations

def alter_codigo_field(apps, schema_editor):
    with schema_editor.connection.cursor() as cursor:
        # 1. Create a new temporary column
        cursor.execute('ALTER TABLE ce_origem ADD COLUMN codigo_temp INTEGER')
        
        # 2. Copy data from old column to the new temporary column
        cursor.execute('UPDATE ce_origem SET codigo_temp = codigo::INTEGER')
        
        # 3. Drop the old column
        cursor.execute('ALTER TABLE ce_origem DROP COLUMN codigo')
        
        # 4. Rename the temporary column to the original column name
        cursor.execute('ALTER TABLE ce_origem RENAME COLUMN codigo_temp TO codigo')

class Migration(migrations.Migration):

    dependencies = [
        ('ControleEstoque', '0010_remove_origem_id_alter_origem_codigo'),
        ('ControleEstoque', '0011_alter_origem_codigo'),
    ]

    operations = [
        migrations.RunPython(alter_codigo_field),
    ]
