# AlgoLab – interactive DSA visualizer

Open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari). No install, build step or internet needed.

## Pages
index (home) · sorting · searching · stack-queue · linked-list · binary-tree · graph · recursion-dp · problem-solver · quiz · help

## Structure
- `css/styles.css` – design tokens, layout, 3D stage, node states, responsive rules
- `js/site.js` – list of pages, navigation, footer
- `js/algorithms.js` – each algorithm turns an input into "frames" (nodes, edges, highlighted code line, message)
- `js/engine.js` – shared player: render frames in 3D, controls, drag-to-rotate, code panel
- `js/quiz.js` – quiz questions and logic
- `assets/favicon.svg`

## Add an algorithm
1. Add an object to the right array in `ALGOS` (`name`, `input`, `code`, `why`, `use`, `cx`, `tip`, `run`).
2. `run(input, param)` returns frames: `{n:[{id,t,x,y,w,h,s,g}], e:[[fromId,toId]], l:lineIndex, m:message}`.
3. Nothing else is needed: the engine draws, animates and highlights it.

## Notes
All code is original and dependency-free. Algorithms were checked by script on 190 runs (all sorts produce sorted output; code-line indexes are valid; traversal, BFS/DFS, Fibonacci, Kadane and Two Sum results verified).
Accessibility: keyboard-focusable controls, live message region, reduced-motion support.
