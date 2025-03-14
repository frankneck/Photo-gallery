var colNum = 1;
 
function AddElement() {
    var col = document.getElementById(`column${colNum}`);



    var newItem = document.createElement("figure");
    newItem.innerHTML = `
                        <img src="../static/images/cyberpunk.jpg" width="600"/>
                        <figcaption>
                            <button class="button-tag" id="tag" name="tag">
                                <a href="#">tag 1</a>
                            </button>
                            <button class="button-tag" id="tag" name="tag">
                                <a href="#">tag 2</a>
                            </button>
                            <button class="button-tag" id="tag" name="tag">
                                <a href="#">tag 3</a>
                            </button>`;
    col.insertAdjacentElement("beforeend", newItem);
    if (colNum === 3) {
        colNum = 1;
    }
    else {
        colNum++;
    }
}


function FilterPictureByTag() {
    var pictures = Array.from(document.getElementsByTagName("figure"));
    var tempTag = "tag 1";

    console.log("Всего элементов <figure>: ", pictures.length);

    var filteredPictures = pictures.filter(function (picture) {
        
        var btnTags = Array.from(picture.getElementsByTagName("button"));
        
        return btnTags.some(function (btnTag) {
            return (btnTag.innerText.trim() === tempTag);
        });
    });

    filteredPictures.forEach(function (picture) {
        console.log(picture);
    });
}

FilterPictureByTag();