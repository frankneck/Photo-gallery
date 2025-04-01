var colNum = 1;
var tags = [] // list of all tags
let uploadedImages = new Set();

function findAllTags() {
    var allTags = document.getElementsByClassName("button-tag") // all objects who is button
    
    for (var i = 0; i < allTags.length; i++) {
        
        if (!tags.includes(allTags[i].innerText)) {
            tags.push(allTags[i].innerText);
        }
    }
}

function addNewTag(newTag) {
    
    if (!(tags.includes(newTag)) && newTag.length > 0) {
        tags.push(newTag);
        const selects = document.getElementsByName("selectTag");
        
        selects.forEach(function (select){
            let option = document.createElement("option");
            option.textContent = newTag;
            select.appendChild(option);
        });

        var ul = document.querySelector("nav ul");
        var li = document.createElement("li");
        li.innerHTML = `
            <button class="button-tag" id="tag${tags.length}" name="tag">
                <a href="#" onclick = filterPictureByTag('${newTag}')>${newTag}</a>
            </button>`;
        ul.appendChild(li);
    }
}


function addElement(imageInput, description, tag1 = "None", tag2 = "None", tag3 = "None") {
    var cols = document.getElementsByClassName("column");                                       // получаем все столбцы
    var newItem = document.createElement("figure");
    let tagButtons = "";

    // Получаем файл из input
    var image = imageInput.files[0];                                                            // берем первый файл
                
    if (!image) {                                                                               // Проверяем, что файл существует
        alert("Please select a file.");
        return;
    }
    
    if (tag1 === "None" && tag2 === "None" && tag3 === "None") {
        alert("Choose at least one tag!");
        return;
    }

    var reader = new FileReader();
    
    if (tag1 === tag2 && tag2 === tag3) {
        [tag1].forEach((tag) => {
            if (tag !== "None") {                                               // если теги разные и нер равны None
                    tagButtons += `
                        <button class="button-tag" id="tag1" name="tag">
                            <a href="#">${tag}</a>
                        </button>`
                }
            });                                                                     // если теги одинаковые, добавляем просто первый
    }
    else if (tag1 === tag2 && tag2 !== tag3) {
        [tag1, tag3].forEach((tag) => {
            if (tag !== "None") {                                               // если теги разные и нер равны None
                    tagButtons += `
                        <button class="button-tag" id="tag1" name="tag">
                            <a href="#" onclick = filterPictureByTag('${tag}')>${tag}</a>
                        </button>`
                }
        });
    }
    else if (tag1 === tag3 && tag1 !== tag2) {
        [tag1, tag2].forEach((tag) => {
            if (tag !== "None") {                                               // если теги разные и нер равны None
                    tagButtons += `
                        <button class="button-tag" id="tag1" name="tag">
                            <a href="#" onclick = filterPictureByTag('${tag}')>${tag}</a>
                        </button>`
                }
            });
    }
    else if (tag2 === tag3 && tag2 !== tag1) {
        [tag1, tag3].forEach((tag) => {
            if (tag !== "None") {                                               // если теги разные и нер равны None
                    tagButtons += `
                        <button class="button-tag" id="tag1" name="tag">
                            <a href="#" onclick = filterPictureByTag('${tag}')=>${tag}</a>
                        </button>`
                }
            });
    }
    else if (tag1 !== tag2 && tag2 !== tag3 && tag1 !== tag3) {
        [tag1, tag2, tag3].forEach((tag) => {
        if (tag !== "None") {                                               // если теги разные и нер равны None
                tagButtons += `
                    <button class="button-tag" id="tag1" name="tag">
                        <a href="#" onclick = filterPictureByTag('${tag}')>${tag}</a>
                    </button>`
            }
        });
    }

    reader.onload = function(e) {
        const imageURL = e.target.result;                                   // получаем результат чтения файла
        
        if (uploadedImages.has(imageURL)) {
            alert("This image has already been uploaded!");
            return;
        }

        uploadedImages.add(imageURL);

        newItem.innerHTML = `
            <img src="${imageURL}" alt="Uploaded Image"/>
            <figcaption>
                <p name="description" style="display: none;">
                    ${description}
                </p>
                ${tagButtons}
            </figcaption>
        `;

        let minCol = cols[0]; // figure как элемент массива
        let minHeight = cols[0].offsetHeight; 

        Array.from(cols).forEach(function (col) {
            console.log(col.offsetHeight);

            if (col.offsetHeight < minHeight) {
                minHeight = col.offsetHeight;
                minCol = col;
            }
        });
        
        minCol.insertAdjacentElement("beforeend", newItem);
        closeForm(); // если все успешно, закрываем форму
    };

    // Чтение изображения как DataURL
    reader.readAsDataURL(image);
}

// фильтраиця тестовая версия
function filterPictureByTag(tempTag) {
    const pictures = Array.from(document.getElementsByTagName("figure"));
    
    pictures.forEach((picture) => {
        const btnTags = Array.from(picture.getElementsByTagName("button"));
        const hasTag = btnTags.some(btnTag => btnTag.innerText.trim() === tempTag);
        picture.style.display = hasTag ? "block" : "none";
    });
}

function showAllPictures() {
    const pictures = Array.from(document.getElementsByTagName("figure"));
    pictures.forEach((picture) => {
        picture.style.display = "block";
    });
}

// вспомогательные функции
function openForm() {
    const form = document.querySelector("form");
    form.style.display = "block";
    form.reset();
}

function closeForm() {
const form = document.getElementById("Adding form");
form.style.display = "none";
    form.reset();
}