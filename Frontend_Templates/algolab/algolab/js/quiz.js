/* quiz.js – ten multiple-choice questions with instant feedback. */
const QUESTIONS = [
 ['What is the worst-case time of quick sort with a poor pivot?', ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], 1, 'If every pivot is the smallest or largest value, the partitions are unbalanced and the work adds up to O(n²).'],
 ['Binary search requires the data to be…', ['Unique', 'Sorted', 'Stored in a linked list', 'Positive numbers'], 1, 'Discarding half the list is only valid when the order tells you which half can hold the target.'],
 ['Which principle does a stack follow?', ['FIFO', 'LIFO', 'Random access', 'Sorted order'], 1, 'Last in, first out: the newest item is removed first.'],
 ['A queue\'s dequeue operation removes the…', ['Back item', 'Largest item', 'Front item', 'Middle item'], 2, 'A queue is first in, first out, so the oldest (front) item leaves first.'],
 ['Inorder traversal of a binary search tree gives…', ['Values in sorted order', 'Level by level order', 'Root last', 'Random order'], 0, 'Left < node < right at every node, so left-node-right produces ascending order.'],
 ['Breadth-first search uses which data structure?', ['Stack', 'Queue', 'Heap', 'Hash set only'], 1, 'A queue makes you finish all nodes at one distance before moving further out.'],
 ['Plain recursive Fibonacci has what time complexity?', ['O(n)', 'O(log n)', 'Exponential', 'O(1)'], 2, 'Each call makes two more calls and the same values are recomputed, so the work grows exponentially.'],
 ['Inserting at the head of a singly linked list takes…', ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], 0, 'You only create a node and rewire the head pointer.'],
 ['Which sort is stable and always O(n log n)?', ['Quick sort', 'Selection sort', 'Merge sort', 'Bubble sort'], 2, 'Merge sort splits evenly every time and keeps equal values in their original order.'],
 ['Memoized Fibonacci runs in…', ['O(n)', 'O(2ⁿ)', 'O(n²)', 'O(log n)'], 0, 'Each value from 0 to n is computed once and then reused from the cache.']
];
(function () {
  let q = 0, score = 0; const box = document.getElementById('quiz');
  function show() {
    if (q >= QUESTIONS.length) { box.innerHTML = `<h2>Your score: ${score} / ${QUESTIONS.length}</h2><p class="lead">${score >= 8 ? 'Excellent work!' : score >= 5 ? 'Good progress. Revisit the topics you missed.' : 'Keep practising with the visualizers, then try again.'}</p><button id="again">Try again</button>`; document.getElementById('again').onclick = () => { q = 0; score = 0; show(); }; return; }
    const [t, o, a, why] = QUESTIONS[q];
    box.innerHTML = `<p class="note">Question ${q + 1} of ${QUESTIONS.length}</p><h2>${t}</h2><div class="opts">${o.map((x, n) => `<button data-n="${n}">${x}</button>`).join('')}</div><p id="why" class="note"></p><button id="nx" hidden>${q === QUESTIONS.length - 1 ? 'See score' : 'Next question'}</button>`;
    box.querySelector('.opts').onclick = e => {
      if (e.target.dataset.n === undefined || box.querySelector('.good,.wrong')) return;
      const n = +e.target.dataset.n; if (n === a) score++;
      box.querySelectorAll('.opts button').forEach((b, k) => { if (k === a) b.classList.add('good'); else if (k === n) b.classList.add('wrong'); });
      document.getElementById('why').textContent = (n === a ? 'Correct! ' : 'Not quite. ') + why; document.getElementById('nx').hidden = false;
      document.getElementById('nx').onclick = () => { q++; show(); };
    };
  }
  show();
})();
