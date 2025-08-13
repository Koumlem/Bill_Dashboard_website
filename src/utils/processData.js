// src/utils/processData.js

// 分类规则（你可以自己加）
const CATEGORY_RULES = {
  饮食: ['奶茶', '餐', '麦当劳', '星巴克', '外卖', '咖啡', '米线', '汉堡'],
  交通: ['地铁', '公交', '滴滴', '高铁', '出租车', '火车'],
  购物: ['淘宝', '京东', '拼多多', '商场', '超市'],
  娱乐: ['游戏', '会员', '电影院', 'KTV', '腾讯视频', '爱奇艺'],
  转账: ['转账', '红包', '收款', '提现'],
  其他: []
};

// 格式化时间为 YYYY-MM-DD
function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // 如果解析失败就原样返回
  return date.toISOString().split('T')[0];
}

// 分类函数
function detectCategory(merchant, item) {
  const text = `${merchant || ''}${item || ''}`;
  for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  return '其他';
}

// 主处理函数
export function processData(rows = []) {
  const list = Array.isArray(rows) ? rows : [];
  return list
    .filter(row => row && Object.keys(row).length > 0) // 去掉空行
    .map(row => {
      return {
        ...row,
        time: formatDate(row.time),
        amount: parseFloat(row.amount) || 0,
        category: detectCategory(row.merchant, row.item)
      };
    });
}
