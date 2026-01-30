import React from "react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { AppstoreOutlined, SearchOutlined } from "@ant-design/icons";
import { Layout, Input, List, Menu } from "antd";

import { menuItems } from "./constants";
import type { IFlatMenuItem } from "./types";
import useLayout from "./useLayout";
const { Header, Sider, Content } = Layout;

import "./index.scss";

const LayoutPages: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    collapsed,
    handleComplete,
    searchValue,
    handleSearchChange,
    handleMenuClick,
    handleOpenChange,
    openKeys,
    selectedKeys,
    flatSearchResults,
  } = useLayout({
    navigate,
    location,
  });
  const showSearchResults = searchValue.trim() && !collapsed;

  return (
    <Layout className="devpocket-pages">
      <Sider
        collapsible
        breakpoint="md"
        className="devpocket-sider"
        collapsed={collapsed}
        collapsedWidth={80}
        trigger={null}
        width={240}
        onBreakpoint={(broken) => {
          handleComplete(broken);
        }}
      >
        <div className="devpocket-sider-header">
          <div className="devpocket-sider-header-logo">
            <div className="devpocket-sider-header-logo-icon">
              <AppstoreOutlined />
            </div>
            {!collapsed && <div className="devpocket-sider-header-logo-title">我不知道叫什么</div>}
          </div>
        </div>
        {!collapsed && (
          <div className="devpocket-sider-search">
            <Input
              allowClear
              placeholder="搜索菜单"
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
            />
          </div>
        )}

        <div className="devpocket-sider-menu">
          {!showSearchResults ? (
            <div className="devpocket-sider-menu-items">
              <Menu
                className="content"
                items={menuItems}
                mode="inline"
                openKeys={openKeys}
                selectedKeys={selectedKeys}
                theme="light"
                onClick={handleMenuClick}
                onOpenChange={handleOpenChange}
              />
            </div>
          ) : (
            <div className="devpocket-sider-search-results">
              <div className="devpocket-sider-search-results-count">
                共搜索到 {flatSearchResults.length} 项与"{searchValue}"相关的菜单
              </div>
              <div className="devpocket-sider-search-results-list">
                <List<IFlatMenuItem>
                  dataSource={flatSearchResults || []}
                  renderItem={(item: IFlatMenuItem) => (
                    <List.Item
                      className={`devpocket-sider-search-result-item ${
                        selectedKeys.includes(item.key) ? "devpocket-sider-search-result-item-selected" : ""
                      }`}
                      onClick={() => {
                        if (item.key.startsWith("/")) {
                          handleMenuClick({ key: item.key });
                        }
                      }}
                    >
                      <div className="devpocket-sider-search-result-content">
                        {item.icon && <span className="devpocket-sider-search-result-icon">{item.icon}</span>}
                        <span className="devpocket-sider-search-result-label">
                          {item.parentLabel ? `${item.parentLabel} / ${item.label}` : item.label}
                        </span>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </Sider>
      <Layout className="devpocket-content">
        <Outlet />
      </Layout>
    </Layout>
  );
};
export default LayoutPages;
