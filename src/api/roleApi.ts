import request from '@/utils/request'
import { ResultData, Role } from '@/types/api'
export default {
  //获取角色列表
  getRoleList(params: Role.Params) {
    return request.get<ResultData<Role.RoleItem>>('/roles/list', params)
  },
  //创建角色
  createRoleList(params: Role.CreateParams) {
    return request.post('/roles/create', params)
  },
  //编辑角色
  editRoleList(params: Role.EditParams) {
    return request.post('/roles/edit', params)
  },
  //删除角色
  delRoleList(params: Role.DelParams) {
    return request.post('/roles/delete', params)
  }
}
