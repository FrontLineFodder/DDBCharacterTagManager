// ==UserScript==
// @name        DnDBeyond Character Tag Manager
// @namespace   DnDBeyond Tag Manager
// @match       https://www.dndbeyond.com/characters
// @grant       none
// @version     1.0
// @author      Adam Mellor
// @description DnDBeyond Character Tag Manager script for Violentmonkey
// @homepage    https://github.com/FrontLineFodder/DDBCharacterTagManager
// @downloadURL https://github.com/FrontLineFodder/DDBCharacterTagManager/raw/main/DDBCharacterTagManager.js
// ==/UserScript==

(function() {
    'use strict';

function displayCharacterTagSettings() {
  const tagSettingsPopup = `<div class="characterTagSettingsBackground" style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"></div>
<div class="characterTagSettingsPopup" tabindex="-1" style="max-width: 50%;max-height: 900px;padding: 0px 16px 0px;">
<div class="characterTagSettingsHeader" style="padding: 16px;border-bottom: 1px solid rgb(162, 172, 178);">
<svg height="1em" style="color: rgba(0, 0, 0, 0.54);margin-right: 5px;height: 35px;width: 35px;" viewBox="0 0 512 512" focusable="false" class="ddb-character-app-vubbuv">
<path d="M0 252.1V48C0 21.5 21.5 0 48 0h204.1a48 48 0 0 1 33.9 14.1l211.9 211.9c18.7 18.7 18.7 49.1 0 67.9L293.8 497.9c-18.7 18.7-49.1 18.7-67.9 0L14.1 286.1A48 48 0 0 1 0 252.1zM112 64c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"></path></svg>
<p class="characterTagSettingsTitle">Update Character Tags</p>
<button class="characterTagSettingsButton" tabindex="0" type="button" style="cursor: pointer;/* right:6px; */color: rgba(0, 0, 0, 0.54);">
<span class="characterTagButtonSpan">Close</span></button></div>
<div style="padding: 8px;">
<input type="text" placeholder="enter new tag name" class="tagInput">
<div class="sortable-list" style="overflow: auto;max-height: 700px;min-height: 350px;">
<ul id="tagList"></ul>
</div></div></div>`;

  let tagSettingsPopupElement = document.createElement("div")
  tagSettingsPopupElement.setAttribute("class", "characterTagSettingsOverlay")
  tagSettingsPopupElement.innerHTML = tagSettingsPopup

  document.body.appendChild(tagSettingsPopupElement)

  let characterTagSettingsBackground = tagSettingsPopupElement.querySelector( ".characterTagSettingsBackground" )
  characterTagSettingsBackground.onclick = function(event) {
  tagSettingsUpdate()
        tagSettingsPopupElement.remove()
  }
  let characterTagSettingsButton = tagSettingsPopupElement.querySelector( ".characterTagSettingsButton" )
  characterTagSettingsButton.onclick = function(event) {
    tagSettingsUpdate()
    tagSettingsPopupElement.remove()
  }
  let tagList = document.getElementById("tagList");
  let draggedItem = null;

  let characterTagSettingsNewTagInput = tagSettingsPopupElement.querySelector( "input.tagInput" )
  characterTagSettingsNewTagInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      tagList.innerHTML+=`<li class="tagListItem tagGrab" draggable="true">${event.target.value}<span class="removeItem">\u00D7</span></li>`;
      event.target.value= ""
    }
  });

  tagList.onclick=ev=>
    ev.target.tagName=="SPAN"
    && ev.target.className=="removeItem"
    && ev.target.parentNode.tagName=="LI"
    && ev.target.parentNode.remove();

  tagList.addEventListener("dragstart", (e) => {
    draggedItem = e.target;
    setTimeout(() => {
      e.target.style.display = "none";
    }, 0);
  });

  tagList.addEventListener("dragend", (e) => {
    setTimeout(() => {
      e.target.style.display = "";
      draggedItem = null;
    }, 0);
  });

  tagList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(tagList, e.clientY);
    const currentElement = document.querySelector(".dragging");
    if (afterElement == null) {
      tagList.appendChild(draggedItem);
    } else {
      tagList.insertBefore(draggedItem, afterElement);
    }
  });

  const getDragAfterElement = (container, y) => {
    const draggableElements = [ ...container.querySelectorAll("li:not(.dragging)"), ];

    return draggableElements.reduce( (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return {
          offset: offset,
          element: child,
        };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY, }, ).element;
  };

  tagSettingsPopulate()
}

function tagSettingsPopulate() {
  let tagList = document.getElementById("tagList");
  characterTagSet.forEach( (tagState) => {
    tagList.innerHTML+=`<li class="tagListItem tagGrab" draggable="true">${ tagState.name }<span class="removeItem">\u00D7</span></li>`;
  })
}

function displayCharacterTagSelection( characterPathName ) {
  const tagSelectionPopup = `<div class="characterTagSettingsBackground" style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"></div>
<div class="characterTagSettingsPopup" tabindex="-1" style="max-width: 50%;max-height: 900px;padding: 0px 16px 0px;">
<div class="characterTagSettingsHeader" style="padding: 16px;border-bottom: 1px solid rgb(162, 172, 178);">
<svg height="1em" style="color: rgba(0, 0, 0, 0.54);margin-right: 5px;height: 35px;width: 35px;" viewBox="0 0 512 512" focusable="false" class="ddb-character-app-vubbuv">
<path d="M0 252.1V48C0 21.5 21.5 0 48 0h204.1a48 48 0 0 1 33.9 14.1l211.9 211.9c18.7 18.7 18.7 49.1 0 67.9L293.8 497.9c-18.7 18.7-49.1 18.7-67.9 0L14.1 286.1A48 48 0 0 1 0 252.1zM112 64c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"></path></svg>
<p class="characterTagSettingsTitle">Select Character Tag</p>
<button class="characterTagSettingsButton" tabindex="0" type="button" style="cursor: pointer;/* right:6px; */color: rgba(0, 0, 0, 0.54);">
<span class="characterTagButtonSpan">Close</span></button></div>
<div style="padding: 8px;">
<div class="sortable-list" style="overflow: auto;max-height: 700px;min-height: 350px;">
<ul id="tagList"></ul>
</div></div></div>`

  let tagSelectionPopupElement = document.createElement("div")
  tagSelectionPopupElement.setAttribute("class", "characterTagSettingsOverlay")

  tagSelectionPopupElement.innerHTML = tagSelectionPopup

  document.body.appendChild(tagSelectionPopupElement)

  let characterTagSelectionBackground = tagSelectionPopupElement.querySelector( ".characterTagSettingsBackground" )
  characterTagSelectionBackground.onclick = function(event) {
    tagSelectionPopupElement.remove()
  }
  let characterTagSelectionButton = tagSelectionPopupElement.querySelector( ".characterTagSettingsButton" )
  characterTagSelectionButton.onclick = function(event) {
    tagSelectionPopupElement.remove()
  }

  let tagList = document.getElementById("tagList");
  tagList.onclick = function(event) {
    if ( event.target.className.includes( "tagListItem" ) ) {
      var tagName = event.target.childNodes[0].textContent
      if ( tagName === "Untagged" ) { characterTags.delete( characterPathName ) }
      else { characterTags.set( characterPathName, tagName ) }

      tagSettingsUpdate()
      tagSelectionPopupElement.remove()
    }
  }

  tagSelectionPopulate()
}

function tagSelectionPopulate() {
  let tagList = document.getElementById("tagList");
  tagList.innerHTML+=`<li class="tagListItem tagSelect">${ "Untagged" }</li>`;
  characterTagSet.forEach( (tagState) => {
    if ( tagState.name == "Untagged") { return }
    tagList.innerHTML+=`<li class="tagListItem tagSelect">${ tagState.name }</li>`;
  })
}

function tagSettingsUpdate() {
  let tagList = document.getElementById("tagList");

  //newcharacterTagSet = new Set()
  let newcharacterTagSet = new Map()

  let characterListingBody = document.querySelector("div.ddb-characters-listing-body")
  let oldDetails = characterListingBody.querySelectorAll( "details:not(#Untagged)" )
  let oldDetailsState = new Map();
  oldDetails.forEach( (detail) => {
    var tagState = { name: detail.name, open: detail.open }
    oldDetailsState.set( detail.name, tagState )
  });

  tagList.querySelectorAll( "li.tagListItem" ).forEach( (tag) => {
    var tagName = tag.childNodes[0].textContent
    if ( tagName == "Untagged") { return }
    if ( oldDetailsState.has( tagName ) ) {
      newcharacterTagSet.set( tagName, oldDetailsState.get( tagName ) )
    }
    else {
      newcharacterTagSet.set( tagName, { name: tagName, open: true } )
    }
  });

  characterTagSet = newcharacterTagSet

  for ( var [character, tagname] of characterTags ) {
    if ( characterTagSet.has( tagname ) ) { continue }
    else {
      characterTags.delete( character )
    }
  }

  localStorage.setItem( "DnDBeyond_CharacterMgmt_CharacterTags", JSON.stringify( Array.from( characterTags ) ) );
  localStorage.setItem( "DnDBeyond_CharacterMgmt_CharacterTagSet", JSON.stringify( Array.from( characterTagSet ) ) );

  reloadCharacters()
}

function reloadCharacters() {
  let characterSelection = document.querySelectorAll( "li.ddb-campaigns-character-card-wrapper.j-characters-listing__item" )
  //untaggedCharacterGroup = document.getElementById( "Untagged" )
  let untaggedCharacterGroup = document.querySelector( "#Untagged" )
  if ( ! untaggedCharacterGroup ) {
    untaggedCharacterGroup = createTagGroup( "Untagged" )
  }
  let characterList = untaggedCharacterGroup.querySelector( "ul" )

  characterSelection.forEach( (character) => {
    characterList.appendChild( character )
  });

  let characterListingBody = document.querySelector("div.ddb-characters-listing-body")
  let oldDetails = characterListingBody.querySelectorAll( "details:not(#Untagged)" )
  if ( oldDetails && oldDetails.length > 0 ) {
    oldDetails.forEach( (detail) => {
      detail.remove();
    });
  }

  if ( ! characterTagSet || characterTagSet.size < 1 ) { return }

  characterTagSet.forEach( (tagState) => {
    if ( tagState.name == "Untagged") { return }
    createTagGroup( tagState.name )
  });

  characterSelection.forEach( (character) => {
    var characterCardHeader = character.querySelector( ".ddb-campaigns-character-card-header-upper" )
    var characterCardAnchor = characterCardHeader.querySelector( "a" )

    if ( characterTags.has( characterCardAnchor.pathname ) ) {
      var characterTag = characterTags.get( characterCardAnchor.pathname )
      var tagGroup = document.getElementById( characterTag )
      characterList = tagGroup.querySelector( "ul" )
      characterList.appendChild( character )
    }
  });
}

function addCharacterTagButtons() {
  let characterSelection = document.querySelectorAll( "li.ddb-campaigns-character-card-wrapper.j-characters-listing__item" )

  const characterTagButton = `<button class="characterTagButton Button_button__B9Kr5 ButtonVariants_primary__TMQ5y ButtonVariants_text__vKMzd ButtonSizes_small__zsC6U">Tag</button>`

  characterSelection.forEach( (character) => {
    var characterCardFooter = character.querySelector("div.ddb-campaigns-character-card-footer-links")
    var characterTagButtonDiv = document.createElement( "div" )
    characterTagButtonDiv.innerHTML = characterTagButton
    characterCardFooter.insertBefore( characterTagButtonDiv, characterCardFooter.childNodes[3] )
  });

  var characterListingBody = document.querySelector("div.ddb-characters-listing-body")
  characterListingBody.onclick = function(event) {
    if ( event.target.className.includes( "characterTagButton" ) ) {
      var character = event.target.closest( "li.ddb-campaigns-character-card-wrapper.j-characters-listing__item" )

      var characterCardHeader = character.querySelector( ".ddb-campaigns-character-card-header-upper" )
      var characterCardAnchor = characterCardHeader.querySelector( "a" )
      var characterCardInfo = character.querySelector( ".ddb-campaigns-character-card-header-upper-character-info" )
      var characterName = characterCardInfo.querySelector( "h2" ).innerText
      var characterPathName = characterCardAnchor.pathname

      displayCharacterTagSelection( characterPathName )
    }
  }
}

function createTagGroup( tagName ) {
  let details = document.createElement( "details" )
  details.name = tagName
  let tagState = characterTagSet.get( tagName )
  if ( tagState && ! tagState.open ) { details.open = false }
  else { details.open = true }
  details.id = tagName
  let summary = document.createElement( "summary" )
  summary.classList.add( "styles_h1__wBuYU" )
  summary.innerText = tagName
  details.appendChild( summary )

  let listing = document.createElement( "ul" )
  listing.classList.add( "listing" )
  listing.classList.add( "listing-rpgcharacter" )
  listing.classList.add( "rpgcharacter-listing" )

  let listingBody = document.querySelector("#character-tools-target > div > div > div > div.ddb-characters-listing-body.j-characters-listing__content > div > div")

  let detailsRef = listingBody.appendChild( details )
  detailsRef.appendChild( listing )
  return detailsRef
}


function init() {
  const tagSettingsStyle = `#tagList {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  .tagInput {
    position: relative;
    padding: 12px 12px;
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
    position: relative;
    padding: 12px 12px;
    margin: 5px;
    background: #eee;
    font-family: Tiamat Condensed SC;
    font-size: 2.5rem;
    transition: 0.2s;
    display: flex;
    justify-content: space-between;
    user-select: none
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
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  .characterTagSettingsOverlay {
    position: fixed;
    z-index: 99999;
    inset: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .characterTagSettingsBackground {
    position: fixed;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    inset: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-tap-highlight-color: transparent;
    z-index: -1;
  }
  .characterTagSettingsPopup {
    background-color: rgb(255, 255, 255);
    color: rgb(18, 24, 28);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
    background-image: none;
  }
  .characterTagSettingsTitle {
    margin: 0px;
    font-family: Roboto;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: 0.15px;
    line-height: 24px;
    font-size: 18px;
    font-weight: 700;
  }
  .characterTagButtonSpan {
    border: solid;
    padding: 4px;
    border-color: var(--color-primary--main);
    border-radius: 6px;
    color: var(--color-primary--main);
  }
  .characterTagSettingsButton {
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    outline: 0px;
    border: 0px;
    margin: 0px;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    appearance: none;
    text-decoration: none;
    text-align: center;
    flex: 0 0 auto;
    border-radius: 50%;
    overflow: visible;
    color: rgba(18, 24, 28, 0.64);
    padding: 5px;
    font-size: 1.125rem;
    transition: none 0s ease 0s;
  }`

  const tagSettingsStyleElement = document.createElement( "style" );
  tagSettingsStyleElement.innerHTML = tagSettingsStyle
  document.body.appendChild( tagSettingsStyleElement )

  let settingsButton = document.querySelector("#character-tools-target > div > div > div > div.styles_searchSort__-7qBD > button")

  const tagSettingsButtonElement = document.createElement( "button" )
  tagSettingsButtonElement.classList = settingsButton.classList
  tagSettingsButtonElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em"><path d="M0 252.1V48C0 21.5 21.5 0 48 0h204.1a48 48 0 0 1 33.9 14.1l211.9 211.9c18.7 18.7 18.7 49.1 0 67.9L293.8 497.9c-18.7 18.7-49.1 18.7-67.9 0L14.1 286.1A48 48 0 0 1 0 252.1zM112 64c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"></path></svg><span class="styles_settingsButtonText__GJ0wj">Tags</span>`

  const searchSortBar = document.querySelector("#character-tools-target > div > div > div > div.styles_searchSort__-7qBD")
  searchSortBar.appendChild( tagSettingsButtonElement )

  tagSettingsButtonElement.onclick = function() {
    displayCharacterTagSettings()
  }

  addCharacterTagButtons()
  reloadCharacters()

  console.log( "Character Tag Manager loaded" );
};



  //load saved character tags
  let characterTags = new Map() ;
  var characterTagData = localStorage.DnDBeyond_CharacterMgmt_CharacterTags || null
  if ( characterTagData ) { characterTags = new Map( JSON.parse( characterTagData ) ) ; }

  let characterTagSet = new Map() ;
  var characterTagSetData = localStorage.DnDBeyond_CharacterMgmt_CharacterTagSet || null
  if ( characterTagSetData ) { let characterTagSet = new Map( JSON.parse( characterTagSetData ) ) ; }

  function waitForElm(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
  });
}

waitForElm( "#character-tools-target > div > div > div > div.styles_searchSort__-7qBD > button" ).then((elm) => {
  // console.log('Element is ready');
  // console.log(elm.textContent);
  init();
});

})();