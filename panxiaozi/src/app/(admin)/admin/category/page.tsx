"use client";

import { Suspense, useEffect, useState } from "react";
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
import { Category } from "@/lib/db/schema";
import { getTotalPages } from "@/utils";
import { useSafeSearchParams } from "@/hooks/use-safe-search-params";
// 定义搜索表单数据类型
interface SearchFormData {
  name: string;
}

export default function AdminCategory() {
  // 设置当前页面标题
  useSetTitle("分类管理");

  // 添加加载状态
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(0);
  const searchParams = useSafeSearchParams();

  useEffect(() => {
    // 从URL参数中获取页码
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setPage(parseInt(pageParam));
    }

    getCategories();
  }, [searchParams]); // 添加searchParams作为依赖项

  const getCategories = async (name: string = "") => {
    // 设置加载状态为true
    setLoading(true);

    try {
      // 构建查询参数
      const params = new URLSearchParams();
      if (name) {
        params.append("name", name);
      }

      const currentPage = searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : page;

      params.append("page", currentPage.toString());
      params.append("pageSize", pageSize.toString());

      const res = await fetch(`/api/category/list?${params.toString()}`, {
        method: "GET",
      });
      const data = await res.json();
      setCategories(data.list);
      setTotalPages(getTotalPages(data.total, pageSize));
    } catch (error) {
      console.error("获取分类列表失败:", error);
    } finally {
      // 无论成功或失败，都将加载状态设为false
      setLoading(false);
    }
  };

  const saveCategory = async (name: string, key: string, id?: number) => {
    const res = await fetch(`/api/category/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, key, id }),
    });
    const data = await res.json();
    if (res.ok) {
      getCategories();
    }
  };

  // 示例数据
  const [categories, setCategories] = useState<Category[]>([]);

  // 编辑状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<Partial<Category> | null>(null);
  const [dialogTitle, setDialogTitle] = useState("添加新分类");

  // 使用 React Hook Form
  const { register, handleSubmit, reset, setValue } = useForm<SearchFormData>({
    defaultValues: {
      name: "",
    },
  });

  // 添加分类表单数据
  const [categoryName, setCategoryName] = useState("");
  const [categoryKey, setCategoryKey] = useState("");

  // 打开添加分类对话框
  const openAddDialog = () => {
    setCurrentCategory(null);
    setDialogTitle("添加新分类");
    setCategoryName("");
    setCategoryKey("");
    setIsDialogOpen(true);
  };

  // 打开编辑分类对话框
  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setDialogTitle("编辑分类");
    setCategoryName(category.name);
    setCategoryKey(category.key);
    setIsDialogOpen(true);
  };

  // 保存分类（添加或编辑）
  const handleSaveCategory = async () => {
    if (!categoryName || !categoryKey) {
      alert("请填写完整信息");
      return;
    }

    try {
      await saveCategory(
        categoryName,
        categoryKey,
        currentCategory ? currentCategory.id : undefined,
      );
      setIsDialogOpen(false);
    } catch (error) {
      console.error("保存分类失败:", error);
    }
  };

  // 删除分类
  const handleDeleteCategory = async (id: number) => {
    if (!confirm("确定要删除这个分类吗？")) {
      return;
    }

    try {
      const res = await fetch(`/api/category/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        getCategories();
      }
    } catch (error) {
      console.error("删除分类失败:", error);
    }
  };

  // 处理搜索表单提交
  const onSearch = (data: SearchFormData) => {
    // 搜索时重置为第一页
    setPage(1);
    getCategories(data.name);
  };

  // 重置搜索表单
  const handleReset = () => {
    reset();
    setPage(1);
    getCategories();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 text-sm">
      <form onSubmit={handleSubmit(onSearch)} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="search-name" className="text-left">
              分类名称
            </Label>
            <Input
              id="search-name"
              placeholder="搜索分类名称"
              {...register("name")}
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
              添加分类
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>
                {currentCategory ? "修改分类信息" : "填写以下信息创建新的分类"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category-name" className="text-right">
                  名称
                </Label>
                <Input
                  id="category-name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category-key" className="text-right">
                  key
                </Label>
                <Input
                  id="category-key"
                  value={categoryKey}
                  onChange={(e) => setCategoryKey(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSaveCategory}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>id</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>key</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // 加载状态显示
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
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
              ) : categories.length === 0 ? (
                // 无数据状态显示
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                // 数据列表显示
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.key}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
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
