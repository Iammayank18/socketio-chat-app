import encode from "jwt-encode";
import { jwtDecode } from "jwt-decode";
import { AppwriteException } from "appwrite";

export function isValidURL(url: string) {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
}

export const encryptPassword = (password: string): string => {
  const secret = "JDKNSOoaidjfnosada12312";
  const data = {
    password: password,
  };
  return encode(data, secret);
};

export const decryptPassword = (password: string): { password: string } => {
  return jwtDecode(password);
};

export function getErrorMessage(e: AppwriteException) {
  return e.message;
}

export const formatTime = (timestamp: string | number | Date) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const base64ToFile = (base64Data: string) => {
  const fileName = new Date().toLocaleTimeString();
  const byteString = atob(base64Data.split(",")[1]);
  const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];

  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const file = new File([uint8Array], `${fileName}.png`, {
    type: mimeString,
  });
  return file;
};

export const createImageFromBase64 = (base64) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};
