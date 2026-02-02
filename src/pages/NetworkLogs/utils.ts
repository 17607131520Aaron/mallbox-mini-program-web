/**
 * 网络监控工具函数
 */

import type { INetworkRequest } from "./types";

/**
 * 生成 curl 命令
 */
export const generateCurlCommand = (request: INetworkRequest): string => {
  const method = request.method.toUpperCase();
  const url = request.url;
  const headers = request.headers || {};

  let curl = `curl -X ${method}`;

  // 添加请求头
  Object.entries(headers).forEach(([key, value]) => {
    curl += ` \\\n  -H "${key}: ${value}"`;
  });

  // 添加请求体
  if (method !== "GET" && request.data) {
    let dataStr = "";
    if (typeof request.data === "string") {
      dataStr = request.data;
    } else {
      dataStr = JSON.stringify(request.data);
    }
    curl += ` \\\n  -d '${dataStr}'`;
  }

  // 添加 URL
  curl += ` \\\n  "${url}"`;

  return curl;
};

/**
 * 复制到剪贴板
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // 降级方案
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

/**
 * 格式化 JSON
 */
export const formatJSON = (data: unknown): string => {
  try {
    if (typeof data === "string") {
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
    }
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
};

/**
 * 获取请求的完整 URL（包含 baseURL）
 */
export const getFullUrl = (request: INetworkRequest): string => {
  return request.url;
};

/**
 * 解析 URL 的 query 参数
 */
export const parseQueryParams = (url: string): Record<string, string> => {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    // 如果不是完整 URL，尝试解析 query 字符串
    try {
      const queryString = url.includes("?") ? url.split("?")[1] : url;
      const params: Record<string, string> = {};
      if (queryString) {
        queryString.split("&").forEach((param) => {
          const [key, value] = param.split("=");
          if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || "");
          }
        });
      }
      return params;
    } catch {
      return {};
    }
  }
};

/**
 * 格式化时间戳
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  // 手动添加毫秒
  const ms = date.getMilliseconds().toString().padStart(3, "0");
  return `${dateStr}.${ms}`;
};

/**
 * 解析 URL 的各个部分
 */
export const parseUrl = (
  url: string,
): {
  protocol: string;
  host: string;
  pathname: string;
  search: string;
  hash: string;
} => {
  try {
    const urlObj = new URL(url);
    return {
      protocol: urlObj.protocol,
      host: urlObj.host,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
    };
  } catch {
    return {
      protocol: "",
      host: "",
      pathname: url.split("?")[0],
      search: url.includes("?") ? `?${url.split("?")[1]}` : "",
      hash: "",
    };
  }
};

/**
 * 根据请求信息推断并补充常见的请求头
 */
export const enhanceRequestHeaders = (request: INetworkRequest): Record<string, string> => {
  const headers = { ...(request.headers || {}) };
  const method = request.method.toUpperCase();

  // 补充常见的请求头（如果不存在）
  if (!headers["Accept"]) {
    headers["Accept"] = "application/json, text/plain, */*";
  }

  if (!headers["Accept-Language"]) {
    headers["Accept-Language"] = "zh-CN,zh;q=0.9,en;q=0.8";
  }

  if (!headers["Accept-Encoding"]) {
    headers["Accept-Encoding"] = "gzip, deflate, br";
  }

  if (!headers["Connection"]) {
    headers["Connection"] = "keep-alive";
  }

  // User-Agent（React Native 应用）
  if (!headers["User-Agent"]) {
    const appVersion = headers["app-version"] || "unknown";
    headers["User-Agent"] = `React-Native/${appVersion}`;
  }

  // Content-Type（对于 POST/PUT/PATCH 请求）
  if (["POST", "PUT", "PATCH"].includes(method) && request.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // 根据 URL 推断协议
  if (request.url.startsWith("https://")) {
    headers["Protocol"] = "HTTPS/1.1";
  } else if (request.url.startsWith("http://")) {
    headers["Protocol"] = "HTTP/1.1";
  }

  return headers;
};

export const getStatusColor = (status?: number): string => {
  if (!status) {
    return "#8c8c8c";
  }
  if (status >= 200 && status < 300) {
    return "#52c41a";
  }
  if (status >= 300 && status < 400) {
    return "#1890ff";
  }
  if (status >= 400 && status < 500) {
    return "#faad14";
  }
  if (status >= 500) {
    return "#ff4d4f";
  }
  return "#8c8c8c";
};

/**
 * 获取请求方法颜色
 */
export const getMethodColor = (method: string): string => {
  const colors: Record<string, string> = {
    GET: "#61affe",
    POST: "#49cc90",
    PUT: "#fca130",
    DELETE: "#f93e3e",
    PATCH: "#50e3c2",
    HEAD: "#9012fe",
    OPTIONS: "#0d5aa7",
  };
  return colors[method.toUpperCase()] || "#8c8c8c";
};

/**
 * 格式化文件大小
 */
export const formatSize = (bytes?: number): string => {
  if (!bytes) {
    return "0 B";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * 格式化时间（毫秒）
 */
export const formatDuration = (ms?: number): string => {
  if (!ms) {
    return "-";
  }
  if (ms < 1000) {
    return `${ms} ms`;
  }
  return `${(ms / 1000).toFixed(2)} s`;
};
