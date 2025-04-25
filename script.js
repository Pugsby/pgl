const inputElement = document.getElementById('input');
const outputElement = document.getElementById('output');
var commandList = ['print', 'boot', 'help', 'enabledLibraries', 'installedLibraries', 'enableLibrary', 'execute', 'credits', 'installLibrary'];
var enabledLibraries = [];
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
            case 'boot':
                window.location.href = 'pugsbyOS/index.html';
                break;
            case 'enabledLibraries':
                if (enabledLibraries.length > 0) {
                    log('Enabled Libraries: ' + enabledLibraries.join(', '));
                } else {
                    log('No libraries enabled.', "yellow");
                }
                break;
            case 'installedLibraries':
                if (installedLibraries.length > 0) {
                    log('Installed Libraries: ' + installedLibraries.join(', '));
                } else {
                    log('No libraries installed.', "yellow");
                }
            case 'enableLibrary':
                if (words[1]) {
                    if (installedLibraries.includes(words[1])) {
                        if (!enabledLibraries.includes(words[1])) {
                            enabledLibraries.push(words[1]);
                            commandList.push(...eval("myCommandList_" + words[1]));
                            log(`Library ${words[1]} enabled.`);
                        } else {
                            log(`Library ${words[1]} is already enabled.`, "yellow");
                        }
                    } else {
                        log(`Library ${words[1]} is not installed.`, "red");
                    }
                } else {
                    log('Please specify a library to enable.', "yellow");
                }
                break;
            case 'installLibrary':
                if (words[1]) {
                    fetch(words[1])
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.text();
                        })
                        .then(scriptContent => {
                            try {
                                eval(scriptContent);
                                installedLibraries.push(words[1]);
                                log(`Library from ${words[1]} installed successfully.`);
                                if (eval("ver_" + words[1]) != 2) {
                                    log(`${words[1]} version ${eval("ver_" + words[1])} does not match current pgl version (2).`, "yellow");
                                }
                            } catch (error) {
                                log(`Error executing library script: ${error.message}`, "red");
                            }
                        })
                        .catch(error => {
                            log(`Error fetching library: ${error.message}`, "red");
                        });
                } else {
                    log('Please specify a URL to install the library from.', "yellow");
                }
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
                var result = false;
                enabledLibraries.forEach(library => {
                    if (library) {
                        try {
                            result = eval("handleCommand_" + library + "('" + words[0] + "', '" + words + "')");
                            if (result) {
                                return;
                            }
                        } catch (error) {
                            
                        }
                        return;
                    }
                });
                if (!result) {
                    log(`Unknown command: ${words[0]}`, "yellow");
                }
                break;
            }

    }
});

window.onerror = function(message, source, lineno, colno, error) {
    log(`Error: ${message} at ${source}:${lineno}:${colno}`, "red");
};
