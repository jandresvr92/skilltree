---
inclusion: always
---
# SkillTree - MVP Hackathon

## 1. Contexto del Producto y Stack Técnico

**El Problema:** Las guías de estudio planas no motivan ni dejan un registro auditable del trabajo.[cite: 5]
**La Solución (SkillTree):** Un mapa visual interactivo (tipo árbol de habilidades). El usuario debe subir una evidencia/bitácora para iluminar un nodo y desbloquear el progreso.[cite: 5]
**El Diferencial:** Funciona 100% en el navegador. La creación de planes se hace mediante un JSON generado por cualquier IA (ChatGPT, Claude, Gemini) que el usuario importa en la app, empoderando al usuario y eliminando dependencias de backend.[cite: 5]

**Stack Técnico Estricto:**
*   **Core:** React 18+ (Vite, TypeScript, estricto uso de Hooks).[cite: 5]
*   **Mapa:** React Flow (Renderizado de nodos y conexiones).[cite: 5]
*   **Estado y Persistencia:** Zustand con middleware `persist` (Todo se guarda en LocalStorage. PROHIBIDO usar bases de datos externas, Dexie.js o backend).[cite: 5]
*   **Estilos y UI:** Tailwind CSS y Lucide-react (íconos).[cite: 5]

**Reglas Estrictas para el Agente:**
*   No cambies el stack definido sin preguntar.[cite: 5]
*   El tiempo de desarrollo es sumamente corto. Enfócate solo en la fase actual.[cite: 5]
*   La interfaz debe estar en español.[cite: 5]
*   **Diseño visual (CRÍTICO):** Usa estilo Neo-Brutalismo gamificado (tipo indie game/arcade). Usa un fondo color crema (`bg-[#F4F4F0]`), tipografía monoespaciada en toda la app (`font-mono`), bordes negros muy gruesos (`border-4 border-black`) y sombras sólidas duras (`shadow-[6px_6px_0px_0px_#000]`). Cero sombras difuminadas o degradados.
*   No construyas lógicas complejas de ruteo; todo debe funcionar en una sola vista (SPA).[cite: 5]

## 2. Modelo de Datos y Gamificación

**Estructura del Estado en Zustand (React Flow Elements):**
*   `nodes`: Array de nodos. Cada nodo contiene en su objeto `data`:[cite: 5]
    *   `title`: (string) Nombre del tema.[cite: 5]
    *   `status`: ('locked' | 'available' | 'completed').[cite: 5]
    *   `resources`: (Array de strings) Enlaces de estudio.[cite: 5]
    *   `evidence`: (string) La bitácora del usuario (inicialmente vacía).[cite: 5]
*   `edges`: Conexiones (origen y destino).[cite: 5]
*   `planName`: Nombre del árbol actual.[cite: 5]

**Gamificación Visual (Estados de Nodos en Tailwind - NeoBrutalismo):**
*   **Base de nodos y paneles:** `border-4 border-black font-mono font-bold transition-all`.
*   **locked:** Fondo gris oscuro (`bg-gray-400`), texto negro, opacidad normal, no clickeable, ícono de candado, sombra sólida negra (`shadow-[4px_4px_0px_0px_#000]`).
*   **available:** Fondo amarillo vibrante (`bg-yellow-400`), texto negro, animación `animate-pulse` leve para invitar al clic. Al interactuar (hover/active), debe simular un botón físico (`active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer`).
*   **completed:** Fondo verde vibrante (`bg-green-400`), texto negro, sombra sólida negra (`shadow-[4px_4px_0px_0px_#000]`). 
*   **edges (Líneas):** Tipo `step` (ortogonales), color negro puro, y un grosor (`strokeWidth`) de 4px.

## 3. Fases de Desarrollo por Iteración

**Fase 0: Setup (Solo si no se ha configurado el proyecto)**
Crea el proyecto con Vite, React y TS. Instala Tailwind, React Flow y Zustand. Limpia `App.tsx` y prepara la estructura: `src/components`, `src/store`.[cite: 5]

**Fase 1: Motor de Estado e Importador IA**
Crea `useTreeStore.ts` con Zustand y `persist`. [cite: 5]
1. Crea un estado inicial vacío.[cite: 5]
2. Crea la acción `importTree(jsonString)` que parsee un JSON (con `name`, `nodes` y `edges`) y actualice el store.[cite: 5]
3. En `App.tsx`, construye la "Pantalla de Inicio" con un Header rústico que tenga:
   - Un botón/modal que muestre el Prompt Plantilla para IA (te lo daré luego).[cite: 5]
   - Un `textarea` donde el usuario pega el JSON devuelto por la IA.[cite: 5]
   - Un botón "Generar Árbol" que ejecute `importTree()` y cambie la vista al Mapa.[cite: 5]

**Fase 2: El Lienzo del Mapa (React Flow)**
Crea `MapBoard.tsx`. Renderiza los nodos de Zustand usando React Flow. Construye un Custom Node que lea `data.status` y aplique los estilos de gamificación Neo-Brutalistas descritos en la Sección 2.[cite: 5] Usa un fondo de cuadrícula de puntos (el `Background` nativo de React Flow) para darle vibra de libreta de ingeniería. Muestra un árbol de prueba simple temporal para validar el diseño.[cite: 5]

**Fase 3: Panel Lateral (Recursos vs Bitácora)**
Al hacer clic en un nodo `available` o `completed`, abre un `SidePanel.tsx` sobre el mapa.[cite: 5] Debe lucir como una ventana flotante maciza (`bg-white border-[6px] border-black shadow-[12px_12px_0px_0px_#000]`).
Debe tener dos secciones claras:[cite: 5]
1. **📚 Material de Apoyo (Solo lectura):** Lista los `resources`.[cite: 5]
2. **📝 Mi Bitácora:** Si es 'available', muestra un textarea (con bordes gruesos) para escribir apuntes y un botón "Guardar Progreso" naranja vibrante (`bg-orange-500` con el mismo efecto `active` de los nodos).[cite: 5]
Al guardar: actualiza `data.evidence` en Zustand, cambia el status del nodo a 'completed', busca los nodos hijo y cámbialos a 'available'. El panel se cierra y el nodo cambia de color en el mapa.[cite: 5]