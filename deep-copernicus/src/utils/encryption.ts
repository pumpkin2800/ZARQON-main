import CryptoJS from 'crypto-js';

// In a real app, this key should be user-provided or derived from a master password.
// For this local-only "simple" version, we'll use a stored key or prompt the user.
// To keep it simple as requested, we will use a default key but allow passing one.
const DEFAULT_KEY = 'empire-secret-key';

export const encryptData = (data: string, key: string = DEFAULT_KEY): string => {
    return CryptoJS.AES.encrypt(data, key).toString();
};

export const decryptData = (ciphertext: string, key: string = DEFAULT_KEY): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption failed", error);
        return "";
    }
};
