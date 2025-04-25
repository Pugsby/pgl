var hzi = 7;
const taskBar = document.getElementById('taskbar'); // Assuming #taskBar exists in your HTML

function setTheme(fileName) {
    const existingTheme = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find(link => link.href !== location.origin + '/style.css');
    if (existingTheme) {
        existingTheme.remove();
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fileName;
    document.head.appendChild(link);
}

function openWindow(icon) {
    const div = document.createElement('div');
    div.className = 'window';
    document.body.appendChild(div);
    const topbar = document.createElement('div');
    topbar.className = 'topbar';
    div.appendChild(topbar);

    var title = document.createElement('p');
    title.className = 'windowTitle';
    title.innerText = 'Blank Window';
    topbar.appendChild(title);

    let isDragging = false;
    let offsetX, offsetY;

    var closeButton = document.createElement('button');
    closeButton.className = 'closebutton topbarButton';
    topbar.appendChild(closeButton);

    var minimizeButton = document.createElement('button');
    minimizeButton.className = 'minimizebutton topbarButton';
    topbar.appendChild(minimizeButton);

    var maximizeButton = document.createElement('button');
    maximizeButton.className = 'maximizebutton topbarButton';
    topbar.appendChild(maximizeButton);

    // Taskbar button
    const taskBarButton = document.createElement('button');
    taskBarButton.className = 'taskBarButton';
    taskBarButton.innerHTML = `<img src="${icon}" class="taskBarIcon">`;
    taskBar.appendChild(taskBarButton);
    closeButton.addEventListener('click', () => {
        div.remove();
        taskBarButton.remove();
    });

    minimizeButton.addEventListener('click', () => {
        div.style.display = 'none';
    });

    var storedWidth, storedHeight, storedLeft, storedTop;
    maximizeButton.addEventListener('click', () => {
        if (div.style.width !== '100%' || div.style.height !== '100%') {
            storedWidth = div.style.width;
            storedHeight = div.style.height;
            storedLeft = div.style.left;
            storedTop = div.style.top;
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.left = '0px';
            div.style.top = '0px';
        } else {
            div.style.width = storedWidth;
            div.style.height = storedHeight;
            div.style.left = storedLeft;
            div.style.top = storedTop;
        }
    });

    taskBarButton.addEventListener('click', () => {
        if (div.style.display === 'none') {
            div.style.display = 'block';
        }
        hzi += 1;
        div.style.zIndex = hzi;
    });

    topbar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - div.offsetLeft;
        offsetY = e.clientY - div.offsetTop;
        hzi += 1;
        div.style.zIndex = hzi;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            div.style.left = `${e.clientX - offsetX}px`;
            div.style.top = `${e.clientY - offsetY}px`;
            if (e.clientX - offsetX < 0) {
                div.style.left = '0px';
            }
            if (e.clientY - offsetY < 0) {
                div.style.top = '0px';
            }
            if (e.clientX - offsetX + div.offsetWidth > window.innerWidth) {
                div.style.left = `${window.innerWidth - div.offsetWidth}px`;
            }
            if (e.clientY - offsetY + div.offsetHeight > window.innerHeight) {
                div.style.top = `${window.innerHeight - div.offsetHeight}px`;
            }
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    return div;
}

function openApp(app) {
    if (app === 'template') {
        var app = openWindow();
        app.style.width = '400px';
        app.style.height = '300px';
    }
    if (app === 'aniplay') {
        var app = openWindow("desktopIcons/aniplay.png");
        app.style.width = '880px';
        app.style.height = '568px';
        var iframe = document.createElement('iframe');
        iframe.src = 'https://aniplaynow.live/';
        iframe.style.width = 'calc(100% + 2px)';
        iframe.style.height = '100%';
        app.querySelector('.windowTitle').innerText = 'Aniplay';
        app.appendChild(iframe);
    }
    if (app === 'settings') {
        var app = openWindow("desktopIcons/settings.png");
        app.style.width = '400px';
        app.style.height = '300px';
        app.querySelector('.windowTitle').innerText = 'Settings';
        var themeSection = document.createElement('p');
        themeSection.innerText = 'Theme:';
        app.appendChild(themeSection);
        var themeButton = document.createElement('button');
        themeButton.innerText = 'Dark';
        themeButton.className = 'button';
        themeButton.addEventListener('click', () => {
            setTheme('catppuccinFrappe.css');
        });
        var themeButton2 = document.createElement('button');
        themeButton2.innerText = 'Light';
        themeButton2.className = 'button';
        themeButton2.addEventListener('click', () => {
            setTheme('catppuccinLatte.css');
        });
        app.appendChild(themeButton);
        app.appendChild(themeButton2);
    }
    if (app === "fileExplorer") {
        var app = openWindow("desktopIcons/fileExplorer.png");
        app.style.width = '400px';
        app.style.height = '300px';
        app.querySelector('.windowTitle').innerText = 'File Explorer';
        app.className = "window fileExplorer";
        var button = document.createElement('button');
        button.innerText = 'Open File';
        button.className = 'button';
        app.appendChild(button);
        var fileDiv = document.createElement('div');
        app.appendChild(fileDiv);
        Object.keys(localStorage).forEach((key) => {
            var text = document.createElement('p');
            text.innerText = key
            fileDiv.appendChild(text);
        });
        button.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt, .png, .jpg, .jpeg, .gif, .mp4, .webm';
            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        localStorage.setItem(file.name, JSON.stringify({ type: file.type, content: e.target.result }));
                        fileDiv.innerText = `File "${file.name}" has been saved to localStorage.`;
                    };
                    reader.readAsText(file);
                }
            });
            input.click();
        });
    }
}
function startMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.bottom = startMenu.style.bottom === '60px' ? '-330px' : '60px';
}

setTheme('catppuccinFrappe.css');
