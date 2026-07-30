# 📦 Sistema de Versionado - Tablero Gerencial de Defectos

## Convenciones de Commits

Para mantener un historial claro y organizado, seguimos estas convenciones:

### Tipos de Commits

- **`feat:`** Nuevas características o funcionalidades
- **`fix:`** Corrección de bugs
- **`refactor:`** Cambios en código sin alterar funcionalidad
- **`docs:`** Cambios en documentación
- **`style:`** Cambios de estilos (CSS, formato)
- **`chore:`** Cambios en configuración o dependencias
- **`perf:`** Mejoras de rendimiento
- **`test:`** Cambios en tests

### Formato de Commit

```bash
<tipo>(<alcance>): <descripción corta>

<descripción detallada>

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

### Ejemplos

```bash
# Nueva columna
git commit -m "feat(pasteles): agregar columna prioridad DB a tabla"

# Arreglar bug
git commit -m "fix(filtros): año no se preselecciona en carga inicial"

# Cambiar ruta
git commit -m "chore(config): cambiar ruta de Excel al directorio local"

# Mejorar tabla
git commit -m "refactor(tablas): aumentar altura máxima de tabla principal"
```

---

## Flujo de Trabajo Recomendado

### 1. **Antes de cambios**
```bash
cd "c:\laragon\www\tablero defectos"
git status                    # Verificar estado
git pull origin main          # Traer cambios remotos
```

### 2. **Hacer cambios**
- Edita los archivos en tu IDE
- Prueba los cambios en el navegador
- Reinicia el servidor manualmente si es necesario:
  ```bash
  python app.py
  ```

### 3. **Guardar los cambios en git**
```bash
# Ver qué cambió
git status

# Agregar específicamente los archivos
git add app.py DOCUMENTACION.md

# O agregar todo
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat(tabla): cambiar columnas de pasteles prioridad db"

# Hacer push a GitHub
git push origin main
```

### 4. **Si necesitas descartar cambios**
```bash
# Ver cambios sin guardar
git diff

# Descartar cambios de un archivo
git checkout -- app.py

# Descartar todos los cambios
git checkout -- .
```

---

## Historial de Versiones

### v1.0.0 (2026-07-30)
- ✅ Dashboard inicial con filtros dinámicos
- ✅ KPIs y métricas
- ✅ Gráficos de barras (estado, país)
- ✅ Tabla de detalle de registros
- ✅ Pasteles Sprint (5 gráficos)
- ✅ Pasteles Prioridad DB con tablas
- ✅ Exportación Excel (3 hojas)
- ✅ Exportación PDF con impresión
- ✅ Menú jerárquico de navegación
- ✅ Año en curso preseleccionado
- ✅ Ruta de Excel relativa (local)
- ✅ Tablas expandidas sin límite de altura
- ✅ Columnas: País, Novedad, Sprint Reportes, Tarjeta Devops, Sprint Despliegue, Prioridad DB

---

## Comandos Útiles

```bash
# Ver historial de commits
git log --oneline -10

# Ver cambios del último commit
git show HEAD

# Ver commits de un archivo específico
git log --oneline app.py

# Revertir el último commit (sin perder cambios)
git reset --soft HEAD~1

# Revertir el último commit (perdiendo cambios)
git reset --hard HEAD~1
```

---

## Reglas Importantes

✅ **SIEMPRE hacer commit antes de cambios grandes**  
✅ **SIEMPRE hacer push después de cada sesión**  
✅ **SIEMPRE hacer pull antes de empezar a trabajar**  
❌ **NUNCA hacer force push** (`--force`)  
❌ **NUNCA dejar cambios sin commitear**

---

## Próximos Cambios

Cuando agregues nuevas características:

```bash
# 1. Hacer cambios
# 2. Probar en navegador
# 3. Commitear
git add .
git commit -m "feat(nueva-caracteristica): descripción"
git push origin main

# 4. Verificar en GitHub
# https://github.com/StephyMolina/tablero
```

---

**Última actualización:** 2026-07-30  
**Versión:** 1.0.0
