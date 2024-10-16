export const calculateHash = async (arrayBuffer) => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => ("00" + b.toString(16)).slice(-2)).join("");
};
