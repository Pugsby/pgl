let openedPdf;
let pageNumber = 1;
var myCommandList_pdfReader = ['openPdf', 'pdfInfo', 'displayPdf', 'nextPage', 'prevPage'];
installedLibraries.push('pdfReader');
commandList.push(...myCommandList_pdfReader);

function displayPdf () {
    const reader = new FileReader();
                    reader.onload = function(event) {
                        const pdfData = event.target.result;

                        const pdfWindow = document.createElement('div');
                        pdfWindow.classList.add('window');

                        const windowHeader = document.createElement('div');
                        windowHeader.classList.add('windowHeader');

                        const title = document.createElement('p');
                        title.textContent = `${openedPdf.name} - Page ${pageNumber}`;
                        windowHeader.appendChild(title);

                        const closeButton = document.createElement('button');
                        closeButton.classList.add('closeButton');
                        closeButton.textContent = '×';
                        closeButton.onclick = () => pdfWindow.remove();
                        windowHeader.appendChild(closeButton);

                        const windowContent = document.createElement('div');
                        windowContent.classList.add('windowContent');
                        const pdfjsLib = window['pdfjs-dist/build/pdf'];
                        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        windowContent.appendChild(canvas);

                        pdfjsLib.getDocument({ data: pdfData }).promise.then(pdf => {
                            pdf.getPage(pageNumber).then(page => {
                                const viewport = page.getViewport({ scale: 1 }); // Get original size
                                const canvas = document.createElement('canvas');
                                const context = canvas.getContext('2d');
                        
                                // Set canvas width and height
                                const scale = Math.min(window.innerWidth / viewport.width, window.innerHeight / viewport.height);
                                canvas.width = viewport.width * scale;
                                canvas.height = viewport.height * scale;
                        
                                const renderContext = {
                                    canvasContext: context,
                                    viewport: page.getViewport({ scale })
                                };
                                page.render(renderContext);
                                windowContent.appendChild(canvas);
                            });
                        }).catch(error => {
                            log(`Failed to load PDF: ${error.message}`, "red");
                        });

                        pdfWindow.appendChild(windowHeader);
                        pdfWindow.appendChild(windowContent);

                        document.body.appendChild(pdfWindow);
                    };
                    reader.readAsArrayBuffer(openedPdf);
}

function handleCommandWithPdfReader(command, words) {
    var result = true;
    switch (command) {
        case 'openPdf':
            if (words[1]) {
                const pdfUrl = words[1];
                fetch(pdfUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        openedPdf = new File([blob], pdfUrl.split('/').pop(), { type: 'application/pdf' });
                        log(`Selected PDF: ${openedPdf.name}. You can now use it within the command line.`);
                    })
                    .catch(error => {
                        log(`Failed to fetch PDF: ${error.message}`);
                    });
            } else {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'application/pdf';
                fileInput.addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        log(`Selected PDF: ${file.name}. You can now use it within the command line.`);
                        openedPdf = file;
                    }
                });
                fileInput.click();
            }
            break;

        case 'pdfInfo':
            if (openedPdf) {
                log(`Name: ${openedPdf.name}`);
                log(`Size: ${(openedPdf.size / 1000).toFixed(2)} kilobytes`);
            } else {
                log('No PDF opened.', "yellow");
            }
            break;

        case 'displayPdf':
            if (openedPdf) {
                displayPdf();
            } else {
                log('No PDF opened.', "yellow");
            }
            break;

        case 'nextPage':
            if (openedPdf) {
                pageNumber++;
                const windows = document.querySelectorAll('.window');
                windows.forEach(window => {
                    const title = window.querySelector('.windowHeader p');
                    if (title && title.textContent === `${openedPdf.name} - Page ${pageNumber - 1}`) {
                        window.remove();
                    }
                });
                displayPdf();
                log('Page ' + pageNumber + ' of ' + openedPdf.name);
            } else {
                log('No PDF opened.', "yellow");
            }
            break;

        case 'prevPage':
            if (openedPdf) {
                pageNumber--;
                const windows = document.querySelectorAll('.window');
                windows.forEach(window => {
                    const title = window.querySelector('.windowHeader p');
                    if (title && title.textContent === `${openedPdf.name} - Page ${pageNumber + 1}`) {
                        window.remove();
                    }
                });
                displayPdf();
                log('Page ' + pageNumber + ' of ' + openedPdf.name);
            } else {
                log('No PDF opened.', "yellow");
            }
            break;
        case 'pdfReader':
            if (words[1] === 'help') {
                log('Available commands: ' + myCommandList_pdfReader.join(', '));
            } else {
                log('pdfReader is the name of a library, not a command. If you need a command list, type "pdfReader help"', "yellow");
            }
            break;
        default:
            result = false;
            break;
        }
        return result
    }
