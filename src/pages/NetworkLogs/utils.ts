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
