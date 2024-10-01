let form = document.getElementById("form")
let nameGroup = document.getElementById("name")
let addressGroup = document.getElementById("address")
let numberGroup = document.getElementById("number")
let availableContactContainer = document.getElementById("available-contacts")
let mainCardContainer = document.getElementById("card-container")
let actionMessage = document.getElementById("action__message")
let buttonText = document.getElementById("add__text")
let resetButton = document.getElementById("header-btn")


let contactArray = []
let editSignal = -1

// Collect user's input data 
form.addEventListener("submit", collectData)
function collectData(event){
    event.preventDefault()

    let nameInput = nameGroup.value
    let addressInput = addressGroup.value
    let numberInput = numberGroup.value

    if(nameInput.length === 0 || addressInput.length === 0 || numberInput.length === 0){
        alert("All field's must be completed")
        return
    }

    // Check for duplicate contacts
    let contactExists = contactArray.some(item => 
        item.nameOfContact.toLowerCase() === nameInput.toLowerCase() && 
        item.addressOfContact.toLowerCase() === addressInput.toLowerCase() && 
        item.numberOfContact.toLowerCase() === numberInput.toLowerCase()
    )

    if (contactExists && editSignal === -1) {
        alert("This contact already exists.");
        return;
    }

    // Edit contact if editSignal is active
    if(editSignal >= 0){
        contactArray = contactArray.map((item, index)=>{
            if(editSignal === index){
                return{
                    nameOfContact : nameInput,
                    addressOfContact : addressInput,
                    numberOfContact : numberInput
                }
            }else{
                buttonText.textContent = "Add contact"
                return{
                    nameOfContact : item.nameOfContact,
                    addressOfContact : item.addressOfContact,
                    numberOfContact : item.numberOfContact
                }
            }
        })
    } else {
        const userInput = {
            nameOfContact : nameInput,
            addressOfContact : addressInput,
            numberOfContact : numberInput
        }
        contactArray.push(userInput)
    }

    localStorage.setItem("contactInfo", JSON.stringify(contactArray))
    form.reset()
    fetchUserData()

    // Show success message
    showSuccessMessage()
}

// Show success message when contact is added or updated
function showSuccessMessage(){
    actionMessage.style.display = "block"  // show the message 
    setTimeout(()=>{
        actionMessage.style.display = "none" // Hide the message after 2 seconds 
    }, 2000)
}

// Fetch user data from Local Storage 
function fetchUserData(){
    if(localStorage.getItem("contactInfo")){
        contactArray = JSON.parse(localStorage.getItem("contactInfo"))
    }
    printContactInfo()
}
fetchUserData()

// Print contact Information to the UI
function printContactInfo(){
    if(contactArray.length === 0){
        availableContactContainer.style.display = "none"
    }else{
        availableContactContainer.style.display = "flex"
    }

    mainCardContainer.innerHTML = ""
    contactArray.forEach((item, index)=> {
        let contactName = item.nameOfContact
        let contactAddress = item.addressOfContact
        let contactNumber = item.numberOfContact

        let cardDiv = document.createElement("div") // main card 
        cardDiv.classList.add("card")

        let contactIdDiv = document.createElement("div")
        contactIdDiv.classList.add("contact-id")

        let headingText = document.createElement("h4")
        headingText.textContent = "Contact ID:"

        let pTag = document.createElement("p")
        pTag.textContent = `${index}`

        contactIdDiv.append(headingText, pTag)

        let contactIdDivName = document.createElement("div")
        contactIdDivName.classList.add("contact-id")

        let headingTextName = document.createElement("h4")
        headingTextName.textContent = "Name:"

        let pTagName = document.createElement("p")
        pTagName.textContent = contactName 

        contactIdDivName.append(headingTextName, pTagName)

        let contactIdDivAddress = document.createElement("div")
        contactIdDivAddress.classList.add("contact-id")

        let headingTextAddress = document.createElement("h4")
        headingTextAddress.textContent = "Address:"

        let pTagNameAddress = document.createElement("p")
        pTagNameAddress.textContent = `${contactAddress}` 

        contactIdDivAddress.append(headingTextAddress, pTagNameAddress)

        let contactIdDivNumber = document.createElement("div")
        contactIdDivNumber.classList.add("contact-id")

        let headingTextNumber = document.createElement("h4")
        headingTextNumber.textContent = "Contact Number:"

        let pTagNameNumber = document.createElement("p")
        pTagNameNumber.textContent = contactNumber 

        contactIdDivNumber.append(headingTextNumber, pTagNameNumber)

        let actionBtnDiv = document.createElement("div") //main button container
        actionBtnDiv.classList.add("action-btn")
        actionBtnDiv.setAttribute("id", `${index}`)

        let deleteButtonDiv = document.createElement("div")
        deleteButtonDiv.classList.add("action-btn__delete")
        deleteButtonDiv.setAttribute("data-action", "delete")

        let deleteIcon = document.createElement("i")
        deleteIcon.classList.add("fa-solid", "fa-trash")
        deleteIcon.setAttribute("data-action", "delete")

        let deleteText = document.createElement("p")
        deleteText.textContent = "Delete"
        deleteText.setAttribute("data-action", "delete")

        deleteButtonDiv.append(deleteIcon, deleteText)

        let editButtonDiv = document.createElement("div")
        editButtonDiv.classList.add("action-btn__edit")
        editButtonDiv.setAttribute("data-action", "edit")

        let editIcon = document.createElement("i")
        editIcon.classList.add("fa-solid", "fa-pen-to-square")
        editIcon.setAttribute("data-action", "edit")

        let editText = document.createElement("p")
        editText.textContent = "Edit"
        editText.setAttribute("data-action", "edit")

        editButtonDiv.append(editIcon, editText)
        actionBtnDiv.append(deleteButtonDiv, editButtonDiv)

        cardDiv.append(contactIdDiv, contactIdDivName, contactIdDivAddress, contactIdDivNumber, actionBtnDiv)
        mainCardContainer.append(cardDiv)

    })
}

//Catch user Action/target
mainCardContainer.addEventListener("click", contactTarget)
function contactTarget(event){
    let userTarget = event.target
    let grandParentElement = userTarget.parentElement.parentElement
    
    if(!grandParentElement.classList.contains("action-btn"))return
    
    let contactId = Number(grandParentElement.id)
    let clickedAction = userTarget.dataset.action 

    if(clickedAction === "edit"){
        editContact(contactId)
    }else if (clickedAction === "delete"){
        deleteContact(contactId)
    }
}


// Edit contact list 
function editContact(iD){
    nameGroup.value = contactArray[iD].nameOfContact
    addressGroup.value = contactArray[iD].addressOfContact
    numberGroup.value = contactArray[iD].numberOfContact

    editSignal = iD
    // Change input field button text content 
    if(editSignal === iD){
        buttonText.textContent = "Update contact"
    }
}

// Delete a contact 
function deleteContact(ID){
    contactArray = contactArray.filter((item, index)=>{
        return ID !== index
    })
    localStorage.setItem("contactInfo", JSON.stringify(contactArray))
    fetchUserData()
}

// Delete All note using the reset button 
resetButton.addEventListener("click", ()=>{
    contactArray = []
    localStorage.setItem("contactInfo", JSON.stringify(contactArray))
    fetchUserData()
})
