> ## Documentation Index
> Fetch the complete documentation index at: https://docs.bigmodel.cn/llms.txt
> Use this file to discover all available pages before exploring further.

# 开源仓库 MCP

<Info>
  开源仓库 MCP Server (ZRead MCP) 是一个基于模型上下文协议 (Model Context Protocol) 的开源仓库内容获取能力实现，基于 [zread.ai](https://zread.ai) 的强大能力，为 Claude Code, Cline 等兼容 MCP 的客户端提供开源仓库的知识文档与代码访问功能。
</Info>

## 产品简介

<Tip>
  此拥有开源仓库问答能力的 Remote MCP Server 是智谱为 **GLM Coding Plan 用户开发的专属 Server**, 让您的 Code Agent 能够深入理解开源项目，高效获取文档、代码结构与文件内容。
</Tip>

## 功能特性

<CardGroup cols={3}>
  <Card title="文档搜索" icon={<svg style={{maskImage: "url(/resource/icon/book.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    Github 代码仓库检索文档、代码与注释
  </Card>

  <Card title="仓库结构" icon={<svg style={{maskImage: "url(/resource/icon/window.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    获取 GitHub 仓库的目录结构和文件列表，快速掌握项目布局
  </Card>

  <Card title="代码读取" icon={<svg style={{maskImage: "url(/resource/icon/code.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    读取 GitHub 仓库中指定文件的完整代码内容，深入分析实现细节
  </Card>
</CardGroup>

## 支持的工具

该服务器实现了模型上下文协议，可与任何兼容 MCP 的客户端一起使用。目前提供以下工具：

* **`search_doc`** - 搜索 GitHub 仓库的对应的知识文档，快速了解仓库知识，新闻，最近的 issue pr 和贡献者等。
* **`get_repo_structure`** - 获取 GitHub 仓库的目录结构和文件列表，了解项目模块拆分和目录组织方式。
* **`read_file`** - 读取 GitHub 仓库中指定文件的完整代码内容，深入文件代码的实现细节。

## 示例场景

<AccordionGroup>
  <Accordion title="快速上手开源库" defaultOpen>
    通过搜索文档和获取仓库结构，快速了解开源库的核心概念、安装步骤和代码组织方式，加速学习曲线。
  </Accordion>

  <Accordion title="排查 Issue 和历史记录" defaultOpen>
    在遇到问题时，搜索仓库的 Issue 和 Commit 历史，查找是否有类似问题的解决方案或修复记录。
  </Accordion>

  <Accordion title="深入源码分析">
    直接读取核心文件的代码内容，分析实现逻辑，辅助进行二次开发或 Debug。
  </Accordion>

  <Accordion title="依赖库调研">
    在引入新的依赖库之前，通过查看其仓库结构和文档，评估其活跃度、代码质量和维护情况。
  </Accordion>
</AccordionGroup>

## 安装与使用

### 快速开始

<Steps>
  <Step title="获取访问令牌">
    前往 [智谱开放平台](https://open.bigmodel.cn/usercenter/apikeys) 获取您的 API Key
  </Step>

  <Step title="配置 MCP 服务器">
    根据您使用的客户端 **参考下方** 选择相应的配置方式
  </Step>
</Steps>

### 支持的客户端

<Tabs>
  <Tab title="Claude Code">
    **一键安装命令**

    注意替换里面的 `your_api_key` 为您上一步获取到的 API Key

    ```bash  theme={null}
    claude mcp add -s user -t http zread https://open.bigmodel.cn/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
    ```

    **手动配置**

    编辑 Claude Code 的配置文件, 位于用户目录下 `.claude.json` 的 MCP 部分：

    ```json  theme={null}
    {
      "mcpServers": {
        "zread": {
          "type": "http",
          "url": "https://open.bigmodel.cn/api/mcp/zread/mcp",
          "headers": {
            "Authorization": "Bearer your_api_key"
          }
        }
      }
    }
    ```
  </Tab>

  <Tab title="Cline (VS Code)">
    在 Cline 扩展设置中添加 MCP 服务器配置：

    注意替换里面的 `your_api_key` 为您上一步获取到的 API Key

    ```json  theme={null}
    {
      "mcpServers": {
        "zread": {
          "type": "streamableHttp",
          "url": "https://open.bigmodel.cn/api/mcp/zread/mcp",
          "headers": {
            "Authorization": "Bearer your_api_key"
          }
        }
      }
    }
    ```

    若老版本 Cline 不支持 StreamableHttp 类型的 MCP 服务器，可以使用 SSE 类型的配置：

    ```json  theme={null}
    {
      "mcpServers": {
        "zread": {
          "type": "sse",
          "url": "https://open.bigmodel.cn/api/mcp/zread/sse?Authorization=your_api_key"
        }
      }
    }
    ```
  </Tab>

  <Tab title="OpenCode">
    在 OpenCode 设置中添加 MCP 服务器配置：

    参考 [OpenCode MCP 文档](https://opencode.ai/docs/mcp-servers)

    注意替换里面的 `your_api_key` 为您上一步获取到的 API Key

    ```json  theme={null}
    {
        "$schema": "https://opencode.ai/config.json",
        "mcp": {
            "zread": {
                "type": "remote",
                "url": "https://open.bigmodel.cn/api/mcp/zread/mcp",
                "headers": {
                    "Authorization": "Bearer your_api_key"
                }
            }
        }
    }
    ```
  </Tab>

  <Tab title="Crush">
    在 Crush 设置中添加 MCP 服务器配置：

    注意替换里面的 `your_api_key` 为您上一步获取到的 API Key

    ```json  theme={null}
    {
        "$schema": "https://charm.land/crush.json",
        "mcp": {
            "zread": {
                "type": "http",
                "url": "https://open.bigmodel.cn/api/mcp/zread/mcp",
                "headers": {
                    "Authorization": "Bearer your_api_key"
                }
            }
        }
    }
    ```
  </Tab>

  <Tab title="Goose">
    暂时 Goose 不支持，详见 [Issue](https://github.com/block/goose/issues/6576)

    在 Goose 设置中添加 MCP 服务器配置：

    点击 `Extensions` -> `Add custom extension`

    配置 Extension Name 为 `zread`，Type 选择 `HTTP`，Endpoint 填写如下 URL：

    ```
    https://open.bigmodel.cn/api/mcp/zread/mcp
    ```

    配置 Request Headers 添加 `Authorization` : `your_api_key`

    最后点击底部 `Add Extension` 即可，注意替换里面的 `your_api_key` 为您上一步获取到的 API Key
  </Tab>

  <Tab title="Roo Code, Kilo Code 其它">
    对于 Roo Code, Kilo Code 等其它支持 MCP 协议的客户端，参考以下通用配置：

    注意替换里面的 `your_api_key` 为您上一步获取到的 API Key

    ```json  theme={null}
    {
      "mcpServers": {
        "zread": {
          "type": "streamable-http",
          "url": "https://open.bigmodel.cn/api/mcp/zread/mcp",
          "headers": {
            "Authorization": "Bearer your_api_key"
          }
        }
      }
    }
    ```
  </Tab>
</Tabs>

## MCP 使用额度说明

<Check>
  调用额度如下：

  * **Lite 套餐**：联网搜索 MCP 和网页读取 MCP，ZRead MCP 每月合计 1 百次，达到上限后当月无法调用；视觉理解 MCP 共享套餐的 5 小时最大 prompt 资源池，达到上限后会在 5 小时周期后恢复额度。
  * **Pro 套餐**：联网搜索 MCP 和网页读取 MCP，ZRead MCP 每月合计 1 千次，达到上限后当月无法调用；视觉理解 MCP 共享套餐的 5 小时最大 prompt 资源池，达到上限后会在 5 小时周期后恢复额度。
  * **Max 套餐**：联网搜索 MCP 和网页读取 MCP，ZRead MCP 每月合计 4 千次，达到上限后当月无法调用；视觉理解 MCP 共享套餐的 5 小时最大 prompt 资源池，达到上限后会在 5 小时周期后恢复额度。
</Check>

## 故障排除

<AccordionGroup>
  <Accordion title="访问令牌无效">
    **问题：** 收到访问令牌无效的错误

    **解决方案：**

    1. 确认访问令牌是否正确复制
    2. 检查访问令牌是否已激活
    3. 确认访问令牌是否有足够的余额
    4. 检查 Authorization header 格式是否正确
  </Accordion>

  <Accordion title="连接超时">
    **问题：** MCP 服务器连接超时

    **解决方案：**

    1. 检查网络连接
    2. 确认防火墙设置
    3. 验证服务器 URL 是否正确
    4. 增加超时时间设置
  </Accordion>

  <Accordion title="仓库访问失败">
    **问题：** 无法搜索或读取指定仓库内容

    **解决方案：**

    1. 确认仓库是否存在且为开源（公开）仓库
    2. 检查仓库名称拼写是否正确 (owner/repo)
    3. 访问 zread.ai 搜索此开源仓库是否被收纳支持
  </Accordion>
</AccordionGroup>

## 相关资源

* [模型上下文协议 (MCP) 官方文档](https://modelcontextprotocol.io/)
* [Claude Code MCP 配置指南](https://docs.anthropic.com/en/docs/claude-code/mcp)
* [智谱 API 文档](/cn/api/introduction)
* [GLM Coding Plan 介绍](/cn/coding-plan/overview)
