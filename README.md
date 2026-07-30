# Tablero Gerencial de Defectos

Sitio web local que lee el archivo Excel ubicado en `C:\laragon\MOLINA\BUGS Reportados SIR 2024.xlsx` y muestra un tablero con filtros dinámicos, KPIs, agregados y tabla de detalle.

## Ejecutar

Si vas a usar la pantalla en PHP, abre `index.php` desde Laragon/Apache y deja `app.py` corriendo como API local.

```powershell
pip install -r requirements.txt
python app.py
```

Luego abre `http://127.0.0.1:8000` si quieres probar la versión Python, o `index.php` si quieres la pantalla PHP.

## Filtro principal

La hoja del Excel es el filtro principal del tablero. A partir de la hoja seleccionada, los filtros secundarios se adaptan a los campos disponibles.
