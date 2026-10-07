/* site.js – shared page list, navigation and footer */
const TOPICS = [
  {key:'sorting', title:'Sorting', blurb:'Bubble, selection, insertion, merge and quick sort on 3D bars.', intro:'Sorting puts items in order. Watch five classic algorithms rearrange the same bars and compare how much work each one does.'},
  {key:'searching', title:'Searching', blurb:'Linear and binary search, with lo / mid / hi pointers.', intro:'Searching finds an item in a collection. Linear search checks one by one; binary search halves the problem each step on sorted data.'},
  {key:'stack-queue', title:'Stack & Queue', blurb:'LIFO vs FIFO: push, pop, enqueue and dequeue.', intro:'A stack removes the newest item (LIFO). A queue removes the oldest item (FIFO). Type your own operations and see each one happen.'},
  {key:'linked-list', title:'Linked List', blurb:'Nodes and pointers: insert, delete and find.', intro:'A linked list stores items in nodes, each pointing to the next. Operations are about following and rewiring those pointers.'},
  {key:'binary-tree', title:'Binary Tree', blurb:'Preorder, inorder, postorder and level-order traversal.', intro:'A binary tree has at most two children per node. A traversal is a rule for the order in which every node is visited.'},
  {key:'graph', title:'Graph BFS/DFS', blurb:'Explore a graph breadth-first and depth-first.', intro:'A graph is nodes joined by edges. BFS explores level by level using a queue; DFS dives deep first using recursion (a stack).'},
  {key:'recursion-dp', title:'Recursion & DP', blurb:'Fibonacci: plain recursion, memoization and a DP table.', intro:'Recursion solves a problem with smaller copies of itself. Dynamic programming stores answers so the same sub-problem is never solved twice.'},
  {key:'problem-solver', title:'Problem Solver', blurb:'Two Sum, Valid Parentheses and Maximum Subarray, step by step.', intro:'Classic interview questions solved with the structures you just learned. Run each one with your own input and read the reasoning.'},
  {key:'quiz', title:'Quiz', blurb:'Ten questions to test what you learned.', static:true},
  {key:'help', title:'Help', blurb:'FAQ and glossary.', static:true, hidden:true}
];
function renderNav() {
  const cur = document.body.dataset.topic || '';
  document.getElementById('nav').innerHTML = '<a class="brand" href="index.html">AlgoLab</a>' +
    TOPICS.map(t => `<a href="${t.key}.html"${t.key === cur ? ' class="on"' : ''}>${t.title}</a>`).join('');
  const f = document.getElementById('foot');
  if (f) f.innerHTML = 'AlgoLab – an original learning project built with HTML, CSS and JavaScript. No libraries. <a href="help.html">Help &amp; FAQ</a>';
}
renderNav();
