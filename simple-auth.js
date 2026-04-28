// 简化版认证系统 - 用于演示

// 登录表单提交
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        
        // 验证输入
        if (!email || !password) {
            alert('请输入邮箱和密码');
            return;
        }
        
        // 显示加载提示
        const submitBtn = loginForm.querySelector('.auth-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '登录中...';
        submitBtn.disabled = true;
        
        // 模拟登录延迟
        setTimeout(() => {
            // 保存登录状态
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('loginTime', new Date().toISOString());
            
            // 显示成功消息
            alert('✅ 登录成功！');
            
            // 跳转到主页
            window.location.href = '../index.html';
        }, 1000);
    });
}

// 注册表单提交
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = registerForm.querySelector('#username')?.value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;
        const confirmPassword = registerForm.querySelector('#confirm-password')?.value;
        const termsCheckbox = registerForm.querySelector('#terms');
        
        // 验证输入
        if (!email || !password) {
            alert('请填写所有必填项');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        
        if (termsCheckbox && !termsCheckbox.checked) {
            alert('请同意服务条款和隐私政策');
            return;
        }
        
        // 显示加载提示
        const submitBtn = registerForm.querySelector('.auth-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '注册中...';
        submitBtn.disabled = true;
        
        // 模拟注册延迟
        setTimeout(() => {
            // 保存注册信息
            localStorage.setItem('registeredEmail', email);
            if (username) {
                localStorage.setItem('registeredUsername', username);
            }
            
            // 显示成功消息
            alert('✅ 注册成功！即将跳转到登录页面...');
            
            // 跳转到登录页面
            window.location.href = 'login.html';
        }, 1000);
    });
}

// 社交登录按钮
const emailBtn = document.querySelector('.email-btn');
if (emailBtn) {
    emailBtn.addEventListener('click', () => {
        const methods = document.querySelector('.auth-methods');
        const form = document.querySelector('.auth-form');
        const divider = document.querySelector('.divider');
        
        if (methods) methods.style.display = 'none';
        if (form) form.style.display = 'flex';
        if (divider) divider.style.display = 'flex';
    });
}

const socialLoginLink = document.querySelector('.social-login-link');
if (socialLoginLink) {
    socialLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        const methods = document.querySelector('.auth-methods');
        const form = document.querySelector('.auth-form');
        const divider = document.querySelector('.divider');
        
        if (methods) methods.style.display = 'flex';
        if (form) form.style.display = 'none';
        if (divider) divider.style.display = 'none';
    });
}

// Google登录
const googleBtn = document.querySelector('.google-btn');
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        alert('Google登录功能开发中...');
    });
}

// Apple登录
const appleBtn = document.querySelector('.apple-btn');
if (appleBtn) {
    appleBtn.addEventListener('click', () => {
        alert('Apple登录功能开发中...');
    });
}

// 登录页面自动填充注册的邮箱
if (loginForm) {
    const registeredEmail = localStorage.getItem('registeredEmail');
    if (registeredEmail) {
        const emailInput = loginForm.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.value = registeredEmail;
            // 显示提示
            const hint = document.createElement('p');
            hint.style.color = '#10b981';
            hint.style.fontSize = '0.9rem';
            hint.style.marginTop = '0.5rem';
            hint.textContent = '✅ 已自动填充您注册的邮箱';
            emailInput.parentNode.appendChild(hint);
        }
        // 清除注册信息
        localStorage.removeItem('registeredEmail');
        localStorage.removeItem('registeredUsername');
    }
}

// 检查登录状态并更新导航栏
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    
    if (isLoggedIn === 'true' && userEmail) {
        // 更新导航栏（如果在主页）
        const navLogin = document.querySelector('.nav-login');
        const btnRegister = document.querySelector('.btn-nav-register');
        
        if (navLogin && btnRegister) {
            // 隐藏登录和注册按钮
            navLogin.style.display = 'none';
            btnRegister.style.display = 'none';
            
            // 添加用户信息和退出按钮
            const nav = document.querySelector('.nav');
            if (nav && !document.querySelector('.user-info')) {
                const userInfo = document.createElement('span');
                userInfo.className = 'user-info';
                userInfo.style.color = '#a0826d';
                userInfo.style.fontWeight = '600';
                userInfo.textContent = userEmail.split('@')[0];
                
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.className = 'nav-link';
                logoutBtn.textContent = '退出';
                logoutBtn.style.color = '#ef4444';
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('确定要退出登录吗？')) {
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('userEmail');
                        localStorage.removeItem('loginTime');
                        alert('已退出登录');
                        window.location.reload();
                    }
                });
                
                nav.appendChild(userInfo);
                nav.appendChild(logoutBtn);
            }
        }
    }
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', checkLoginStatus);
