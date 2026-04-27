/**
 * 算道 BaziAI API 集成
 * 直接调用 bazi-ai.com 的 API
 */

// API配置
const BAZI_API = {
    baseUrl: 'https://www.bazi-ai.com',
    sessionToken: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiNHBxaFNuWDBObkFfcXJHT0ZuNTZQdGY5S1dHRHVPYVJzUnAxdHZWQWs0US1INW5lcG5mSlotSGZPR01BQkdjSVVnNHNmMlF1Y1c2OEFLSkpHWlZhNXcifQ..R5h4fxJeHGh20vopCWMyxA.afEcMFSXO8n3wvBEMbjroOEuipRJ8swSzCLszBqy4fqaVd1N6nABRRXsR2bF8eRQPMGd0F72e7pFt84O_44LIFQwnC17kJXBhhCD_2HENAtsJs1JtgG5ewxhWGCdpBZdZ9dD4FqK5NXYVxctoZvUVn-tN5pnYwyUAcOLSCpg0agJF38TC9y9BlhHqIhPu71TA2NOGWq7p-crg_x_c12OlmVsxiLd1hfpVqBXTA7053LgRgUhyib14ziPuaFgoKBd9elRxWHWGCkMQ_e4MreZYL1VZoC-icQTkZi_h907x03-lzDW8yxR3_w3aUr7LNZiqxS8flkOJQ-D7xO4rMEzlsEdn3wtZ5jIgFCgqrIxDgKInd8_Y75W_5BbJ0i7EQG9MqMqnfBQ2k9uqLTOyQc_LV9Paw0sB5xMnBsFWsRN6s1PgCjBAKGX1AH00i0JnAHwo2gFI8gV2u4cyzIFnlqRoFjXX_EbhZn9sAg28Y6y6Hw.mcWPYWyVidSTvJIjvRdnGXYJ34oLZukOrbzmFZX_R_A'
};

// 生成UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 创建会话
async function createSession(question, birthInfo) {
    const sessionId = generateUUID();
    const userUuid = generateUUID();
    const customerInfoId = generateUUID();
    
    const payload = {
        uuid: sessionId,
        user_uuid: userUuid,
        customer_info_id: customerInfoId,
        title: question,
        status: "new",
        created_at: new Date().toISOString(),
        customer_info: {
            id: customerInfoId,
            gender: birthInfo.gender,
            birthYear: parseInt(birthInfo.birthYear),
            birthMonth: parseInt(birthInfo.birthMonth),
            birthDay: parseInt(birthInfo.birthDay),
            birthHour: parseInt(birthInfo.birthHour),
            userUuid: userUuid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            name: birthInfo.name || "",
            relationshipStatus: "",
            jobStatus: "",
            additionalInfo: "",
            type: "self"
        },
        is_matching: false,
        is_iching: false,
        model: "r1"
    };
    
    try {
        const response = await fetch(`${BAZI_API.baseUrl}/api/chat-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `__Secure-authjs.session-token=${BAZI_API.sessionToken}`
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            return { sessionId, userUuid, customerInfoId };
        }
        throw new Error('创建会话失败');
    } catch (error) {
        console.error('创建会话错误:', error);
        throw error;
    }
}

// 发送消息并获取AI回复
async function sendMessage(sessionId, question, birthInfo, userUuid, customerInfoId) {
    const payload = {
        id: sessionId,
        messages: [{
            role: "user",
            content: question,
            parts: [{
                type: "text",
                text: question
            }]
        }],
        locale: "zh",
        session_id: sessionId,
        customer_info: {
            id: customerInfoId,
            gender: birthInfo.gender,
            birthYear: parseInt(birthInfo.birthYear),
            birthMonth: parseInt(birthInfo.birthMonth),
            birthDay: parseInt(birthInfo.birthDay),
            birthHour: parseInt(birthInfo.birthHour),
            userUuid: userUuid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            name: birthInfo.name || "",
            relationshipStatus: "",
            jobStatus: "",
            additionalInfo: "",
            type: "self"
        },
        is_matching: false,
        is_iching: false,
        model: "r1"
    };
    
    try {
        const response = await fetch(`${BAZI_API.baseUrl}/api/chat-completion/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `__Secure-authjs.session-token=${BAZI_API.sessionToken}`
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error('发送消息失败');
        }
        
        // 读取流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.content) {
                            fullResponse += data.content;
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            }
        }
        
        return fullResponse;
    } catch (error) {
        console.error('发送消息错误:', error);
        throw error;
    }
}

// 完整流程：创建会话 + 发送消息
async function askBazi(question, birthInfo) {
    try {
        // 1. 创建会话
        const { sessionId, userUuid, customerInfoId } = await createSession(question, birthInfo);
        
        // 2. 发送消息并获取回复
        const answer = await sendMessage(sessionId, question, birthInfo, userUuid, customerInfoId);
        
        return {
            success: true,
            answer: answer,
            sessionId: sessionId
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// 导出函数
window.BaziAPI = {
    ask: askBazi
};
