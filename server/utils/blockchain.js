class Blockchain {
    constructor() {
      this.chain = [];
      this.currentTransactions = [];
    }
  
    createBlock(nonce, previousHash) {
      const block = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.currentTransactions,
        nonce,
        previousHash
      };
      this.currentTransactions = [];
      this.chain.push(block);
      return block;
    }
  
    verifyChain() {
      for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];
        
        if (currentBlock.previousHash !== this.hash(previousBlock)) {
          return false;
        }
      }
      return true;
    }
  
    hash(block) {
      return require('crypto')
        .createHash('sha256')
        .update(JSON.stringify(block))
        .digest('hex');
    }
  }
  
  module.exports = Blockchain;