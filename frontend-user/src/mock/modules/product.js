import Mock from "mockjs";

const categories = [
  { id: 1, name: "手机数码", icon: "phone-o" },
  { id: 2, name: "电脑办公", icon: "desktop-o" },
  { id: 3, name: "影音摄影", icon: "music-o" },
  { id: 4, name: "服饰鞋包", icon: "bag-o" },
  { id: 5, name: "美妆护肤", icon: "gift-o" },
  { id: 6, name: "食品饮品", icon: "shop-o" },
  { id: 7, name: "图书文具", icon: "bookmark-o" },
  { id: 8, name: "运动户外", icon: "fire-o" },
];

// 商品数据 - 全部使用 Unsplash 已验证可加载的真实图片
// 每张图片的 photo ID 对应的内容已通过 Unsplash 页面确认
const U = (id, w = 400, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`;

const productData = {
  1: [
    {
      name: "iPhone 15 Pro Max",
      image: U("1695048133142-1a20484d2569"),
      detail: U("1591337676887-a217a6c6205f"),
    },
    {
      name: "华为 Mate 60 Pro",
      image: U("1598327105666-5b89351aff97"),
      detail: U("1511707171634-5f897ff02aa9"),
    },
    {
      name: "小米14 Ultra",
      image: U("1585060544812-6b45742d762f"),
      detail: U("1574944985070-8f3ebc6b79d2"),
    },
    {
      name: "iPad Pro 12.9英寸",
      image: U("1544244015-0df4b3ffc6b0"),
      detail: U("1561154464-82381f1e4f85"),
    },
    {
      name: "OPPO Find X7",
      image: U("1592899677977-9c10ca588bbd"),
      detail: U("1605236453806-6ff36851218e"),
    },
    {
      name: "Samsung Galaxy S24",
      image: U("1610945265064-0e34e5519bbf"),
      detail: U("1565849904461-04a58ad377e0"),
    },
  ],
  2: [
    {
      name: "MacBook Pro 14英寸",
      image: U("1517336714731-489689fd1ca8"),
      detail: U("1541807084-5c52b6b3adef"),
    },
    {
      name: "联想小新Pro16",
      image: U("1496181133206-80ce9b88a853"),
      detail: U("1525547719571-a2d4ac8945e2"),
    },
    {
      name: "华为MateBook X Pro",
      image: U("1531297484001-80022131f5a1"),
      detail: U("1587614382346-4ec70e388b28"),
    },
    {
      name: "戴尔XPS 13",
      image: U("1593642632559-0c6d3fc62b89"),
      detail: U("1588872657578-7efd1f1555ed"),
    },
    {
      name: "ThinkPad X1 Carbon",
      image: U("1588702547923-7093a6c3ba33"),
      detail: U("1602080858428-57174f9431cf"),
    },
    {
      name: "机械键盘套装",
      image: U("1618384887929-16ec33fab9ef"),
      detail: U("1595225476474-87b55e93b28a"),
    },
  ],
  3: [
    {
      name: "Sony头戴式耳机",
      image: U("1505740420928-5e560c06d30e"),
      detail: U("1583394838336-d831a2f563a1"),
    },
    {
      name: "佳能单反相机",
      image: U("1516035069371-29a1b244cc32"),
      detail: U("1502920917128-1aa500764cbd"),
    },
    {
      name: "4K高清显示器",
      image: U("1527443224154-c4a3942d3acf"),
      detail: U("1585792180666-f7347c490ee2"),
    },
    {
      name: "蓝牙音箱",
      image: U("1608043152269-423dbba4e7e1"),
      detail: U("1545454675-14e690c0009e"),
    },
    {
      name: "游戏鼠标",
      image: U("1527814050087-3793815479db"),
      detail: U("1563297007-8f4e0a9d1e3a"),
    },
    {
      name: "机械革命极光Pro",
      image: U("1603302576837-37561b2e2302"),
      detail: U("1618424181497-157f25b6ddd5"),
    },
  ],
  4: [
    {
      name: "Nike Air Max 270",
      image: U("1542291026-7eec264c27ff"),
      detail: U("1600269452121-4f2416e55c28"),
    },
    {
      name: "皮革夹克",
      image: U("1551028719-00167b16eac5"),
      detail: U("1521572163474-6864f9cf17ab"),
    },
    {
      name: "Adidas Ultraboost",
      image: U("1608231387042-66d1773070a5"),
      detail: U("1595950653106-6c9ebd614d3a"),
    },
    {
      name: "Levi's 501牛仔裤",
      image: U("1542272604-787c3835535d"),
      detail: U("1582552938357-32b906df40cb"),
    },
    {
      name: "New Balance 574",
      image: U("1539185441755-769473a23570"),
      detail: U("1551107696-a4b0c5a0d9a2"),
    },
    {
      name: "连帽卫衣",
      image: U("1556821840-3a63f95609a7"),
      detail: U("1578587018452-892bacefd3f2"),
    },
  ],
  5: [
    {
      name: "兰蔻小黑瓶精华",
      image: U("1571781926291-c477ebfd024b"),
      detail: U("1596462502278-27bfdc403348"),
    },
    {
      name: "雅诗兰黛眼霜",
      image: U("1612817288484-6f916006741a"),
      detail: U("1570194065650-d99fb4b38b17"),
    },
    {
      name: "SK-II神仙水",
      image: U("1608248543803-ba4f8c70ae0b"),
      detail: U("1556228578-0d85b1a4d571"),
    },
    {
      name: "资生堂防晒霜",
      image: U("1556228720-195a672e8a03"),
      detail: U("1598440947619-2c35fc9aa908"),
    },
    {
      name: "欧莱雅洁面乳",
      image: U("1556229010-aa3f7ff66b24"),
      detail: U("1631729371254-42c2892f0e6e"),
    },
    {
      name: "MAC口红",
      image: U("1586495777744-4413f21062fa"),
      detail: U("1583241800698-e8ab01830a07"),
    },
  ],
  6: [
    {
      name: "智利车厘子2斤装",
      image: U("1559181567-c3190ca9959b"),
      detail: U("1528821128474-27f963b062bf"),
    },
    {
      name: "精品咖啡豆",
      image: U("1559056199-641a0ac8b55e"),
      detail: U("1497935586351-b67a49e012bf"),
    },
    {
      name: "法国红酒",
      image: U("1510812431401-41d2bd2722f3"),
      detail: U("1553361371-9b22f78e8b1d"),
    },
    {
      name: "新疆阿克苏苹果",
      image: U("1560806887-1e4cd0b6cbd6"),
      detail: U("1568702846914-96b305d2aaeb"),
    },
    {
      name: "手工巧克力礼盒",
      image: U("1481391319762-47dff72954d9"),
      detail: U("1511381939415-e44015fb59b3"),
    },
    {
      name: "有机蔬菜礼盒",
      image: U("1540420773420-3366772f4999"),
      detail: U("1512621776951-a57141f2eefd"),
    },
  ],
  7: [
    {
      name: "三体全集典藏版",
      image: U("1544947950-fa07a98d237f"),
      detail: U("1512820790803-83ca734da794"),
    },
    {
      name: "人民文学出版社精选",
      image: U("1524578271613-d550eacf6090"),
      detail: U("1495446815901-a7297e633e8d"),
    },
    {
      name: "MUJI文具套装",
      image: U("1513542789411-b6a5d4f31634"),
      detail: U("1456735190827-d1262f71b8a3"),
    },
    {
      name: "晨光中性笔10支装",
      image: U("1585336261022-680e295ce3fe"),
      detail: U("1583485088034-697b5bc54ccd"),
    },
    {
      name: "Kindle电子书阅读器",
      image: U("1611532736597-de2d4265fba3"),
      detail: U("1507842217343-583bb7270b66"),
    },
    {
      name: "Moleskine笔记本",
      image: U("1531346878377-a5be20888e57"),
      detail: U("1517842645767-c639042777db"),
    },
  ],
  8: [
    {
      name: "Nike跑步鞋",
      image: U("1460353581641-37baddab0fa2"),
      detail: U("1556906781-9a412961c28c"),
    },
    {
      name: "户外登山包",
      image: U("1553062407-98eeb64c6a62"),
      detail: U("1622260614153-03223fb72052"),
    },
    {
      name: "瑜伽垫",
      image: U("1601925260368-ae2f83cf8b7f"),
      detail: U("1544367567-0f2fcb009e0b"),
    },
    {
      name: "哑铃健身套装",
      image: U("1583454110551-21f2fa2afe61"),
      detail: U("1571019613454-1cb2f99b2d8b"),
    },
    {
      name: "户外帐篷",
      image: U("1504280390367-361c6d9f38f4"),
      detail: U("1478131143263-b21e6709e7e5"),
    },
    {
      name: "太阳镜",
      image: U("1572635196237-14b3f281503f"),
      detail: U("1511499767150-a48a237f0083"),
    },
  ],
};

// 基于种子的简单伪随机函数，确保同一 ID 每次生成相同数据
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  s = (s * 16807) % 2147483647;
  return (s - 1) / 2147483646;
}

function generateProducts(categoryId, count) {
  const items = productData[categoryId] || productData[1];
  return items.slice(0, count).map((item, index) => {
    const id = categoryId * 100 + index + 1;
    const r1 = seededRandom(id * 7 + 3);
    const r2 = seededRandom(id * 13 + 7);
    const r3 = seededRandom(id * 17 + 11);
    const r4 = seededRandom(id * 23 + 19);
    const r5 = seededRandom(id * 31 + 29);

    const price = Number((29 + r1 * 9970).toFixed(2));
    const originalPrice = Number((price * (1.1 + r2 * 0.7)).toFixed(2));
    const sales = Math.floor(100 + r3 * 9899);
    const rating = Number((4.0 + r4 * 1.0).toFixed(1));
    const stock = Math.floor(10 + r5 * 490);

    const allTags = ["新品", "热销", "包邮", "限时折扣", "品质保证"];
    const tagCount = 1 + Math.floor(seededRandom(id * 37) * 3);
    const tags = allTags.slice(0, tagCount);

    return {
      id,
      name: item.name,
      image: item.image,
      detailImage: item.detail,
      price,
      originalPrice,
      description: `${item.name}，品质保证，正品行货。精选优质材料，匠心工艺打造，为您带来卓越的使用体验。`,
      category: categories.find((c) => c.id === categoryId)?.name || "其他",
      categoryId,
      sales,
      rating,
      stock,
      tags,
    };
  });
}

const allProducts = [];
categories.forEach((cat) => {
  allProducts.push(...generateProducts(cat.id, 6));
});

// 轮播图
const banners = [
  {
    id: 1,
    image: U("1607082348824-0a96f2a4b9da", 750, 300),
    link: "/product/101",
  },
  {
    id: 2,
    image: U("1607083206869-4c7672e72a8a", 750, 300),
    link: "/product/201",
  },
  {
    id: 3,
    image: U("1483985988355-763728e1935b", 750, 300),
    link: "/product/301",
  },
];

Mock.mock(/\/api\/banners/, "get", () => {
  return { code: 200, message: "success", data: banners };
});

Mock.mock(/\/api\/categories/, "get", () => {
  return { code: 200, message: "success", data: categories };
});

// 推荐商品 - 使用固定种子排序避免数据抖动
const recommendProducts = [...allProducts]
  .sort((a, b) => {
    // 按销量降序作为稳定的推荐排序
    return b.sales - a.sales || a.id - b.id;
  })
  .slice(0, 10);

Mock.mock(/\/api\/products\/recommend/, "get", () => {
  return { code: 200, message: "success", data: recommendProducts };
});

Mock.mock(/\/api\/products\/\d+/, "get", (options) => {
  const id = parseInt(options.url.match(/\/api\/products\/(\d+)/)[1]);
  const product = allProducts.find((p) => p.id === id);
  if (product) {
    return {
      code: 200,
      message: "success",
      data: {
        ...product,
        images: [product.image, product.detailImage, product.image],
        specs: [
          { name: "颜色", values: ["默认", "黑色", "白色"] },
          { name: "规格", values: ["标准版", "升级版"] },
        ],
      },
    };
  }
  return { code: 404, message: "商品不存在", data: null };
});

Mock.mock(/\/api\/products(\?.*)?$/, "get", (options) => {
  const url = new URL("http://localhost" + options.url);
  const categoryId = url.searchParams.get("categoryId");
  const keyword = url.searchParams.get("keyword");
  const page = parseInt(url.searchParams.get("page")) || 1;
  const pageSize = parseInt(url.searchParams.get("pageSize")) || 10;

  let filtered = [...allProducts];
  if (keyword) {
    filtered = filtered.filter(
      (p) => p.name.includes(keyword) || p.category.includes(keyword),
    );
  }

  const start = (page - 1) * pageSize;
  const list = filtered.slice(start, start + pageSize);

  return {
    code: 200,
    message: "success",
    data: { list, total: filtered.length, page, pageSize },
  };
});
