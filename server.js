// 引入 Express 模組
const express = require('express');
const app = express();
const port = 8080; // 定義伺服器運行的連接埠

// 啟用 CORS，讓前端頁面可以向這個 API 請求資料
const cors = require('cors');
app.use(cors());

// --- 我們的核心資料庫 (暫時用 JavaScript 陣列模擬) ---
const recyclingData = [
    { city_name: "臺北市", item_name: "寶特瓶", disposal_type: "資源回收", disposal_details: "請將內容物倒空並沖洗乾淨，壓扁。", item_category: "塑膠容器" },
    { city_name: "臺北市", item_name: "紙餐盒", disposal_type: "資源回收", disposal_details: "請移除食物殘渣，略為擦拭或沖洗後堆疊。", item_category: "紙類" },
    { city_name: "臺北市", item_name: "衛生紙", disposal_type: "一般垃圾", disposal_details: "不可回收，請丟棄於一般垃圾。", item_category: "紙類" },
    
    { city_name: "高雄市", item_name: "寶特瓶", disposal_type: "資源回收", disposal_details: "請洗淨後瀝乾，交給回收車。", item_category: "塑膠容器" },
    { city_name: "高雄市", item_name: "紙餐盒", disposal_type: "一般垃圾", disposal_details: "不可回收，請將食物殘渣去除後丟一般垃圾。", item_category: "紙類" },
    { city_name: "高雄市", item_name: "舊衣物", disposal_type: "資源回收", disposal_details: "請清潔後裝袋，交給舊衣回收箱或清潔隊。", item_category: "紡織品" },
];

// 讓伺服器知道如何處理根目錄 (/) 的請求
app.get('/', (req, res) => {
    res.send('歡迎來到回收分類查詢 API 伺服器！');
});

// --- 建立查詢 API ---
// 當前端發送 GET 請求到 /api/query 時，執行這裡的程式碼
app.get('/api/query', (req, res) => {
    // 1. 從前端請求中取得縣市 (city) 和物品 (item) 參數
    const { city, item } = req.query; 

    // 2. 檢查參數是否齊全
    if (!city || !item) {
        // HTTP 400 Bad Request
        return res.status(400).json({ error: "請提供縣市 (city) 和物品名稱 (item)。" });
    }
    
    // 3. 在模擬資料庫中查找
    // 使用 find() 方法查找第一個符合條件的物件
    const result = recyclingData.find(data => 
        data.city_name === city && data.item_name === item
    );

    // 4. 回傳結果
    if (result) {
        // HTTP 200 OK，回傳找到的分類資料
        res.json(result);
    } else {
        // HTTP 404 Not Found，回傳查無資料
        res.status(404).json({ 
            disposal_type: "未找到",
            disposal_details: `在 ${city} 的資料庫中未找到「${item}」的明確分類。`,
            item_name: item,
            city_name: city
        });
    }
});

// --- 啟動伺服器 ---
app.listen(port, () => {
    console.log(`✅ 伺服器已啟動並運行在 http://localhost:${port}`);
    console.log(`請在瀏覽器中測試 API: http://localhost:${port}/api/query?city=臺北市&item=寶特瓶`);
});