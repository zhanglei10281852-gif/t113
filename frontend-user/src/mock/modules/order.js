import Mock from "mockjs";

// 订单状态：0待付款 1待发货 2待收货 3已完成 4已取消
const statusMap = {
  0: "待付款",
  1: "待发货",
  2: "待收货",
  3: "已完成",
  4: "已取消",
};

const U = (id) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop`;

const defaultAddress = {
  name: "张三",
  phone: "138****8888",
  province: "广东省",
  city: "深圳市",
  district: "南山区",
  detail: "科技园路88号",
};

let nextOrderId = 1000;

let orders = [
  {
    id: 901,
    orderNo: "ORD20260225100001",
    items: [
      {
        productId: 1,
        name: "iPhone 15 Pro Max",
        image: U("1695048133142-1a20484d2569"),
        price: 9999,
        quantity: 1,
        spec: "256GB 原色钛金属",
      },
      {
        productId: 6,
        name: "机械键盘套装",
        image: U("1618384887929-16ec33fab9ef"),
        price: 599,
        quantity: 1,
        spec: "红轴 RGB",
      },
    ],
    totalAmount: 10598,
    address: defaultAddress,
    status: 2,
    statusText: statusMap[2],
    createTime: "2026/2/25 10:00:01",
    payTime: "2026/2/25 10:02:33",
  },
  {
    id: 902,
    orderNo: "ORD20260226143052",
    items: [
      {
        productId: 7,
        name: "Sony头戴式耳机",
        image: U("1505740420928-5e560c06d30e"),
        price: 1999,
        quantity: 1,
        spec: "WH-1000XM5 黑色",
      },
    ],
    totalAmount: 1999,
    address: defaultAddress,
    status: 2,
    statusText: statusMap[2],
    createTime: "2026/2/26 14:30:52",
    payTime: "2026/2/26 14:31:10",
  },
  {
    id: 903,
    orderNo: "ORD20260227091520",
    items: [
      {
        productId: 2,
        name: "MacBook Pro 14英寸",
        image: U("1517336714731-489689fd1ca8"),
        price: 14999,
        quantity: 1,
        spec: "M3 Pro 18GB+512GB",
      },
    ],
    totalAmount: 14999,
    address: defaultAddress,
    status: 2,
    statusText: statusMap[2],
    createTime: "2026/2/27 09:15:20",
    payTime: "2026/2/27 09:16:05",
  },
];

// 提交订单
Mock.mock(/\/api\/orders$/, "post", (options) => {
  const body = JSON.parse(options.body);
  const order = {
    id: nextOrderId++,
    orderNo: "ORD" + Date.now() + Mock.mock("@integer(100,999)"),
    items: body.items,
    totalAmount: body.totalAmount,
    address: body.address,
    status: 0,
    statusText: statusMap[0],
    createTime: new Date().toLocaleString("zh-CN"),
    payTime: null,
  };
  orders.unshift(order);
  return { code: 200, message: "下单成功", data: order };
});

// 获取订单列表
Mock.mock(/\/api\/orders(\?.*)?$/, "get", (options) => {
  const url = new URL("http://localhost" + options.url);
  const status = url.searchParams.get("status");
  let list = [...orders];
  if (status !== null && status !== "" && parseInt(status) !== -1) {
    list = list.filter((o) => o.status === parseInt(status));
  }
  return { code: 200, message: "success", data: list };
});

// 取消订单
Mock.mock(/\/api\/orders\/\d+\/cancel/, "put", (options) => {
  const id = parseInt(options.url.match(/\/api\/orders\/(\d+)/)[1]);
  const order = orders.find((o) => o.id === id);
  if (order && order.status === 0) {
    order.status = 4;
    order.statusText = statusMap[4];
    return { code: 200, message: "已取消", data: null };
  }
  return { code: 400, message: "无法取消", data: null };
});

// 支付订单
Mock.mock(/\/api\/orders\/\d+\/pay/, "put", (options) => {
  const id = parseInt(options.url.match(/\/api\/orders\/(\d+)/)[1]);
  const order = orders.find((o) => o.id === id);
  if (order && order.status === 0) {
    order.status = 1;
    order.statusText = statusMap[1];
    order.payTime = new Date().toLocaleString("zh-CN");
    return { code: 200, message: "支付成功", data: null };
  }
  return { code: 400, message: "支付失败", data: null };
});

// 确认收货
Mock.mock(/\/api\/orders\/\d+\/confirm/, "put", (options) => {
  const id = parseInt(options.url.match(/\/api\/orders\/(\d+)/)[1]);
  const order = orders.find((o) => o.id === id);
  if (order && order.status === 2) {
    order.status = 3;
    order.statusText = statusMap[3];
    return { code: 200, message: "已确认收货", data: null };
  }
  return { code: 400, message: "操作失败", data: null };
});
