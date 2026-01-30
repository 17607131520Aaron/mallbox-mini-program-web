import React from "react";

import { useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";

import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Typography } from "antd";

import "./index.scss";

const { Title, Text } = Typography;

interface ILoginFormValues {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [loginForm] = Form.useForm<ILoginFormValues>();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as Location & {
    state?: { from?: { pathname?: string } };
  };

  // const { login } = useAuth();

  const handleLoginSubmit = async (values: ILoginFormValues): Promise<void> => {
    setSubmitting(true);
    setError(null);
    try {
      console.log(values, "values");
      // const redirectPath: string = location.state?.from?.pathname ?? "/";
      // navigate(redirectPath, { replace: true });
    } catch {
      const redirectPath: string = location.state?.from?.pathname ?? "/";
      navigate(redirectPath, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToRegister = (): void => {
    navigate("/register", { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-page__glow login-page__glow--left" />
      <div className="login-page__glow login-page__glow--right" />

      <div className="login-page__content">
        <div className="login-page__left">
          <div className="login-page__badge">
            <span className="login-page__badge-dot" />
            <span>实时洞察 · 性能可视 · 安全稳定</span>
          </div>

          <div className="login-page__title">不知道叫啥的某系统</div>
          <div className="login-page__subtitle">
            一套为中大型团队设计的统一管理中台，提供条码管理、文档协同、团队权限、系统监控等能力，
            让你的业务像游戏一样顺滑、高效。
          </div>

          <div className="login-page__highlights">
            <span className="login-page__chip">⚡ 实时性能监控</span>
            <span className="login-page__chip">🛡️ 多维安全策略</span>
            <span className="login-page__chip">📊 可视化数据面板</span>
            <span className="login-page__chip">☁️ 云端同步 & 历史留存</span>
          </div>
        </div>

        <div className="login-page__right">
          <div className="login-page__card">
            <div className="login-page__card-header">
              <div>
                <Title className="login-page__card-title" level={4} style={{ color: "#fff" }}>
                  欢迎回来，管理员
                </Title>
                <Text className="login-page__card-desc">使用账号登录以进入管理控制台</Text>
              </div>
              <span className="login-page__card-pill">Beta · 内部环境</span>
            </div>

            {error ? <Alert showIcon style={{ marginBottom: 16 }} title={error} type="error" /> : null}

            <Form<ILoginFormValues>
              form={loginForm}
              initialValues={{ username: "admin" }}
              layout="vertical"
              onFinish={handleLoginSubmit}
            >
              <Form.Item
                label={<span style={{ color: "#fff" }}>账号</span>}
                name="username"
                rules={[{ required: true, message: "请输入账号" }]}
              >
                <Input
                  autoComplete="username"
                  placeholder="请输入账号"
                  prefix={<UserOutlined style={{ color: "#90a4ae" }} />}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: "#fff" }}>密码</span>}
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  autoComplete="current-password"
                  placeholder="请输入密码"
                  prefix={<LockOutlined style={{ color: "#90a4ae" }} />}
                  size="large"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 8 }}>
                <Button
                  block
                  htmlType="submit"
                  icon={<LoginOutlined />}
                  loading={submitting}
                  size="large"
                  type="primary"
                >
                  登录系统
                </Button>
              </Form.Item>

              <div className="login-page__footer">
                <span>
                  还没有账号？{" "}
                  <a style={{ color: "#90caf9", cursor: "pointer" }} onClick={handleGoToRegister}>
                    立即注册
                  </a>
                </span>
              </div>
            </Form>

            <div className="login-page__footer-bottom">
              <span>默认演示账号：admin / 任意密码</span>
              <span>© {new Date().getFullYear()} 某不知名系统</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
