<<<<<<< HEAD
import html2pdf from 'html2pdf.js';
// ==========================================

// 1. CSS STYLES (Updated)
// ==========================================
const styles = `
  :root {
      --sidebar-width: 280px;
      --primary: #2c3e50;
      --accent: #2980b9;
      --danger: #e74c3c;
      --bg-color: #525659;
      --page-padding: 20mm;
      --num-col-width: 40px;
      
      /* New Paper Variables (Default A4) */
      --paper-width: 210mm;
      --paper-height: 297mm;
      --paper-gap: 10mm;
  }

  body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; overflow: hidden; height: 100vh; background-color: var(--bg-color); }
  * { box-sizing: border-box; }

  /* ... (Keep Layout, Sidebar, Sidebar Controls as they were) ... */
  
  .app-layout { display: flex; height: 100vh; width: 100vw; }
  .sidebar { width: var(--sidebar-width); background: #fff; color: #333; display: flex; flex-direction: column; padding: 20px; border-right: 1px solid #ccc; transition: margin-left 0.3s; z-index: 100; overflow-y: auto; }
  .sidebar.closed { margin-left: calc(-1 * var(--sidebar-width)); }
  .sidebar h2 { margin-top: 0; font-size: 18px; color: var(--primary); border-bottom: 2px solid #eee; padding-bottom: 10px; }
  .control-group { margin-bottom: 20px; }
  .label { font-size: 12px; font-weight: 700; color: #666; text-transform: uppercase; margin-bottom: 5px; display: block; }
  input[type=range], select { width: 100%; padding: 5px; cursor: pointer; }
  .btn-pdf { width: 100%; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; background: var(--danger); color: white; margin-top: auto; }
  .btn-pdf:hover { background: #c0392b; }
  .editor-area { flex-grow: 1; position: relative; display: flex; flex-direction: column; overflow: hidden; }
  .toggle-btn { position: absolute; top: 20px; left: 20px; z-index: 50; background: var(--primary); color: white; border: none; padding: 10px; cursor: pointer; border-radius: 4px; }
  .paper-viewport { 
      flex-grow: 1; 
      overflow: auto; /* Changed from overflow-y to auto (handles X and Y) */
      display: flex; 
      justify-content: center;
      padding: 50px 0; 
      background-color: var(--bg-color);
  }

  /* --- THE PHYSICAL PAPER (Updated Logic) --- */
  .paper-container {
      background-color: white;
      width: var(--paper-width);
      min-height: calc((var(--paper-height) + var(--paper-gap)) * 50); 
      padding: var(--page-padding);
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      position: relative;
      display: flex;
      flex-direction: column;
      background-repeat: repeat-y;
      
      /* --- ZOOM FIX START --- */
      transform-origin: top center; /* Pins paper to top when zooming */
      transition: transform 0.2s ease-out; /* Makes zoom smooth */
      /* --- ZOOM FIX END --- */
  }

  /* ... (Keep Content Styling, Question Blocks, etc. exactly as they were) ... */
  
  textarea, input[type="text"] { width: 100%; border: none; background: transparent; outline: none; font-family: inherit; font-size: inherit; font-weight: inherit; resize: none; overflow: hidden; line-height: 1.5; color: #333; padding: 0; margin: 0; }
  textarea:focus, input[type="text"]:focus { border-bottom: 1px solid var(--accent); background: rgba(41, 128, 185, 0.05); }
  .main-heading { font-size: 24px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px; display: block; width: 100%; }
  .sub-heading { font-size: 16px; color: #666; margin-bottom: 15px; font-weight: 500; display: block; width: 100%; }
  .divider { border-bottom: 2px solid var(--primary); margin-bottom: 25px; width: 100%; }
  .question-block { display: flex; gap: 10px; margin-bottom: 25px; position: relative; page-break-inside: avoid; }
  .q-num { font-weight: 900; width: var(--num-col-width); text-align: right; color: var(--primary); font-size: 16px; padding-top: 3px; flex-shrink: 0; }
  .q-content { flex-grow: 1; width: 100%; }
  .q-text { font-weight: 700; margin-bottom: 5px; font-size: 16px; min-height: 24px; }
  .a-text { border-left: 3px solid #eee; padding-left: 15px; color: #444; font-size: 15px; margin-bottom: 10px; min-height: 24px; }
  .q-toolbar { display: flex; align-items: center; gap: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px; border: 1px solid #eee; margin-top: 5px; width: fit-content; }
  .btn-icon { background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 600; color: #555; display: flex; align-items: center; gap: 4px; }
  .btn-icon:hover { color: #000; }
  .btn-delete { color: var(--danger); margin-left: 10px; }
  .img-wrapper { margin: 10px 0; position: relative; border: 1px solid #eee; padding: 5px; border-radius: 4px; display: inline-block; }
  .img-wrapper img { display: block; max-width: 100%; }
  .slider-box { margin-top: 5px; display: flex; align-items: center; gap: 5px; font-size: 11px; color: #666; }
  .paper-actions { margin-top: 30px; display: flex; gap: 10px; padding-top: 20px; border-top: 1px solid #eee; page-break-inside: avoid; }
  .btn-action { flex: 1; padding: 12px; cursor: pointer; font-weight: bold; border-radius: 6px; font-size: 14px; }
  .btn-add-q { background: white; border: 2px solid var(--accent); color: var(--accent); }
  .btn-add-q:hover { background: #ebf5fb; }
  .btn-add-break { background: white; border: 2px dashed #f39c12; color: #f39c12; }
  .btn-add-break:hover { background: #fef9e7; }
  .page-break-marker { border-top: 2px dashed #999; margin: 30px 0; text-align: center; position: relative; color: #777; font-size: 12px; font-weight: bold; letter-spacing: 1px; page-break-after: always; }
  .page-break-marker span { background: white; padding: 2px 8px; position: relative; top: -10px; border: 1px solid #ccc; border-radius: 4px; }
  .btn-del-break { position: absolute; right: 0; top: -12px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; }
  .answer-key { margin-top: 50px; border-top: 2px dashed #ccc; padding-top: 30px; page-break-before: always; }
  .ak-title { font-size: 20px; font-weight: 800; text-align: center; margin-bottom: 20px; text-transform: uppercase; color: var(--primary); }
  .ak-item { display: flex; gap: 15px; margin-bottom: 8px; border-bottom: 1px solid #f9f9f9; padding-bottom: 4px; font-size: 14px; }

  /* --- EXPORT MODE (Clean PDF) --- */
  body.exporting .sidebar, body.exporting .toggle-btn, body.exporting .q-toolbar, body.exporting .paper-actions, body.exporting .btn-del-break, body.exporting .slider-box { display: none !important; }
  
  body.exporting .paper-container { 
      transform: scale(1) !important; margin: 0; box-shadow: none; 
      background-image: none !important; /* Remove gray gap */
      width: 100%; 
      min-height: 0 !important; /* Reset 50 page height */
      height: auto;
      padding: var(--page-padding) !important;
  }
  body.exporting .page-break-marker { border: none; margin: 0; height: 0; }
  body.exporting .page-break-marker span { display: none; }
  .print-only { display: none; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: anywhere; width: 100%; }
  body.exporting textarea, body.exporting input[type="text"] { display: none !important; }
  body.exporting .print-only { display: block !important; }
`;

// Inject Styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// ==========================================
// 2. HTML STRUCTURE
// ==========================================
document.getElementById('app').innerHTML = `
<div class="app-layout">
    <div class="sidebar" id="sidebar">
        <h2>Editor Tools</h2>

        <div class="control-group">
            <span class="label">Paper Size</span>
            <select id="paperSizeSelect">
                <option value="a4">A4 (210mm x 297mm)</option>
                <option value="a3">A3 (297mm x 420mm)</option>
            </select>
        </div>

        <div class="control-group">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span class="label">Zoom</span>
                <span id="zoomValue" class="label" style="color:var(--accent);">100%</span>
            </div>
            <input type="range" id="zoomRange" min="25" max="200" value="100" step="5">
        </div>

        <div class="control-group">
            <span class="label">Font Size</span>
            <input type="range" id="fontRange" min="12" max="24" value="15">
        </div>
        <div class="control-group">
            <span class="label">Margins</span>
            <input type="range" id="marginRange" min="10" max="50" value="20">
        </div>
        <div class="control-group">
            <span class="label">Number Column Width</span>
            <input type="range" id="numWidthRange" min="20" max="100" value="40">
        </div>
        <div class="control-group">
            <span class="label">Header Alignment</span>
            <select id="alignSelect">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
            </select>
        </div>
        <div class="control-group">
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:14px;">
                <input type="checkbox" id="answerKeyCheck" checked style="width:auto;"> Include Answer Key
            </label>
        </div>

        <div style="flex-grow:1"></div>
        <button class="btn-main btn-pdf" id="btnExport">⬇ Export PDF</button>
    </div>

    <div class="editor-area">
        <button class="toggle-btn" id="btnToggleSidebar">☰</button>
        <div class="paper-viewport">
            <div id="paper" class="paper-container" style="font-size: 15px;">
                <div id="headerSection">
                    <input type="text" class="main-heading edit-only" value="QUANTITATIVE APTITUDE" oninput="syncText(this)">
                    <div class="main-heading print-only">QUANTITATIVE APTITUDE</div>
                    <input type="text" class="sub-heading edit-only" value="Topic: Time and Work" oninput="syncText(this)">
                    <div class="sub-heading print-only">Topic: Time and Work</div>
                    <div class="divider"></div>
                </div>
                <div id="contentList"></div>
                <div class="paper-actions">
                    <button class="btn-action btn-add-q" id="btnAdd">+ Add Question</button>
                    <button class="btn-action btn-add-break" id="btnBreak">--- Page Break ---</button>
                </div>
                <div id="answerKeySection" class="answer-key">
                    <div class="ak-title">Answer Key</div>
                    <div id="answerKeyList"></div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// ==========================================
// 3. APP LOGIC
// ==========================================
let blocks = [
  { id: Date.now(), type: 'question', num: 'Q1.', q: '', a: '', img: null, imgSize: 100 }
];

const contentList = document.getElementById('contentList');
const answerKeyList = document.getElementById('answerKeyList');
const akSection = document.getElementById('answerKeySection');

// --- RENDER ---
function render() {
  contentList.innerHTML = '';
  answerKeyList.innerHTML = '';

  blocks.forEach((block, index) => {
      // --- PAGE BREAK ---
      if (block.type === 'break') {
          const div = document.createElement('div');
          div.className = 'page-break-marker';
          div.innerHTML = `
            <span>MANUAL PAGE BREAK</span>
            <button class="btn-del-break" onclick="deleteBlock(${block.id})">×</button>
          `;
          contentList.appendChild(div);
          return;
      }

      // --- QUESTION ---
      const div = document.createElement('div');
      div.className = 'question-block';
      
      div.innerHTML = `
          <div class="q-num">
              <input type="text" class="edit-only" value="${block.num}" style="text-align:right; font-weight:900; color:#2c3e50;">
              <div class="print-only" style="text-align:right; font-weight:900;">${block.num}</div>
          </div>
          
          <div class="q-content">
              <textarea class="q-text edit-only" placeholder="Type question here...">${block.q}</textarea>
              <div class="q-text print-only">${block.q}</div>

              <textarea class="a-text edit-only" placeholder="Answer / Explanation...">${block.a}</textarea>
              <div class="a-text print-only">${block.a}</div>

              ${block.img ? `
                  <div class="img-wrapper">
                      <img src="${block.img}" style="width:${block.imgSize}%;">
                      <div class="slider-box">
                          <span>Size:</span>
                          <input type="range" class="img-slider" min="20" max="100" value="${block.imgSize}">
                      </div>
                  </div>
              ` : ''}

              <div class="q-toolbar">
                  <label class="btn-icon" style="cursor:pointer;">
                      📷 <span style="text-decoration:underline;">Image</span>
                      <input type="file" class="img-upload" style="display:none;">
                  </label>
                  <div style="width:1px; height:15px; background:#ddd; margin:0 5px;"></div>
                  <button class="btn-icon btn-up">⬆ Up</button>
                  <button class="btn-icon btn-down">⬇ Down</button>
                  <div style="flex-grow:1;"></div>
                  <button class="btn-icon btn-delete">🗑 Delete</button>
              </div>
          </div>
      `;

      // --- EVENT LISTENERS ---
      // Sync Inputs & Resize
      const qInput = div.querySelector('.q-text.edit-only');
      qInput.oninput = (e) => { updateBlock(block.id, 'q', e.target.value); autoResize(e.target); syncText(e.target); };
      
      const aInput = div.querySelector('.a-text.edit-only');
      aInput.oninput = (e) => { updateBlock(block.id, 'a', e.target.value); autoResize(e.target); syncText(e.target); };
      
      div.querySelector('.q-num input').oninput = (e) => { updateBlock(block.id, 'num', e.target.value); syncText(e.target); };

      // Image
      div.querySelector('.img-upload').onchange = (e) => uploadImage(block.id, e.target);
      const slider = div.querySelector('.img-slider');
      if(slider) slider.oninput = (e) => { updateBlock(block.id, 'imgSize', e.target.value); render(); };

      // Buttons (Using window functions wrapper or direct logic)
      div.querySelector('.btn-up').onclick = () => moveBlock(index, -1);
      div.querySelector('.btn-down').onclick = () => moveBlock(index, 1);
      div.querySelector('.btn-delete').onclick = () => deleteBlock(block.id);

      contentList.appendChild(div);

      // Add to Answer Key
      if (document.getElementById('answerKeyCheck').checked) {
          const akItem = document.createElement('div');
          akItem.className = 'ak-item';
          akItem.innerHTML = `
              <div style="font-weight:bold; min-width:30px;">${block.num}</div>
              <div>${block.a || '<span style="color:#ccc;">No answer provided</span>'}</div>
          `;
          answerKeyList.appendChild(akItem);
      }
  });

  // Init textareas
  document.querySelectorAll('textarea').forEach(autoResize);
}

// --- LOGIC HELPERS ---
window.syncText = function(el) {
    const sibling = el.nextElementSibling;
    if (sibling && sibling.classList.contains('print-only')) sibling.innerText = el.value;
};

window.addQuestion = function() {
    // Count only questions for numbering
    const qCount = blocks.filter(b => b.type === 'question').length;
    blocks.push({ id: Date.now(), type: 'question', num: `Q${qCount + 1}.`, q: '', a: '', img: null, imgSize: 100 });
    render();
};

window.addPageBreak = function() {
    blocks.push({ id: Date.now(), type: 'break' });
    render();
};

window.deleteBlock = function(id) {
    blocks = blocks.filter(b => b.id !== id);
    render();
};

window.moveBlock = function(index, dir) {
    const target = index + dir;
    if (target >= 0 && target < blocks.length) {
        [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
        render();
    }
};

window.updateBlock = function(id, field, value) {
    const b = blocks.find(item => item.id === id);
    if (b) b[field] = value;
};

window.uploadImage = function(id, input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            blocks.find(item => item.id === id).img = e.target.result;
            render();
        }
        reader.readAsDataURL(input.files[0]);
    }
};

window.autoResize = function(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
};

// --- BINDINGS ---
document.getElementById('btnAdd').onclick = window.addQuestion;
document.getElementById('btnBreak').onclick = window.addPageBreak;

// Sidebar Controls
document.getElementById('zoomRange').oninput = function() { 
    const val = this.value;
    // Update the visual text
    document.getElementById('zoomValue').innerText = val + "%";
    
    // Apply the scale
    document.getElementById('paper').style.transform = `scale(${val / 100})`; 
};
document.getElementById('fontRange').oninput = function() { 
    document.getElementById('paper').style.fontSize = `${this.value}px`; 
};
document.getElementById('marginRange').oninput = function() { 
    document.documentElement.style.setProperty('--page-padding', `${this.value}mm`);
};
document.getElementById('numWidthRange').oninput = function() { 
    document.documentElement.style.setProperty('--num-col-width', `${this.value}px`);
};
document.getElementById('alignSelect').onchange = function() {
    const val = this.value;
    document.getElementById('headerSection').style.textAlign = val;
    document.querySelectorAll('.main-heading, .sub-heading').forEach(el => el.style.textAlign = val);
};
document.getElementById('answerKeyCheck').onchange = function() {
    akSection.style.display = this.checked ? 'block' : 'none';
    render();
};
document.getElementById('btnToggleSidebar').onclick = function() { 
    document.getElementById('sidebar').classList.toggle('closed'); 
};

// --- PDF EXPORT ---
document.getElementById('btnExport').onclick = function() {
    document.body.classList.add('exporting');
    document.querySelectorAll('textarea, input.edit-only').forEach(el => syncText(el));

    const element = document.getElementById('paper');
    
    const opt = {
        margin: 0, // Handled by CSS padding
        filename: 'CRT_Document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        // CSS mode respects the 'page-break-after: always' property
        pagebreak: { mode: ['css', 'legacy'] }
    };

    // Reset Visuals
    const oldTransform = element.style.transform;
    element.style.transform = 'scale(1)';

    html2pdf().set(opt).from(element).save().then(() => {
        document.body.classList.remove('exporting');
        element.style.transform = oldTransform;
    });
};

// Init
=======
import html2pdf from 'html2pdf.js';
// ==========================================

// 1. CSS STYLES (Updated)
// ==========================================
const styles = `
  :root {
      --sidebar-width: 280px;
      --primary: #2c3e50;
      --accent: #2980b9;
      --danger: #e74c3c;
      --bg-color: #525659;
      --page-padding: 20mm;
      --num-col-width: 40px;
      
      /* New Paper Variables (Default A4) */
      --paper-width: 210mm;
      --paper-height: 297mm;
      --paper-gap: 10mm;
  }

  body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; overflow: hidden; height: 100vh; background-color: var(--bg-color); }
  * { box-sizing: border-box; }

  /* ... (Keep Layout, Sidebar, Sidebar Controls as they were) ... */
  
  .app-layout { display: flex; height: 100vh; width: 100vw; }
  .sidebar { width: var(--sidebar-width); background: #fff; color: #333; display: flex; flex-direction: column; padding: 20px; border-right: 1px solid #ccc; transition: margin-left 0.3s; z-index: 100; overflow-y: auto; }
  .sidebar.closed { margin-left: calc(-1 * var(--sidebar-width)); }
  .sidebar h2 { margin-top: 0; font-size: 18px; color: var(--primary); border-bottom: 2px solid #eee; padding-bottom: 10px; }
  .control-group { margin-bottom: 20px; }
  .label { font-size: 12px; font-weight: 700; color: #666; text-transform: uppercase; margin-bottom: 5px; display: block; }
  input[type=range], select { width: 100%; padding: 5px; cursor: pointer; }
  .btn-pdf { width: 100%; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; background: var(--danger); color: white; margin-top: auto; }
  .btn-pdf:hover { background: #c0392b; }
  .editor-area { flex-grow: 1; position: relative; display: flex; flex-direction: column; overflow: hidden; }
  .toggle-btn { position: absolute; top: 20px; left: 20px; z-index: 50; background: var(--primary); color: white; border: none; padding: 10px; cursor: pointer; border-radius: 4px; }
  .paper-viewport { 
      flex-grow: 1; 
      overflow: auto; /* Changed from overflow-y to auto (handles X and Y) */
      display: flex; 
      justify-content: center;
      padding: 50px 0; 
      background-color: var(--bg-color);
  }

  /* --- THE PHYSICAL PAPER (Updated Logic) --- */
  .paper-container {
      background-color: white;
      width: var(--paper-width);
      min-height: calc((var(--paper-height) + var(--paper-gap)) * 50); 
      padding: var(--page-padding);
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      position: relative;
      display: flex;
      flex-direction: column;
      background-repeat: repeat-y;
      
      /* --- ZOOM FIX START --- */
      transform-origin: top center; /* Pins paper to top when zooming */
      transition: transform 0.2s ease-out; /* Makes zoom smooth */
      /* --- ZOOM FIX END --- */
  }

  /* ... (Keep Content Styling, Question Blocks, etc. exactly as they were) ... */
  
  textarea, input[type="text"] { width: 100%; border: none; background: transparent; outline: none; font-family: inherit; font-size: inherit; font-weight: inherit; resize: none; overflow: hidden; line-height: 1.5; color: #333; padding: 0; margin: 0; }
  textarea:focus, input[type="text"]:focus { border-bottom: 1px solid var(--accent); background: rgba(41, 128, 185, 0.05); }
  .main-heading { font-size: 24px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px; display: block; width: 100%; }
  .sub-heading { font-size: 16px; color: #666; margin-bottom: 15px; font-weight: 500; display: block; width: 100%; }
  .divider { border-bottom: 2px solid var(--primary); margin-bottom: 25px; width: 100%; }
  .question-block { display: flex; gap: 10px; margin-bottom: 25px; position: relative; page-break-inside: avoid; }
  .q-num { font-weight: 900; width: var(--num-col-width); text-align: right; color: var(--primary); font-size: 16px; padding-top: 3px; flex-shrink: 0; }
  .q-content { flex-grow: 1; width: 100%; }
  .q-text { font-weight: 700; margin-bottom: 5px; font-size: 16px; min-height: 24px; }
  .a-text { border-left: 3px solid #eee; padding-left: 15px; color: #444; font-size: 15px; margin-bottom: 10px; min-height: 24px; }
  .q-toolbar { display: flex; align-items: center; gap: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px; border: 1px solid #eee; margin-top: 5px; width: fit-content; }
  .btn-icon { background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 600; color: #555; display: flex; align-items: center; gap: 4px; }
  .btn-icon:hover { color: #000; }
  .btn-delete { color: var(--danger); margin-left: 10px; }
  .img-wrapper { margin: 10px 0; position: relative; border: 1px solid #eee; padding: 5px; border-radius: 4px; display: inline-block; }
  .img-wrapper img { display: block; max-width: 100%; }
  .slider-box { margin-top: 5px; display: flex; align-items: center; gap: 5px; font-size: 11px; color: #666; }
  .paper-actions { margin-top: 30px; display: flex; gap: 10px; padding-top: 20px; border-top: 1px solid #eee; page-break-inside: avoid; }
  .btn-action { flex: 1; padding: 12px; cursor: pointer; font-weight: bold; border-radius: 6px; font-size: 14px; }
  .btn-add-q { background: white; border: 2px solid var(--accent); color: var(--accent); }
  .btn-add-q:hover { background: #ebf5fb; }
  .btn-add-break { background: white; border: 2px dashed #f39c12; color: #f39c12; }
  .btn-add-break:hover { background: #fef9e7; }
  .page-break-marker { border-top: 2px dashed #999; margin: 30px 0; text-align: center; position: relative; color: #777; font-size: 12px; font-weight: bold; letter-spacing: 1px; page-break-after: always; }
  .page-break-marker span { background: white; padding: 2px 8px; position: relative; top: -10px; border: 1px solid #ccc; border-radius: 4px; }
  .btn-del-break { position: absolute; right: 0; top: -12px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; }
  .answer-key { margin-top: 50px; border-top: 2px dashed #ccc; padding-top: 30px; page-break-before: always; }
  .ak-title { font-size: 20px; font-weight: 800; text-align: center; margin-bottom: 20px; text-transform: uppercase; color: var(--primary); }
  .ak-item { display: flex; gap: 15px; margin-bottom: 8px; border-bottom: 1px solid #f9f9f9; padding-bottom: 4px; font-size: 14px; }

  /* --- EXPORT MODE (Clean PDF) --- */
  body.exporting .sidebar, body.exporting .toggle-btn, body.exporting .q-toolbar, body.exporting .paper-actions, body.exporting .btn-del-break, body.exporting .slider-box { display: none !important; }
  
  body.exporting .paper-container { 
      transform: scale(1) !important; margin: 0; box-shadow: none; 
      background-image: none !important; /* Remove gray gap */
      width: 100%; 
      min-height: 0 !important; /* Reset 50 page height */
      height: auto;
      padding: var(--page-padding) !important;
  }
  body.exporting .page-break-marker { border: none; margin: 0; height: 0; }
  body.exporting .page-break-marker span { display: none; }
  .print-only { display: none; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: anywhere; width: 100%; }
  body.exporting textarea, body.exporting input[type="text"] { display: none !important; }
  body.exporting .print-only { display: block !important; }
`;

// Inject Styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// ==========================================
// 2. HTML STRUCTURE
// ==========================================
document.getElementById('app').innerHTML = `
<div class="app-layout">
    <div class="sidebar" id="sidebar">
        <h2>Editor Tools</h2>

        <div class="control-group">
            <span class="label">Paper Size</span>
            <select id="paperSizeSelect">
                <option value="a4">A4 (210mm x 297mm)</option>
                <option value="a3">A3 (297mm x 420mm)</option>
            </select>
        </div>

        <div class="control-group">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span class="label">Zoom</span>
                <span id="zoomValue" class="label" style="color:var(--accent);">100%</span>
            </div>
            <input type="range" id="zoomRange" min="25" max="200" value="100" step="5">
        </div>

        <div class="control-group">
            <span class="label">Font Size</span>
            <input type="range" id="fontRange" min="12" max="24" value="15">
        </div>
        <div class="control-group">
            <span class="label">Margins</span>
            <input type="range" id="marginRange" min="10" max="50" value="20">
        </div>
        <div class="control-group">
            <span class="label">Number Column Width</span>
            <input type="range" id="numWidthRange" min="20" max="100" value="40">
        </div>
        <div class="control-group">
            <span class="label">Header Alignment</span>
            <select id="alignSelect">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
            </select>
        </div>
        <div class="control-group">
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:14px;">
                <input type="checkbox" id="answerKeyCheck" checked style="width:auto;"> Include Answer Key
            </label>
        </div>

        <div style="flex-grow:1"></div>
        <button class="btn-main btn-pdf" id="btnExport">⬇ Export PDF</button>
    </div>

    <div class="editor-area">
        <button class="toggle-btn" id="btnToggleSidebar">☰</button>
        <div class="paper-viewport">
            <div id="paper" class="paper-container" style="font-size: 15px;">
                <div id="headerSection">
                    <input type="text" class="main-heading edit-only" value="QUANTITATIVE APTITUDE" oninput="syncText(this)">
                    <div class="main-heading print-only">QUANTITATIVE APTITUDE</div>
                    <input type="text" class="sub-heading edit-only" value="Topic: Time and Work" oninput="syncText(this)">
                    <div class="sub-heading print-only">Topic: Time and Work</div>
                    <div class="divider"></div>
                </div>
                <div id="contentList"></div>
                <div class="paper-actions">
                    <button class="btn-action btn-add-q" id="btnAdd">+ Add Question</button>
                    <button class="btn-action btn-add-break" id="btnBreak">--- Page Break ---</button>
                </div>
                <div id="answerKeySection" class="answer-key">
                    <div class="ak-title">Answer Key</div>
                    <div id="answerKeyList"></div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// ==========================================
// 3. APP LOGIC
// ==========================================
let blocks = [
  { id: Date.now(), type: 'question', num: 'Q1.', q: '', a: '', img: null, imgSize: 100 }
];

const contentList = document.getElementById('contentList');
const answerKeyList = document.getElementById('answerKeyList');
const akSection = document.getElementById('answerKeySection');

// --- RENDER ---
function render() {
  contentList.innerHTML = '';
  answerKeyList.innerHTML = '';

  blocks.forEach((block, index) => {
      // --- PAGE BREAK ---
      if (block.type === 'break') {
          const div = document.createElement('div');
          div.className = 'page-break-marker';
          div.innerHTML = `
            <span>MANUAL PAGE BREAK</span>
            <button class="btn-del-break" onclick="deleteBlock(${block.id})">×</button>
          `;
          contentList.appendChild(div);
          return;
      }

      // --- QUESTION ---
      const div = document.createElement('div');
      div.className = 'question-block';
      
      div.innerHTML = `
          <div class="q-num">
              <input type="text" class="edit-only" value="${block.num}" style="text-align:right; font-weight:900; color:#2c3e50;">
              <div class="print-only" style="text-align:right; font-weight:900;">${block.num}</div>
          </div>
          
          <div class="q-content">
              <textarea class="q-text edit-only" placeholder="Type question here...">${block.q}</textarea>
              <div class="q-text print-only">${block.q}</div>

              <textarea class="a-text edit-only" placeholder="Answer / Explanation...">${block.a}</textarea>
              <div class="a-text print-only">${block.a}</div>

              ${block.img ? `
                  <div class="img-wrapper">
                      <img src="${block.img}" style="width:${block.imgSize}%;">
                      <div class="slider-box">
                          <span>Size:</span>
                          <input type="range" class="img-slider" min="20" max="100" value="${block.imgSize}">
                      </div>
                  </div>
              ` : ''}

              <div class="q-toolbar">
                  <label class="btn-icon" style="cursor:pointer;">
                      📷 <span style="text-decoration:underline;">Image</span>
                      <input type="file" class="img-upload" style="display:none;">
                  </label>
                  <div style="width:1px; height:15px; background:#ddd; margin:0 5px;"></div>
                  <button class="btn-icon btn-up">⬆ Up</button>
                  <button class="btn-icon btn-down">⬇ Down</button>
                  <div style="flex-grow:1;"></div>
                  <button class="btn-icon btn-delete">🗑 Delete</button>
              </div>
          </div>
      `;

      // --- EVENT LISTENERS ---
      // Sync Inputs & Resize
      const qInput = div.querySelector('.q-text.edit-only');
      qInput.oninput = (e) => { updateBlock(block.id, 'q', e.target.value); autoResize(e.target); syncText(e.target); };
      
      const aInput = div.querySelector('.a-text.edit-only');
      aInput.oninput = (e) => { updateBlock(block.id, 'a', e.target.value); autoResize(e.target); syncText(e.target); };
      
      div.querySelector('.q-num input').oninput = (e) => { updateBlock(block.id, 'num', e.target.value); syncText(e.target); };

      // Image
      div.querySelector('.img-upload').onchange = (e) => uploadImage(block.id, e.target);
      const slider = div.querySelector('.img-slider');
      if(slider) slider.oninput = (e) => { updateBlock(block.id, 'imgSize', e.target.value); render(); };

      // Buttons (Using window functions wrapper or direct logic)
      div.querySelector('.btn-up').onclick = () => moveBlock(index, -1);
      div.querySelector('.btn-down').onclick = () => moveBlock(index, 1);
      div.querySelector('.btn-delete').onclick = () => deleteBlock(block.id);

      contentList.appendChild(div);

      // Add to Answer Key
      if (document.getElementById('answerKeyCheck').checked) {
          const akItem = document.createElement('div');
          akItem.className = 'ak-item';
          akItem.innerHTML = `
              <div style="font-weight:bold; min-width:30px;">${block.num}</div>
              <div>${block.a || '<span style="color:#ccc;">No answer provided</span>'}</div>
          `;
          answerKeyList.appendChild(akItem);
      }
  });

  // Init textareas
  document.querySelectorAll('textarea').forEach(autoResize);
}

// --- LOGIC HELPERS ---
window.syncText = function(el) {
    const sibling = el.nextElementSibling;
    if (sibling && sibling.classList.contains('print-only')) sibling.innerText = el.value;
};

window.addQuestion = function() {
    // Count only questions for numbering
    const qCount = blocks.filter(b => b.type === 'question').length;
    blocks.push({ id: Date.now(), type: 'question', num: `Q${qCount + 1}.`, q: '', a: '', img: null, imgSize: 100 });
    render();
};

window.addPageBreak = function() {
    blocks.push({ id: Date.now(), type: 'break' });
    render();
};

window.deleteBlock = function(id) {
    blocks = blocks.filter(b => b.id !== id);
    render();
};

window.moveBlock = function(index, dir) {
    const target = index + dir;
    if (target >= 0 && target < blocks.length) {
        [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
        render();
    }
};

window.updateBlock = function(id, field, value) {
    const b = blocks.find(item => item.id === id);
    if (b) b[field] = value;
};

window.uploadImage = function(id, input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            blocks.find(item => item.id === id).img = e.target.result;
            render();
        }
        reader.readAsDataURL(input.files[0]);
    }
};

window.autoResize = function(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
};

// --- BINDINGS ---
document.getElementById('btnAdd').onclick = window.addQuestion;
document.getElementById('btnBreak').onclick = window.addPageBreak;

// Sidebar Controls
document.getElementById('zoomRange').oninput = function() { 
    const val = this.value;
    // Update the visual text
    document.getElementById('zoomValue').innerText = val + "%";
    
    // Apply the scale
    document.getElementById('paper').style.transform = `scale(${val / 100})`; 
};
document.getElementById('fontRange').oninput = function() { 
    document.getElementById('paper').style.fontSize = `${this.value}px`; 
};
document.getElementById('marginRange').oninput = function() { 
    document.documentElement.style.setProperty('--page-padding', `${this.value}mm`);
};
document.getElementById('numWidthRange').oninput = function() { 
    document.documentElement.style.setProperty('--num-col-width', `${this.value}px`);
};
document.getElementById('alignSelect').onchange = function() {
    const val = this.value;
    document.getElementById('headerSection').style.textAlign = val;
    document.querySelectorAll('.main-heading, .sub-heading').forEach(el => el.style.textAlign = val);
};
document.getElementById('answerKeyCheck').onchange = function() {
    akSection.style.display = this.checked ? 'block' : 'none';
    render();
};
document.getElementById('btnToggleSidebar').onclick = function() { 
    document.getElementById('sidebar').classList.toggle('closed'); 
};

// --- PDF EXPORT ---
document.getElementById('btnExport').onclick = function() {
    document.body.classList.add('exporting');
    document.querySelectorAll('textarea, input.edit-only').forEach(el => syncText(el));

    const element = document.getElementById('paper');
    
    const opt = {
        margin: 0, // Handled by CSS padding
        filename: 'CRT_Document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        // CSS mode respects the 'page-break-after: always' property
        pagebreak: { mode: ['css', 'legacy'] }
    };

    // Reset Visuals
    const oldTransform = element.style.transform;
    element.style.transform = 'scale(1)';

    html2pdf().set(opt).from(element).save().then(() => {
        document.body.classList.remove('exporting');
        element.style.transform = oldTransform;
    });
};

// Init
>>>>>>> 62af397df696e92d011d1f9784ea7a3079a50eeb
render();