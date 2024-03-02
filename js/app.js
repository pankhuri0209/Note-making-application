let notes = []; // array to store notes

let toggleButtonClicked = [];

function fetchNotes() {
  // Simulate fetching notes from a JSON file
  // Here you can use XMLHttpRequest or fetch API to get notes from a server

  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/data/notes.json");

  xhr.onload = function () {
    const status = this.status;
    const responseText = this.responseText;

    if (status === 200) {
      const articles = JSON.parse(responseText);
      articles.forEach((item) =>
        // addArticle(item.id, item.textContent, item.content, articlesSection)

        notes.push({
          title: item.title,
          content: item.content,
          actionItems: item.actionItems,
          created: item.created,
        })
      );
    }
    // Call displayNotes() after a delay of 1000 milliseconds (1 second)
    setTimeout(displayNotes, 1000);
  };
  xhr.send();
}

function displayNotes() {
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = "";
  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.setAttribute("id", `note-${index}`);
    noteDiv.innerHTML = `
    <div class="note-header">
    <h2>${note.title}</h2> &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;
    
        <button class="side-button" id="toggle-${index}">Toggle Button</button>
  </div>
      <div class="content">${note.content}</div>
     
    `;
    const toggleButton = noteDiv.querySelector(`#toggle-${index}`);
    toggleButton.addEventListener("click", () => {
      // Update the variable when the toggle button is clicked
      toggleButtonClicked[index] = !toggleButtonClicked[index];
      var element = document.getElementById(`note-${index}`);
      if (typeof element !== "undefined" && element !== null) {
        if (toggleButtonClicked[index]) {
          element?.classList.add("expanded");
          actionAttribute(index);
          showDateCreated(index);
        } else {
          //   var actionDiv = element.querySelector("action-expanded");
          //   actionDiv?.remove();
          element.classList.remove("expanded");
        }
      }

      console.log("inside", toggleButtonClicked);
    });

    notesList.appendChild(noteDiv);
  });
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("openModalBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  createNote();
}
function showDateCreated(selectedIndex) {
  var noteDiv = document.getElementById(`note-${selectedIndex}`);
  const datetimeHTML = `
 <div class="datetime-expanded">
   <h3 class="custom-heading">${notes[selectedIndex].created}</h3>
   </div>
   `;
  noteDiv.innerHTML += datetimeHTML;
}
function actionAttribute(selectedIndex) {
  var noteDiv = document.getElementById(`note-${selectedIndex}`);
  const actionItemsHTML = `
 <div class="action-expanded">
   <h3>Action Items:</h3>
   ${notes[selectedIndex].actionItems
     .map(
       (item) => `
     <div class="action-item">
       <input type="checkbox"> <label for="editableCheckbox" contenteditable="true">${item}
     </div>
   `
     )
     .join("")}
 </div>
`;
  noteDiv.innerHTML += actionItemsHTML;
  const contentElement = noteDiv.querySelector(".content");
  const actionItemsElements = noteDiv.querySelectorAll(".action-item");
  //   titleElement.contentEditable = true;
  contentElement.contentEditable = true;

  actionItemsElements.forEach((item) => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const text = item.querySelector("span");
    //  text.contentEditable = true;
    checkbox.disabled = false;
  });
}

function truncateContent(content) {
  return content.split(" ").slice(0, 10).join(" ");
}

function expandNote1(index) {
  const noteDiv = document.getElementById(`note-${index}`);
  const isExpanded = noteDiv.classList.contains("expanded");

  // Close all other note divs
  const allNotes = document.querySelectorAll(".note");
  allNotes.forEach((note, i) => {
    // if (i == index) {
    note.classList.remove("expanded");
    //}
  });

  if (isExpanded && toggleButtonClicked[index] == false) {
    // If the same note is clicked again, make its content and action items editable
    // Get all elements with class name "expanded" inside elements with class name "note"
    var expandedElements = document.querySelectorAll(".note .expanded");

    // Loop through each expanded element and remove it
    expandedElements.forEach(function (expandedElement) {
      expandedElement.parentNode.removeChild(expandedElement);
    });
  } else {
    // Expand the clicked note and make its content and action items editable
    noteDiv.classList.add("expanded");

    const contentDiv = noteDiv.querySelector(".content");
    contentDiv.setAttribute("contenteditable", true);
    // Append the action items HTML
    const actionItemsHTML = `
 <div class="action-expanded">
   <h3>Action Items:</h3>
   ${notes[index].actionItems
     .map(
       (item) => `
     <div class="action-item">
       <input type="checkbox"><label for="editableCheckbox" contenteditable="true"> ${item} </label>
     </div>
   `
     )
     .join("")}
 </div>

`;
    noteDiv.innerHTML += actionItemsHTML;
  }
}

function saveNote() {
  const title = document.getElementById("note-title").value;
  const content = document.getElementById("note-content").value;
  const actionItems = Array.from(
    document.querySelectorAll("#action-items-list input[type=checkbox]:checked")
  ).map((item) => item.nextSibling.textContent.trim());
  const created = new Date().toLocaleString();
  const newNote = { title, content, actionItems, created };
  notes.push(newNote);
  displayNotes();
  document.getElementById("note-details").style.display = "none";
}

var items_added = [];
function createNote() {
  // Append form to modal content
  items_added = [];

  document.getElementById("modalContent").innerHTML = `
  <div class="form__group field">
  <input type="input" class="form__field" placeholder="Title" name="name" id='name' required />
  <label for="Title" class="form__label">Title</label>
</div>
 <textarea id="note-content" placeholder="Content"></textarea><br>

 <input type="input" class="input-class" id="action-item"  placeholder="Action Item" />
 <button class="add-item" onclick="addActionItemButton()">Add Action Item</button>

 <div id="action-items-list" class="action-items-list"></div>
 
`;
  addFooterDate();
}
function addFooterDate() {
  const currentDateElement = document.getElementById("current-date");
  const currentDate = new Date().toLocaleDateString("en-US", {
    timeZone: "UTC",
  });
  currentDateElement.textContent = currentDate;
}
function addActionItemButton() {
  const actionItemInput =
    document.getElementsByClassName("input-class")[0].value;

  // const actionItem = actionItemInput.value.trim();
  if (actionItemInput !== "") {
    items_added.push(actionItemInput);
    console.log(items_added);

    document.getElementsByClassName("input-class")[0].value = "";
    addActionItem();
  }
}

function addActionItem() {
  const actionItemsList =
    document.getElementsByClassName("action-items-list")[0];
  actionItemsList.innerHTML = "";
  let itemList = [];
  items_added.forEach((e) => {
    const actionItemDiv = document.createElement("div");
    actionItemDiv.classList.add("action-item");
    actionItemDiv.innerHTML = `
        <input type="checkbox"> ${e}
      `;
    actionItemsList.appendChild(actionItemDiv);
  });
  console.log(actionItemsList.innerHTML);
}

fetchNotes(); // Load notes when the page loads
