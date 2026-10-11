System.register(["jimu-core/emotion","jimu-core"],function(a,t){var r={},e={};return{setters:[function(a){r.jsx=a.jsx},function(a){e.React=a.React}],execute:function(){a((()=>{var a={9244(a){"use strict";a.exports=e},7386(a){"use strict";a.exports=r}},t={};function o(r){var e=t[r];if(void 0!==e)return e.exports;var i=t[r]={exports:{}};return a[r](i,i.exports,o),i.exports}o.d=(a,t)=>{for(var r in t)o.o(t,r)&&!o.o(a,r)&&Object.defineProperty(a,r,{enumerable:!0,get:t[r]})},o.o=(a,t)=>Object.prototype.hasOwnProperty.call(a,t),o.r=a=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(a,"__esModule",{value:!0})},o.p="";var i={};return o.p=window.jimuConfig.baseUrl,(()=>{"use strict";o.r(i),o.d(i,{__set_webpack_public_path__:()=>n,default:()=>e});var a=o(7386),t=o(9244);const r=String.raw`
/* ---------------------------------------------------------------
   JAXTWIN V1.2 · BRANDED STYLE TOKENS
   The layout, positions and widget mounting are unchanged.
   --------------------------------------------------------------- */
body.jax-v12-workspace-active {
  --j12-navy: #174c5e;
  --j12-navy-dark: #113c4b;
  --j12-primary: #087c96;
  --j12-primary-hover: #046c83;
  --j12-highlight: #dff1f5;
  --j12-surface: #ffffff;
  --j12-soft: #f6f9fb;
  --j12-soft-blue: #eff6f8;
  --j12-border: #d7e3e9;
  --j12-border-strong: #b9d2dc;
  --j12-ink: #243f4d;
  --j12-copy: #476674;
  --j12-muted: #728894;
  --j12-shadow: 0 10px 32px rgba(13,53,69,.16), 0 1px 5px rgba(13,53,69,.07);
  --j12-radius: 11px;
  --j12-font: 'Avenir Next', 'Segoe UI', Arial, sans-serif;
}

/* Tiny marker to indicate only the V1.2 page is restyled */
body.jax-v12-workspace-active .jax-v12-version-chip {
  box-sizing: border-box;
  min-height: 24px;
  height: 24px;
  width: max-content;
  padding: 0 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font: 700 10px/1 var(--j12-font);
  letter-spacing: .055em;
  border-radius: 999px;
  border: 1px solid rgba(159,199,212,.48);
  background: rgba(19,66,83,.88);
  color: #edfaff;
  box-shadow: 0 2px 9px rgba(7,33,48,.13);
  backdrop-filter: blur(5px);
}
body.jax-v12-workspace-active .jax-v12-version-dot {
  width: 5px; height: 5px; display: inline-block; flex-shrink: 0;
  background: #60d5bb; border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(96,213,187,.14);
}

/* ---------------------------------------------------------------
   BUILT-IN WIDGET CONTROLLER SHELL
   Selector alternatives accommodate Esri's version-specific DOM.
   Only controllers CONTAINING Analysis/Layers/our Basemap Gallery are affected.
   Never style the Builder's own property-editing sidebar.
   --------------------------------------------------------------- */
body.jax-v12-workspace-active :is(
  .widget-controller-panel,
  .widget-controller-widget-panel,
  .jimu-widget-controller-panel,
  .jimu-widget-panel,
  .jimu-panel,
  [class*='widget-controller-panel'],
  [class*='controller-panel']
):has(:is(.jax-analysis-panel,.jax-layers-widget,.jax1211-basemap)) {
  border: 1px solid var(--j12-border) !important;
  border-radius: var(--j12-radius) !important;
  box-shadow: var(--j12-shadow) !important;
  overflow: hidden !important;
  background: var(--j12-surface) !important;
}
body.jax-v12-workspace-active :is(
  .widget-controller-panel,
  .widget-controller-widget-panel,
  .jimu-widget-controller-panel,
  .jimu-widget-panel,
  .jimu-panel,
  [class*='widget-controller-panel'],
  [class*='controller-panel']
):has(:is(.jax-analysis-panel,.jax-layers-widget,.jax1211-basemap))
> :is(.panel-header,.widget-controller-panel-header,.jimu-panel-header,[class*='panel-header']) {
  min-height: 42px !important;
  background: var(--j12-navy) !important;
  color: #f3fbfd !important;
  border-bottom: 1px solid rgba(255,255,255,.12) !important;
  font-family: var(--j12-font) !important;
  font-size: 13px !important;
  font-weight: 650 !important;
}

/* Shared JAX fonts and surfaces, including an AI portal under Results. */
body.jax-v12-workspace-active :is(.jax-analysis-panel,.jax-layers-widget,.jax-results-dock,.jaxai-root.jaxai-embedded) {
  --jax-font: var(--j12-font);
  --jax-ink: var(--j12-ink);
  --jax-text: var(--j12-copy);
  --jax-muted: var(--j12-muted);
  --jax-accent: var(--j12-primary);
  --jax-accent-hover: var(--j12-primary-hover);
  --jax-line: var(--j12-border);
  --jax-surface: var(--j12-surface);
  --jax-card: var(--j12-soft);
  --jax-radius: 9px;
  color: var(--j12-copy);
  font-family: var(--j12-font) !important;
  -webkit-font-smoothing: antialiased;
}
body.jax-v12-workspace-active :is(.jax-analysis-panel,.jax-layers-widget,.jax-results-dock,.jaxai-root.jaxai-embedded) :is(button,input,select,textarea) {
  font-family: var(--j12-font) !important;
}

/* ---------------------------------------------------------------
   ANALYSIS: compact, quiet content within native controller panel.
   The controller already has the heading "Analysis".
   --------------------------------------------------------------- */
body.jax-v12-workspace-active .jax-analysis-panel {
  background: white !important;
  border: 0 !important;
}
body.jax-v12-workspace-active .jax-analysis-header {
  background: var(--j12-soft) !important;
  border-bottom: 1px solid var(--j12-border) !important;
  padding: 13px 17px 12px !important;
}
body.jax-v12-workspace-active .jax-analysis-eyebrow,
body.jax-v12-workspace-active .jax-analysis-title { display: none !important; }
body.jax-v12-workspace-active .jax-analysis-subtitle {
  margin: 0 !important;
  color: var(--j12-muted) !important;
  font-size: 11.5px !important;
  line-height: 1.52 !important;
}
body.jax-v12-workspace-active .jax-analysis-body {
  background: white !important;
  padding: 16px 16px 20px !important;
  scrollbar-color: #cad9df transparent;
  scrollbar-width: thin;
}
body.jax-v12-workspace-active .jax-analysis-section-label {
  color: var(--j12-primary) !important;
  font-size: 10px !important;
  font-weight: 750 !important;
  letter-spacing: .085em !important;
}
body.jax-v12-workspace-active :is(.jax-study-card,.jax-basic-card) {
  background: var(--j12-soft) !important;
  border: 1px solid var(--j12-border) !important;
  border-radius: 9px !important;
  box-shadow: none !important;
}
body.jax-v12-workspace-active :is(.jax-basic-row,.jax-reference-row) {
  border-bottom-color: #e4edf0 !important;
}
body.jax-v12-workspace-active .jax-dimension-row {
  border: 1px solid var(--j12-border) !important;
  border-radius: 9px !important;
  background: #f8fafb !important;
  box-shadow: none !important;
  transition: background-color .15s ease, border-color .15s ease;
}
body.jax-v12-workspace-active .jax-dimension-row:hover {
  background: var(--j12-soft-blue) !important;
  border-color: var(--j12-border-strong) !important;
}
body.jax-v12-workspace-active .jax-dimension-row.is-open {
  background: var(--j12-highlight) !important;
  border-color: #a7d2dd !important;
}
body.jax-v12-workspace-active .jax-dimension-name {
  color: var(--j12-ink) !important;
  font-weight: 650 !important;
}
body.jax-v12-workspace-active :is(.jax-metric-group,.jax-dimension-select-all,.jax-clear-button,.jax-study-mode-button) {
  border-color: var(--j12-border) !important;
  border-radius: 8px !important;
}
body.jax-v12-workspace-active .jax-analysis-actions-footer {
  background: #fff !important;
  padding: 13px 15px !important;
  border-top: 1px solid var(--j12-border) !important;
  box-shadow: 0 -8px 20px rgba(18,50,67,.035) !important;
}
body.jax-v12-workspace-active :is(.jax-run-button,.jax-action-button-primary) {
  background: var(--j12-primary) !important;
  border-color: var(--j12-primary) !important;
  color: white !important;
  border-radius: 9px !important;
  font-weight: 650 !important;
}
body.jax-v12-workspace-active :is(.jax-run-button,.jax-action-button-primary):hover {
  background: var(--j12-primary-hover) !important;
}
body.jax-v12-workspace-active :is(.jax-clear-area-button,.jax-action-button-secondary) {
  background: #f5f9fa !important;
  border-color: var(--j12-border) !important;
  color: var(--j12-primary) !important;
  border-radius: 9px !important;
}

/* ---------------------------------------------------------------
   LAYERS: identical white surface/padding as Analysis.
   Hide the repeated in-widget title but preserve all layer rows.
   --------------------------------------------------------------- */
body.jax-v12-workspace-active .jax-layers-widget,
body.jax-v12-workspace-active .jax-layers-card {
  background: white !important;
}
body.jax-v12-workspace-active .jax-layers-card {
  margin: 0 !important;
  height: 100% !important;
  min-height: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
body.jax-v12-workspace-active .jax-layers-header { display: none !important; }
body.jax-v12-workspace-active .jax-layers-body {
  padding: 16px 16px 20px !important;
  background: white !important;
  scrollbar-color: #cad9df transparent;
  scrollbar-width: thin;
}
body.jax-v12-workspace-active .jax-layers-section-label {
  color: var(--j12-primary) !important;
  font-size: 10px !important;
  letter-spacing: .085em !important;
  font-weight: 750 !important;
  margin-bottom: 9px !important;
}
body.jax-v12-workspace-active .jax-reference-card {
  background: var(--j12-soft) !important;
  border: 1px solid var(--j12-border) !important;
  border-radius: 9px !important;
}
body.jax-v12-workspace-active :is(.jax-layer-section,.jax-student-group) {
  background: #fff !important;
  border: 1px solid var(--j12-border) !important;
  border-radius: 9px !important;
  box-shadow: none !important;
  overflow: hidden;
}
body.jax-v12-workspace-active .jax-layer-section.is-open {
  border-color: #9fcbd7 !important;
}
body.jax-v12-workspace-active :is(.jax-layer-section-header,.jax-student-group-header):hover {
  background: var(--j12-soft-blue) !important;
}
body.jax-v12-workspace-active .jax-layer-active-badge {
  color: var(--j12-primary) !important;
  background: var(--j12-highlight) !important;
  border-radius: 6px !important;
}

/* ---------------------------------------------------------------
   RESULTS: preserve user-selected size/left/top/resizable behavior.
   This is the IMPORTANT change from the previous V1.2 skin.
   --------------------------------------------------------------- */
body.jax-v12-workspace-active .jax-results-dock {
  background: white !important;
  border: 1px solid var(--j12-border) !important;
  border-radius: 12px !important;
  box-shadow: var(--j12-shadow) !important;
  /* Deliberately NO width, left, top, height, position or resize rules. */
}
body.jax-v12-workspace-active .jax-result-header {
  background: #fff !important;
  border-bottom: 1px solid var(--j12-border) !important;
  padding: 15px 17px 13px !important;
}
body.jax-v12-workspace-active .jax-result-eyebrow { display: none !important; }
body.jax-v12-workspace-active .jax-result-title {
  font-size: 17px !important;
  font-weight: 700 !important;
  letter-spacing: -.02em !important;
  color: var(--j12-ink) !important;
}
body.jax-v12-workspace-active .jax-result-close {
  color: var(--j12-muted) !important;
  border-radius: 8px !important;
}
body.jax-v12-workspace-active .jax-result-close:hover {
  color: var(--j12-primary) !important;
  background: var(--j12-soft-blue) !important;
}
body.jax-v12-workspace-active .jax-results-mode-tabs {
  gap: 6px !important;
  padding: 11px 14px !important;
  background: white !important;
  border-bottom: 1px solid var(--j12-border) !important;
}
body.jax-v12-workspace-active .jax-results-mode-tabs > button {
  min-height: 36px !important;
  border-radius: 8px !important;
  background: var(--j12-soft) !important;
  border: 1px solid var(--j12-border) !important;
  color: #617887 !important;
  font-weight: 650 !important;
  transition: border-color .15s ease,background-color .15s ease;
}
body.jax-v12-workspace-active .jax-results-mode-tabs > button[aria-selected='true'] {
  color: var(--j12-primary-hover) !important;
  border-color: #9bcbd8 !important;
  background: var(--j12-highlight) !important;
  box-shadow: inset 0 0 0 1px rgba(14,117,146,.04);
}
body.jax-v12-workspace-active :is(.jax-result-body,.jax-result-navigator) {
  background: white !important;
  scrollbar-color: #cad9df transparent;
  scrollbar-width: thin;
}
body.jax-v12-workspace-active .jax-result-body { padding: 15px 17px 20px !important; }
body.jax-v12-workspace-active :is(.jax-result-section-title,.jax-result-navigator-label) {
  color: var(--j12-primary) !important;
  letter-spacing: .06em !important;
}
body.jax-v12-workspace-active .jax-result-navigator-select {
  background: var(--j12-soft) !important;
  border: 1px solid var(--j12-border) !important;
  border-radius: 8px !important;
}
body.jax-v12-workspace-active :is(.jax-result-metric,.jax-result-meta,.jax-info-card) {
  border-color: var(--j12-border) !important;
  border-radius: 9px !important;
}
body.jax-v12-workspace-active .jax-evidence-button {
  color: var(--j12-primary-hover) !important;
  background: var(--j12-highlight) !important;
  border: 1px solid #a7d2dd !important;
  border-radius: 8px !important;
  font-weight: 650 !important;
}
body.jax-v12-workspace-active .jax-evidence-button:hover {
  background: #cfecf2 !important;
}

/* ---------------------------------------------------------------
   AI INSIGHTS: stays inside Results. Same metric/card style.
   --------------------------------------------------------------- */
body.jax-v12-workspace-active #jaxtwin-ai-results-host {
  background: white !important;
}
body.jax-v12-workspace-active .jaxai-root.jaxai-embedded {
  border: 0 !important;
  border-radius: 0 !important;
  background: white !important;
  box-shadow: none !important;
}
body.jax-v12-workspace-active .jaxai-root.jaxai-embedded .jaxai-body {
  padding: 13px 15px 20px !important;
}
body.jax-v12-workspace-active .jaxai-root :is(.jaxai-scope,.jaxai-priority-kpi) {
  background: var(--j12-soft) !important;
  border: 1px solid var(--j12-border) !important;
  border-radius: 9px !important;
}
body.jax-v12-workspace-active .jaxai-root .jaxai-priority-banner {
  background: var(--j12-soft-blue) !important;
  border: 1px solid #bfdbe4 !important;
  border-radius: 9px !important;
}
body.jax-v12-workspace-active .jaxai-root .jaxai-priority-card {
  background: #fff !important;
  border: 1px solid var(--j12-border) !important;
  border-radius: 10px !important;
  box-shadow: none !important;
}
body.jax-v12-workspace-active .jaxai-root .jaxai-priority-card.jaxai-selected {
  border-color: #52a9be !important;
  box-shadow: inset 0 0 0 1px #52a9be !important;
}
body.jax-v12-workspace-active .jaxai-root .jaxai-priority-title {
  color: var(--j12-ink) !important;
  font-size: 14px !important;
  font-weight: 700 !important;
}
body.jax-v12-workspace-active .jaxai-root .jaxai-priority-kpi strong {
  color: var(--j12-primary-hover) !important;
}
body.jax-v12-workspace-active .jaxai-root :is(.jaxai-primary,.jaxai-priority-map) {
  border-radius: 8px !important;
}
body.jax-v12-workspace-active .jaxai-root .jaxai-primary {
  background: var(--j12-primary) !important;
}
body.jax-v12-workspace-active .jaxai-root .jaxai-priority-map {
  background: var(--j12-highlight) !important;
  color: var(--j12-primary-hover) !important;
  border-color: #a7d2dd !important;
}
body.jax-v12-workspace-active .jaxai-root .jaxai-priority-map[aria-pressed='true'] {
  color: white !important;
  background: var(--j12-primary) !important;
}

/* Accessible focus ring (no change to mouse or map interactions). */
body.jax-v12-workspace-active :is(.jax-analysis-panel,.jax-layers-widget,.jax-results-dock,.jaxai-root) :focus-visible {
  outline: 2px solid #258eaa !important;
  outline-offset: 2px !important;
}
@media (prefers-reduced-motion: reduce) {
  body.jax-v12-workspace-active :is(.jax-results-mode-tabs > button,.jax-dimension-row) {
    transition: none !important;
  }
}


/* ===============================================================
   V1.2.2 refinement — stronger visual hierarchy, SAME positions
   =============================================================== */
/* The appearance-only sentinel stays invisible, not display:none.
   The React inline style also keeps it invisible on the first frame. */
.jax-v12-version-chip {
  opacity: 0 !important;
  pointer-events: none !important;
  width: 1px !important;
  height: 1px !important;
  min-width: 1px !important;
  min-height: 1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  box-shadow: none !important;
}

/* More explicit palette and component consistency. */
body.jax-v12-workspace-active {
  --j12-navy: #16485a;
  --j12-primary: #086e87;
  --j12-primary-hover: #075c72;
  --j12-shadow: 0 9px 25px rgba(12,42,55,.18), 0 1px 3px rgba(12,42,55,.07);
  --j12-border: #d9e6eb;
}
/* Esri's controller shell has several DOM variants across versions.  These
   rules touch ONLY widget-panel containers (not Builder's settings sidebars). */
body.jax-v12-workspace-active :is(
  .widget-controller-panel,
  .widget-controller-widget-panel,
  .jimu-widget-controller-panel,
  [class*='widget-controller-panel']
) {
  border-radius: 11px !important;
  border: 1px solid rgba(199,219,227,.85) !important;
  box-shadow: 0 9px 26px rgba(6,38,55,.16) !important;
}
body.jax-v12-workspace-active :is(
  .widget-controller-panel,
  .widget-controller-widget-panel,
  .jimu-widget-controller-panel,
  [class*='widget-controller-panel']
) > :is(.panel-header,.widget-controller-panel-header,.jimu-panel-header,[class*='panel-header']) {
  background: #174c60 !important;
  color: #fff !important;
  border-bottom: 1px solid rgba(255,255,255,.12) !important;
}

/* Layers: deliberately visible difference vs. earlier compact skin.
   No rows are removed and every checkbox remains native to its widget. */
body.jax-v12-workspace-active .jax-layers-widget .jax-layers-body {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfe 100%) !important;
  padding: 17px 15px 22px !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-layers-section-label {
  margin: 17px 3px 9px !important;
  color: #0c748b !important;
  font-size: 10px !important;
  font-weight: 750 !important;
  letter-spacing: .11em !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-layers-section-label:first-child {
  margin-top: 1px !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-reference-card {
  padding: 5px 11px !important;
  background: #eef6f8 !important;
  border-color: #d0e4ea !important;
  border-radius: 10px !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-reference-row {
  min-height: 39px !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-layer-sections {
  gap: 8px !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-layer-section {
  border-radius: 10px !important;
  border: 1px solid #d9e6eb !important;
  background: white !important;
  box-shadow: 0 1px 3px rgba(20,59,72,.045) !important;
  transition: box-shadow .17s ease, border-color .17s ease !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-layer-section:hover {
  border-color: #9fcbd7 !important;
  box-shadow: 0 3px 8px rgba(20,59,72,.075) !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-layer-section-header {
  min-height: 43px !important;
  padding: 9px 12px !important;
  background: #f7fafb !important;
  color: #244353 !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-layer-section-header:hover {
  background: #eff7f9 !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-layer-section.is-open {
  border-color: #87bfd0 !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-layer-section.is-open > .jax-layer-section-header {
  background: #e6f3f7 !important;
  border-bottom: 1px solid #c9e3ea !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-layer-section-title {
  font-size: 12px !important;
  font-weight: 650 !important;
}
body.jax-v12-workspace-active .jax-layers-widget .jax-layer-active-badge {
  color: #0a6e85 !important;
  background: #d5edf3 !important;
  border-radius: 6px !important;
}

/* Keep the same visual language in Spatial Analysis and Results. */
body.jax-v12-workspace-active .jax-analysis-panel .jax-basic-card,
body.jax-v12-workspace-active .jax-analysis-panel .jax-study-card {
  border-radius: 10px !important;
  border-color: #d6e5ea !important;
  background: #f5f9fb !important;
}
body.jax-v12-workspace-active .jax-analysis-panel .jax-dimension-row {
  border-radius: 9px !important;
  box-shadow: 0 1px 3px rgba(20,59,72,.045) !important;
}
body.jax-v12-workspace-active .jax-results-dock {
  box-shadow: var(--j12-shadow) !important;
  border-color: #d6e5ea !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-results-mode-tabs > button[aria-selected='true'] {
  background: #e0f1f5 !important;
  border-color: #86bfcd !important;
  color: #0a617a !important;
}
body.jax-v12-workspace-active :is(.jax-layers-widget,.jax-analysis-panel,.jax-results-dock) button:focus-visible {
  outline: 2px solid #16a0bd !important;
  outline-offset: 1px !important;
}

/* ===============================================================
   V1.2.3 · RESULTS RESTORATION + NAVIGATOR + ACCORDION CHEVRONS
   Scope is only the V1.2 skin; NO panel placement/GIS/React edits.
   =============================================================== */

/* 1. Restore the visual hierarchy of the earlier Results card.
      The tiny JAX TWIN eyebrow is intentional and was hidden by V1.2.2. */
body.jax-v12-workspace-active .jax-results-dock {
  background: #ffffff !important;
  border: 1px solid #d7e3e9 !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(12,37,46,.17) !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-header {
  padding: 19px 20px 16px !important;
  background: #f8fafb !important;
  border-bottom: 1px solid #e4edf0 !important;
  align-items: flex-start !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-eyebrow {
  display: block !important;
  visibility: visible !important;
  color: #087c96 !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  line-height: 1.35 !important;
  letter-spacing: .95px !important;
  text-transform: uppercase !important;
  margin: 0 !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-title {
  margin: 5px 0 0 !important;
  font-size: 21px !important;
  line-height: 1.25 !important;
  font-weight: 650 !important;
  letter-spacing: -.25px !important;
  color: #243f4d !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-close {
  margin-top: -3px !important;
  color: #718995 !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-results-mode-tabs {
  padding: 12px 16px 13px !important;
  gap: 6px !important;
  background: #ffffff !important;
  border-bottom: 1px solid #e4edf0 !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-results-mode-tabs > button {
  min-height: 38px !important;
  height: 38px !important;
  font-size: 12px !important;
  border-radius: 8px !important;
  background: #ffffff !important;
  border: 1px solid #d9e5eb !important;
  color: #4d6a7a !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-results-mode-tabs > button[aria-selected='true'] {
  background: #e4f2f6 !important;
  border-color: #9bcbd8 !important;
  color: #006f89 !important;
}

/* 2. Make SELECT METRIC / result count breathe under the tab divider.
      Do not override display because the AI tab uses display:none inline. */
body.jax-v12-workspace-active .jax-results-dock .jax-result-navigator {
  padding: 16px 19px 15px !important;
  background: #ffffff !important;
  border-bottom: 1px solid #e4edf0 !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-navigator-label {
  display: block !important;
  margin: 0 0 9px !important;
  padding: 0 !important;
  font-size: 10.5px !important;
  font-weight: 750 !important;
  line-height: 1.45 !important;
  letter-spacing: .07em !important;
  color: #087c96 !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-navigator-select {
  width: 100% !important;
  min-height: 43px !important;
  height: 43px !important;
  padding: 0 13px !important;
  border: 1px solid #d5e3e9 !important;
  border-radius: 8px !important;
  background: #f7fafb !important;
  font-size: 12.5px !important;
  font-weight: 600 !important;
  color: #294958 !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-body {
  padding: 19px 20px 24px !important;
  background: #f9fbfc !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-value {
  font-size: 37px !important;
  font-weight: 500 !important;
  letter-spacing: -.5px !important;
  color: #067b95 !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-section-title {
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: .06em !important;
  color: #087c96 !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-evidence-button {
  min-height: 42px !important;
  background: #ffffff !important;
  border: 1px solid #b8d2dc !important;
  border-radius: 8px !important;
  color: #087c96 !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-evidence-button:hover {
  background: #eaf5f8 !important;
  border-color: #8bbdcb !important;
}

/* 3. Make LAND / CONNECT / RESILIENCE sub-group arrows match their
      parent accordion's short, thin chevron (right closed, down open).
      This fixes oversized/inconsistent arrows at Mix & Diversity. */
body.jax-v12-workspace-active .jax-analysis-panel .jax-land-subdimensions
  .jax-metric-group-header .jax-chevron-box {
  display: inline-flex !important;
  flex: 0 0 16px !important;
  width: 16px !important;
  height: 20px !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 !important;
  padding: 0 !important;
  font-size: 0 !important;
  line-height: 1 !important;
  transform: none !important;
}
body.jax-v12-workspace-active .jax-analysis-panel .jax-land-subdimensions
  .jax-metric-group-header .jax-chevron-box .jax-chevron-line {
  display: block !important;
  flex: 0 0 7px !important;
  width: 7px !important;
  height: 7px !important;
  border: 0 !important;
  border-right: 1.6px solid #708b95 !important;
  border-bottom: 1.6px solid #708b95 !important;
  border-radius: 0 !important;
  background: none !important;
  box-shadow: none !important;
  transform: rotate(-45deg) !important;
  transform-origin: center !important;
  transition: transform .15s ease !important;
}
body.jax-v12-workspace-active .jax-analysis-panel .jax-land-subdimensions
  .jax-metric-group-header .jax-chevron-box.is-open .jax-chevron-line {
  transform: rotate(45deg) !important;
}
/* Align the overall dimension headers' chevron stroke exactly the same. */
body.jax-v12-workspace-active .jax-analysis-panel .jax-dimension-tab
  .jax-chevron-box .jax-chevron-line {
  width: 7px !important;
  height: 7px !important;
  border-right: 1.6px solid #708b95 !important;
  border-bottom: 1.6px solid #708b95 !important;
}
@media (prefers-reduced-motion: reduce) {
  body.jax-v12-workspace-active .jax-analysis-panel .jax-land-subdimensions
    .jax-metric-group-header .jax-chevron-line { transition: none !important; }
}



/* ===============================================================
   V1.2.4 · LAST-MILE DESIGN SYSTEM
   Exact page-scoped: no spatial query, no map event and no EXB
   configuration changes. The header mark is placed on a text node
   by the existing Skin widget when the V1.2 page is active.
   =============================================================== */

/* RESULTS: up 18 px from the 105px CSS base. Do not use margin-top:
   the results card is fixed-position and an entrance animation can
   override transforms.  No left/width/z-index changes. */
body.jax-v12-workspace-active .jax-results-dock {
  top: 87px !important;
  max-height: calc(100vh - 101px) !important;
}
/* USER REQUEST: no repeated JAX TWIN label within the Results card. */
body.jax-v12-workspace-active .jax-results-dock .jax-result-eyebrow {
  display: none !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-header {
  padding: 18px 20px 17px !important;
  background: #f8fafb !important;
  border-bottom: 1px solid #e2eaf0 !important;
  align-items: center !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-title {
  margin: 0 !important;
  font-size: 21px !important;
  font-weight: 700 !important;
  letter-spacing: -.025em !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-navigator {
  padding-top: 18px !important;
}
/* Consistent shell for left and right panels, no size constraints. */
body.jax-v12-workspace-active .jax-results-dock,
body.jax-v12-workspace-active .jax12-basemap-shell {
  border-radius: 12px !important;
  box-shadow: 0 14px 34px rgba(9,34,46,.17),0 2px 7px rgba(9,34,46,.055) !important;
}
/* Esri's built-in Basemap Gallery: the Skin marks its containing panel
   at runtime once its actual Basemap heading + thumbnails are present. */
body.jax-v12-workspace-active .jax12-basemap-shell {
  border: 1px solid #d6e4ea !important;
  overflow: hidden !important;
  background: #ffffff !important;
  font-family: var(--j12-font) !important;
}
body.jax-v12-workspace-active .jax12-basemap-shell :is(.panel-header, .jimu-panel-header, .widget-controller-panel-header, [class*='panel-header']) {
  min-height: 41px !important;
  background: #174c5e !important;
  border-bottom: 1px solid rgba(255,255,255,.14) !important;
  color: #ffffff !important;
  font-size: 13px !important;
  font-weight: 650 !important;
}
body.jax-v12-workspace-active .jax12-basemap-shell :is(
  .basemap-item, .basemap-gallery-item, .esri-basemap-gallery__item,
  [class*='basemap-gallery__item'], [class*='basemap-gallery-item'], [class*='basemap-item']
) {
  min-height: 68px !important;
  box-sizing: border-box !important;
  margin: 5px 8px !important;
  padding: 7px 9px !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  border-radius: 9px !important;
  border: 1px solid #e0e9ed !important;
  background: #f8fafb !important;
  color: #314b59 !important;
  transition: border-color .16s ease,background-color .16s ease !important;
}
body.jax-v12-workspace-active .jax12-basemap-shell :is(
  .basemap-item, .basemap-gallery-item, .esri-basemap-gallery__item,
  [class*='basemap-gallery__item'], [class*='basemap-gallery-item'], [class*='basemap-item']
):hover {
  border-color: #aed2dc !important;
  background: #edf5f8 !important;
}
body.jax-v12-workspace-active .jax12-basemap-shell :is(
  .esri-basemap-gallery__item--selected, .selected, [aria-selected='true']
):has(img) {
  border-color: #7ab7c9 !important;
  background: #e4f2f6 !important;
}
/* Image thumbnails from native Esri gallery are much bigger than the
   custom cards: normalize them to a compact, readable horizontal row. */
body.jax-v12-workspace-active .jax12-basemap-shell :is(
  .esri-basemap-gallery__item-thumbnail,
  .basemap-item img, .basemap-gallery-item img,
  [class*='basemap-gallery__item'] img,
  [class*='basemap-item'] img
) {
  box-sizing: border-box !important;
  width: 76px !important;
  min-width: 76px !important;
  max-width: 76px !important;
  height: 53px !important;
  max-height: 53px !important;
  object-fit: cover !important;
  border-radius: 6px !important;
  border: 1px solid #d7e2e7 !important;
}
body.jax-v12-workspace-active .jax12-basemap-shell :is(
  .esri-basemap-gallery__item-title,
  [class*='basemap-gallery__item-title'], [class*='basemap-item-title']
) {
  font: 600 12px/1.3 var(--j12-font) !important;
  color: #2d4b58 !important;
}
body.jax-v12-workspace-active .jax12-basemap-shell :is(
  .esri-basemap-gallery__item-container, [class*='basemap-gallery__item-container']
) { align-items: center !important; }
@media (prefers-reduced-motion:reduce) {
  body.jax-v12-workspace-active .jax12-basemap-shell * { transition: none !important; }
}


/* ==============================================================
   V1.2.5 FINAL COSMETIC OVERRIDES
   No header text replacement via DOM; use real Brand Header widget.
   =============================================================== */
body.jax-v12-workspace-active .jax12-basemap-shell {
  background:#fff !important;
  border:1px solid #d5e2e8 !important;
  border-radius:11px !important;
  box-shadow:0 12px 30px rgba(10,40,53,.15) !important;
}
/* Gallery rows identified in runtime without relying on Esri version class names. */
body.jax-v12-workspace-active .jax12-basemap-shell .jax12-basemap-row {
  box-sizing:border-box !important;
  display:flex !important;
  align-items:center !important;
  gap:11px !important;
  margin:5px 8px !important;
  padding:7px 8px !important;
  border:1px solid #dce8ec !important;
  border-radius:8px !important;
  background:#f7fafb !important;
  color:#345261 !important;
  min-height:66px !important;
  transition:background-color .12s ease,border-color .12s ease !important;
}
body.jax-v12-workspace-active .jax12-basemap-shell .jax12-basemap-row:hover {
  background:#eaf4f7 !important;
  border-color:#a7cfd9 !important;
}
body.jax-v12-workspace-active .jax12-basemap-shell .jax12-basemap-row img {
  box-sizing:border-box !important;
  display:block !important;
  width:74px !important;
  max-width:74px !important;
  min-width:74px !important;
  height:52px !important;
  max-height:52px !important;
  object-fit:cover !important;
  border:1px solid #c9dce3 !important;
  border-radius:5px !important;
}
/* Esri BasemapGallery element classes: fallback if row marking is not possible. */
body.jax-v12-workspace-active .esri-basemap-gallery .esri-basemap-gallery__item {
  box-sizing:border-box !important;
  display:flex !important;
  align-items:center !important;
  gap:11px !important;
  border:1px solid #dce8ec !important;
  border-radius:8px !important;
  background:#f7fafb !important;
  margin:5px 8px !important;
  padding:7px 8px !important;
}
body.jax-v12-workspace-active .esri-basemap-gallery .esri-basemap-gallery__item:hover {
  background:#eaf4f7 !important;
  border-color:#a7cfd9 !important;
}
body.jax-v12-workspace-active .esri-basemap-gallery .esri-basemap-gallery__item-thumbnail {
  width:74px !important;
  height:52px !important;
  min-width:74px !important;
  object-fit:cover !important;
  border-radius:5px !important;
}
body.jax-v12-workspace-active .esri-basemap-gallery .esri-basemap-gallery__item-title {
  font:600 12px/1.35 var(--j12-font) !important;
  color:#365463 !important;
}
body.jax-v12-workspace-active .esri-basemap-gallery .esri-basemap-gallery__item--selected,
body.jax-v12-workspace-active .jax12-basemap-shell .jax12-basemap-row[aria-selected='true'] {
  background:#dff0f5 !important;
  border-color:#64aebe !important;
}
/* Compact Results remains 18px higher; keeps the user-preferred typography. */
body.jax-v12-workspace-active .jax-results-dock {top:87px !important;}
body.jax-v12-workspace-active .jax-results-dock .jax-result-eyebrow {display:none !important;}



/* ==============================================================
   V1.2.7 – RESULT HEADING ONLY, page-scoped and non-invasive
   Keeps current map position, metric values and AI Insights untouched.
   ============================================================== */
body.jax-v12-workspace-active .jax-results-dock .jax-result-title {
  font-size: 18px !important;
  font-weight: 650 !important;
  line-height: 1.28 !important;
  letter-spacing: -.015em !important;
}
body.jax-v12-workspace-active .jax-results-dock .jax-result-eyebrow {
  display:none !important;
}

/* JaxTwin desktop: pull the EXISTING 2D Analysis Results card 12px
   toward the map's left border. No resize or vertical position changes.
   Keep mobile and tablet unchanged. */
@media (min-width: 1025px) {
  body.jax-v12-workspace-active .jax-results-dock {
    margin-left: -12px !important;
  }
}
`,e=e=>{const o=t.React.useRef(null);return t.React.useEffect(()=>{const a=document.createElement("style");a.setAttribute("data-jax-v12-style","1.2.12"),a.textContent=r,document.head.appendChild(a);let t=!1;const e=a=>{a!==t&&(t=a,document.body.classList.toggle("jax-v12-workspace-active",t))},i=()=>{const a=o.current;if(!a)return void e(!1);const t=a.getBoundingClientRect(),r=window.getComputedStyle(a);e(t.width>0&&t.height>0&&t.bottom>0&&t.top<window.innerHeight&&"none"!==r.display&&"hidden"!==r.visibility)},n="undefined"!=typeof IntersectionObserver?new IntersectionObserver(a=>e(a.some(a=>a.isIntersecting))):null;return o.current&&(null==n||n.observe(o.current)),i(),window.addEventListener("resize",i),()=>{null==n||n.disconnect(),window.removeEventListener("resize",i),e(!1),a.remove()}},[]),(0,a.jsx)("div",{ref:o,className:"jax-v12-version-chip jimu-widget","aria-hidden":"true",style:{width:1,height:1,minWidth:1,minHeight:1,opacity:0,overflow:"hidden",pointerEvents:"none"}})};function n(a){o.p=a}})(),i})())}}});