const inputElement = document.getElementById('input');
const outputElement = document.getElementById('output');
var commandList = ['print', 'help', 'installedLibraries', 'execute', 'credits'];
var installedLibraries = [];
var allowACE = false;

function log(message, addedClass) {
    if (outputElement) {
        const p = document.createElement('p');
        p.textContent = message;
        if (addedClass) {
            p.classList.add(addedClass);
        }
        outputElement.appendChild(p);
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const inputValue = inputElement?.value;
        const words = inputValue.split(' ');
        inputElement.value = '';

        switch (words[0]) {
            case 'print':
                log(words.slice(1).join(' '));
                break;
            case 'help':
                log('Available commands: ' + commandList.join(', '));
                break;
            case 'installedLibraries':
                if (installedLibraries.length > 0) {
                    log('Installed libraries: ' + installedLibraries.join(', '));
                } else {
                    log('No libraries installed.', "yellow");
                }
                break;
            case 'execute':
                if (!allowACE) {
                    if (words[1] === 'true') {
                        allowACE = true;
                        log('Arbitrary Code Execution is now enabled.');
                    } else {
                        log('Arbitrary Code Execution is not enabled, type execute true to allow it.', "yellow");
                    }
                    break;
                } else {
                    try {
                        const codeToRun = words.slice(1).join(' ');
                        const result = eval(codeToRun);
                        if (result !== undefined) {
                            log('Result: ' + result);
                        }
                    } catch (error) {
                        log(`Error executing code: ${error.message}`, "red");
                    }
                    break;
                }
            case 'credits':
                log('Creator: Pugsby');
                log('Lead Developer: Pugsby');
                log('Co-developer: ChatGPT');
                log('Catppuccin Mocha: A variety of people.');
                log('Inspired by Windows Terminal and Linux Terminal.');
                break;
            default:
                if (handleCommandWithPdfReader) {
                    var result = handleCommandWithPdfReader(words[0], words);
                    if (result) {
                        return;
                    }
                }
                if (handleCommandWithGames) {
                    var result = handleCommandWithGames(words[0], words);
                    if (result) {
                        return;
                    }
                }
                log(`Unknown command: ${words[0]}`, "yellow");
                break;
            }

    }
});

window.onerror = function(message, source, lineno, colno, error) {
    log(`Error: ${message} at ${source}:${lineno}:${colno}`, "red");
};
