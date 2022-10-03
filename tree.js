const fs = require('fs');

class TreeNode {
    constructor(path) {
      this.path = path;
      this.children = [];
    }
}

function buildTree(rootPath) {
    const root = new TreeNode(rootPath);
  
    const stack = [root];
  
    while (stack.length) {
        const currentNode = stack.pop();
  
        if (currentNode) {
            const children = fs.readdirSync(currentNode.path);
  
            for (let child of children) {
                const childPath = `${currentNode.path}/${child}`;
                const childNode = new TreeNode(childPath);
                currentNode.children.push(childNode);
  
                if (fs.statSync(childNode.path).isDirectory()) {
                    stack.push(childNode);
                }
            }
        }
    }

    return root;
}

module.exports = { buildTree }