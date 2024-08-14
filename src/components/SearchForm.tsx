import { Button, Form, Space } from "antd";


/**
 * 搜索表单容器组件封装
 * @param props
 * @returns
 */
export default function SearchForm(props: any) {
  return (
    <Form className='serch-form' form={props.form} layout='inline' initialValues={props.initialValues}>
      {props.children}
      <Form.Item>
        <Space>
          <Button type='primary' onClick={props.handleSearch}>
            搜索
          </Button>
          <Button type='default' onClick={props.handleReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
