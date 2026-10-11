import {
  Block,
  BlockPayload,
  BlockType,
  BlockchainValidationReport,
  BlockValidationError,
} from '../types/blockchain';
import { computeBlockHash } from '../utils/crypto';

export class Blockchain {
  public chain: Block[] = [];

  constructor(existingChain?: Block[]) {
    if (existingChain && existingChain.length > 0) {
      this.chain = [...existingChain];
    }
  }

  /**
   * Initializes the Genesis block if the chain is empty
   */
  public async initialize(): Promise<void> {
    if (this.chain.length === 0) {
      const genesisBlock = await this.createGenesisBlock();
      this.chain = [genesisBlock];
    }
  }

  /**
   * Creates Block #0 (The Genesis Block)
   * index: 0, previousHash: "0", data: "FUNDCHAIN Genesis Block"
   */
  public async createGenesisBlock(): Promise<Block> {
    const index = 0;
    const timestamp = '2026-01-01T00:00:00.000Z';
    const data: BlockPayload = 'FUNDCHAIN Genesis Block';
    const previousHash = '0';
    const nonce = 0;
    const hash = await computeBlockHash(index, timestamp, data, previousHash, nonce);

    return {
      index,
      timestamp,
      data,
      previousHash,
      hash,
      nonce,
      blockType: 'GENESIS',
    };
  }

  public getLatestBlock(): Block {
    if (this.chain.length === 0) {
      throw new Error('Blockchain is empty. Call initialize() first.');
    }
    return this.chain[this.chain.length - 1];
  }

  /**
   * Adds a new block to the chain linked to the latest block's hash
   */
  public async addBlock(data: BlockPayload, blockType: BlockType): Promise<Block> {
    const latest = this.getLatestBlock();
    const index = latest.index + 1;
    const timestamp = new Date().toISOString();
    const previousHash = latest.hash;
    const nonce = 0;
    const hash = await computeBlockHash(index, timestamp, data, previousHash, nonce);

    const newBlock: Block = {
      index,
      timestamp,
      data,
      previousHash,
      hash,
      nonce,
      blockType,
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  /**
   * Comprehensive validation of the entire blockchain:
   * 1. Genesis block validity
   * 2. Recalculates actual SHA-256 for each block
   * 3. Confirms previousHash strictly links to predecessor
   */
  public async isChainValid(): Promise<BlockchainValidationReport> {
    const errors: BlockValidationError[] = [];
    let validCount = 0;
    let firstBrokenIndex: number | null = null;

    if (this.chain.length === 0) {
      return {
        isValid: false,
        totalBlocks: 0,
        validBlocks: 0,
        invalidBlocks: 0,
        firstBrokenIndex: null,
        errors: [{ blockIndex: 0, errorType: 'GENESIS_CORRUPTED', details: 'Empty chain' }],
        checkedAt: new Date().toISOString(),
      };
    }

    // Verify Genesis Block
    const genesis = this.chain[0];
    const computedGenesisHash = await computeBlockHash(
      genesis.index,
      genesis.timestamp,
      genesis.data,
      genesis.previousHash,
      genesis.nonce
    );

    if (genesis.index !== 0 || genesis.previousHash !== '0') {
      errors.push({
        blockIndex: 0,
        errorType: 'GENESIS_CORRUPTED',
        details: 'Genesis block must have index 0 and previousHash "0"',
      });
      if (firstBrokenIndex === null) firstBrokenIndex = 0;
    } else if (genesis.hash !== computedGenesisHash) {
      errors.push({
        blockIndex: 0,
        errorType: 'HASH_MISMATCH',
        details: 'Genesis block hash does not match computed SHA-256',
        actualHash: genesis.hash,
        expectedHash: computedGenesisHash,
      });
      if (firstBrokenIndex === null) firstBrokenIndex = 0;
    } else {
      validCount++;
    }

    // Verify subsequent blocks
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      let blockHasError = false;

      // 1. Check data integrity by recalculating hash
      const computedHash = await computeBlockHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.data,
        currentBlock.previousHash,
        currentBlock.nonce
      );

      if (currentBlock.hash !== computedHash) {
        errors.push({
          blockIndex: currentBlock.index,
          errorType: 'HASH_MISMATCH',
          details: `Block #${currentBlock.index} data was altered! Recorded hash ${currentBlock.hash.slice(0, 10)}... does not match recalculated hash ${computedHash.slice(0, 10)}...`,
          actualHash: currentBlock.hash,
          expectedHash: computedHash,
        });
        blockHasError = true;
        if (firstBrokenIndex === null) firstBrokenIndex = currentBlock.index;
      }

      // 2. Check previous hash linkage
      if (currentBlock.previousHash !== previousBlock.hash) {
        errors.push({
          blockIndex: currentBlock.index,
          errorType: 'PREVIOUS_HASH_MISMATCH',
          details: `Broken cryptographic link! Block #${currentBlock.index} points to previousHash ${currentBlock.previousHash.slice(0, 10)}..., but Block #${previousBlock.index} hash is ${previousBlock.hash.slice(0, 10)}...`,
          actualHash: currentBlock.previousHash,
          expectedHash: previousBlock.hash,
        });
        blockHasError = true;
        if (firstBrokenIndex === null) firstBrokenIndex = currentBlock.index;
      }

      if (!blockHasError) {
        validCount++;
      }
    }

    return {
      isValid: errors.length === 0,
      totalBlocks: this.chain.length,
      validBlocks: validCount,
      invalidBlocks: this.chain.length - validCount,
      firstBrokenIndex,
      errors,
      checkedAt: new Date().toISOString(),
    };
  }

  /**
   * Simulates tampering on a specific block for the Security Lab
   */
  public async tamperBlock(
    index: number,
    modifiedData: BlockPayload,
    tamperReason: string = 'Data modified in memory'
  ): Promise<void> {
    if (index <= 0 || index >= this.chain.length) {
      throw new Error('Can only tamper with non-genesis blocks within chain bounds.');
    }

    const block = this.chain[index];

    // Backup original data and hash if not already backed up
    if (!block.isTampered) {
      block.originalData = JSON.parse(JSON.stringify(block.data));
      block.originalHash = block.hash;
    }

    block.data = modifiedData;
    block.isTampered = true;
    block.tamperReason = tamperReason;
    // We intentionally keep the block.hash as original recorded hash to demonstrate HASH_MISMATCH,
    // OR if updated, previousHash mismatch downstream occurs. Both violate immutability!
  }

  /**
   * Restores a tampered block back to its pristine authentic state
   */
  public async restoreBlock(index: number): Promise<void> {
    if (index < 0 || index >= this.chain.length) return;

    const block = this.chain[index];
    if (block.isTampered && block.originalData && block.originalHash) {
      block.data = block.originalData;
      block.hash = block.originalHash;
      block.isTampered = false;
      delete block.tamperReason;
      delete block.originalData;
      delete block.originalHash;
    }
  }

  /**
   * Restores all tampered blocks in the entire chain
   */
  public async restoreAllBlocks(): Promise<void> {
    for (let i = 0; i < this.chain.length; i++) {
      await this.restoreBlock(i);
    }
  }
}
