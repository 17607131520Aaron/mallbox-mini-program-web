import React from "react";

import { ReloadOutlined, StopOutlined, ClearOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Input, Select, Space, Spin, Tooltip, Typography, Table } from "antd";

import RequestDetails from "./RequestDetails";
import type { INetworkRequest } from "./types";
import useColumns from "./useColumns";
import { useNetworkLogs } from "./useNetworkLogs";

import "./index.scss";

const { Text } = Typography;
const { Search } = Input;
const isConnected = false;
const isConnecting = false;

const dataSource: Array<INetworkRequest> = [
  {
    id: 1,
    method: "GET",
    url: "http://localhost:8080/asdnajnsd/asdnajsdnjas/asdnahjsbdhajbsdhbahsbdhabsdhbashdbahsbdha",
    status: 200,
  },
  {
    id: 2,
    method: "POSt",
    url: "http://localhost:8080/asdnajnsd/asdnajsdnjas/asdnahjsbdhajbsdhbahsbdhabsdhbashdbahsbdha",
    status: 400,
  },
  {
    id: 3,
    method: "DELETE",
    url: "http://localhost:8080/asdnajnsd/asdnajsdnjas/asdnahjsbdhajbsdhbahsbdhabsdhbashdbahsbdha",
    status: 0,
  },
  {
    id: 4,
    method: "PUT",
    url: "http://localhost:8080/asdnajnsd/asdnajsdnjas/asdnahjsbdhajbsdhbahsbdhabsdhbashdbahsbdha",
    status: 500,
  },
];

const NetworkLogs: React.FC = () => {
  const {
    methodFilter,
    handelMethods,
    statusFilter,
    handelStatusFilter,
    searchText,
    handleConnectClick,
    handleClose,
    handleClearRequests,
    handleSearch,
    selectedRequest,
    setSelectedRequest,
  } = useNetworkLogs();

  const columns = useColumns();
  return (
    <div className="network-pages">
      <Card className="network-toolbar">
        <Space wrap size="middle" style={{ width: "100%" }}>
          <Space>
            <Text strong>连接状态：</Text>
            {isConnecting ? (
              <Space>
                <Spin size="small" />
                <Text type="secondary">连接中...</Text>
              </Space>
            ) : (
              <Badge status={isConnected ? "success" : "error"} text={isConnected ? "已连接" : "未连接"} />
            )}
          </Space>
          <Space>
            <Tooltip title="连接">
              <Button icon={<ReloadOutlined />} loading={isConnecting} type="primary" onClick={handleConnectClick}>
                {isConnected ? "重连" : "连接"}
              </Button>
            </Tooltip>
            <Tooltip title="关闭连接">
              <Button danger disabled={!isConnected && !isConnecting} icon={<StopOutlined />} onClick={handleClose}>
                关闭
              </Button>
            </Tooltip>
            <Tooltip title="清除所有请求">
              <Button icon={<ClearOutlined />} onClick={handleClearRequests}>
                清除
              </Button>
            </Tooltip>
          </Space>
          <Space style={{ marginLeft: "auto" }}>
            <Select
              options={[
                { label: "全部", value: "all" },
                { label: "GET", value: "GET" },
                { label: "POST", value: "POST" },
                { label: "PUT", value: "PUT" },
                { label: "DELETE", value: "DELETE" },
                { label: "PATCH", value: "PATCH" },
              ]}
              placeholder="方法"
              style={{ width: 100 }}
              value={methodFilter}
              onChange={handelMethods}
            />
            <Select
              options={[
                { label: "全部", value: "all" },
                { label: "成功", value: "success" },
                { label: "错误", value: "error" },
              ]}
              placeholder="状态"
              style={{ width: 100 }}
              value={statusFilter}
              onChange={handelStatusFilter}
            />
            <Search
              allowClear
              placeholder="过滤请求..."
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Space>
        </Space>
      </Card>
      <div className="network-content">
        <Card className="network-content-card">
          <div className="network-content-card-table">
            <Table
              bordered
              virtual
              columns={columns}
              dataSource={dataSource || []}
              pagination={false}
              rowKey="id"
              scroll={{ y: window.innerHeight - 400 }}
              size="small"
              onRow={(record) => ({
                onClick: () => {
                  console.log(record, "record");
                  setSelectedRequest(record);
                },
                style: { cursor: "pointer" },
              })}
            />
          </div>
        </Card>
        <Card className="network-info">
          <RequestDetails request={selectedRequest} />
        </Card>
      </div>
    </div>
  );
};

export default NetworkLogs;
