# Specs — Planificador de Cursada (Lic. Economía Empresarial UTDT)

Especificaciones del proyecto, en orden de lectura:

1. **[01-Discovery.md](./01-Discovery.md)** — el problema, el usuario, objetivos, contexto del dominio y decisiones tomadas.
2. **[02-PRD.md](./02-PRD.md)** — requerimientos de producto: modelo de datos, features, reglas de validación de correlativas y criterios de aceptación.
3. **[03-Design.md](./03-Design.md)** — brief de diseño (estética Di Tella) para generar el front-end. **Este es el que se entrega a Claude Design.** Documento vivo: se actualiza tras el desarrollo funcional.
4. **[04-Cuentas-y-Sincronizacion.md](./04-Cuentas-y-Sincronizacion.md)** — hito posterior a la v1: cuentas (mail+contraseña), plan en la nube con autoguardado (Supabase) y acceso gateado por pago. Reemplaza las decisiones de "fuera de alcance" sobre multiusuario.

Fuente de verdad del plan y correlativas:
[`../plan-de-estudios/economia-empresarial-ditella.md`](../plan-de-estudios/economia-empresarial-ditella.md)

## Flujo del proyecto
`Specs` → `Claude Design` (front/mockup) → desarrollo funcional (React+Vite+TS) → actualizar `03-Design.md`.

## Pendiente de validar por el usuario
- Mapeo materia→área en `02-PRD.md §3` (hay 4 materias marcadas con ❓).
- Nota de aprobación = **6** (UTDT suele ser 4; es constante única, fácil de cambiar).
- "Celdas a verificar" del plan original (ver archivo de plan de estudios).
