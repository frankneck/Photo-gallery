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
    var cols = document.querySelectorAll(".columns"); // Получаем все столбцы
    var newItem = document.createElement("figure");
    let tagButtons = "";

    // Получаем файл из input
    var image = imageInput.files[0]; // Берем первый файл
                
    if (!image) {
        alert("Please select a file.");
        return;
    }
    
    // Фильтруем теги, оставляя только уникальные и не "None"
    let uniqueTags = [...new Set([tag1, tag2, tag3].filter(tag => tag !== "None"))];

    if (uniqueTags.length === 0) {
        alert("Choose at least one tag!");
        return;
    }

    // Создаем кнопки для тегов
    uniqueTags.forEach(tag => {
        tagButtons += `
            <button class="button-tag" name="tag">
                <a href="#" onclick="filterPictureByTag('${tag}')">${tag}</a>
            </button>`;
    });

    var reader = new FileReader();
    
    reader.onload = function(e) {
        const imageURL = e.target.result; // Получаем результат чтения файла
        
        if (uploadedImages.has(imageURL)) {
            alert("This image has already been uploaded!");
            return;
        }

        uploadedImages.add(imageURL);

        newItem.innerHTML = `
            <a class="image"><img src="${imageURL}" alt="Uploaded Image"/></a>
            <figcaption>
                <p name="description" style="display: none;">${description}</p>
                ${tagButtons}
            </figcaption>
        `;

        // Выбираем самый низкий столбец
        var minCol = Array.from(cols).reduce((min, col) => 
            col.offsetHeight < min.offsetHeight ? col : min, cols[0]);

        minCol.appendChild(newItem);
        closeForm(); // Закрываем форму
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