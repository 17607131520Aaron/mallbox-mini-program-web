import type React from "react";

import type { Location, NavigateFunction } from "react-router-dom";

import type { MenuProps } from "antd";

export interface UseLayoutProps {
  navigate: NavigateFunction;
  location: Location;
}

export interface IFlatMenuItem {
  key: string;
  label: string;
  parentLabel?: string;
  icon?: React.ReactNode;
}

export interface IUseAppReturn {
  // 状态
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  openKeys: string[];
  selectedKeys: string[];
  flatSearchResults: IFlatMenuItem[];
  filteredMenuItems: MenuProps["items"];
  isLoading: boolean;
  isRefreshing: boolean;
  refreshKey: string;
  // 事件处理
  handleMenuClick: ({ key }: { key: string }) => void;
  handleOpenChange: (keys: string[]) => void;
  handleUserMenuClick: ({ key }: { key: string }) => void;
}
