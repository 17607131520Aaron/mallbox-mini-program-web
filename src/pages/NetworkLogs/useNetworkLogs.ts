import { useState } from "react";

import type { INetworkRequest } from "@/pages/NetworkLogs/types";
const useNetworkLogs = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<INetworkRequest | null>(null);
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const handelMethods = (val: string): void => {
    setMethodFilter(val);
  };

  const handelStatusFilter = (val: string): void => {
    setStatusFilter(val);
  };

  const handleConnectClick = (): void => {
    console.log("重新连接或者连接");
  };

  const handleClose = (): void => {
    console.log("关闭连接");
  };

  const handleSearch = (values: string): void => {
    setSearchText(values);
  };

  const handleClearRequests = (): void => {
    console.log("clear requests清除所有请求");
  };

  return {
    methodFilter,
    handelMethods,
    statusFilter,
    handelStatusFilter,
    searchText,
    handleSearch,
    handleConnectClick,
    handleClose,
    handleClearRequests,
    selectedRequest,
    setSelectedRequest,
  };
};

export { useNetworkLogs };
