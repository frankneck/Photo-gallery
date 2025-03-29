var colNum = 1;
var tags = [] // list of all tags

function findAllTags() {
    var allTags = document.getElementsByClassName("button-tag") // all objects who is button
    
    for (var i = 0; i < allTags.length; i++) {
        
        if (!tags.includes(allTags[i].innerText)) {
            tags.push(allTags[i].innerText);
        }
    }
}

function addNewTag(newTag) {
    
    if (!tags.includes(newTag)) {
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
                <a href="#">${newTag}</a>
            </button>`;
        ul.appendChild(li);
    }
}


function addElement(imageInput, description, tag1 = "none", tag2 = "none", tag3 = "none") {
    var cols = document.getElementsByClassName("column"); // получаем все столбцы
    var newItem = document.createElement("figure");

    // Получаем файл из input
    var image = imageInput.files[0]; // берем первый файл

    // Проверяем, что файл существует
    if (!image) {
        alert("Please select a file.");
        return;
    }

    var reader = new FileReader();
    
    reader.onload = function(e) {
        var imageURL = e.target.result; // получаем результат чтения файла
        newItem.innerHTML = `
            <img src="${imageURL}" alt="Uploaded Image"/>
            <figcaption>
                <p name="description" style="display: none;">
                    ${description}
                </p>
                <button class="button-tag" id="tag" name="tag">
                    <a href="#">${tag1}</a>
                </button>
                <button class="button-tag" id="tag" name="tag">
                    <a href="#">${tag2}</a>
                </button>
                <button class="button-tag" id="tag" name="tag">
                    <a href="#">${tag3}</a>
                </button>
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
    };

    // Чтение изображения как DataURL
    reader.readAsDataURL(image);
}

function clickButtonAddElement() {

}

// фильтраиця тестовая версия
function filterPictureByTag() {
    var pictures = Array.from(document.getElementsByTagName("figure"));
    var tempTag = "tag1";

    var filteredPictures = pictures.filter(function (picture) {
        
        var btnTags = Array.from(picture.getElementsByTagName("button"));
        
        return btnTags.some(function (btnTag) {
            return (btnTag.innerText.trim() === tempTag);
        });
    });

    filteredPictures.forEach(function (picture) {
    });
}

function openForm() {
    const form = document.querySelector("form");
    form.style.display = "block";
    form.reset();

    // closing of the button
    var count = 0;
    var buttons = document.getElementsByName("AddElement");
    
    buttons.forEach( function (button) {

        if (count == 1)
        {
            button.style.display = "none";
        }
        
        count++;
    });
    
}

function closeForm() {
    const form = document.getElementById("Adding form");
    form.style.display = "none";
    form.reset();

    // opening of the button
    var count = 0;
    var buttons = document.getElementsByName("AddElement");
    
    buttons.forEach( function (button) {

        if (count == 1) {
            button.style.display = "block";
        }

        count++;
    });
}

findAllTags();