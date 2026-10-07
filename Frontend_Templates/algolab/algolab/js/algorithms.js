/* algorithms.js – every algorithm returns an array of "frames" for the player.
   frame = { n:[nodes], e:[[fromId,toId]], l:codeLineIndex, m:message }
   node  = { id, t:text, x, y, w, h, s:state, g:tag }  state: cmp | swap | sel | done | dim */
const nums = s => String(s).split(/[\s,]+/).filter(Boolean).map(Number);
const words = s => String(s).split(/[\s,]+/).filter(Boolean);
const bad = m => [{n:[], e:[], l:-1, m}];
const ints = (s, max = 14) => { const a = nums(s); return a.length && a.length <= max && a.every(x => Number.isInteger(x) && x >= 0 && x <= 999) ? a : null; };
const cx = (b, a, w, s) => [['Best', b], ['Average', a], ['Worst', w], ['Extra space', s]];
const rnd = (n = 8, m = 60) => () => Array.from({length:n}, () => 1 + Math.floor(Math.random() * m)).join(', ');
const ops = s => String(s).split(',').map(x => x.trim().split(/\s+/)).filter(x => x[0]).slice(0, 25);
const boxes = (v, st = {}, y = 0, tg = {}, p = '', sp = 56) => v.map((t, i) => ({id:p + i, t, x:i * sp, y, w:46, h:46, s:st[i] || '', g:tg[i] || ''}));
const barsOf = (a, st, mx) => a.map((v, i) => { const h = 24 + v / mx * 140; return {id:i, t:v, x:i * 48, y:190 - h, w:40, h, s:st[i] || ''}; });
const NUMERR = 'Enter 1–14 whole numbers (0–999) separated by commas.';

function layoutTree(root, sp = 54) {
  const pos = {}, E = []; let leaf = 0;
  (function go(n, d) {
    n.c.forEach(c => { E.push([n.id, c.id]); go(c, d + 1); });
    pos[n.id] = {x: n.c.length ? (pos[n.c[0].id].x + pos[n.c[n.c.length - 1].id].x) / 2 : leaf++ * sp, y: d * 64};
  })(root, 0);
  return {pos, E};
}

function sorter(body) {
  return s => {
    const a = ints(s); if (!a) return bad(NUMERR);
    const F = [], done = {}, mx = Math.max(1, ...a);
    const f = (st, l, m) => F.push({n:barsOf(a, {...done, ...st}, mx), e:[], l, m});
    body(a, f, done);
    a.forEach((_, k) => done[k] = 'done'); f({}, -1, `Sorted: ${a.join(', ')}`);
    return F;
  };
}

function treeRun(kind) {
  return s => {
    const v = words(s).slice(0, 15);
    const root = (function mk(i) { if (i >= v.length || v[i] === '-') return null; const l = mk(2*i+1), r = mk(2*i+2); return {id:i, t:v[i], l, r, c:[l, r].filter(Boolean)}; })(0);
    if (!root) return bad('Enter level-order values and use - for an empty child. Example: 50,30,70,20,40,60,80');
    const {pos, E} = layoutTree(root), txt = {}, st = {}, out = [], F = [];
    (function w(n) { txt[n.id] = n.t; n.c.forEach(w); })(root);
    const f = (l, m) => F.push({n:Object.keys(pos).map(id => ({id, t:txt[id], x:pos[id].x, y:pos[id].y, w:44, h:44, s:st[id] || ''})), e:E, l, m});
    if (kind === 'level') {
      const q = [root]; st[root.id] = 'sel'; f(0, `Queue starts with the root: [${q.map(x => x.t)}]`);
      while (q.length) {
        const n = q.shift(); st[n.id] = 'cmp'; f(2, `Dequeue ${n.t}.`);
        st[n.id] = 'done'; out.push(n.t); f(2, `Visit ${n.t}. Output so far: ${out.join(' → ')}`);
        [n.l, n.r].forEach(c => { if (c) { q.push(c); st[c.id] = 'sel'; } });
        f(3, `Enqueue its children. Queue: [${q.map(x => x.t)}]`);
      }
    } else {
      const ln = {pre:{V:2, L:3, R:4}, in:{L:2, V:3, R:4}, post:{L:2, R:3, V:4}}[kind], order = {pre:'VLR', in:'LVR', post:'LRV'}[kind];
      const visit = n => { st[n.id] = 'done'; out.push(n.t); f(ln.V, `Visit ${n.t}. Output so far: ${out.join(' → ')}`); };
      const go = n => {
        st[n.id] = 'cmp'; f(1, `Arrive at ${n.t}.`);
        for (const ch of order) {
          if (ch === 'V') { visit(n); continue; }
          const c = ch === 'L' ? n.l : n.r;
          if (c) { f(ln[ch], `Go ${ch === 'L' ? 'left' : 'right'} from ${n.t} to ${c.t}.`); go(c); }
        }
      };
      go(root);
    }
    f(-1, `Traversal result: ${out.join(', ')}`); return F;
  };
}

function graphRun(kind) {
  return (s, start) => {
    const E = words(s);
    if (!E.length || E.length > 18 || E.some(e => !/^\d{1,2}-\d{1,2}$/.test(e))) return bad('Enter edges like 0-1, 0-2, 1-3 (node numbers 0–99).');
    const pairs = E.map(e => e.split('-').map(Number)), ids = [...new Set(pairs.flat())].sort((a, b) => a - b);
    if (ids.length > 12) return bad('Use at most 12 nodes.');
    const adj = {}; ids.forEach(k => adj[k] = []);
    pairs.forEach(([a, b]) => { if (a !== b) { adj[a].push(b); adj[b].push(a); } });
    ids.forEach(k => adj[k] = [...new Set(adj[k])].sort((x, y) => x - y));
    const s0 = ids.includes(Number(start)) ? Number(start) : ids[0], pos = {}, st = {}, F = [], seen = new Set([s0]), order = [];
    ids.forEach((k, i) => { const t = 2 * Math.PI * i / ids.length - Math.PI / 2; pos[k] = {x:150 + 130 * Math.cos(t), y:130 + 120 * Math.sin(t)}; });
    const f = (l, m) => F.push({n:ids.map(k => ({id:k, t:k, x:pos[k].x, y:pos[k].y, w:42, h:42, s:st[k] || ''})), e:pairs.filter(([a, b]) => a !== b), l, m});
    if (kind === 'bfs') {
      const q = [s0]; st[s0] = 'sel'; f(0, `Start at ${s0}. Queue: [${q}]`);
      while (q.length) {
        const u = q.shift(); st[u] = 'cmp'; order.push(u); f(2, `Dequeue ${u}.`);
        for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); q.push(v); st[v] = 'sel'; f(4, `Discover ${v} from ${u}; enqueue it. Queue: [${q}]`); }
        st[u] = 'done'; f(1, `Finished ${u}.`);
      }
    } else {
      const go = u => {
        seen.add(u); st[u] = 'cmp'; order.push(u); f(1, `Visit ${u}.`);
        for (const v of adj[u]) if (!seen.has(v)) { f(3, `From ${u}, go deeper to ${v}.`); go(v); }
        st[u] = 'done'; f(2, `All neighbours of ${u} done. Backtrack.`);
      };
      go(s0);
    }
    f(-1, `${kind.toUpperCase()} visit order from ${s0}: ${order.join(', ')}`); return F;
  };
}

function fibTree(memoOn) {
  return n => {
    n = Math.floor(+n); if (!(n >= 0 && n <= 7)) return bad('Enter n between 0 and 7 (the tree grows very fast).');
    let id = 0, calls = 0; const ev = [], memo = {}, info = {};
    const call = k => {
      const nd = {id:id++, k, c:[]}; info[nd.id] = nd; ev.push(['in', nd]);
      if (memoOn && k in memo) { nd.v = memo[k]; ev.push(['hit', nd]); return nd; }
      if (k < 2) nd.v = k; else { const a = call(k - 1), b = call(k - 2); nd.c = [a, b]; nd.v = a.v + b.v; }
      if (memoOn) memo[k] = nd.v; ev.push(['out', nd]); return nd;
    };
    const root = call(n), {pos, E} = layoutTree(root, 80), vis = new Set(), st = {}, F = [];
    const f = (l, m) => F.push({n:[...vis].map(i => ({id:i, t:`f(${info[i].k})` + (st[i] === 'done' || st[i] === 'swap' ? '=' + info[i].v : ''), x:pos[i].x, y:pos[i].y, w:72, h:40, s:st[i]})), e:E.filter(([a, b]) => vis.has(a) && vis.has(b)), l, m});
    ev.forEach(([t, nd]) => {
      if (t === 'in') { vis.add(nd.id); st[nd.id] = 'cmp'; f(0, `Call #${++calls}: fib(${nd.k}).`); }
      else if (t === 'hit') { st[nd.id] = 'swap'; f(1, `fib(${nd.k}) is already in the memo: reuse ${nd.v}. No new calls.`); }
      else { st[nd.id] = 'done'; f(nd.k < 2 ? (memoOn ? 2 : 1) : (memoOn ? 3 : 2), `fib(${nd.k}) = ${nd.v}.`); }
    });
    f(-1, `fib(${n}) = ${root.v} using ${calls} function calls.`); return F;
  };
}

const ALGOS = {
sorting: [
 {name:'Bubble sort', input:'5, 2, 9, 1, 7, 3', rand:rnd(), cx:cx('O(n)','O(n²)','O(n²)','O(1)'),
  why:'Repeatedly compares neighbours and swaps them if they are in the wrong order. After each pass the largest remaining value "bubbles" to the end.',
  use:'Teaching and tiny lists. It is simple but slow for large inputs.', tip:'Stable: equal values keep their order.',
  code:['for i in range(n - 1):','    for j in range(n - 1 - i):','        if a[j] > a[j + 1]:','            a[j], a[j + 1] = a[j + 1], a[j]'],
  run:sorter((a, f, done) => { const n = a.length; f({}, 0, 'Start bubble sort.');
   for (let i = 0; i < n - 1; i++) { for (let j = 0; j < n - 1 - i; j++) {
     f({[j]:'cmp', [j+1]:'cmp'}, 2, `Compare ${a[j]} and ${a[j+1]}.`);
     if (a[j] > a[j+1]) { [a[j], a[j+1]] = [a[j+1], a[j]]; f({[j]:'swap', [j+1]:'swap'}, 3, 'Left value was larger, so swap them.'); } }
    done[n-1-i] = 'done'; f({}, 1, `${a[n-1-i]} is now in its final place.`); } })},
 {name:'Selection sort', input:'29, 10, 14, 37, 13', rand:rnd(), cx:cx('O(n²)','O(n²)','O(n²)','O(1)'),
  why:'Finds the smallest value in the unsorted part and swaps it to the front. The sorted part grows one item at a time.',
  use:'When swaps are expensive: it makes at most n − 1 swaps.', tip:'Not stable in its swap form.',
  code:['for i in range(n):','    m = i','    for j in range(i + 1, n):','        if a[j] < a[m]: m = j','    a[i], a[m] = a[m], a[i]'],
  run:sorter((a, f, done) => { const n = a.length; f({}, 0, 'Start selection sort.');
   for (let i = 0; i < n; i++) { let m = i; f({[i]:'sel'}, 1, `Assume index ${i} holds the minimum.`);
    for (let j = i + 1; j < n; j++) { f({[i]:'sel', [m]:'sel', [j]:'cmp'}, 3, `Compare ${a[j]} with the minimum ${a[m]}.`);
     if (a[j] < a[m]) { m = j; f({[i]:'sel', [m]:'sel'}, 3, `New minimum: ${a[m]}.`); } }
    if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; f({[i]:'swap', [m]:'swap'}, 4, 'Swap the minimum to the front of the unsorted part.'); }
    done[i] = 'done'; f({}, 4, `${a[i]} is fixed in place.`); } })},
 {name:'Insertion sort', input:'12, 11, 13, 5, 6', rand:rnd(), cx:cx('O(n)','O(n²)','O(n²)','O(1)'),
  why:'Builds a sorted prefix. Each new item slides left until it meets a value that is not larger.',
  use:'Small or nearly sorted lists. Many libraries use it for small chunks.', tip:'Stable and fast on almost-sorted data.',
  code:['for i in range(1, n):','    j = i','    while j > 0 and a[j - 1] > a[j]:','        a[j - 1], a[j] = a[j], a[j - 1]; j -= 1'],
  run:sorter((a, f, done) => { done[0] = 'done'; f({}, 0, 'The first item alone is a sorted prefix.');
   for (let i = 1; i < a.length; i++) { let j = i; f({[j]:'sel'}, 1, `Insert ${a[i]} into the sorted prefix.`);
    while (j > 0 && a[j-1] > a[j]) { f({[j-1]:'cmp', [j]:'cmp'}, 2, `${a[j-1]} > ${a[j]}: out of order.`); [a[j-1], a[j]] = [a[j], a[j-1]]; f({[j-1]:'swap', [j]:'swap'}, 3, 'Swap to move it one step left.'); j--; }
    done[i] = 'done'; f({}, 2, `The first ${i + 1} items are sorted.`); } })},
 {name:'Merge sort', input:'38, 27, 43, 3, 9, 82, 10', rand:rnd(), cx:cx('O(n log n)','O(n log n)','O(n log n)','O(n)'),
  why:'Divide and conquer: split the range in half, sort each half, then merge the two sorted halves by always writing the smaller front value.',
  use:'When you need guaranteed O(n log n) and stability, or are sorting linked lists.', tip:'Highlighted bars are the range being merged.',
  code:['def merge_sort(a, l, r):','    if l >= r: return','    m = (l + r) // 2','    merge_sort(a, l, m); merge_sort(a, m + 1, r)','    merge(a, l, m, r)   # write the smaller front value each time'],
  run:sorter((a, f) => { const n = a.length; f({}, 0, 'Start merge sort.');
   const ms = (l, r) => { if (l >= r) return; const m = (l + r) >> 1, rg = () => { const s = {}; for (let x = l; x <= r; x++) s[x] = 'cmp'; return s; };
    f(rg(), 3, `Split [${l}..${r}] at index ${m}.`); ms(l, m); ms(m + 1, r);
    const L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1); let i = 0, j = 0, k = l;
    while (i < L.length || j < R.length) { const left = j >= R.length || (i < L.length && L[i] <= R[j]); a[k] = left ? L[i++] : R[j++]; f({...rg(), [k]:'swap'}, 4, `Merge: write ${a[k]} into index ${k}.`); k++; } };
   ms(0, n - 1); })},
 {name:'Quick sort', input:'10, 80, 30, 90, 40, 50, 70', rand:rnd(), cx:cx('O(n log n)','O(n log n)','O(n²)','O(log n)'),
  why:'Picks a pivot (the last item), moves smaller values to its left and larger to its right, then sorts each side the same way.',
  use:'General-purpose sorting; fast in practice with good pivots.', tip:'Violet bar = pivot. Sorted/reversed input is the worst case with this pivot choice.',
  code:['def quick(a, lo, hi):','    if lo >= hi: return','    pivot = a[hi]; i = lo','    for j in range(lo, hi):','        if a[j] < pivot: swap(a, i, j); i += 1','    swap(a, i, hi)       # pivot to final place','    quick(a, lo, i - 1); quick(a, i + 1, hi)'],
  run:sorter((a, f, done) => { f({}, 0, 'Start quick sort.');
   const qs = (lo, hi) => { if (lo > hi) return; if (lo === hi) { done[lo] = 'done'; return; }
    const p = a[hi]; let i = lo; f({[hi]:'sel'}, 2, `Pivot = ${p} (last item of [${lo}..${hi}]).`);
    for (let j = lo; j < hi; j++) { f({[hi]:'sel', [j]:'cmp', [i]:'cmp'}, 4, `Is ${a[j]} < pivot ${p}?`);
     if (a[j] < p) { if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; f({[hi]:'sel', [i]:'swap', [j]:'swap'}, 4, 'Yes: swap it into the "smaller" zone.'); } i++; } }
    [a[i], a[hi]] = [a[hi], a[i]]; done[i] = 'done'; f({[i]:'swap'}, 5, `Pivot ${p} lands at index ${i}: its final position.`);
    qs(lo, i - 1); qs(i + 1, hi); };
   qs(0, a.length - 1); })}
],
searching: [
 {name:'Linear search', input:'14, 3, 27, 9, 21, 5', param:'Target', par:'9', rand:rnd(), cx:cx('O(1)','O(n)','O(n)','O(1)'),
  why:'Checks each item from the start until the target is found or the list ends.', use:'Unsorted or very small data.', tip:'Works on any list; no ordering needed.',
  code:['for i in range(n):','    if a[i] == target: return i','return -1'],
  run:(s, t) => { const a = ints(s); t = Number(t); if (!a || !Number.isFinite(t)) return bad('Enter numbers and a target number.');
   const F = [], f = (st, l, m) => F.push({n:boxes(a, st), e:[], l, m}); f({}, 0, `Looking for ${t}. Start at index 0.`);
   for (let i = 0; i < a.length; i++) { f({[i]:'cmp'}, 1, `a[${i}] = ${a[i]}. Is it ${t}?`); if (a[i] === t) { f({[i]:'done'}, 1, `Found ${t} at index ${i}. Return ${i}.`); return F; } }
   f({}, 2, `Every item checked: ${t} is not present. Return -1.`); return F; }},
 {name:'Binary search', input:'3, 8, 12, 19, 25, 31, 44', param:'Target', par:'25', rand:rnd(), cx:cx('O(1)','O(log n)','O(log n)','O(1)'),
  why:'On a sorted list, look at the middle. If the target is larger, discard the left half; if smaller, discard the right half. Repeat.', use:'Large sorted data. 1,000,000 items need only about 20 checks.', tip:'Your input is sorted first. Faded boxes are already eliminated.',
  code:['lo, hi = 0, n - 1','while lo <= hi:','    mid = (lo + hi) // 2','    if a[mid] == t: return mid','    elif a[mid] < t: lo = mid + 1','    else: hi = mid - 1','return -1'],
  run:(s, t) => { let a = ints(s); t = Number(t); if (!a || !Number.isFinite(t)) return bad('Enter numbers and a target number.'); a = a.sort((x, y) => x - y);
   const F = [], f = (lo, hi, mid, l, m, hit) => { const st = {}, tg = {}, T = (k, x) => { if (k >= 0 && k < a.length) tg[k] = tg[k] ? tg[k] + '/' + x : x; };
    a.forEach((_, k) => { if (k < lo || k > hi) st[k] = 'dim'; }); if (mid >= 0) st[mid] = hit ? 'done' : 'cmp'; if (lo <= hi) { T(lo, 'lo'); T(hi, 'hi'); } T(mid, 'mid');
    F.push({n:boxes(a, st, 0, tg), e:[], l, m}); };
   let lo = 0, hi = a.length - 1; f(lo, hi, -1, 0, `Sorted array. Search for ${t} between lo=0 and hi=${hi}.`);
   while (lo <= hi) { const mid = (lo + hi) >> 1; f(lo, hi, mid, 2, `mid = ${mid}, a[mid] = ${a[mid]}.`);
    if (a[mid] === t) { f(lo, hi, mid, 3, `a[mid] equals ${t}. Found at index ${mid}.`, 1); return F; }
    if (a[mid] < t) { lo = mid + 1; f(lo, hi, -1, 4, `${a[mid]} < ${t}: discard the left half. lo = ${lo}.`); }
    else { hi = mid - 1; f(lo, hi, -1, 5, `${a[mid]} > ${t}: discard the right half. hi = ${hi}.`); } }
   f(lo, hi, -1, 6, `lo passed hi: ${t} is not in the list. Return -1.`); return F; }}
],
'stack-queue': [
 {name:'Stack (LIFO)', input:'push 5, push 3, push 8, pop, peek, push 2, pop', cx:cx('O(1) push','O(1) pop','O(1) peek','O(n)'),
  why:'Last in, first out, like a pile of plates. Push adds to the top, pop removes from the top, peek looks without removing.', use:'Undo history, function calls, bracket matching, DFS.', tip:'Commands: push N, pop, peek (comma separated).',
  code:['stack.append(x)    # push(x)','stack.pop()        # pop()','stack[-1]          # peek()'],
  run:s => { const st = [], F = [], f = (h, l, m) => F.push({n:boxes(st, h, 0, {[st.length - 1]:'top'}), e:[], l, m}); f({}, 0, 'Empty stack. Last in, first out.');
   ops(s).forEach(([c, v]) => { c = c.toLowerCase();
    if (c === 'push' && v !== undefined) { if (st.length >= 12) return f({}, 0, 'Stack is full in this demo (12 items).'); st.push(v); f({[st.length-1]:'swap'}, 0, `push(${v}) places it on top.`); }
    else if (c === 'pop') { if (!st.length) f({}, 1, 'pop on an empty stack: underflow!'); else { f({[st.length-1]:'cmp'}, 1, `pop() removes the top item, ${st[st.length-1]}.`); st.pop(); f({}, 1, 'Removed.'); } }
    else if (c === 'peek') f(st.length ? {[st.length-1]:'sel'} : {}, 2, st.length ? `peek() reads ${st[st.length-1]} without removing it.` : 'peek on an empty stack: nothing to read.');
    else f({}, 0, `Unknown command "${c}". Use push N, pop or peek.`); }); return F; }},
 {name:'Queue (FIFO)', input:'enqueue 4, enqueue 7, enqueue 1, dequeue, enqueue 9, dequeue', cx:cx('O(1) enqueue','O(1) dequeue','O(1) peek','O(n)'),
  why:'First in, first out, like a line at a ticket counter. Enqueue joins the back; dequeue serves the front.', use:'Task scheduling, printers, BFS, buffering.', tip:'Commands: enqueue N, dequeue, peek.',
  code:['queue.append(x)    # enqueue(x)','queue.popleft()    # dequeue()','queue[0]           # peek()'],
  run:s => { const q = [], F = [], f = (h, l, m) => F.push({n:boxes(q, h, 0, q.length ? {0:'front', [q.length-1]:q.length > 1 ? 'back' : 'front'} : {}), e:[], l, m}); f({}, 0, 'Empty queue. First in, first out.');
   ops(s).forEach(([c, v]) => { c = c.toLowerCase();
    if (c === 'enqueue' && v !== undefined) { if (q.length >= 12) return f({}, 0, 'Queue is full in this demo (12 items).'); q.push(v); f({[q.length-1]:'swap'}, 0, `enqueue(${v}) joins the back of the line.`); }
    else if (c === 'dequeue') { if (!q.length) f({}, 1, 'dequeue on an empty queue: underflow!'); else { f({0:'cmp'}, 1, `dequeue() serves the front item, ${q[0]}.`); q.shift(); f({}, 1, 'Removed. Everyone moves forward.'); } }
    else if (c === 'peek') f(q.length ? {0:'sel'} : {}, 2, q.length ? `peek() reads the front item ${q[0]}.` : 'peek on an empty queue.');
    else f({}, 0, `Unknown command "${c}". Use enqueue N, dequeue or peek.`); }); return F; }}
],
'linked-list': [
 {name:'Singly linked list', input:'head 4, head 9, tail 7, find 7, delete 9, delete 5', arrows:true, cx:cx('O(1) at head','O(n) find / tail','O(n) delete','O(1)'),
  why:'Each node holds a value and a pointer to the next node. Inserting at the head only rewires one pointer; finding or deleting means walking the chain.', use:'Fast insert/remove at the front; when size changes a lot.', tip:'Commands: head N, tail N, delete N, find N.',
  code:['node = Node(v)','node.next = head; head = node          # insert at head','cur = head; while cur.next: cur = cur.next   # walk to tail','cur.next = node                       # insert at tail','while cur and cur.value != v: prev, cur = cur, cur.next   # delete: walk','prev.next = cur.next                  # unlink the node','while cur: (if cur.value == v: return cur); cur = cur.next   # find'],
  run:s => { const L = [], F = [], f = (st, l, m) => F.push({n:boxes(L, st, 0, L.length ? {0:'head'} : {}, '', 80), e:L.slice(1).map((_, i) => [i, i + 1]), l, m});
   f({}, 0, 'Empty list: head is None.');
   ops(s).forEach(([c, v]) => { c = c.toLowerCase(); v = Number(v); if (!Number.isFinite(v)) return f({}, 0, 'Each command needs a number, e.g. head 4.'); if (L.length >= 10 && (c === 'head' || c === 'tail')) return f({}, 0, 'List is full in this demo (10 nodes).');
    if (c === 'head') { L.unshift(v); f({0:'swap'}, 1, `New node ${v} points to the old head and becomes the head.`); }
    else if (c === 'tail') { for (let i = 0; i < L.length; i++) f({[i]:'cmp'}, 2, `Walk to the tail: at ${L[i]}.`); L.push(v); f({[L.length-1]:'swap'}, 3, L.length > 1 ? `The last node now links to the new node ${v}.` : `List was empty, so ${v} becomes the head.`); }
    else if (c === 'delete') { let i = 0; for (; i < L.length && L[i] !== v; i++) f({[i]:'cmp'}, 4, `${L[i]} is not ${v}; keep walking.`);
     if (i === L.length) f({}, 4, `${v} is not in the list. Nothing deleted.`); else { f({[i]:'swap'}, 5, `Found ${v}: link the previous node straight to the next one.`); L.splice(i, 1); f({}, 5, `${v} is unlinked.`); } }
    else if (c === 'find') { let i = 0; for (; i < L.length && L[i] !== v; i++) f({[i]:'cmp'}, 6, `${L[i]} is not ${v}; move to next.`); f(i < L.length ? {[i]:'done'} : {}, 6, i < L.length ? `Found ${v} at position ${i}.` : `${v} is not in the list.`); }
    else f({}, 0, `Unknown command "${c}". Use head, tail, delete or find.`); }); return F; }}
],
'binary-tree': [
 {name:'Inorder (Left, Node, Right)', input:'50, 30, 70, 20, 40, 60, 80', cx:cx('O(n)','O(n)','O(n)','O(h) stack'), run:treeRun('in'),
  why:'Visit the left subtree, then the node, then the right subtree. On a binary search tree this prints values in sorted order.', use:'Getting sorted output from a BST.', tip:'Enter values level by level; use - for a missing child.',
  code:['def inorder(node):','    if node is None: return','    inorder(node.left)','    visit(node)','    inorder(node.right)']},
 {name:'Preorder (Node, Left, Right)', input:'50, 30, 70, 20, 40, 60, 80', cx:cx('O(n)','O(n)','O(n)','O(h) stack'), run:treeRun('pre'),
  why:'Visit the node first, then the left and right subtrees. The output starts with the root.', use:'Copying a tree, saving its structure, prefix expressions.', tip:'Yellow = currently inside this node\'s call.',
  code:['def preorder(node):','    if node is None: return','    visit(node)','    preorder(node.left)','    preorder(node.right)']},
 {name:'Postorder (Left, Right, Node)', input:'50, 30, 70, 20, 40, 60, 80', cx:cx('O(n)','O(n)','O(n)','O(h) stack'), run:treeRun('post'),
  why:'Visit both subtrees first and the node last, so children are always handled before their parent.', use:'Deleting a tree, evaluating expression trees.', tip:'The root is always the last node visited.',
  code:['def postorder(node):','    if node is None: return','    postorder(node.left)','    postorder(node.right)','    visit(node)']},
 {name:'Level-order (BFS)', input:'50, 30, 70, 20, 40, 60, 80', cx:cx('O(n)','O(n)','O(n)','O(w) queue'), run:treeRun('level'),
  why:'Visit nodes row by row from the top using a queue: take a node, then add its children to the back.', use:'Shortest path in unweighted trees, printing by depth.', tip:'Violet nodes are waiting in the queue.',
  code:['queue = [root]','while queue:','    node = queue.pop(0); visit(node)','    queue += [node.left, node.right]  # skip None']}
],
graph: [
 {name:'Breadth-first search', input:'0-1, 0-2, 1-3, 2-3, 3-4, 4-5', param:'Start node', par:'0', cx:cx('O(V + E)','O(V + E)','O(V + E)','O(V)'), run:graphRun('bfs'),
  why:'Explore all neighbours of the start, then their neighbours, level by level, using a queue. It finds the fewest-edges path in unweighted graphs.', use:'Shortest path in unweighted graphs, social-network distance.', tip:'V = nodes, E = edges. Violet = discovered, yellow = being processed.',
  code:['queue = [s]; seen = {s}','while queue:','    u = queue.pop(0)','    for v in adj[u]:','        if v not in seen: seen.add(v); queue.append(v)']},
 {name:'Depth-first search', input:'0-1, 0-2, 1-3, 2-3, 3-4, 4-5', param:'Start node', par:'0', cx:cx('O(V + E)','O(V + E)','O(V + E)','O(V)'), run:graphRun('dfs'),
  why:'Go as deep as possible along one path, then backtrack to try the next. Recursion keeps the path on the call stack.', use:'Cycle detection, mazes, connected components, topological sort.', tip:'Yellow nodes are on the current path.',
  code:['def dfs(u):','    seen.add(u)','    for v in adj[u]:','        if v not in seen: dfs(v)']}
],
'recursion-dp': [
 {name:'Fibonacci: plain recursion', input:'5', cx:cx('O(2ⁿ) time','O(2ⁿ)','O(2ⁿ)','O(n) stack'), run:fibTree(false),
  why:'fib(n) = fib(n−1) + fib(n−2). The same values (like fib(2)) are recomputed again and again, so the number of calls explodes.', use:'Understanding why naive recursion can be exponential.', tip:'n is limited to 7 so the tree fits. Count the calls in the final message.',
  code:['def fib(n):','    if n < 2: return n','    return fib(n - 1) + fib(n - 2)']},
 {name:'Fibonacci: memoization', input:'5', cx:cx('O(n) time','O(n)','O(n)','O(n)'), run:fibTree(true),
  why:'Same recursion, but each answer is saved in a dictionary. Repeated calls become instant look-ups (coral nodes), cutting the tree to a single path plus cache hits.', use:'Top-down dynamic programming.', tip:'Compare the final call count with the plain version for the same n.',
  code:['def fib(n, memo={}):','    if n in memo: return memo[n]','    if n < 2: return n','    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)','    return memo[n]']},
 {name:'Fibonacci: DP table', input:'10', cx:cx('O(n) time','O(n)','O(n)','O(n)'),
  why:'Bottom-up: fill a table from the smallest sub-problem upward. Each cell uses the two cells before it. No recursion is needed.', use:'Bottom-up dynamic programming; easy to optimise to O(1) space.', tip:'Enter n from 0 to 12.',
  code:['dp = [0, 1]','for i in range(2, n + 1):','    dp[i] = dp[i - 1] + dp[i - 2]','return dp[n]'],
  run:n => { n = Math.floor(+n); if (!(n >= 0 && n <= 12)) return bad('Enter n between 0 and 12.');
   const dp = Array(n + 1).fill('?'), F = [], f = (st, l, m) => F.push({n:boxes(dp, st, 0, Object.fromEntries(dp.map((_, k) => [k, k]))), e:[], l, m});
   dp[0] = 0; if (n >= 1) dp[1] = 1; f({0:'done', ...(n >= 1 ? {1:'done'} : {})}, 0, 'Base cases: dp[0] = 0 and dp[1] = 1. Small numbers under each box are the index.');
   for (let i = 2; i <= n; i++) { dp[i] = dp[i-1] + dp[i-2]; f({[i]:'swap', [i-1]:'cmp', [i-2]:'cmp'}, 2, `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}.`); }
   f({[n]:'done'}, 3, `Answer: fib(${n}) = ${dp[n]}.`); return F; }}
],
'problem-solver': [
 {name:'Two Sum (hash map)', input:'2, 7, 11, 15, 3, 6', param:'Target', par:'9', cx:cx('O(n)','O(n)','O(n)','O(n)'),
  why:'Find two numbers that add up to the target. Instead of trying all pairs (O(n²)), remember each number seen so far; for every x, check whether target − x was already seen.', use:'Interview classic showing how a hash map trades memory for speed.', tip:'Brute force checks every pair; the hash map solves it in one pass.',
  code:['seen = {}','for i, x in enumerate(nums):','    if target - x in seen: return [seen[target - x], i]','    seen[x] = i'],
  run:(s, t) => { const a = ints(s); t = Number(t); if (!a || !Number.isFinite(t)) return bad('Enter numbers and a target number.');
   const F = [], seen = {}, f = (st, l, m) => F.push({n:boxes(a, st), e:[], l, m}); f({}, 0, `Find two numbers that add to ${t}. seen = {} (value: index).`);
   for (let i = 0; i < a.length; i++) { const need = t - a[i]; f({[i]:'cmp'}, 2, `x = ${a[i]}. Need ${t} − ${a[i]} = ${need}. Is ${need} in seen?`);
    if (need in seen) { f({[i]:'done', [seen[need]]:'done'}, 2, `Yes! Indices ${seen[need]} and ${i}: ${need} + ${a[i]} = ${t}.`); return F; }
    seen[a[i]] = i; f({[i]:'sel'}, 3, `Not yet. Remember ${a[i]} at index ${i}. seen = {${Object.entries(seen).map(([k, v]) => k + ':' + v).join(', ')}}`); }
   f({}, 1, 'No pair adds up to the target.'); return F; }},
 {name:'Valid Parentheses (stack)', input:'{[()]}', cx:cx('O(n)','O(n)','O(n)','O(n)'),
  why:'Every closing bracket must match the most recent unmatched opening bracket. That "most recent" rule is exactly what a stack gives you.', use:'Parsers, compilers, editors that match brackets.', tip:'Top row = input characters. Bottom row = the stack.',
  code:['stack = []; pairs = {")": "(", "]": "[", "}": "{"}','for ch in s:','    if ch in "([{": stack.append(ch)','    elif not stack or stack.pop() != pairs[ch]: return False','return not stack'],
  run:s => { s = String(s).replace(/\s/g, ''); if (!s || s.length > 16 || /[^()[\]{}]/.test(s)) return bad('Use 1–16 bracket characters: ( ) [ ] { }');
   const F = [], st = [], pairs = {')':'(', ']':'[', '}':'{'};
   const f = (i, state, l, m, ss = {}) => F.push({n:[...boxes([...s], i >= 0 ? {[i]:state} : {}, 0, {}, 'c'), ...boxes(st, ss, 90, {[st.length - 1]:'top'}, 's')], e:[], l, m}); f(-1, '', 0, 'Start with an empty stack.');
   for (let i = 0; i < s.length; i++) { const ch = s[i];
    if ('([{'.includes(ch)) { st.push(ch); f(i, 'swap', 2, `${ch} opens a bracket: push it.`, {[st.length-1]:'swap'}); }
    else { if (!st.length || st[st.length-1] !== pairs[ch]) { f(i, 'swap', 3, `${ch} has no matching opener on top of the stack. Invalid.`); return F; }
     f(i, 'cmp', 3, `${ch} matches ${st[st.length-1]}: pop it.`, {[st.length-1]:'cmp'}); st.pop(); f(i, 'done', 3, 'Matched and removed.'); } }
   f(-1, '', 4, st.length ? `Unclosed brackets remain: ${st.join(' ')}. Invalid.` : 'Stack is empty: all brackets matched. Valid!'); return F; }},
 {name:'Maximum Subarray (Kadane)', input:'-2, 1, -3, 4, -1, 2, 1, -5, 4', cx:cx('O(n)','O(n)','O(n)','O(1)'),
  why:'At each item decide: extend the running sum, or start fresh here. Keep the best sum seen. One pass replaces checking all O(n²) subarrays.', use:'Dynamic programming in its simplest form; stock-profit style problems.', tip:'Violet = current run, mint = best run so far. Values may be negative (−99 to 99).',
  code:['cur = best = nums[0]','for x in nums[1:]:','    cur = max(x, cur + x)','    best = max(best, cur)','return best'],
  run:s => { const a = nums(s); if (!a.length || a.length > 14 || a.some(x => !Number.isInteger(x) || Math.abs(x) > 99)) return bad('Enter 1–14 whole numbers between −99 and 99.');
   let cur = a[0], best = a[0], cs = 0, bs = 0, be = 0; const F = [];
   const f = (i, l, m) => { const st = {}; for (let k = cs; k <= i; k++) st[k] = 'sel'; for (let k = bs; k <= be; k++) st[k] = 'done'; if (i >= 0 && st[i] !== 'done') st[i] = 'cmp'; F.push({n:boxes(a, st), e:[], l, m}); };
   f(0, 0, `Start: cur = best = ${a[0]}.`);
   for (let i = 1; i < a.length; i++) { if (a[i] > cur + a[i]) { cur = a[i]; cs = i; f(i, 2, `${a[i]} alone beats extending the run: start fresh. cur = ${cur}.`); } else { cur += a[i]; f(i, 2, `Extend the run with ${a[i]}. cur = ${cur}.`); }
    if (cur > best) { best = cur; bs = cs; be = i; f(i, 3, `New best sum: ${best}.`); } else f(i, 3, `best stays ${best}.`); }
   f(-1, 4, `Maximum subarray sum = ${best} (indices ${bs} to ${be}).`); return F; }}
]
};
if (typeof module !== 'undefined') module.exports = ALGOS;
