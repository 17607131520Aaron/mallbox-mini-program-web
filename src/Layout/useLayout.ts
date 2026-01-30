import { useMemo, useState, useEffect } from "react";

import { menuItems } from "./constants";
import type { UseLayoutProps, IFlatMenuItem } from "./types";

const getKeysToOpen = (path: string): string[] => {
  const keysToOpen: string[] = [];
  menuItems?.forEach((item) => {
    if (!item) {
      return;
    }

    if ("children" in item && item.children) {
      const hasMatch = item.children.some((child) => child && typeof child !== "string" && child.key === path);
      if (hasMatch && item.key) {
        keysToOpen.push(item.key as string);
      }
    }
  });

  return keysToOpen;
};

const useLayout = (props: UseLayoutProps) => {
  const { navigate, location } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  // 初始化时计算默认展开的菜单
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const path = location.pathname || "/";
    return getKeysToOpen(path);
  });

  // 获取当前选中的菜单项
  const selectedKeys = useMemo(() => {
    const path = location.pathname || "/";
    const keys: string[] = [];

    // 遍历菜单项找到匹配的路径
    menuItems?.forEach((item) => {
      if (!item) {
        return;
      }

      // 精确匹配首页
      if (item.key === "/" && (path === "/" || path === "")) {
        keys.push("/");
      } else if (item.key === path) {
        keys.push(path);
      } else if ("children" in item && item.children) {
        item.children.forEach((child) => {
          if (child && child.key === path) {
            keys.push(path);
          }
        });
      }
    });

    // 如果没有匹配到，默认选中首页
    return keys.length > 0 ? keys : ["/"];
  }, [location.pathname]);

  const handleComplete = (broken: boolean): void => {
    setCollapsed(broken);
  };

  const handleSearchChange = (value: string): void => {
    setSearchValue(value);
  };

  const handleMenuClick = ({ key }: { key: string }): void => {
    // 只处理叶子节点（有实际路径的菜单项）
    if (key.startsWith("/")) {
      navigate(key);
    }
  };

  const handleOpenChange = (keys: string[]): void => {
    setOpenKeys(keys);
  };

  // 扁平化菜单项，用于搜索结果展示
  const flattenMenuItems = (items: typeof menuItems, searchText: string): IFlatMenuItem[] => {
    const result: IFlatMenuItem[] = [];
    const searchLower = searchText.toLowerCase();

    items?.forEach((item) => {
      if (!item || typeof item === "string" || item.type === "divider") {
        return;
      }

      const label = "label" in item && item.label ? item.label.toString() : "";
      const labelLower = label.toLowerCase();

      // 如果是一级菜单，检查自身和子菜单
      if ("children" in item && item.children) {
        // 检查子菜单
        item.children.forEach((child) => {
          if (!child || typeof child === "string" || child.type === "divider") {
            return;
          }
          const childLabel = "label" in child && child.label ? child.label.toString() : "";
          const childLabelLower = childLabel.toLowerCase();

          // 如果子菜单匹配
          if (childLabelLower.includes(searchLower)) {
            result.push({
              key: child.key as string,
              label: childLabel,
              parentLabel: label,
              icon: "icon" in child ? child.icon : undefined,
            });
          }
        });

        // 如果父菜单本身也匹配，且父菜单有实际路径（可点击），才添加到结果中
        if (labelLower.includes(searchLower) && item.key && typeof item.key === "string" && item.key.startsWith("/")) {
          result.push({
            key: item.key as string,
            label,
            icon: "icon" in item ? item.icon : undefined,
          });
        }
      } else {
        // 没有子菜单的项，直接检查标题
        if (labelLower.includes(searchLower)) {
          result.push({
            key: item.key as string,
            label,
            icon: "icon" in item ? item.icon : undefined,
          });
        }
      }
    });

    return result;
  };

  // 过滤菜单项（用于树形菜单）
  const filterMenuItems = (items: typeof menuItems, searchText: string): typeof menuItems => {
    if (!searchText.trim()) {
      return items;
    }

    const filtered: typeof menuItems = [];

    items?.forEach((item) => {
      if (!item || typeof item === "string" || item.type === "divider") {
        return;
      }

      const label = "label" in item && item.label ? item.label.toString().toLowerCase() : "";
      const searchLower = searchText.toLowerCase();

      // 如果是一级菜单，检查自身和子菜单
      if ("children" in item && item.children) {
        const filteredChildren = item.children.filter((child) => {
          if (!child || typeof child === "string" || child.type === "divider") {
            return false;
          }
          const childLabel = "label" in child && child.label ? child.label.toString().toLowerCase() : "";
          return childLabel.includes(searchLower);
        });

        // 如果父菜单标题匹配或子菜单有匹配项，则保留
        if (label.includes(searchLower) || filteredChildren.length > 0) {
          filtered.push({
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children,
          });
        }
      } else {
        // 没有子菜单的项，直接检查标题
        if (label.includes(searchLower)) {
          filtered.push(item);
        }
      }
    });

    return filtered;
  };

  // 根据搜索值生成扁平化搜索结果
  const flatSearchResults = useMemo(() => {
    if (!searchValue.trim()) {
      return [];
    }
    return flattenMenuItems(menuItems, searchValue);
  }, [searchValue]);

  // 根据搜索值过滤菜单（用于树形菜单）
  const filteredMenuItems = useMemo(() => {
    return filterMenuItems(menuItems, searchValue);
  }, [searchValue]);

  // 搜索时自动展开匹配的菜单
  useEffect(() => {
    if (searchValue.trim()) {
      const keysToOpen: string[] = [];
      menuItems?.forEach((item) => {
        if (!item || typeof item === "string" || item.type === "divider") {
          return;
        }
        if ("children" in item && item.children) {
          const hasMatch = item.children.some((child) => {
            if (!child || typeof child === "string" || child.type === "divider") {
              return false;
            }
            const childLabel = "label" in child && child.label ? child.label.toString().toLowerCase() : "";
            return childLabel.includes(searchValue.toLowerCase());
          });
          if (hasMatch && item.key) {
            keysToOpen.push(item.key as string);
          }
        }
      });
      setOpenKeys(keysToOpen);
    }
    // 移除 else 分支，不再在路由变化时重置 openKeys
  }, [searchValue]);

  // 监听路由变化，自动展开当前路径对应的菜单（但不收起已展开的菜单）
  useEffect(() => {
    if (!searchValue.trim()) {
      // 只在非搜索状态下，自动展开当前路径对应的菜单
      const path = location.pathname || "/";
      const keysToOpenForCurrentPath = getKeysToOpen(path);

      // 将当前路径对应的菜单 key 添加到已展开的列表中（如果不存在）
      setOpenKeys((prevKeys) => {
        const newKeys = [...prevKeys];
        keysToOpenForCurrentPath.forEach((key) => {
          if (!newKeys.includes(key)) {
            newKeys.push(key);
          }
        });
        return newKeys;
      });
    }
  }, [location.pathname, searchValue]);

  return {
    collapsed,
    searchValue,
    openKeys,
    selectedKeys,
    flatSearchResults,
    filteredMenuItems,
    handleComplete,
    handleSearchChange,
    handleMenuClick,
    handleOpenChange,
    flattenMenuItems,
  };
};

export default useLayout;
