import { Space, Typography, Tooltip } from "antd";

import type { INetworkRequest } from "./types";
import { getStatusColor, getMethodColor, formatSize, formatDuration } from "./utils";
const { Text } = Typography;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
const useColumns = () => {
  return [
    {
      title: "请求方式",
      dataIndex: "method",
      key: "method",
      width: 90,
      render: (value: string) => (
        <Space size="small" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <span className="network-method-badge" style={{ backgroundColor: getMethodColor(value), flexShrink: 0 }}>
            {value}
          </span>
        </Space>
      ),
    },
    {
      title: "名称",
      dataIndex: "url",
      key: "url",
      ellipsis: true,
      render: (value: string) => {
        return (
          <Tooltip placement="top" title={value}>
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      ellipsis: {
        showTitle: true,
      },
      render: (_value: string, record: INetworkRequest) => {
        if (record.error) {
          return <span style={{ color: "#ff4d4f", fontWeight: 500 }}>错误</span>;
        }
        if (!record.completed) {
          return <span style={{ color: "#1890ff", fontWeight: 500 }}>进行中</span>;
        }
        const statusText = String(record.status || "-");
        return <span style={{ color: getStatusColor(record.status), fontWeight: 500 }}>{statusText}</span>;
      },
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      ellipsis: {
        showTitle: true,
      },
      render: (_value: unknown, record: INetworkRequest) => {
        const typeText = (record.type || "xhr").toUpperCase();
        return (
          <Text ellipsis={{ tooltip: typeText }} type="secondary">
            {typeText}
          </Text>
        );
      },
    },
    {
      title: "大小",
      dataIndex: "responseSize",
      key: "size",
      width: 100,
      ellipsis: {
        showTitle: true,
      },
      render: (_value: unknown, record: INetworkRequest) => {
        const sizeText = formatSize(record.responseSize);
        return (
          <Text ellipsis={{ tooltip: sizeText }} type="secondary">
            {sizeText}
          </Text>
        );
      },
    },
    {
      title: "时间",
      dataIndex: "duration",
      key: "time",
      width: 120,
      ellipsis: {
        showTitle: true,
      },
      render: (_value: unknown, record: INetworkRequest) => {
        const durationText = formatDuration(record.duration);
        return (
          <Text ellipsis={{ tooltip: durationText }} type="secondary">
            {durationText}
          </Text>
        );
      },
    },
  ];
};

export default useColumns;
