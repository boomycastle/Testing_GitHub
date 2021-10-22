// JavaScript source code
Moralis.initialize("FxEMzV0qMLEbJUcQftBWFgu7OulA7zx1E7w51Rdw");
    Moralis.serverURL = 'https://voxwaaiapzq4.moralishost.com:2053/server'
   
    //need to work on this
//init = async () => {
     //window.Web3 = await Moralis.Web3.enable();
     //hideElement(userInfo);
     //hideElement(createItemForm);
    // initUser();
   //}

   //init();
  

//define the function to show the correct buttons when on main page
initUser = async () => {
        if (await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
        showElement(openCreateItemButton);

    }else{
        showElement(userConnectButton);
        hideElement(userProfileButton);
        hideElement(userInfo);
        hideElement(openCreateItemButton);
        hideElement(createItemForm);
    }
}
//call to show main buttons
initUser();

//define login function
login = async () => {
    try {
        await Moralis.Web3.authenticate();
        initUser();
    } catch (error) {
        alert(error);
    }
}

//define logOut function
logOut = async () => {
    await Moralis.User.logOut();
    hideElement(userInfo);
    hideElement(openCreateItemButton)
    hideElement(createItemForm)
    //you should do the hide and show in inituser
    hideElement(userProfileButton);
    showElement(userConnectButton);
    //will take care of displaying the correct user button after you logout
    initUser;
}

//define function to open user info when click profile button
openUserInfo = async () => {
    user = await Moralis.User.current();
    if (user){
        const email = user.get('email');
        if(email){
            userEmailField.value = email;
        }else{
            userEmailField.value = "";
        }
        
        userUsernameField.value = user.get('username');
        const userAvatar = user.get('avatar');
        if(userAvatar){
            userAvatarImg.src = userAvatar.url();
            showElement(userAvatarImg);
        }else{
            hideElement(userAvatarImg);
        }
        showElement(userInfo);
    }else{
        login();
    }
}

saveUserInfo = async () => {
    user.set('email', userEmailField.value);
    user.set('username', userUsernameField.value);
    
    if (userAvatarFile.files.length > 0) {
        const avatar = new Moralis.File("avatar.jpg", userAvatarFile.files[0]);
        user.set('avatar', avatar);
    }
    await user.save();
    alert("User info saved successfully!");
    //call openUserInfo function to fill out the fields 
    openUserInfo();
}


//Check to see if file was selected.
createItem = async () => {
    if (createItemFile.files.length == 0){
        alert("please select a file!");
        return;
    } else if (createItemNameField.value.length == 0){
        alert("Please give the item a name!");
        return; 
    }

    const nftFile = new Moralis.File("nftFile.jpg",createItemFile.files[0]);
    await nftFile.saveIPFS();

    const nftFilePath = nftFile.ipfs();
    const nftFileHash = nftFile.hash();

    //store data on ipfs
    //object for the meta data
    const metadata = {
        name: createItemNameField.value,
        description: createItemDescriptionField.value,
        nftFilePath: nftFilePath,
        nftFileHash: nftFileHash
    };

    const nftFileMetadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
    await nftFileMetadataFile.saveIPFS();

    //more data on vid5
    const nftFileMetadataFilepath = nftFileMetadataFile.ipfs();
    const nftFileMetadataFilehash = nftFileMetadataFile.hash();

    const Item = Moralis.Object.extend("Item");

    // Create a new isntance of that class
    //this will save the items in a record in the back end database
    const item = new Item();
    item.set('name', createItemNameField.value);
    item.set('description', createItemDescriptionField.value);
    item.set('nftFilePath', nftFilePath.value);
    item.set('nftFileHash', nftFileHash.value);
    item.set('metadataFilePath', nftFileMetadataFilepath);
    item.set('metadataFileHash', nftFileMetadataFilehash);
    await item.save();
    console.log(item);
    
}

hideElement = (element) => element.style.display = "none";
showElement = (element) => element.style.display = "block";

//navbar
//when click, loginto wallet and account
const userConnectButton = document.getElementById("btnConnect");
userConnectButton.onclick = login;

//when click, go to profile
const userProfileButton = document.getElementById("btnUserInfo");
userProfileButton.onclick = openUserInfo;

const openCreateItemButton = document.getElementById("btnOpenCreateItem");
openCreateItemButton.onclick = () => showElement(createItemForm);

//UserProfile
const userInfo = document.getElementById("userInfo");
const userUsernameField = document.getElementById("txtUsername");
const userEmailField = document.getElementById("txtEmail");
const userAvatarImg = document.getElementById("imgAvatar");
const userAvatarFile = document.getElementById("fileAvatar");

document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo);
document.getElementById("btnLogout").onclick = logOut;
document.getElementById("btnSaveUserInfo").onclick = saveUserInfo;


//Item creation
const createItemForm = document.getElementById("createItem");
const createItemNameField = document.getElementById("txtCreateItemName");
const createItemDescriptionField = document.getElementById("txtCreateItemDescription");
const createItemPriceField = document.getElementById("numCreateItemPrice");
const createItemStatusField = document.getElementById("selectCreateItemStatus");
const createItemFile = document.getElementById("fileCreateItemFile");
document.getElementById("btnCloseCreateItem").onclick = () => hideElement(createItemForm);
document.getElementById("btnCreateItem").onclick = createItem;

//init();



