import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import Swal from "sweetalert2";

const initialState = {
  userInfo: [],
  products: [],
  updateStatus: [],
};

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find(
        (item) => item.maSanPhamCT === action.payload.maSanPhamCT
      );
      if (item) {
        item.soLuong += action.payload.soLuong;
      } else {
        state.products.push(action.payload);
      }
      Swal.fire({
        title: "Thành công!",
        text: "Thêm vào giỏ hàng thành công",
        icon: "success",
      });
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item.maSanPhamCT === action.payload.maSanPhamCT
      );
      if (item) {
        if (item.soLuong < 10) {
          item.soLuong++;
        } else {
          message.error("Vượt giới hạn mua, vui lòng đăng nhập để mua thêm");
        }
      }
    },
    drecreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item.maSanPhamCT === action.payload.maSanPhamCT
      );
      if (item.soLuong === 1) {
        item.soLuong = 1;
      } else {
        item.soLuong--;
      }
    },
    updateQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item.maSanPhamCT === action.payload.maSanPhamCT
      );
      if (item) {
        // Assuming you want to set the quantity to a specific value
        item.soLuong = action.payload.newQuantity;
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item.maSanPhamCT !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
    updateStatus: (state, action) => {
      // Lấy dữ liệu từ action và cập nhật vào trạng thái
      state.updateStatus = action.payload;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  drecreaseQuantity,
  deleteItem,
  resetCart,
  updateQuantity,
  updateStatus,
} = orebiSlice.actions;
export default orebiSlice.reducer;
