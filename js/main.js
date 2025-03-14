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
                            </button>
    `;
    col.insertAdjacentElement("beforeend", newItem);
    if (colNum === 3) {
        colNum = 1;
    }
    else {
        colNum++;
    }
}