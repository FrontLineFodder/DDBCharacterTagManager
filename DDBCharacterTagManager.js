// ==UserScript==
// @name        DnDBeyond Character Tag Manager
// @namespace   DnDBeyond Tag Manager
// @match       https://www.dndbeyond.com/characters
// @grant       none
// @version     2.0.0
// @author      Adam Mellor
// @description DnDBeyond Character Tag Manager script for Violentmonkey
// @homepage    https://github.com/FrontLineFodder/DDBCharacterTagManager
// @downloadURL https://github.com/FrontLineFodder/DDBCharacterTagManager/raw/Dev/DDBCharacterTagManager.js
// ==/UserScript==

(function() {
  'use strict';

// Function to check if the style with id 'styleTagManager' exists, and add it if it's missing
function ensureStyleTagManager() {
  const existingStyle = document.getElementById('styleTagManager');

  if (!existingStyle) {
      // Create a new style element
      const style = document.createElement('style');
      style.id = 'styleTagManager'; // Set the id attribute
      style.innerHTML = `
      /* Main content section */
      .main-content {
          padding: 20px;
          background-color: #f9f9f9;
      }

      /* Sidebar section, aligned to the right */
      .sidebar-TagManager {
          transition: width 0.3s ease;
          overflow: hidden;
          z-index: 1000 !important;
          height: 100vh;
          padding: 0 !important;
          background-color: #e2e2e2;
          display: flex;
          justify-content: flex-start;
      }

      .sidebar-TagManager.container-TagManager {
          position: fixed !important;
          top: 120px;
          right: 0;
      }

      /* Collapsed sidebar */
      .sidebar-TagManager.collapsed-TagManager {
          display: none;
      }

      .sidebarContent-TagManager {
          padding: 20px;
          display: flex;
          flex-direction: column;
      }

      /* Vertical text block */
      .vertical-text {
          writing-mode: vertical-lr;
          background-color: var(--color-primary--main);
          color: white;
          padding: 0;
          font-size: 1.2em;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
      }

      /* Button to toggle the sidebar */
      #toggleButton {
          position: absolute;
          top: 10px;
          left: -50px;
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
          transform: rotate(90deg);
          transform-origin: left top;
          white-space: nowrap;
      }

      #toggleButton:hover {
          background-color: #45a049;
      }

      /* Responsive behavior for smaller screens */
      @media (max-width: 768px) {
          .sidebar-TagManager {
              width: 100%;
              height: auto;
              bottom: 0;
              right: 0;
              top: unset;
          }

          .sidebar-TagManager.collapsed-TagManager {
              width: 60px;
          }
      }

      /* Styles for tagList and its items */
      #tagList {
          margin: 0;
          padding: 0;
          list-style-type: none;
      }
      .tagInput, .tagListItem {
          position: relative;
          padding: 12px;
          margin: 5px;
          background: #eee;
          font-family: Tiamat Condensed SC;
          font-size: 2.5rem;
          transition: 0.2s;
      }
      .sortable-list {
          overflow: auto;
          max-height: 700px;
          min-height: 350px;
      }
      .tagListItem {
          display: flex;
          justify-content: space-between;
          user-select: none;
          border: solid #374045;
      }
      .tagHidden {
          background: bottom;
          opacity: 50%;
          border: solid #ed6c02;
      }
      .characterHidden {
          display: none;
      }
      .tagGrab {
        cursor: grab;
      }
      .tagSelect {
          cursor: pointer;
      }
      .newItem:hover {
          background-color: rgb(223, 222, 222);
      }
      .removeItem {
          cursor: pointer;
          font-size: 2.5rem;
          padding-left: 16px;
      }
      .characterTagSettingsHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
      }
      .characterTagSettingsOverlay,
      .characterTagSettingsBackground {
          position: fixed;
          display: flex;
          justify-content: center;
          align-items: center;
          inset: 0;
      }
      .characterTagSettingsOverlay {
        z-index: 99999;
      }
      .characterTagSettingsBackground {
          background-color: rgba(0, 0, 0, 0.5);
          z-index: -1;
      }
      .characterTagSettingsPopup {
          background-color: #fff;
          color: #12181c;
          border-radius: 8px;
          box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
                      0px 1px 1px 0px rgba(0, 0, 0, 0.14),
                      0px 1px 3px 0px rgba(0, 0, 0, 0.12);
      }
      .characterTagSettingsTitle {
          margin: 0;
          font-family: Roboto;
          font-size: 18px;
          font-weight: 700;
          line-height: 24px;
      }
      .characterTagButtonSpan {
          border: solid var(--color-primary--main);
          border-radius: 6px;
          color: var(--color-primary--main);
          padding: 4px;
      }
      .characterTagSettingsButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          padding: 5px;
          font-size: 1.125rem;
          background-color: transparent;
          cursor: pointer;
          color: rgba(18, 24, 28, 0.64);
      }
      `;
      // Append the style element to the head of the document
      document.head.appendChild(style);
      // console.log("Style 'styleTagManager' was missing and has been added.");
  } else {
      console.log("Style 'styleTagManager' already exists.");
  }
}

function ensureSidebarTagManager() {
  const existingSidebar = document.getElementById('sidebarTagManager');

  if (!existingSidebar) {
      // Create the sidebar container
      const sidebarContainer = document.createElement('div');
      sidebarContainer.classList.add('sidebar-TagManager', 'container-TagManager');

      // Create the vertical text bar
      const verticalbar = document.createElement('div');
      verticalbar.classList.add('vertical-text');
      verticalbar.textContent = 'Tag Manager';
      sidebarContainer.appendChild(verticalbar);
      verticalbar.addEventListener('click', toggleSidebar);

      // Create the sidebar content container
      const sidebarTagManager = document.createElement('div');
      sidebarTagManager.id = 'sidebarTagManager';
      sidebarTagManager.classList.add('sidebar-TagManager', 'collapsed-TagManager');

      const sidebarContent = document.createElement('div');
      sidebarContent.classList.add('sidebarContent-TagManager');
      sidebarTagManager.appendChild(sidebarContent);

      // Add heading to the sidebar content
      const heading = document.createElement('h2');
      heading.textContent = 'Tag Manager';
      sidebarContent.appendChild(heading);

      // Append the sidebar to the main content container
      const container = document.querySelector('main');
      if (container) {
          sidebarContainer.appendChild(sidebarTagManager);
          container.appendChild(sidebarContainer);
          // console.log("Sidebar 'sidebarTagManager' was missing and has been added.");
      } else {
          console.error("Container not found. Cannot add sidebar.");
      }
  } else {
      console.log("Sidebar 'sidebarTagManager' already exists.");
  }
}

// Function to toggle the sidebar
function toggleSidebar() {
  const sidebarTagManager = document.getElementById('sidebarTagManager');
  if (sidebarTagManager) {
      sidebarTagManager.classList.toggle('collapsed-TagManager');
        updateWindowsSize();
  }
}

// Function to create the new button
function createTagManagerToggleButton() {
  // Create a new button element
  const buttonTagManagerToggle = document.createElement('button');

  // Set the innerHTML with the SVG and span text
  buttonTagManagerToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em">
          <path d="M0 252.1V48C0 21.5 21.5 0 48 0h204.1a48 48 0 0 1 33.9 14.1l211.9 211.9c18.7 18.7 18.7 49.1 0 67.9L293.8 497.9c-18.7 18.7-49.1 18.7-67.9 0L14.1 286.1A48 48 0 0 1 0 252.1zM112 64c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"></path>
      </svg>
      <span class="styles_settingsButtonText__GJ0wj">Tag Manager</span>
  `;

  // Set the button id
  buttonTagManagerToggle.id = 'buttonTagManagerToggle';

  // Copy classList from the existing button
  const buttonSettings = document.querySelector("#character-tools-target > div > div > div > div.styles_searchSort__-7qBD > button");
  if (buttonSettings) {
      buttonTagManagerToggle.classList = buttonSettings.classList;
  }

  // Add click event listener to toggle the sidebar
  buttonTagManagerToggle.addEventListener('click', toggleSidebar);

  // Append the new button to the search/sort container
  const divSearchSort = document.querySelector("#character-tools-target > div > div > div > div.styles_searchSort__-7qBD");
  if (divSearchSort) {
      divSearchSort.appendChild(buttonTagManagerToggle);
  } else {
      console.error("Search sort container not found. Cannot append the button.");
  }
}

function displayCharacterTagSettings() {
const tagSettingsPopup = `
  <div class="characterTagSettingsBackground" style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"></div>
  <div class="characterTagSettingsPopup" tabindex="-1" style="max-width: 50%; max-height: 900px; padding: 0px 16px;">
    <div class="characterTagSettingsHeader" style="padding: 16px; border-bottom: 1px solid rgb(162, 172, 178);">
      <svg height="1em" style="color: rgba(0, 0, 0, 0.54); margin-right: 5px; height: 35px; width: 35px;" viewBox="0 0 512 512">
        <path d="M0 252.1V48C0 21.5 21.5 0 48 0h204.1a48 48 0 0 1 33.9 14.1l211.9 211.9c18.7 18.7 18.7 49.1 0 67.9L293.8 497.9c-18.7 18.7-49.1 18.7-67.9 0L14.1 286.1A48 48 0 0 1 0 252.1zM112 64c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"></path>
      </svg>
      <p class="characterTagSettingsTitle">Update Character Tags</p>
      <button class="characterTagSettingsButton" tabindex="0" type="button" style="cursor: pointer; color: rgba(0, 0, 0, 0.54);">
        <span class="characterTagButtonSpan">Close</span>
      </button>
    </div>
    <div style="padding: 8px;">
      <input type="text" placeholder="enter new tag name" class="tagInput">
      <div class="sortable-list" style="overflow: auto; max-height: 700px; min-height: 350px;">
        <ul id="settingsTagList"></ul>
      </div>
    </div>
  </div>`;

const tagSettingsPopupElement = document.createElement("div");
tagSettingsPopupElement.classList.add("characterTagSettingsOverlay");
tagSettingsPopupElement.innerHTML = tagSettingsPopup;
document.body.appendChild(tagSettingsPopupElement);

const background = tagSettingsPopupElement.querySelector(".characterTagSettingsBackground");
const closeButton = tagSettingsPopupElement.querySelector(".characterTagSettingsButton");
const settingsTagList = document.getElementById("settingsTagList");
let draggedItem = null;

const newTagInput = tagSettingsPopupElement.querySelector("input.tagInput");
newTagInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    settingsTagList.innerHTML += `
      <li class="tagListItem tagGrab" draggable="true">
        ${event.target.value}
        <span class="removeItem">\u00D7</span>
      </li>`;
    event.target.value = "";
  }
});

// Remove tag when clicking on 'removeItem'
settingsTagList.addEventListener("click", (event) => {
  if (event.target.tagName === "SPAN" && event.target.className === "removeItem" && event.target.parentNode.tagName === "LI") {
    event.target.parentNode.remove();
  }
});

// Drag & drop functionality
settingsTagList.addEventListener("dragstart", (e) => {
  draggedItem = e.target;
  setTimeout(() => {
    e.target.style.display = "none";
  }, 0);
});

settingsTagList.addEventListener("dragend", (e) => {
  setTimeout(() => {
    e.target.style.display = "";
    draggedItem = null;
  }, 0);
});

settingsTagList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(settingsTagList, e.clientY);
  if (afterElement == null) {
    settingsTagList.appendChild(draggedItem);
  } else {
    settingsTagList.insertBefore(draggedItem, afterElement);
  }
});

const getDragAfterElement = (container, y) => {
  const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
};

// Close popup and update tags
const closePopup = () => {
  tagSettingsUpdate();
  tagSettingsPopupElement.remove();
};

background.addEventListener("click", closePopup);
closeButton.addEventListener("click", closePopup);

// Populate the tag settings list
tagSettingsPopulate();
}

function tagSettingsPopulate() {
const settingsTagList = document.getElementById("settingsTagList");
settingsTagList.innerHTML = ''; // Clear the existing list

characterTagSet.forEach((tagState) => {
  const listItem = document.createElement('li');
  listItem.classList.add('tagListItem', 'tagGrab');
  listItem.draggable = true;
  listItem.innerHTML = `${tagState.name}<span class="removeItem">\u00D7</span>`;
  settingsTagList.appendChild(listItem);
});
}

function tagSettingsUpdate() {
const settingsTagList = document.getElementById("settingsTagList");
const sidebarTagList = document.getElementById("sidebarTagList");

const newCharacterTagSet = new Map();
const oldToggleState = new Map();

// Get current sidebar tag states
sidebarTagList.querySelectorAll("li").forEach((tag) => {
  const hiddenState = tag.classList.contains('tagHidden');
  const tagState = { name: tag.innerText, hidden: hiddenState };
  oldToggleState.set(tag.innerText, tagState);
});

// Update newCharacterTagSet based on settingsTagList
settingsTagList.querySelectorAll("li.tagListItem").forEach((tag) => {
  const tagName = tag.childNodes[0].textContent;

  // Use old state if it exists, otherwise default to visible
  if (oldToggleState.has(tagName)) {
    newCharacterTagSet.set(tagName, oldToggleState.get(tagName));
  } else {
    newCharacterTagSet.set(tagName, { name: tagName, hidden: false });
  }
});

// Update the global characterTagSet with new values
characterTagSet = newCharacterTagSet;

// Remove character tags that are no longer in the tag set
for (const [character, tagname] of characterTags) {
  if (!characterTagSet.has(tagname)) {
    characterTags.delete(character);
  }
}

// Store the updated tags in local storage
localStorage.setItem("DnDBeyond_CharacterMgmt_CharacterTags", JSON.stringify([...characterTags]));
localStorage.setItem("DnDBeyond_CharacterMgmt_CharacterTagSet", JSON.stringify([...characterTagSet]));

// Optionally reload characters
// reloadCharacters();

sidebarTagListPopulate()
}

function reloadCharacters() {
const characterListingBody = document.querySelector("div.ddb-characters-listing-body");
const characterListItems = characterListingBody.querySelectorAll("li");

characterListItems.forEach((character) => {
  const characterCardHeader = character.querySelector(".ddb-campaigns-character-card-header-upper");
  const characterCardAnchor = characterCardHeader.querySelector("a");
  const characterPath = characterCardAnchor.pathname;

  // Check if character has a tag
  if (characterTags.has(characterPath)) {
    const characterTag = characterTags.get(characterPath);
    if (characterTagSet.has(characterTag)) {
      const tagState = characterTagSet.get(characterTag);
      toggleCharacterVisibility(character, tagState.hidden);
    }
  }
  // Handle 'Untagged' case
  else if (tagName === 'Untagged') {
    toggleCharacterVisibility(character, tagState.hidden);
  }
});
}

function updateCharacterHiddenStateFromTag() {
const sidebarTagListItems = document.querySelectorAll('#sidebarTagList li');

// Loop over each tag in the sidebarTagList
sidebarTagListItems.forEach(tagItem => {
  const tagName = tagItem.textContent.trim();
  const isHidden = tagItem.classList.contains('tagHidden');

  // Loop over all character list items and update their hidden state based on the tag
  const characterListItems = document.querySelectorAll("li.ddb-campaigns-character-card-wrapper.j-characters-listing__item");

  characterListItems.forEach(character => {
    const characterCardHeader = character.querySelector(".ddb-campaigns-character-card-header-upper");
    const characterCardAnchor = characterCardHeader.querySelector("a");
    const characterTag = characterTags.get(characterCardAnchor.pathname);

    // If the character's tag matches the sidebar tag, update its visibility
    if (characterTag === tagName || (tagName === 'Untagged' && !characterTag)) {
      if (isHidden) {
        character.classList.add('characterHidden');
      } else {
        character.classList.remove('characterHidden');
      }
    }
  });
});
}


// Helper function to toggle character visibility
function toggleCharacterVisibility(character, isHidden) {
const isCharacterHidden = character.classList.contains("characterHidden");

if (isHidden && !isCharacterHidden) {
  character.classList.add("characterHidden");
} else if (!isHidden && isCharacterHidden) {
  character.classList.remove("characterHidden");
}
}

function displayCharacterTagSelection(character) {
const tagSelectionPopup = `
  <div class="characterTagSettingsBackground" style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"></div>
  <div class="characterTagSettingsPopup" tabindex="-1" style="max-width: 50%; max-height: 900px; padding: 0px 16px;">
    <div class="characterTagSettingsHeader" style="padding: 16px; border-bottom: 1px solid rgb(162, 172, 178);">
      <svg height="1em" style="color: rgba(0, 0, 0, 0.54); margin-right: 5px; height: 35px; width: 35px;" viewBox="0 0 512 512">
        <path d="M0 252.1V48C0 21.5 21.5 0 48 0h204.1a48 48 0 0 1 33.9 14.1l211.9 211.9c18.7 18.7 18.7 49.1 0 67.9L293.8 497.9c-18.7 18.7-49.1 18.7-67.9 0L14.1 286.1A48 48 0 0 1 0 252.1zM112 64c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"></path>
      </svg>
      <p class="characterTagSettingsTitle">Select Character Tag</p>
      <button class="characterTagSettingsButton" tabindex="0" type="button" style="cursor: pointer; color: rgba(0, 0, 0, 0.54);">
        <span class="characterTagButtonSpan">Close</span>
      </button>
    </div>
    <div style="padding: 8px;">
      <div class="sortable-list" style="overflow: auto; max-height: 700px; min-height: 350px;">
        <ul id="characterTagList"></ul>
      </div>
    </div>
  </div>
`;

const tagSelectionPopupElement = document.createElement("div");
tagSelectionPopupElement.classList.add("characterTagSettingsOverlay");
tagSelectionPopupElement.innerHTML = tagSelectionPopup;
document.body.appendChild(tagSelectionPopupElement);

const background = tagSelectionPopupElement.querySelector(".characterTagSettingsBackground");
const closeButton = tagSelectionPopupElement.querySelector(".characterTagSettingsButton");

background.addEventListener("click", () => tagSelectionPopupElement.remove());
closeButton.addEventListener("click", () => tagSelectionPopupElement.remove());

const characterCardHeader = character.querySelector(".ddb-campaigns-character-card-header-upper");
const characterCardAnchor = characterCardHeader.querySelector("a");
const characterCardInfo = character.querySelector(".ddb-campaigns-character-card-header-upper-character-info");
const characterName = characterCardInfo.querySelector("h2").innerText;
const characterPathName = characterCardAnchor.pathname;

const characterTagList = document.getElementById("characterTagList");
characterTagList.addEventListener("click", (event) => {
  if (event.target.classList.contains("tagListItem")) {
    const tagName = event.target.childNodes[0].textContent;

    if (tagName === "Untagged") {
      characterTags.delete(characterPathName);
    } else {
      characterTags.set(characterPathName, tagName);
    }

    updateCharacterState(character, characterPathName, tagName);
    tagSelectionPopupElement.remove();
  }
});

tagSelectionPopulate();
}

function updateCharacterState(character, characterPathName, tagName) {
let shouldHide = false;

if (characterTags.has(characterPathName)) {
  const characterTag = characterTags.get(characterPathName);

  if (characterTagSet.has(characterTag)) {
    const tagState = characterTagSet.get(characterTag);
    shouldHide = tagState.hidden;
  }
} else if (tagName === 'Untagged') {
  const tagState = characterTagSet.get(tagName); // Assuming tagState exists for 'Untagged'
  shouldHide = tagState.hidden;
}

toggleCharacterVisibility(character, shouldHide);
}

function toggleCharacterVisibility(character, shouldHide) {
const isCharacterHidden = character.classList.contains("characterHidden");

if (shouldHide && !isCharacterHidden) {
  character.classList.add("characterHidden");
} else if (!shouldHide && isCharacterHidden) {
  character.classList.remove("characterHidden");
}
}

function tagSelectionPopulate() {
const characterTagList = document.getElementById("characterTagList");
characterTagList.innerHTML = ''; // Clear the list before populating

// Add "Untagged" as the first option
const untaggedItem = document.createElement('li');
untaggedItem.classList.add('tagListItem', 'tagSelect');
untaggedItem.textContent = 'Untagged';
characterTagList.appendChild(untaggedItem);

// Populate the list with the rest of the tags
characterTagSet.forEach((tagState) => {
  if (tagState.name !== 'Untagged') {
    const tagItem = document.createElement('li');
    tagItem.classList.add('tagListItem', 'tagSelect');
    tagItem.textContent = tagState.name;
    characterTagList.appendChild(tagItem);
  }
});
}

function addCharacterTagButtons() {
const characterSelection = document.querySelectorAll("li.ddb-campaigns-character-card-wrapper.j-characters-listing__item");

const characterTagButtonHTML = `
  <button class="characterTagButton Button_button__B9Kr5 ButtonVariants_primary__TMQ5y ButtonVariants_text__vKMzd ButtonSizes_small__zsC6U">
    Tag
  </button>
`;

characterSelection.forEach((character) => {
  const characterCardFooter = character.querySelector("div.ddb-campaigns-character-card-footer-links");

  // Check if the button already exists by looking for an existing button with the class 'characterTagButton'
  if (!characterCardFooter.querySelector('.characterTagButton')) {
    const characterTagButtonDiv = document.createElement("div");
    characterTagButtonDiv.innerHTML = characterTagButtonHTML;
    // Insert the tag button before the fourth child in the footer
    characterCardFooter.insertBefore(characterTagButtonDiv, characterCardFooter.childNodes[3]);
  }
});

// Add click event listener to character listing body
const characterListingBody = document.querySelector("div.ddb-characters-listing-body");
characterListingBody.addEventListener("click", (event) => {
  if (event.target.classList.contains("characterTagButton")) {
    const character = event.target.closest("li.ddb-campaigns-character-card-wrapper.j-characters-listing__item");
    displayCharacterTagSelection(character);
  }
});
}

function sidebarTagListPopulate() {
const sidebarTagList = document.getElementById("sidebarTagList");
sidebarTagList.innerHTML = ''; // Clear the list before populating

// Add a default item for untagged items
if ( ! characterTagSet.has( 'Untagged' ) ) {
  const untaggedItem = document.createElement('li');
  untaggedItem.classList.add('tagListItem', 'tagSelect');
  untaggedItem.textContent = 'Untagged';
  sidebarTagList.appendChild(untaggedItem);
}

// Iterate over the characterTagSet and add each tag
characterTagSet.forEach((tagState) => {
  const tagItem = document.createElement('li');
  tagItem.classList.add('tagListItem', 'tagSelect');
  if ( tagState.hidden ) {
    tagItem.classList.add( 'tagHidden' );
  }
  tagItem.textContent = tagState.name;
  sidebarTagList.appendChild(tagItem);
});

// Update characters based on the tag state
updateCharacterHiddenStateFromTag();
}

// Function to toggle the 'tagHidden' class when a list item is clicked
function toggleTag(event) {
// Ensure the clicked element is a list item
if (event.target && event.target.nodeName === 'LI') {
  const tagName = event.target.innerText.trim();

  // Check if the tag exists in characterTagSet
  if (characterTagSet.has(tagName)) {
    // console.log(`Tag found: {${tagName}}.`);
  }

  // Toggle the 'tagHidden' class on the clicked list item
  event.target.classList.toggle('tagHidden');

  // Update CharacterTagSet with new tag state
  const isHidden = event.target.classList.contains('tagHidden');
  characterTagSet.set(tagName, { name: tagName, hidden: isHidden });

  // Update characters based on the tag state
  updateCharacterHiddenStateFromTag();
}
}

function toggleCharacters(tagName) {
// console.log(tagName);

const characterListingBody = document.querySelector("div.ddb-characters-listing-body");
const characterListItems = characterListingBody.querySelectorAll("li");

characterListItems.forEach((character) => {
  const characterCardHeader = character.querySelector(".ddb-campaigns-character-card-header-upper");
  const characterCardAnchor = characterCardHeader.querySelector("a");

  if (characterTags.has(characterCardAnchor.pathname)) {
    const characterTag = characterTags.get(characterCardAnchor.pathname);

    // Toggle visibility for characters with the specified tag
    if (characterTag === tagName) {
      character.classList.toggle("characterHidden");
    }
  } else if (tagName === 'Untagged') {
    // Toggle visibility for untagged characters
    character.classList.toggle("characterHidden");
  }
});
}

// Function to toggle all tags (hide or show)
function toggleAllTags(hide) {
const sidebarTagList = document.getElementById("sidebarTagList");
const tags = sidebarTagList.querySelectorAll('li');

tags.forEach(tag => {
  if (hide) {
    tag.classList.add('tagHidden');
  } else {
    tag.classList.remove('tagHidden');
  }
});

// Update characters based on the tag state
updateCharacterHiddenStateFromTag();
}

function updateWindowsSize() {
// Get the window height
const windowHeight = window.innerHeight;

// Select the element whose max-height you want to update

const targetElement = document.querySelector("#sidebarTagList")

// Set the max-height to a portion of the window height
if (targetElement) {
  targetElement.style.maxHeight = `${targetElement.parentElement.clientHeight - 320}px`;
}
}

function init() {
// Ensure the necessary style and sidebar are present
ensureStyleTagManager();
ensureSidebarTagManager();
createTagManagerToggleButton();

// Create the Tag Setup button
const tagSettingsButtonElement = document.createElement('button');
const buttonSettings = document.querySelector("#character-tools-target > div > div > div > div.styles_searchSort__-7qBD > button");

tagSettingsButtonElement.classList = buttonSettings.classList;
tagSettingsButtonElement.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em">
    <path d="M256 0c17 0 33.6 1.7 49.8 4.8c7.9 1.5 21.8 6.1 29.4 20.1c2 3.7 3.6 7.6 4.6 11.8l9.3 38.5C350.5 81 360.3 86.7 366 85l38-11.2c4-1.2 8.1-1.8 12.2-1.9c16.1-.5 27 9.4 32.3 15.4c22.1 25.1 39.1 54.6 49.9 86.3c2.6 7.6 5.6 21.8-2.7 35.4c-2.2 3.6-4.9 7-8 10L459 246.3c-4.2 4-4.2 15.5 0 19.5l28.7 27.3c3.1 3 5.8 6.4 8 10c8.2 13.6 5.2 27.8 2.7 35.4c-10.8 31.7-27.8 61.1-49.9 86.3c-5.3 6-16.3 15.9-32.3 15.4c-4.1-.1-8.2-.8-12.2-1.9L366 427c-5.7-1.7-15.5 4-16.9 9.8l-9.3 38.5c-1 4.2-2.6 8.2-4.6 11.8c-7.7 14-21.6 18.5-29.4 20.1C289.6 510.3 273 512 256 512s-33.6-1.7-49.8-4.8c-7.9-1.5-21.8-6.1-29.4-20.1c-2-3.7-3.6-7.6-4.6-11.8l-9.3-38.5c-1.4-5.8-11.2-11.5-16.9-9.8l-38 11.2c-4 1.2-8.1 1.8-12.2 1.9c-16.1 .5-27-9.4-32.3-15.4c-22-25.1-39.1-54.6-49.9-86.3c-2.6-7.6-5.6-21.8 2.7-35.4c2.2-3.6 4.9-7 8-10L53 265.7c4.2-4 4.2-15.5 0-19.5L24.2 218.9c-3.1-3-5.8-6.4-8-10C8 195.3 11 181.1 13.6 173.6c10.8-31.7 27.8-61.1 49.9-86.3c5.3-6 16.3-15.9 32.3-15.4c4.1 .1 8.2 .8 12.2 1.9L146 85c5.7 1.7 15.5-4 16.9-9.8l9.3-38.5c1-4.2 2.6-8.2 4.6-11.8c7.7-14 21.6-18.5 29.4-20.1C222.4 1.7 239 0 256 0zM218.1 51.4l-8.5 35.1c-7.8 32.3-45.3 53.9-77.2 44.6L97.9 120.9c-16.5 19.3-29.5 41.7-38 65.7l26.2 24.9c24 22.8 24 66.2 0 89L59.9 325.4c8.5 24 21.5 46.4 38 65.7l34.6-10.2c31.8-9.4 69.4 12.3 77.2 44.6l8.5 35.1c24.6 4.5 51.3 4.5 75.9 0l8.5-35.1c7.8-32.3 45.3-53.9 77.2-44.6l34.6 10.2c16.5-19.3 29.5-41.7 38-65.7l-26.2-24.9c-24-22.8-24-66.2 0-89l26.2-24.9c-8.5-24-21.5-46.4-38-65.7l-34.6 10.2c-31.8 9.4-69.4-12.3-77.2-44.6l-8.5-35.1c-24.6-4.5-51.3-4.5-75.9 0zM208 256a48 48 0 1 0 96 0 48 48 0 1 0 -96 0zm48 96a96 96 0 1 1 0-192 96 96 0 1 1 0 192z"></path>
  </svg>
  <span class="styles_settingsButtonText__GJ0wj">Tag Setup</span>`;

const sidebarContent = document.querySelector("#sidebarTagManager > div.sidebarContent-TagManager");
sidebarContent.appendChild(tagSettingsButtonElement);

tagSettingsButtonElement.onclick = displayCharacterTagSettings;

// Add heading and buttons to the sidebar
const headingDiv = document.createElement('div');
headingDiv.style.display = 'flex';
headingDiv.style.alignItems = 'center';
headingDiv.style.justifyContent = 'space-between'; // Align buttons to the right

const heading = document.createElement('h2');
heading.textContent = 'Click Tag to Toggle';
headingDiv.appendChild(heading);

const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.gap = '10px'; // Add some space between buttons

// Create "All" button
const allButton = document.createElement('button');
allButton.textContent = 'All';
allButton.style.border = 'none';
allButton.style.padding = '0'; // Remove padding
allButton.onclick = () => toggleAllTags(false); // Show all tags
buttonContainer.appendChild(allButton);

// Create "None" button
const noneButton = document.createElement('button');
noneButton.textContent = 'None';
noneButton.style.border = 'none';
noneButton.style.padding = '0'; // Remove padding
noneButton.onclick = () => toggleAllTags(true); // Hide all tags
buttonContainer.appendChild(noneButton);

headingDiv.appendChild(buttonContainer);
sidebarContent.appendChild(headingDiv);

const sidebarTagList = document.createElement('ul');
sidebarTagList.id = "sidebarTagList";
sidebarTagList.style = "overflow: auto";
sidebarContent.appendChild(sidebarTagList);

sidebarTagList.addEventListener('click', toggleTag);

// Attach the resize event listener
window.addEventListener('resize', updateWindowsSize);

// Initialize character tag buttons and populate sidebar list
addCharacterTagButtons();
sidebarTagListPopulate();

// Initial call to set max-height on page load
updateWindowsSize();

console.log("Character Tag Manager loaded");
}

function waitForElm(selector) {
return new Promise((resolve) => {
  const element = document.querySelector(selector);

  if (element) {
    return resolve(element);
  }

  const observer = new MutationObserver(() => {
    const observedElement = document.querySelector(selector);
    if (observedElement) {
      observer.disconnect();
      resolve(observedElement);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
}

// Load saved character tags
let characterTags = new Map();
const characterTagData = localStorage.getItem('DnDBeyond_CharacterMgmt_CharacterTags');
if (characterTagData) {
characterTags = new Map(JSON.parse(characterTagData));
}

let characterTagSet = new Map();
const characterTagSetData = localStorage.getItem('DnDBeyond_CharacterMgmt_CharacterTagSet');
if (characterTagSetData) {
characterTagSet = new Map(JSON.parse(characterTagSetData));
}

waitForElm("#character-tools-target > div > div > div > div.styles_searchSort__-7qBD > button")
.then((elm) => {
  init();
});

})();