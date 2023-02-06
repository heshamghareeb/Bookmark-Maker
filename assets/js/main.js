let siteName = document.querySelector("#siteName");
let siteUrl = document.querySelector("#siteUrl");
let inputs = document.querySelectorAll('input');
let alerts = document.querySelectorAll("p.custom-alert");
let submitBtn = document.querySelector(".submitBtn");
let bookmarkItems = document.querySelector('.bookmarkItems');
let bookmarks = [];
let regex = /([\w])/;
let urlRegex = RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
let indexUpdate;


if (localStorage.getItem("bookmarks") != null) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    displaybookmarkItems(bookmarks);
}


function showError(classError, msg, showError) {
    let errorEle = document.getElementById(classError);
    errorEle.innerHTML = msg;
    showError ? errorEle.classList.replace('d-none', 'd-block'):errorEle.classList.replace('d-block', 'd-none');
}

function submit() {
    if (checkeValidate(siteName.value, siteUrl.value) && checkAlreadyExist(siteName.value, siteUrl.value)) {
        addBookmarkItem(siteName.value, siteUrl.value);
        return true
    }
    checkeValidate(siteName.value, siteUrl.value);
    checkAlreadyExist(siteName.value, siteUrl.value);
}

submitBtn.addEventListener('click', function(){
    if (indexUpdate == undefined) {
        submit() ? clearForm() : null;
    }
    
});

function checkeValidate(checkName, checkurl){
    if (regex.test(checkName) == false ) {
        showError('nameError', 'Name is required', true)
        return false;
    }else{
        showError('nameError', '', false);
    }
    if (urlRegex.test(checkurl) == false ) {
        showError('urlError', 'Url is required', true)
        return false;
    }else{
        showError('urlError', '', false)
    }

    return true;
}

function checkAlreadyExist(checkName, checkurl, checkIndex) {
    let result = true;
    for (let index = 0; index < bookmarks.length; index++) {
        if (checkName == bookmarks[index].name && checkIndex == undefined) {
            showError('nameError', 'this name already exist', true)
            result = false;
        }else if (checkIndex !== undefined && bookmarks[checkIndex].name !== checkName) {
            showError('nameError', 'this name already exist', true)
            result = false;
        }
        if (checkurl == bookmarks[index].siteUrl && checkIndex == undefined) {
            showError('urlError', 'this url already exist', true)
            result = false;
        }else if (checkIndex !== undefined && bookmarks[checkIndex].siteUrl !== checkurl) {
            showError('urlError', 'this url already exist', true)
            result = false;
        }
    }
    return result;
}


function addBookmarkItem(siteName, siteUrl) {
    let bookmark = {name:siteName, siteUrl:siteUrl};

    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
    displaybookmarkItems(bookmarks);
    
}

function displaybookmarkItems(bookmarks){
    bookmarkItems.innerHTML = '';
    for (let index = 0; index < bookmarks.length; index++) {
        
        let bookmarkItem = document.createElement('div');
        bookmarkItem.id = bookmarks[index].name;
        bookmarkItem.classList.add('bookmark-item');
    
        let siteNameText = document.createElement('h2');
        siteNameText.innerText = bookmarks[index].name;
    
        let visitBtn = document.createElement('a');
        visitBtn.classList.add('btn', 'btn-primary');
        visitBtn.setAttribute("href", bookmarks[index].siteUrl);
        visitBtn.setAttribute("target", '_blank');
        visitBtn.innerText = 'visit';
    
        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-danger', 'btndelete');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick= ()=>deleteBookmark(index);

        let updateBtn = document.createElement('button');
        updateBtn.classList.add('btn', 'btn-warning');
        updateBtn.innerText = 'Update';
        updateBtn.onclick= ()=>setFormForUpdate(index);
    
        bookmarkItem.append(siteNameText);
        bookmarkItem.appendChild(visitBtn);
        bookmarkItem.appendChild(deleteBtn);
        bookmarkItem.appendChild(updateBtn);
        bookmarkItems.appendChild(bookmarkItem);
    }
}

function clearForm(){
    siteName.value = '';
    siteUrl.value = '';
}

function deleteBookmark(index) {
    bookmarks.splice(index,1);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displaybookmarkItems(bookmarks)
}

function setFormForUpdate(index) {
    submitBtn.innerText = 'Update';
    siteName.value = bookmarks[index].name;
    siteUrl.value = bookmarks[index].siteUrl;
    indexUpdate = index;
    submitBtn.onclick= ()=> updateProduct();
    checkeValidate(siteName.value, siteUrl.value);
}

function updateProduct() {
    if (checkeValidate(siteName.value, siteUrl.value) && checkAlreadyExist(siteName.value, siteUrl.value, indexUpdate)) {

        let bookmarkItem = {
            name:siteName.value,
            siteUrl:siteUrl.value,
        };
        bookmarks[indexUpdate] = bookmarkItem;
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
        displaybookmarkItems(bookmarks);
        clearForm();
        submitBtn.innerText = 'Submit';
        submitBtn.onclick= submit;
        indexUpdate == undefined;
    }
}