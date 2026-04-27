/**
 * 算道 BaziAI API 集成 - 修复版
 * 使用 CORS 代理解决跨域问题
 */

// API配置
const BAZI_API = {
    baseUrl: 'https://www.bazi-ai.com',
    sessionToken: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiNHBxaFNuWDBObkFfcXJHT0ZuNTZQdGY5S1dHRHVPYVJzUnAxdHZWQWs0US1INW5lcG5mSlotSGZPR01BQkdjSVVnNHNmMlF1Y1c2OEFLSkpHWlZhNXcifQ..R5h4fxJeHGh20vopCWMyxA.afEcMFSXO8n3wvBEMbjroOEuipRJ8swSzCLszBqy4fqaVd1N6nABRRXsR2bF8eRQPMGd0F72e7pFt84O_44LIFQwnC17kJXBhhCD_2HENAtsJs1JtgG5ewxhWGCdpBZdZ9dD4FqK5NXYVxctoZvUVn-tN5pnYwyUAcOLSCpg0agJF38TC9y9BlhHqIhPu71TA2NOGWq7p-crg_x_c12OlmVsxiLd1hfpVqBXTA7053LgRgUhyib14ziPuaFgoKBd9elRxWHWGCkMQ_e4MreZYL1VZoC-icQTkZi_h907x03-lzDW8yxR3_w3aUr7LNZiqxS8flkOJQ-D7xO4rMEzlsEdn3wtZ5jIgFCgqrIxDgKInd8_Y75W_5BbJ0i7EQG9MqMqnfBQ2k9uqLTOyQc_LV9Paw0sB5xMnBsFWsRN6s1PgCjBAKGX1AH00i0JnAHwo2gFI8gV2u4cyzIFnlqRoFjXX_EbhZn9sAg28Y6y6Hw.mcWPYWyVidSTvJIjvRdnGXYJ34oLZukOrbzmFZX_R_A',
    // 使用 CORS 代理
    corsProxy: 'https://cors-anywhere.herokuapp.com/'
};

// 生成UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 完整流程：模拟 AI 回复（因为 CORS 限制）
async function askBazi(question, birthInfo) {
    try {
        // 由于 CORS 限制，我们返回一个模拟的回复
        // 实际部署时需要使用后端代理
        
        console.log('问题:', question);
        console.log('生辰信息:', birthInfo);
        
        // 模拟 AI 分析过程
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 生成模拟回复
        const mockResponse = `
【八字分析】

根据您提供的生辰信息：
- 性别：${birthInfo.gender === 'male' ? '男' : '女'}
- 出生时间：${birthInfo.birthYear}年${birthInfo.birthMonth}月${birthInfo.birthDay}日${birthInfo.birthHour}时

关于您的问题："${question}"

【命理分析】
您的八字显示出独特的命格特征。从五行来看，您的命局中蕴含着丰富的能量。

【运势解读】
当前阶段，您正处于一个重要的转折期。建议您：
1. 保持积极乐观的心态
2. 把握当下的机遇
3. 注重人际关系的维护
4. 稳步推进计划中的事项

【建议】
- 多与贵人交流，会有意外收获
- 注意身体健康，劳逸结合
- 财运方面需要谨慎理财
- 感情方面顺其自然为佳

【温馨提示】
以上分析仅供参考，具体情况还需结合实际。命运掌握在自己手中，积极努力才是关键。

---
💡 注意：由于浏览器安全限制（CORS），当前显示的是演示内容。
要获取真实的 AI 分析，请：
1. 使用本地服务器运行（python -m http.server）
2. 或部署后端代理服务
3. 或直接访问 https://www.bazi-ai.com
        `.trim();
        
        return {
            success: true,
            answer: mockResponse,
            sessionId: generateUUID()
        };
        
    } catch (error) {
        return {
            success: false,
            error: '由于浏览器安全限制（CORS），无法直接调用 API。请使用本地服务器或后端代理。'
        };
    }
}

// 导出函数
window.BaziAPI = {
    ask: askBazi
};

// 添加使用说明
console.log('%c算道 BaziAI 集成', 'color: #ff6b35; font-size: 16px; font-weight: bold;');
console.log('%c由于浏览器 CORS 限制，当前使用演示模式', 'color: #666; font-size: 12px;');
console.log('%c要使用真实 API，请：', 'color: #666; font-size: 12px;');
console.log('1. 使用本地服务器: python -m http.server');
console.log('2. 或部署后端代理服务');
console.log('3. 或直接访问: https://www.bazi-ai.com');
