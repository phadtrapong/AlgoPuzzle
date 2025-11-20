import { Question } from "../types";

// A curated list of questions to form the "Learning Path"
// This replaces the dynamic generation to ensure quality and specific progression.
export const QUESTION_BANK: Question[] = [
  // --- EASY QUESTIONS ---
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    codeTemplate: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = {{SLOT_1}};

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set({{SLOT_2}}, i);
  }

  return [];
}`,
    slots: [
      {
        id: "{{SLOT_1}}",
        options: [
          { id: "opt1_1", code: "target - nums[i]", isCorrect: true },
          { id: "opt1_2", code: "nums[i] - target", isCorrect: false },
          { id: "opt1_3", code: "target + nums[i]", isCorrect: false }
        ]
      },
      {
        id: "{{SLOT_2}}",
        options: [
          { id: "opt2_1", code: "nums[i]", isCorrect: true },
          { id: "opt2_2", code: "complement", isCorrect: false },
          { id: "opt2_3", code: "i", isCorrect: false }
        ]
      }
    ],
    explanation: "### Approach\nWe use a Hash Map to store the values we've seen so far and their indices. As we iterate through the array, for each number `x`, we calculate its `complement` (`target - x`). If the complement exists in the map, we found our pair.\n\n### Time Complexity\n**O(n)** because we traverse the list containing `n` elements only once. Each look up in the table costs only O(1) time.\n\n### Space Complexity\n**O(n)**. The extra space required depends on the number of items stored in the hash table, which stores at most `n` elements."
  },
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    topic: "Strings",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    codeTemplate: `function isPalindrome(s: string): boolean {
  // Clean the string: remove non-alphanumeric, convert to lower
  const clean = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  let left = 0;
  let right = {{SLOT_1}};

  while (left < right) {
    if (clean[left] !== clean[right]) {
      return {{SLOT_2}};
    }
    left++;
    right--;
  }
  
  return true;
}`,
    slots: [
      {
        id: "{{SLOT_1}}",
        options: [
          { id: "p1_1", code: "clean.length - 1", isCorrect: true },
          { id: "p1_2", code: "clean.length", isCorrect: false },
          { id: "p1_3", code: "s.length", isCorrect: false }
        ]
      },
      {
        id: "{{SLOT_2}}",
        options: [
          { id: "p2_1", code: "false", isCorrect: true },
          { id: "p2_2", code: "true", isCorrect: false },
          { id: "p2_3", code: "break", isCorrect: false }
        ]
      }
    ],
    explanation: "### Approach\nWe use the **Two Pointer** technique. One pointer starts at the beginning of the cleaned string, and the other at the end. We compare characters and move inwards until the pointers meet.\n\n### Time Complexity\n**O(n)**, where n is the length of the string. We traverse the string once.\n\n### Space Complexity\n**O(n)** to store the cleaned string (or O(1) if we process in-place without regex)."
  },

  // --- MEDIUM QUESTIONS ---
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Arrays",
    description: "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    codeTemplate: `function maxSubArray(nums: number[]): number {
  let currentSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Kadane's Algorithm logic
    currentSum = Math.max({{SLOT_1}}, currentSum + nums[i]);
    maxSum = Math.max({{SLOT_2}}, currentSum);
  }

  return maxSum;
}`,
    slots: [
      {
        id: "{{SLOT_1}}",
        options: [
          { id: "m1_1", code: "nums[i]", isCorrect: true },
          { id: "m1_2", code: "0", isCorrect: false },
          { id: "m1_3", code: "maxSum", isCorrect: false }
        ]
      },
      {
        id: "{{SLOT_2}}",
        options: [
          { id: "m2_1", code: "maxSum", isCorrect: true },
          { id: "m2_2", code: "nums[i]", isCorrect: false },
          { id: "m2_3", code: "currentSum + nums[i]", isCorrect: false }
        ]
      }
    ],
    explanation: "### Approach\nThis problem is solved using **Kadane's Algorithm**. We iterate through the array, maintaining a `currentSum`. At each position, we decide whether to start a new subarray at the current element (`nums[i]`) or extend the existing subarray (`currentSum + nums[i]`).\n\n### Time Complexity\n**O(n)**. We pass through the array once.\n\n### Space Complexity\n**O(1)**. We only use two variables (`currentSum` and `maxSum`)."
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    topic: "Two Pointers",
    description: "You are given an integer array `height` of length n. There are n vertical lines. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    codeTemplate: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, {{SLOT_1}});

    if (height[left] < height[right]) {
      {{SLOT_2}};
    } else {
      right--;
    }
  }
  return maxWater;
}`,
    slots: [
      {
        id: "{{SLOT_1}}",
        options: [
          { id: "cw_1", code: "width * h", isCorrect: true },
          { id: "cw_2", code: "width * height[left]", isCorrect: false },
          { id: "cw_3", code: "width + h", isCorrect: false }
        ]
      },
      {
        id: "{{SLOT_2}}",
        options: [
          { id: "cw2_1", code: "left++", isCorrect: true },
          { id: "cw2_2", code: "left--", isCorrect: false },
          { id: "cw2_3", code: "right++", isCorrect: false }
        ]
      }
    ],
    explanation: "### Approach\nWe use the **Two Pointer** approach. We start with the widest container (start and end). At every step, we calculate the area and update max. To potentially find a larger area, we must move the pointer pointing to the shorter line inwards, as the area is limited by the shorter height.\n\n### Time Complexity\n**O(n)**. Each element is visited once.\n\n### Space Complexity\n**O(1)**."
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topic: "Trees",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    codeTemplate: `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = {{SLOT_1}};
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) {{SLOT_2}};
    }
    result.push(currentLevel);
  }
  return result;
}`,
    slots: [
      {
        id: "{{SLOT_1}}",
        options: [
          { id: "bt_1", code: "queue.length", isCorrect: true },
          { id: "bt_2", code: "result.length", isCorrect: false },
          { id: "bt_3", code: "1", isCorrect: false }
        ]
      },
      {
        id: "{{SLOT_2}}",
        options: [
          { id: "bt2_1", code: "queue.push(node.right)", isCorrect: true },
          { id: "bt2_2", code: "result.push(node.right)", isCorrect: false },
          { id: "bt2_3", code: "currentLevel.push(node.right.val)", isCorrect: false }
        ]
      }
    ],
    explanation: "### Approach\nWe use **Breadth-First Search (BFS)** with a Queue. The key is to process nodes level by level. We capture the `queue.length` at the start of the loop to determine how many nodes are in the current level, process them, and add their children to the back of the queue.\n\n### Time Complexity\n**O(n)**. Each node is processed exactly once.\n\n### Space Complexity\n**O(n)** for the queue, which stores at most one level of nodes (max width of the tree)."
  },

  // --- HARD QUESTIONS ---
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    codeTemplate: `function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += {{SLOT_1}};
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += {{SLOT_2}};
      }
      right--;
    }
  }
  return water;
}`,
    slots: [
      {
        id: "{{SLOT_1}}",
        options: [
          { id: "tr_1", code: "leftMax - height[left]", isCorrect: true },
          { id: "tr_2", code: "rightMax - height[left]", isCorrect: false },
          { id: "tr_3", code: "height[left] - leftMax", isCorrect: false }
        ]
      },
      {
        id: "{{SLOT_2}}",
        options: [
          { id: "tr2_1", code: "rightMax - height[right]", isCorrect: true },
          { id: "tr2_2", code: "leftMax - height[right]", isCorrect: false },
          { id: "tr2_3", code: "height[right]", isCorrect: false }
        ]
      }
    ],
    explanation: "### Approach\nWe use the **Two Pointer** technique. The amount of water trapped at any point is determined by the shorter of the two maximum heights on either side (`min(leftMax, rightMax)`) minus the current height. By moving pointers inward from the smaller side, we ensure we always know the limiting wall height.\n\n### Time Complexity\n**O(n)**. Single pass.\n\n### Space Complexity\n**O(1)**. No extra arrays used."
  },
  {
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    topic: "Linked Lists",
    description: "You are given an array of `k` linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    codeTemplate: `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;
  
  // Helper to merge two lists
  const mergeTwo = (l1: ListNode | null, l2: ListNode | null) => {
    const dummy = new ListNode(0);
    let curr = dummy;
    while (l1 && l2) {
      if (l1.val < l2.val) {
        curr.next = l1; l1 = l1.next;
      } else {
        curr.next = l2; l2 = l2.next;
      }
      curr = {{SLOT_1}};
    }
    curr.next = l1 || l2;
    return dummy.next;
  };

  // Divide and Conquer
  let interval = 1;
  while (interval < lists.length) {
    for (let i = 0; i + interval < lists.length; i = i + interval * 2) {
      lists[i] = mergeTwo(lists[i], {{SLOT_2}});
    }
    interval *= 2;
  }
  return lists[0];
}`,
    slots: [
      {
        id: "{{SLOT_1}}",
        options: [
          { id: "mk_1", code: "curr.next", isCorrect: true },
          { id: "mk_2", code: "curr", isCorrect: false },
          { id: "mk_3", code: "dummy", isCorrect: false }
        ]
      },
      {
        id: "{{SLOT_2}}",
        options: [
          { id: "mk2_1", code: "lists[i + interval]", isCorrect: true },
          { id: "mk2_2", code: "lists[i + 1]", isCorrect: false },
          { id: "mk2_3", code: "lists[interval]", isCorrect: false }
        ]
      }
    ],
    explanation: "### Approach\nWe use a **Divide and Conquer** strategy similar to Merge Sort. Instead of merging lists sequentially (which is slow), we merge pairs of lists (0&1, 2&3...), then merge the results, effectively reducing the number of lists by half in each iteration.\n\n### Time Complexity\n**O(N log k)**, where N is total nodes and k is number of lists.\n\n### Space Complexity\n**O(1)** if merging iteratively."
  }
];

export const generateQuestion = async (difficulty: string = "Medium", history: string[] = []): Promise<Question> => {
  // Simulate network delay for a realistic "loading" feel
  await new Promise(resolve => setTimeout(resolve, 800));

  // Filter questions by difficulty
  const pool = QUESTION_BANK.filter(q => q.difficulty === difficulty);
  
  if (pool.length === 0) {
    throw new Error(`No questions available for difficulty: ${difficulty}`);
  }

  // Incremental Logic: Find the first question in the pool that hasn't been solved/seen yet
  const nextQuestion = pool.find(q => !history.includes(q.title));

  if (nextQuestion) {
    return nextQuestion;
  }

  // If user has finished all questions in this difficulty, return a random one 
  // (or the user could be notified they finished the track, but for gameplay loop we return one)
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};