import { secureGet, secureSet } from "@/lib/tauri-store";
import { generateKeyPair } from "@/lib/crypto";

export async function initUserKeys(userId: string): Promise<string> {
  // check if keys already exist in Tauri secure store
  const existingPrivateKey = await secureGet(`privateKey_${userId}`);
  const existingPublicKey = await secureGet(`publicKey_${userId}`);

  if (existingPrivateKey && existingPublicKey) {
    // keys exist locally — but still re-register with server
    // in case user was added to new conversations since last login
    await fetch("/api/chat/keys/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKey: existingPublicKey }),
    });

    return existingPrivateKey;
  }

  // first time — generate fresh keypair
  const { publicKey, privateKey } = await generateKeyPair();

  // save to Tauri secure store
  await secureSet(`privateKey_${userId}`, privateKey);
  await secureSet(`publicKey_${userId}`, publicKey);

  // register with server — updates all current conversations
  await fetch("/api/chat/keys/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicKey }),
  });

  return privateKey;
}