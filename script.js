// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CTA按钮点击事件
document.querySelector('.cta-button')?.addEventListener('click', () => {
    document.querySelector('#readings')?.scrollIntoView({
        behavior: 'smooth'
    });
});

// 卡片悬停效果增强
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = 'var(--primary-color)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderColor = 'var(--border-color)';
    });
});

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// 标签页切换功能
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // 移除所有active类
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        // 添加active类到当前按钮
        this.classList.add('active');
        
        // 获取按钮文本判断功能
        const btnText = this.textContent.trim();
        
        if (btnText.includes('占卜')) {
            // 占卜功能 - 跳转到生肖页面
            window.location.href = '#zodiac';
        } else if (btnText.includes('双人')) {
            // 双人功能 - 跳转到双人分析介绍页面
            window.location.href = 'pages/couple-reading.html';
        }
        // 单人功能保持默认状态
    });
});

// ========== BaziAI 集成功能 ==========

// 生辰信息存储
let birthInfo = {
    name: '',
    gender: 'male',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12
};

// 出生信息按钮点击
document.getElementById('birthInfoBtn')?.addEventListener('click', function() {
    showBirthInfoModal();
});

// 发送按钮点击
document.getElementById('sendBtn')?.addEventListener('click', async function() {
    const question = document.getElementById('questionInput')?.value.trim();
    
    if (!question) {
        alert('请输入您的问题');
        return;
    }
    
    // 显示加载状态
    const sendBtn = this;
    const originalText = sendBtn.innerHTML;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '⏳ 分析中...';
    
    // 显示回复区域
    const responseDiv = document.getElementById('aiResponse');
    const responseContent = document.getElementById('responseContent');
    responseDiv.style.display = 'block';
    responseContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>AI正在为您分析，请稍候...</p></div>';
    
    // 滚动到回复区域
    responseDiv.scrollIntoView({ behavior: 'smooth' });
    
    try {
        // 调用BaziAI API
        const result = await window.BaziAPI.ask(question, birthInfo);
        
        if (result.success) {
            // 显示AI回复
            responseContent.innerHTML = `<div class="answer-text">${result.answer.replace(/\n/g, '<br>')}</div>`;
        } else {
            // 显示错误
            responseContent.innerHTML = `<div class="error-message">❌ ${result.error || '分析失败，请稍后重试'}</div>`;
        }
    } catch (error) {
        responseContent.innerHTML = `<div class="error-message">❌ 网络错误: ${error.message}</div>`;
    } finally {
        // 恢复按钮状态
        sendBtn.disabled = false;
        sendBtn.innerHTML = originalText;
    }
});

// 关闭回复按钮
document.getElementById('closeResponse')?.addEventListener('click', function() {
    document.getElementById('aiResponse').style.display = 'none';
});

// 显示生辰信息模态框
function showBirthInfoModal() {
    const modal = document.createElement('div');
    modal.className = 'birth-modal';
    modal.innerHTML = `
        <div class="birth-modal-content">
            <div class="birth-modal-header">
                <h3>📅 填写出生信息</h3>
                <button class="close-modal" onclick="this.closest('.birth-modal').remove()">✕</button>
            </div>
            <div class="birth-modal-body">
                <div class="form-group">
                    <label>姓名 (可选)</label>
                    <input type="text" id="modalName" value="${birthInfo.name}" placeholder="请输入您的姓名">
                </div>
                <div class="form-group">
                    <label>性别 *</label>
                    <select id="modalGender">
                        <option value="male" ${birthInfo.gender === 'male' ? 'selected' : ''}>男</option>
                        <option value="female" ${birthInfo.gender === 'female' ? 'selected' : ''}>女</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>出生年 *</label>
                        <input type="number" id="modalYear" value="${birthInfo.birthYear}" min="1900" max="2100">
                    </div>
                    <div class="form-group">
                        <label>出生月 *</label>
                        <input type="number" id="modalMonth" value="${birthInfo.birthMonth}" min="1" max="12">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>出生日 *</label>
                        <input type="number" id="modalDay" value="${birthInfo.birthDay}" min="1" max="31">
                    </div>
                    <div class="form-group">
                        <label>出生时 *</label>
                        <input type="number" id="modalHour" value="${birthInfo.birthHour}" min="0" max="23">
                    </div>
                </div>
            </div>
            <div class="birth-modal-footer">
                <button class="modal-btn cancel-btn" onclick="this.closest('.birth-modal').remove()">取消</button>
                <button class="modal-btn save-btn" onclick="saveBirthInfo()">保存</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 保存生辰信息
function saveBirthInfo() {
    birthInfo = {
        name: document.getElementById('modalName').value.trim(),
        gender: document.getElementById('modalGender').value,
        birthYear: document.getElementById('modalYear').value,
        birthMonth: document.getElementById('modalMonth').value,
        birthDay: document.getElementById('modalDay').value,
        birthHour: document.getElementById('modalHour').value
    };
    
    // 关闭模态框
    document.querySelector('.birth-modal')?.remove();
    
    // 提示保存成功
    alert('✅ 出生信息已保存');
}

// 使函数全局可用
window.saveBirthInfo = saveBirthInfo;

// ========== 网站功能增强 ==========

// 1. FAQ卡片点击复制问题到输入框
document.querySelectorAll('.faq-card').forEach(card => {
    card.addEventListener('click', function() {
        const questionText = this.querySelector('.faq-text')?.textContent.trim();
        const questionInput = document.getElementById('questionInput');
        
        if (questionText && questionInput) {
            questionInput.value = questionText;
            // 滚动到输入框
            questionInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // 聚焦输入框
            questionInput.focus();
            // 显示提示
            showToast('✅ 问题已复制到输入框');
        }
    });
});

// 2. 快速链接点击填充输入框
document.querySelectorAll('.quick-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const linkText = this.textContent.trim();
        const questionInput = document.getElementById('questionInput');
        
        if (questionInput) {
            // 移除emoji，只保留文字
            const cleanText = linkText.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
            questionInput.value = `请帮我进行${cleanText}`;
            questionInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            questionInput.focus();
            showToast('✅ 主题已填充到输入框');
        }
    });
});

// 3. 深色模式切换
const themeToggle = document.querySelector('.theme-toggle');
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// 应用主题
function applyTheme(dark) {
    if (dark) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
    }
}

// 初始化主题
applyTheme(isDarkMode);

// 主题切换按钮
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode);
        applyTheme(isDarkMode);
        showToast(isDarkMode ? '🌙 已切换到深色模式' : '☀️ 已切换到浅色模式');
    });
}

// 4. 语言选择器
const langSelector = document.querySelector('.lang-selector');
if (langSelector) {
    langSelector.addEventListener('change', function() {
        const selectedLang = this.value;
        
        if (selectedLang === 'English') {
            showToast('🌐 English version coming soon!');
            // 未来可以实现多语言切换
            // window.location.href = '/en/index.html';
        } else {
            showToast('🌐 当前语言：简体中文');
        }
    });
}

// 5. FAQ标签切换
document.querySelectorAll('.faq-tag').forEach(tag => {
    tag.addEventListener('click', function() {
        // 移除所有active类
        document.querySelectorAll('.faq-tag').forEach(t => t.classList.remove('active'));
        // 添加active到当前标签
        this.classList.add('active');
        
        const category = this.textContent.trim();
        showToast(`📂 已切换到：${category}`);
        
        // 未来可以根据分类过滤FAQ卡片
        // filterFaqCards(category);
    });
});

// 6. 分享按钮功能
const upgradeBtn = document.querySelector('.upgrade-btn');
if (upgradeBtn && upgradeBtn.textContent.includes('分享')) {
    upgradeBtn.addEventListener('click', function() {
        shareWebsite();
    });
}

// 分享网站功能
function shareWebsite() {
    const shareData = {
        title: '算道 - AI遇见东方智慧',
        text: '体验AI驱动的八字分析平台',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showToast('✅ 分享成功'))
            .catch(() => copyToClipboard(window.location.href));
    } else {
        copyToClipboard(window.location.href);
    }
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => showToast('✅ 链接已复制到剪贴板'))
            .catch(() => showToast('❌ 复制失败'));
    } else {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('✅ 链接已复制到剪贴板');
        } catch (err) {
            showToast('❌ 复制失败');
        }
        document.body.removeChild(textarea);
    }
}

// 提示消息函数
function showToast(message, duration = 2000) {
    // 移除已存在的toast
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => toast.classList.add('show'), 10);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}
