"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useSetTitle } from "@/contexts/title-context";
import Pagination from "@/components/pagination";
import { useForm } from "react-hook-form";
import { Resource, Category } from "@/lib/db/schema";
import { getTotalPages } from "@/utils";
import { useSearchParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// 定义搜索表单数据类型
interface SearchFormData {
  title: string;
}

// 添加资源表单数据类型
interface ResourceFormData {
  id: number;
  title: string;
  categoryKey: string;
  url: string;
  pinyin: string;
  desc: string;
  diskType: string;
  hotNum: number;
  isShowHome: number;
}

export default function AdminResource() {
  // 设置当前页面标题
  useSetTitle("资源管理");

  // 添加加载状态
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    // 从URL参数中获取页码
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setPage(parseInt(pageParam));
    }

    getResources();
    getCategories();
  }, [searchParams]); // 添加searchParams作为依赖项

  const getResources = async (title: string = "") => {
    // 设置加载状态为true
    setLoading(true);

    try {
      // 构建查询参数
      const params = new URLSearchParams();
      if (title) {
        params.append("title", title);
      }

      const currentPage = searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : page;

      params.append("page", currentPage.toString());
      params.append("pageSize", pageSize.toString());

      const res = await fetch(`/api/resource/list?${params.toString()}`, {
        method: "GET",
      });
      const data = await res.json();
      setResources(data.list);
      setTotalPages(getTotalPages(data.total, pageSize));
    } catch (error) {
      console.error("获取资源列表失败:", error);
    } finally {
      // 无论成功或失败，都将加载状态设为false
      setLoading(false);
    }
  };

  const saveResource = async (
    title: string,
    categoryKey: string,
    url: string,
    pinyin: string,
    desc: string,
    diskType: string,
    hotNum: number,
    isShowHome: number,
    id?: number,
  ) => {
    const res = await fetch(`/api/resource/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        categoryKey,
        url,
        pinyin,
        desc,
        diskType,
        hotNum,
        isShowHome,
        id,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      getResources();
    }
  };

  const getCategories = async () => {
    const res = await fetch(`/api/category/all`, {
      method: "GET",
    });
    const data = await res.json();
    setCategories(data);
  };
  // 示例数据
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  // 编辑状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] =
    useState<Partial<Resource> | null>(null);
  const [dialogTitle, setDialogTitle] = useState("添加新资源");

  // 使用 React Hook Form
  const { register, handleSubmit, reset, setValue } = useForm<SearchFormData>({
    defaultValues: {
      title: "",
    },
  });

  // 为资源表单创建单独的 form hook
  const resourceForm = useForm<ResourceFormData>({
    defaultValues: {
      title: "",
      categoryKey: "",
      url: "",
      pinyin: "",
      desc: "",
      diskType: "",
      hotNum: 0,
      isShowHome: 0,
    },
  });

  // 打开添加资源对话框
  const openAddDialog = () => {
    setCurrentResource(null);
    setDialogTitle("添加新资源");
    resourceForm.reset({
      title: "",
      categoryKey: "",
      url: "",
      pinyin: "",
      desc: "",
      diskType: "",
      hotNum: 0,
      isShowHome: 0,
    });
    setIsDialogOpen(true);
  };

  // 打开编辑资源对话框
  const openEditDialog = (resource: Resource) => {
    setCurrentResource(resource);
    setDialogTitle("编辑资源");
    resourceForm.reset({
      id: resource.id,
      title: resource.title,
      categoryKey: resource.categoryKey,
      url: resource.url,
      pinyin: resource.pinyin,
      desc: resource.desc,
      diskType: resource.diskType,
      hotNum: resource.hotNum || 0,
      isShowHome: resource.isShowHome || 0,
    });
    setIsDialogOpen(true);
  };

  // 保存资源（添加或编辑）
  const handleSaveResource = async (data: ResourceFormData) => {
    try {
      await saveResource(
        data.title,
        data.categoryKey,
        data.url,
        data.pinyin,
        data.desc,
        data.diskType,
        data.hotNum,
        data.isShowHome,
        currentResource ? currentResource.id : undefined,
      );
      setIsDialogOpen(false);
    } catch (error) {
      console.error("保存资源失败:", error);
    }
  };

  // 删除资源
  const handleDeleteResource = async (id: number) => {
    if (!confirm("确定要删除这个资源吗？")) {
      return;
    }

    try {
      const res = await fetch(`/api/resource/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        getResources();
      }
    } catch (error) {
      console.error("删除资源失败:", error);
    }
  };

  // 处理搜索表单提交
  const onSearch = (data: SearchFormData) => {
    // 搜索时重置为第一页
    setPage(1);
    getResources(data.title);
  };

  // 重置搜索表单
  const handleReset = () => {
    reset();
    setPage(1);
    getResources();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 text-sm">
      <form onSubmit={handleSubmit(onSearch)} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="search-name" className="text-left">
              资源名称
            </Label>
            <Input
              id="search-name"
              placeholder="搜索资源名称"
              {...register("title")}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="mr-2">
              搜索
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>
      </form>

      <div className="flex justify-between items-center mb-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={openAddDialog}>
              <PlusCircle className="h-4 w-4" />
              添加资源
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[700px] w-[90vw]">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>
                {currentResource ? "修改资源信息" : "填写以下信息创建新的资源"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={resourceForm.handleSubmit(handleSaveResource)}>
              <div className="grid gap-2 py-2">
                <div className="grid grid-cols-12 items-center gap-2">
                  <Label
                    htmlFor="resource-name"
                    className="text-right text-sm col-span-2"
                  >
                    名称
                  </Label>
                  <Input
                    id="resource-name"
                    {...resourceForm.register("title", {
                      required: "请输入资源名称",
                    })}
                    className="col-span-10"
                  />
                </div>
                <div className="grid grid-cols-12 items-start gap-2">
                  <Label
                    htmlFor="resource-desc"
                    className="text-right text-sm pt-2 col-span-2"
                  >
                    描述
                  </Label>
                  <Textarea
                    id="resource-desc"
                    {...resourceForm.register("desc", {
                      required: "请输入资源描述",
                    })}
                    className="col-span-10"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <Label
                    htmlFor="resource-key"
                    className="text-right text-sm col-span-2"
                  >
                    分类
                  </Label>
                  <div className="col-span-10">
                    <Select
                      value={resourceForm.watch("categoryKey")}
                      onValueChange={(value) => {
                        resourceForm.setValue("categoryKey", value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.key}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <Label
                    htmlFor="resource-url"
                    className="text-right text-sm col-span-2"
                  >
                    网址
                  </Label>
                  <Input
                    id="resource-url"
                    {...resourceForm.register("url", {
                      required: "请输入资源网址",
                    })}
                    className="col-span-10"
                  />
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <Label
                    htmlFor="resource-pinyin"
                    className="text-right text-sm col-span-2"
                  >
                    拼音
                  </Label>
                  <Input
                    id="resource-pinyin"
                    {...resourceForm.register("pinyin", {
                      required: "请输入资源拼音",
                    })}
                    className="col-span-10"
                  />
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <Label
                    htmlFor="resource-diskType"
                    className="text-right text-sm col-span-2"
                  >
                    网盘类型
                  </Label>
                  <Input
                    id="resource-diskType"
                    {...resourceForm.register("diskType", {
                      required: "请输入资源网盘类型",
                    })}
                    className="col-span-4"
                  />
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <Label
                    htmlFor="resource-hotNum"
                    className="text-right text-sm col-span-2"
                  >
                    热度
                  </Label>
                  <Input
                    id="resource-hotNum"
                    {...resourceForm.register("hotNum", {
                      required: "请输入资源热度",
                    })}
                    className="col-span-4"
                  />
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <Label
                    htmlFor="resource-isShowHome"
                    className="text-right text-sm col-span-2"
                  >
                    显示在首页
                  </Label>
                  <div className="col-span-4">
                    <Switch
                      id="resource-isShowHome"
                      checked={resourceForm.watch("isShowHome") === 1}
                      onCheckedChange={(checked: boolean) => {
                        resourceForm.setValue("isShowHome", checked ? 1 : 0);
                      }}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">保存</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">id</TableHead>
                <TableHead className="w-[150px]">名称</TableHead>
                <TableHead className="w-[300px]">描述</TableHead>
                <TableHead className="w-[80px]">网盘类型</TableHead>
                <TableHead className="w-[80px]">热度</TableHead>
                <TableHead className="w-[120px]">是否显示在首页</TableHead>
                <TableHead className="text-right w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // 加载状态显示
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>加载中...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : resources.length === 0 ? (
                // 无数据状态显示
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                // 数据列表显示
                resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">{resource.id}</TableCell>
                    <TableCell title={resource.title}>
                      {resource.title}
                    </TableCell>
                    <TableCell
                      className="truncate max-w-[300px]"
                      title={resource.desc}
                    >
                      {resource.desc}
                    </TableCell>
                    <TableCell title={resource.diskType}>
                      {resource.diskType}
                    </TableCell>
                    <TableCell>{resource.hotNum}</TableCell>
                    <TableCell>
                      {resource.isShowHome == 1 ? "是" : "否"}
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(resource)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-center mt-4 py-2">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
          }}
        />
      </div>
    </div>
  );
}
