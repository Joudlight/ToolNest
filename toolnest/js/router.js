/* =====================================================
   router.js — SEO URL routing with history.pushState
   Each tool gets its own shareable, indexable URL.
   ===================================================== */

const TOOL_META = {
  tasks:        { title: 'Free Task Manager Online — ToolNest',                   description: 'Organize your daily tasks in your browser. No account needed. Free task manager with priority, categories, due dates and progress tracking.' },
  keyboard:     { title: 'Free Arabic Keyboard Online — Type & Copy Arabic Text | ToolNest', description: 'Type Arabic text in your browser without an Arabic keyboard. Includes diacritics, punctuation, and direct Google/YouTube search in Arabic.' },
  dua:          { title: "Islamic Daily Du'a & Athkar — Morning, Evening, Sleep, Travel | ToolNest", description: "Browse authentic Islamic supplications (Du'a) for morning, evening, before sleep, protection, meals and travel. Arabic text, transliteration and translation included." },
  sudoku:       { title: 'Free Online Sudoku — Easy, Medium, Hard & Expert | ToolNest', description: 'Play classic Sudoku with multiple difficulty levels. Features notes mode, hints, mistake counter, timer and auto-save. Free, no sign-up required.' },
  notes:        { title: 'Free Online Sticky Notes — Quick Notes in Your Browser | ToolNest', description: 'Create, colour-code and drag-to-reorder sticky notes saved in your browser. No account or download needed.' },
  tasbeeh:      { title: 'Free Tasbeeh Counter — Digital Dhikr Counter Online | ToolNest', description: 'Digital Tasbeeh (Misbaha) counter for daily dhikr and post-prayer remembrance. Track Subhanallah, Alhamdulillah and Allahu Akbar counts. Free, no app needed.' },
  wordfill:     { title: 'Fill The Word — Missing Letter Puzzle Game | ToolNest', description: 'Fill in the missing letters to complete the hidden word. Fun daily word puzzle game — no download, no sign-up.' },
  memorymatch:  { title: 'Memory Match Card Game — Brain Training | ToolNest',    description: 'Flip cards and match emoji pairs to sharpen your visual memory and concentration. Free online brain training game.' },
  speedmath:    { title: 'Speed Math — Mental Arithmetic Brain Trainer | ToolNest', description: 'Solve arithmetic problems against the clock. Boost your mental calculation speed with this free online math brain training game.' },
  numbermemory: { title: 'Number Memory Game — Test Your Short-Term Memory | ToolNest', description: 'Remember growing sequences of digits and test the limits of your short-term memory. Free online brain training game.' },
};

const BASE_TITLE = "ToolNest — Free Islamic & Productivity Tools Online | Arabic Keyboard, Du'a, Sudoku";
const BASE_DESC  = "Free online tools for everyday use: Arabic keyboard, daily Du'a & Athkar, Tasbeeh counter, Sudoku, memory games, task manager and more. No sign-up. Works on any phone.";

/* Push a URL when a tool opens */
function routerPush(toolId) {
  const meta = TOOL_META[toolId];
  if (!meta) return;
  const path = '/' + toolId;
  window.history.pushState({ tool: toolId }, meta.title, path);
  document.title = meta.title;
  setMetaDesc(meta.description);
}

/* Restore home URL when modal closes */
function routerHome() {
  window.history.pushState({}, BASE_TITLE, '/');
  document.title = BASE_TITLE;
  setMetaDesc(BASE_DESC);
}

function setMetaDesc(desc) {
  let el = document.querySelector('meta[name="description"]');
  if (el) el.setAttribute('content', desc);
}

/* Handle browser back/forward */
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.tool) {
    openTool(e.state.tool, false /* don't push again */);
  } else {
    closeModal(false /* don't push home again */);
  }
});

/* On first load: if URL has a tool path or ?tool= param, auto-open it */
window.addEventListener('DOMContentLoaded', () => {
  // Clean path: /sudoku → sudoku
  const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  // GitHub Pages fallback: ?tool=sudoku
  const params = new URLSearchParams(window.location.search);
  const toolParam = params.get('tool');
  const toolId = (path && TOOL_META[path]) ? path : (toolParam && TOOL_META[toolParam] ? toolParam : null);
  if (toolId) {
    // Clean up the URL to the nice form
    window.history.replaceState({ tool: toolId }, TOOL_META[toolId].title, '/' + toolId);
    openTool(toolId, false);
  }
});
