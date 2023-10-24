import { Card, Form, Select, Table, Input, Button } from "antd";
import React, { useEffect, useState } from "react";
import { findAllLoai } from "../../services/LoaiService";
import { findAllSanPham } from "../../services/SanPhamService";
import { findAllMau } from "../../services/MauService";
import { findAllThuongHieu } from "../../services/ThuongHieuService";
import { creatSPCT } from "../../services/SanPhamChiTietService";
import { toast } from "react-toastify";

const TableWithInput = () => {
  const [selectedValues1, setSelectedValues1] = useState([]);
  const [selectedValues2, setSelectedValues2] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [dataLoai, setDataLoai] = useState([]);
  const [dataSanPham, setDataSanPham] = useState([]);

  const [loadingLoai, setLoadingLoai] = useState(false);

  const isEditing = (record) => record.id === editingKey;

  const handleSelectChange1 = (values) => {
    setSelectedValues1(values);
    updateTableData(selectedValues2, values);
  };

  const handleSelectChange2 = (values) => {
    setSelectedValues2(values);
    updateTableData(values, selectedValues1);
  };

  const updateTableData = (values1, values2) => {
    const newData = values1.map((value, index) => ({
      id: new Date().getTime() + index,
      value1: value,
      value2: values2,
      value3: "Ô 3",
    }));
    setTableData(newData);
  };

  const loadLoaiData = async () => {
    setLoadingLoai(true);
    try {
      const response = await findAllLoai();
      setDataLoai(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    } finally {
      setLoadingLoai(false);
    }
  };
  const loadTableSanPham = async () => {
    try {
      const response = await findAllSanPham();
      setDataSanPham(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  useEffect(() => {
    loadLoaiData();
    loadTableSanPham();
  }, []);

  const columns = [
    {
      title: "Ô 1",
      dataIndex: "value1",
      key: "value1",
    },
    {
      title: "Ô 2",
      dataIndex: "value2",
      key: "value2",
    },
    {
      title: "Ô 3",
      dataIndex: "value3",
      key: "value3",
      render: (text, record) => {
        const editable = isEditing(record);

        return editable ? (
          <Input
            style={{ width: "100px" }}
            value={text}
            onChange={(e) => handleTableEdit(e.target.value, "value3", record)}
            onBlur={() => save(record.id)}
          />
        ) : (
          <div onClick={() => edit(record.id)}>{text}</div>
        );
      },
    },
  ];

  const handleTableEdit = (value, dataIndex, record) => {
    const newTableData = [...tableData];
    const targetIndex = newTableData.findIndex((item) => record.id === item.id);

    if (targetIndex > -1) {
      newTableData[targetIndex][dataIndex] = value;
      setTableData(newTableData);
    }
  };

  const edit = (key) => {
    setEditingKey(key);
  };

  const save = (key) => {
    setEditingKey("");
  };

  return (
    <div>
      <Card
        title="Multi-Selection Fields"
        bordered={false}
        style={{ width: "100%" }}
      >
        <Select
          placeholder="Select one or more values for Field 1"
          value={selectedValues1}
          onChange={handleSelectChange1}
          style={{ width: "100%" }}
        >
          {dataSanPham.map((item) => (
            <Select.Option key={item.maSanPham} value={item.tenSanPham}>
              {item.tenSanPham}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Select one or more values for Field 2"
          value={selectedValues2}
          onChange={handleSelectChange2}
          style={{ width: "100%" }}
          mode="multiple"
        >
          {loadingLoai ? (
            <Select.Option disabled value="Loading">
              Loading Loai...
            </Select.Option>
          ) : (
            dataLoai.map((item) => (
              <Select.Option key={item.maLoai} value={item.tenLoai}>
                {item.tenLoai}
              </Select.Option>
            ))
          )}
        </Select>
      </Card>

      <Card title="Table" bordered={false} style={{ width: "100%" }}>
        <Table dataSource={tableData} columns={columns} rowKey="id" />
      </Card>
      <Button>Tạo mới</Button>
    </div>
  );
};

export default TableWithInput;
