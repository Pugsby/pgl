installedLibraries.push('games');
myCommandList_games = ["minecraft", "solitaire"];
commandList.push(...myCommandList_games);

function makeWindow_Games (titleText) {
    var gamesWindow = document.createElement('div');
    gamesWindow.classList.add('window');
    var windowHeader = document.createElement('div');
    windowHeader.classList.add('windowHeader')
    var title = document.createElement('p');
    title.textContent = titleText;
    windowHeader.appendChild(title);
    var closeButton = document.createElement('button');
    closeButton.classList.add('closeButton');
    closeButton.textContent = '×';
    closeButton.onclick = () => gamesWindow.remove();
    windowHeader.appendChild(closeButton);
    gamesWindow.appendChild(windowHeader);
    document.body.appendChild(gamesWindow);
    return gamesWindow;
}
function handleCommandWithGames (command, words) {
    var result = true
    switch (command) {
        case 'games':
            if (words[1] === 'help') {
                log('Available commands: ' + myCommandList_games.join(', '));
            } else {
                log('games is the name of a library, not a command. If you need a command list, type "games help"', "yellow");
            }
            break;
        case 'minecraft':
            var window = makeWindow_Games('Minecraft');
            var windowContent = document.createElement('div');
            windowContent.classList.add('windowContent');
            var iframe = document.createElement('iframe');
            iframe.src = 'https://eaglercraft.com/mc/1.12.2/';
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.style.border = 'none';
            windowContent.appendChild(iframe);
            window.appendChild(windowContent);
            window.style.width = '90%';
            window.style.height = '90%';
            window.style.top = '5%';
            window.style.left = '5%';
            window.style.position = 'absolute';
            break;
        case 'solitaire':
            var window = makeWindow_Games('Solitaire');
            var windowContent = document.createElement('div');
            windowContent.classList.add('windowContent');
            var iframe = document.createElement('iframe');
            iframe.src = 'https://cdn.zone.msn.com/assets/games/microsoftsolitairecollection/buildarkzone/2025/20250306T073752_1.11.0_802f0a9_arkzone/index.html?useSDKDevCDN=false';
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.style.border = 'none';
            windowContent.appendChild(iframe);
            window.appendChild(windowContent);
            window.style.width = '90%';
            window.style.height = '90%';
            window.style.top = '5%';
            window.style.left = '5%';
            window.style.position = 'absolute';
            break;
        default:
           result = false;
    }
    return result; // Command was handled
}