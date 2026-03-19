/**
 * Wallet utilities
 */

export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

/**
 * Generate a random test wallet address for minting
 */
export function generateWallet(): string {
  const randomBytes = Array.from({ length: 20 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
  ).join('');
  return `0x${randomBytes}`;
}

/**
 * Shorten an address for display
 */
export function shortenAddress(address: string): string {
  if (!isValidAddress(address)) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Validate hex address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Create EIP-712 typed data structure
 */
export function createEIP712Payload(
  domain: EIP712Domain,
  types: Record<string, unknown>,
  message: Record<string, unknown>
): Record<string, unknown> {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      ...types,
    },
    primaryType: 'Message',
    domain,
    message,
  };
}

/**
 * Sign typed data (placeholder - requires web3 provider)
 * TODO: Implement real signing when web3 provider is available
 */
export function signTypedData(
  _domain: EIP712Domain,
  _types: Record<string, unknown>,
  _message: Record<string, unknown>
): string {
  // TODO: Implement EIP-712 signing with ethers/web3.js
  // For now return mock signature
  return '0x' + 'a'.repeat(130); // 65 bytes (130 hex chars)
}
