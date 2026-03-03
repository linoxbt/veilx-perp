import { PublicKey } from "@solana/web3.js";
import { BN, AnchorProvider } from "@coral-xyz/anchor";
import { PROGRAMS, ARCIUM_CONFIG } from "@/config/programs";

// ── Arcium client imports (v0.8.5) ────────────────────────────────
// These are dynamically imported to avoid build failures if the
// package has Node-only dependencies. The hooks that call these
// functions run only in wallet-connected browser contexts.

let arciumClient: any = null;

async function getArciumClient() {
  if (!arciumClient) {
    try {
      arciumClient = await import("@arcium-hq/client");
    } catch (e) {
      console.warn("Arcium client not available — using stub mode", e);
      return null;
    }
  }
  return arciumClient;
}

// ── Derived Arcium PDA addresses (cluster offset 456) ─────────────
export async function getClusterAccount() {
  const client = await getArciumClient();
  if (!client) return null;
  return client.getClusterAccAddress(ARCIUM_CONFIG.CLUSTER_OFFSET);
}

export async function getMXEAccount() {
  const client = await getArciumClient();
  if (!client) return null;
  return client.getMXEAccAddress(new PublicKey(ARCIUM_CONFIG.MXE_PROGRAM_ID));
}

export async function getMempoolAccount() {
  const client = await getArciumClient();
  if (!client) return null;
  return client.getMempoolAccAddress(ARCIUM_CONFIG.CLUSTER_OFFSET);
}

export async function getExecutingPool() {
  const client = await getArciumClient();
  if (!client) return null;
  return client.getExecutingPoolAccAddress(ARCIUM_CONFIG.CLUSTER_OFFSET);
}

// ── Build account set for any Arcium computation call ─────────────
export async function getArciumAccounts(computationOffset: BN, instructionName: string) {
  const client = await getArciumClient();
  if (!client) throw new Error("Arcium client not available");

  return {
    computationAccount: client.getComputationAccAddress(
      ARCIUM_CONFIG.CLUSTER_OFFSET,
      computationOffset
    ),
    clusterAccount:  client.getClusterAccAddress(ARCIUM_CONFIG.CLUSTER_OFFSET),
    mxeAccount:      client.getMXEAccAddress(new PublicKey(ARCIUM_CONFIG.MXE_PROGRAM_ID)),
    mempoolAccount:  client.getMempoolAccAddress(ARCIUM_CONFIG.CLUSTER_OFFSET),
    executingPool:   client.getExecutingPoolAccAddress(ARCIUM_CONFIG.CLUSTER_OFFSET),
    compDefAccount:  client.getCompDefAccAddress(
      new PublicKey(ARCIUM_CONFIG.MXE_PROGRAM_ID),
      Buffer.from(client.getCompDefAccOffset(instructionName)).readUInt32LE()
    ),
  };
}

// ── x25519 key exchange with MXE — creates encryption cipher ─────
export async function createArciumCipher(provider: AnchorProvider) {
  const client = await getArciumClient();
  if (!client) throw new Error("Arcium client not available");

  const privKey   = client.x25519.utils.randomSecretKey();
  const pubKey    = client.x25519.getPublicKey(privKey);
  const mxePubKey = await client.getMXEPublicKeyWithRetry(
    provider,
    new PublicKey(ARCIUM_CONFIG.MXE_PROGRAM_ID)
  );
  const shared = client.x25519.getSharedSecret(privKey, mxePubKey);
  const cipher = new client.RescueCipher(shared);
  return { cipher, privKey, pubKey };
}

// ── Order payload interface ───────────────────────────────────────
export interface OrderPayload {
  size:        number;
  leverage:    number;
  margin:      number;
  isLong:      boolean;
  entryPrice:  number;
  stopLoss?:   number;
  takeProfit?: number;
}

// ── Encrypt an order — plaintext never leaves the browser ─────────
export async function encryptOrder(
  payload: OrderPayload,
  provider: AnchorProvider
) {
  const client = await getArciumClient();
  if (!client) throw new Error("Arcium client not available");

  const { cipher, pubKey } = await createArciumCipher(provider);
  const nonce = crypto.getRandomValues(new Uint8Array(16));

  const ciphertext = cipher.encrypt(
    [
      BigInt(payload.size),
      BigInt(payload.leverage),
      BigInt(payload.margin),
      BigInt(payload.isLong ? 1 : 0),
      BigInt(payload.entryPrice),
      BigInt(payload.stopLoss   ?? 0),
      BigInt(payload.takeProfit ?? 0),
    ],
    nonce
  );

  const compOffset = new BN(crypto.getRandomValues(new Uint8Array(8)));
  const nonceBN    = new BN(client.deserializeLE(nonce).toString());

  return { cipher, pubKey, ciphertext, nonce, compOffset, nonceBN };
}

// ── Wait for Arcium MPC cluster to finalize computation ───────────
export async function waitForMPC(provider: AnchorProvider, compOffset: BN) {
  const client = await getArciumClient();
  if (!client) throw new Error("Arcium client not available");

  return client.awaitComputationFinalization(
    provider,
    compOffset,
    new PublicKey(ARCIUM_CONFIG.MXE_PROGRAM_ID),
    "confirmed"
  );
}

// ── Decrypt result returned from Arcium callback event ───────────
export async function decryptResult(
  cipher: any,
  encryptedResult: number[],
  nonce: number[]
): Promise<bigint> {
  return cipher.decrypt([encryptedResult], Uint8Array.from(nonce))[0];
}
