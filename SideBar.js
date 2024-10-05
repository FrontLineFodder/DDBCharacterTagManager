tagSidebarStyle = `
  .sidebar {
    position: fixed;
    top: 180px;
    height: calc(100vh - 180px);
  }
  .sidebar__inner {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  color: #000;
}
  .sidebar__controls {
  display: flex;
  justify-content: flex-start;
  line-height: 1;
  margin: 5px 15px 5px;
}
  .sidebar__pane-content {
  background: #fff;
  box-shadow: -4px 0px 8px rgba(180,180,187,.3);
  height: 100%;
  width: 340px;
  max-width: 340px;
  overflow-y: auto;
}
  .sidebar__control-group {
  margin-left: 11px;
}
  .sidebar__control-group--lock {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
  .GameLogHeader_Title__LL__E {
  font-family: "Roboto Condensed","Arial Narrow","Helvetica Neue",Helvetica,Arial,sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
}
  #tagList {
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
  }
`
const tagSidebarStyleElement = document.createElement( "style" );
tagSidebarStyleElement.innerHTML = tagSidebarStyle
document.body.appendChild( tagSidebarStyleElement )


// Tag Sidebar
tagSidebarDiv = `
<div>
  <div class="sidebar sidebar--right sidebar--visible">
    <div class="sidebar__inner">
      <div class="sidebar__controls">
        <span class="sidebar__control-group">
          <button class="sidebar__control">
            <svg class="sidebar__control--collaspe" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" overflow="visible">
              <path fill="none" d="M5.21.36h0A2.25,2.25,0,0,1,7.89.53L16,8,7.89,15.47a2.25,2.25,0,0,1-2.68.17h0A1.3,1.3,0,0,1,5,13.52L11,8,5,2.48A1.3,1.3,0,0,1,5.21.36Z"></path>
              <polygon fill="none" points="9.09 8 0 0 0 16 9.09 8"></polygon>
            </svg>
          </button>
        </span>
        <span class="sidebar__control-group sidebar__control-group--lock">
          <button class="sidebar__control">
            <svg class="sidebar__control--lock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" overflow="visible">
              <path fill="none" d="M5.11656,6.73717l-2.80744.39938V4.19033a2.8071,2.8071,0,0,1,5.6142,0H9.30741a4.19119,4.19119,0,0,0-8.38238,0V7.33344L0,7.465v7.61549L5.11656,16l5.11657-.91947V7.465Z"></path>
            </svg>
          </button>
        </span>
      </div>
      <div id="sidebar__pane-content" class="sidebar__pane-content">
        <div class="glc-game-log GameLog_GameLogContainer__2YlSC Flex_Flex__3cwBI Flex_Flex__flexDirection-column__sAcwk">
          <div class="GameLogHeader_Container__36cXS Flex_Flex__3cwBI Flex_Flex__alignItems-flex-start__HK9_w Flex_Flex__flexDirection-column__sAcwk">
            <div class="GameLogHeader_Title__LL__E">Character Tag Filter</div>
          </div>
          <div class="GameLog_GameLog__2z_HZ">
            <ol class="GameLog_GameLogEntries__3oNPD"></ol>
          </div>
        </div>
        <ul id="tagList"></ul>
      </div>
    </div>
  </div>
</div>
`

let tagSettingsSidebarElement = document.createElement("div")
tagSettingsSidebarElement.innerHTML = tagSidebarDiv

document.body.appendChild(tagSettingsSidebarElement)

// Locked
// justify-content: flex-end;
// <svg class="sidebar__control--unlock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" overflow="visible"><path fill="none" d="M9.30491,6.41174V4.19A4.19,4.19,0,0,0,.925,4.19V6.41174L0,6.54333v7.61309l5.115.91918,5.115-.91918V6.54333ZM2.30862,4.19a2.80632,2.80632,0,0,1,5.61264,0V6.21491L5.115,5.81568l-2.80633.39923Z"></path></svg>

//collapsed
{/* <svg class="sidebar__control--expand" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" overflow="visible">
  <path fill="none" d="M11,2.48,5,8l6,5.52a1.3,1.3,0,0,1-.21,2.12h0a2.25,2.25,0,0,1-2.68-.17L0,8,8.11.53A2.25,2.25,0,0,1,10.79.36h0A1.3,1.3,0,0,1,11,2.48Z"></path>
  <polygon fill="none" points="6.92 8 16 0 16 16 6.92 8"></polygon>
</svg>
 */}

 function tagSettingsPopulate() {
  let tagList = document.getElementById("tagList");
  characterTagSet.forEach( (tagState) => {
    tagList.innerHTML+=`<li class="tagListItem tagGrab" draggable="true">${ tagState.name }<span class="removeItem">\u00D7</span></li>`;
  })
}

  //load saved character tags
  let characterTags = new Map() ;
  var characterTagData = localStorage.DnDBeyond_CharacterMgmt_CharacterTags || null
  if ( characterTagData ) { characterTags = new Map( JSON.parse( characterTagData ) ) ; }

  let characterTagSet = new Map() ;
  var characterTagSetData = localStorage.DnDBeyond_CharacterMgmt_CharacterTagSet || null
  if ( characterTagSetData ) { characterTagSet = new Map( JSON.parse( characterTagSetData ) ) ; }


tagSettingsPopulate()
