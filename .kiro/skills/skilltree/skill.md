---
inclusion: always
---
# ⚡ Kiro Workflow: Skills y Prompts de Agilidad

Este documento es tu "Cheat Sheet" personal. No se lo des a Kiro como contexto general; úsalo para copiar y pegar estos comandos específicos en el chat de Kiro para evitar tareas repetitivas y corregir desvíos al instante.

## 🛠️ Skill 1: Setup y Scaffold Rápido
*Uso: Al iniciar el reloj del evento. Evita que Kiro te pregunte paso a paso cómo configurar el proyecto.*

> "Kiro, actúa como un desarrollador Frontend Senior. Ejecuta los comandos en la terminal para inicializar un proyecto Vite + React + TypeScript. Instala Tailwind CSS y configúralo. Luego, instala las siguientes dependencias: `reactflow`, `zustand`, `lucide-react`. No crees ningún componente todavía, avísame cuando el entorno esté levantado y sin errores."

---

## 🎨 Skill 2: Freno de Diseño (Corrector Neo-Brutalista)
*Uso: Si Kiro genera componentes aburridos, con sombras difuminadas, bordes redondeados o aspecto corporativo.*

> "🛑 ALTO. Te estás desviando del estilo visual. Recuerda que la interfaz es **Neo-Brutalista** (estilo arcade/indie game).
> Aplica estas reglas estrictas a TODOS los paneles, botones y nodos de React Flow:
> 1. Usa fuente de terminal: `font-mono`.
> 2. Bordes negros súper gruesos: `border-4 border-black`.
> 3. Sombras sólidas duras, NADA de difuminados: `shadow-[6px_6px_0px_0px_#000]`.
> 4. Los botones y nodos clickeables deben simular un botón físico al presionarse: `active:translate-y-1 active:translate-x-1 active:shadow-none`.
> Corrige el diseño actual usando estas clases de Tailwind."

---

## 💾 Skill 3: Inyección de Datos Mock (JSON Hardcoded)
*Uso: Durante la Fase 2, para probar el mapa visualmente sin tener que crear el importador de IA o escribir datos a mano.*

> "Para probar el lienzo del mapa de inmediato, inyecta este JSON directamente como el estado inicial en el store de Zustand. Ignora la creación manual por ahora:"
> ```json
> {
>   "name": "Bases de Datos Node.js",
>   "nodes": [
>     { "id": "1", "position": { "x": 250, "y": 0 }, "data": { "title": "Intro SQL", "status": "completed", "resources": ["https://youtube.com/sql"], "evidence": "Mis primeros apuntes" } },
>     { "id": "2", "position": { "x": 100, "y": 150 }, "data": { "title": "PostgreSQL", "status": "available", "resources": ["https://postgresql.org"], "evidence": "" } },
>     { "id": "3", "position": { "x": 400, "y": 150 }, "data": { "title": "ORM (Prisma)", "status": "locked", "resources": ["https://prisma.io"], "evidence": "" } }
>   ],
>   "edges": [
>     { "id": "e1-2", "source": "1", "target": "2", "animated": true },
>     { "id": "e1-3", "source": "1", "target": "3", "animated": false }
>   ]
> }
> ```

---

## 🤖 Skill 4: Plantilla de Prompt para el Usuario (Generador IA)
*Uso: Cuando Kiro esté programando la pantalla de inicio y necesite el texto exacto que el usuario va a copiar para darle a ChatGPT/Claude.*

> "En el modal de 'Crear con IA', inserta este texto exacto para que el usuario lo copie al portapapeles:
> 
> *'Actúa como un arquitecto de software y diseñador de rutas de aprendizaje. Genera un árbol de habilidades en formato JSON compatible con React Flow sobre el tema: [ESCRIBE TU TEMA AQUÍ]. Genera entre 4 y 6 nodos lógicos con ramificaciones. El primer nodo (id: 1) debe tener el status 'available', los demás deben ser 'locked'. Cada nodo en su objeto 'data' debe tener: title, status, resources (array de 2 enlaces reales) y evidence (string vacío). Calcula las posiciones {x, y} para que formen un árbol hacia abajo. Devuelve ÚNICAMENTE el JSON puro con la estructura { name, nodes, edges }.'*"

---

## 🚨 Skill 5: Protocolo de Emergencia (Debugging Seguro)
*Uso: Si la aplicación crashea, sale una pantalla en blanco o Zustand/React Flow lanzan un error rojo en consola.*

> "⚠️ Se ha roto la aplicación. Este es el error de la consola: 
> [PEGA EL ERROR AQUÍ]
> 
> REGLAS ESTRICTAS PARA SOLUCIONARLO:
> 1. Modifica ÚNICAMENTE el archivo y la línea afectada.
> 2. NO cambies la arquitectura de Zustand ni de React Flow.
> 3. NO refactorices componentes enteros ni instales librerías nuevas.
> 4. Mantén intacto el diseño Neo-Brutalista. 
> Dame solo el código corregido."