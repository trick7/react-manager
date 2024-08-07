import { IAuthLoader } from "@/router/AuthLoader";
import { findTreeNode } from "@/utils";
import { Breadcrumb } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useRouteLoaderData } from "react-router-dom";

export default function BreadCrumb() {
  const { pathname } = useLocation() // 获取当前路由
  const [breadList, setBreadList] = useState<(string | ReactNode)[]>([])
  //权限判断
  const data = useRouteLoaderData('layout') as IAuthLoader

  const list = findTreeNode(data.menuList, pathname, [])// 递归查找路径
  useEffect(() => {
    setBreadList([
      <a href='/welcome'> 首页 </a>,
      ...list
    ])
  }, [pathname])
  return <Breadcrumb items={breadList.map(item => ({ title: item }))} style={{ marginLeft: 10 }} />
}
