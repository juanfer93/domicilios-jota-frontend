#!/usr/bin/env node
import webpush from "web-push";

const { publicKey, privateKey } = webpush.generateVAPIDKeys();

console.log("VAPID Public Key:");
console.log(publicKey);
console.log("\nVAPID Private Key:");
console.log(privateKey);
console.log("\nUsa la pública en NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY y guarda la privada solo en el backend.");
