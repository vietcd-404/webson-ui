import React from "react";

import {
  MinusCircleOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Tabs, message } from "antd";
import { useState } from "react";
import { useEffect } from "react";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 4,
    },
  },
};
const { TabPane } = Tabs;

const BanHang = () => {
  const [form] = Form.useForm();
  const [tabFields, setTabFields] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      invoices: tabFields.map((field, index) => ({
        ...field,
        key: field.key || index,
      })),
    });
  }, [tabFields, form]);
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };

  return (
    <Form
      form={form}
      name="dynamic_form_item"
      onFinish={onFinish}
      style={{
        maxWidth: "100%",
      }}
    >
      <Form.List
        name="invoices"
        initialValue={[{ key: 0 }]} // Khởi tạo mảng với một tab
      >
        {(fields, { add, remove }) => (
          <>
            <Button
              type="dashed"
              onClick={() => {
                if (fields.length < 5) {
                  add();
                  setTabFields([...tabFields, { key: fields.length }]);
                } else {
                  message.error("Tạo tối đa 5 hóa đơn");
                  return;
                }
              }}
              style={{
                width: "60%",
                marginBottom: "10px",
              }}
              icon={<PlusOutlined />}
            >
              Tạo hóa đơn
            </Button>

            <Tabs
              type="editable-card"
              tabBarExtraContent={{
                right: (
                  <Button
                    type="text"
                    onClick={() => {
                      add();
                      setTabFields([...tabFields, { key: fields.length }]);
                    }}
                    icon={<PlusOutlined />}
                  >
                    Tạo hóa đơn
                  </Button>
                ),
              }}
              onEdit={(targetKey, action) => {
                if (action === "remove") {
                  //   const updatedTabFields = tabFields.filter(
                  //     (field) => field.key !== Number(targetKey)
                  //   );
                  //   setTabFields(updatedTabFields);
                  remove(targetKey);
                }
              }}
            >
              {fields.map((field) => (
                <TabPane
                  tabBarExtraContent=""
                  active=""
                  tab={`Hóa đơn ${field.key + 1}`}
                  key={field.key}
                  closable={fields.length >= 1}
                  closeIcon={
                    <CloseOutlined onClick={() => remove(field.name)} />
                  }
                >
                  <Form.Item
                    label="Tên"
                    name={[field.name, "tenSanPham"]}
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Tên loại không được để trống!",
                      },
                    ]}
                  >
                    <Input placeholder="Tên" />
                  </Form.Item>
                </TabPane>
              ))}
            </Tabs>
          </>
        )}
      </Form.List>
      <Form.ErrorList />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BanHang;
