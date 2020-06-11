const axios = require('axios');
require('firebase/auth');
require('firebase/database');
var firebase = require('firebase/app');

let config = {
    apiKey: 'AIzaSyAVIfj3o7635plv8Toc2TxLAAejuF5VzFk',
    authDomain: 'my-database-7b462.firebaseapp.com',
    databaseURL: 'https://my-database-7b462.firebaseio.com',
    projectId: 'my-database-7b462',
}
const app = firebase.initializeApp(config);
const database = firebase.database();


var users = [];
var conversations = [];

//retrieves users and conversations data from database

function getUsersData(arrayofData, arrayName) {

    const url = 'https://my-database-7b462.firebaseio.com/' + arrayName;
    axios.get(url).then(response => {
        for (let key in response.data) {
            response.data[key].id = key;
            var user = response.data[key]
            arrayofData.push(user);
        }
        console.log(arrayofData)

    });
}

getUsersData(users, 'message-app-users.json');
getUsersData(conversations, 'conversations.json');


//registration 
function addUser(user, cb) {

    if (!user) throw new Error("User not specified");
    if (!user.email || !user.img || !user.name || !user.surname || !user.password) {
        throw new Error('Some register details are missing')
    }
    for (var id in users) {
        if (users[id].email == user.email) {
            if (cb) {
                cb(new Error('User already exists'));
                return;
            }
        }
    }
    var newUser = {
        email: user.email,
        password: user.password,
        name: user.name,
        surname: user.surname,
        img: user.img
    };

    const url = 'https://my-database-7b462.firebaseio.com/message-app-users.json'
    axios.post(url, newUser)
        .then(
            response => {
                newUser.id = response.data.name;
                users.push(newUser)
                cb(null, newUser)
            })
        .catch(error => {
            if (error.response) {
                if (cb) cb(new Error('User has not been registered'));
            }
        });
}

//login and authentication
function login(email, password, cb) {
    if (!email) throw new Error('Email not specified');
    if (!password) throw new Error('Password not specified');
    for (var id in users) {
        if (users[id].email == email) {
            if (users[id].password == password) {
                var user = {
                    id: users[id].id,
                    email: users[id].email,
                    name: users[id].name,
                    surname: users[id].surname,
                    img: users[id].img,
                    password: users[id].password
                }
                if (cb) cb(null, user.id, user);
                return user;
            }
            else {
                if (cb) {
                    cb(new Error('Wrong password'));
                    return;
                }
            }
        }
    }
    if (cb) cb(new Error('Invalid credentials'));
}

//updates profile
function updateUser(token, user, cb) {
    for (let i = 0; i < users.length; i++) {
        if (token == users[i].id) {
            var editUserObject = users[i];
            editUserObject.id = user.id;
            editUserObject.email = user.email;
            editUserObject.name = user.name;
            editUserObject.surname = user.surname;
            editUserObject.img = user.img;

            users.splice(i, 1, editUserObject)
            let userRef = database.ref('message-app-users/' + user.id);
            userRef.update(editUserObject);

        }
    }
    if (cb) cb(null, editUserObject)
    updateUserForMessages(editUserObject, editUserObject.name, editUserObject.surname, editUserObject.img)

}

//list all users instead of logged user, for the selection of members when adding new conversation

function listUsers(currentUser, cb) {
    var availableMembers = [];
    users.forEach(user => {
        if (currentUser.email != user.email)
            availableMembers.push(user);
    });
    if (cb) cb(availableMembers)
    return availableMembers;
}

//lists all users for members table

function listAllUsers(cb) {
    var allMembers = [];
    users.forEach(user => {
        allMembers.push(user);
    });
    if (cb) cb(allMembers)
    return allMembers;
}


//AUTOMATICALLY UPDATES USERS PHOTO AND AUTHORS NAME IF USER CHANGES PROFILE PHOTO OR NAME

function updateUserForMessages(editUserObject, newUserName, newUserSurname, newUserPhoto) {
    console.log(newUserName)
    console.log(newUserSurname)
    conversations.forEach(conversation => {
        for (let i = 0; i < conversation.messages.length; i++) {
            if (conversation.messages[i].author.includes(newUserName)) {

                let userRef = database.ref('conversations/' + conversation.id + '/messages/' + i + '/img');
                userRef.set(newUserPhoto);
                let userRef2 = database.ref('conversations/' + conversation.id + '/messages/' + i + '/author');
                var authorString = `${newUserName} ${newUserSurname}`;
                userRef2.set(authorString);
                conversation.messages[i].img = newUserPhoto;
                conversation.messages[i].author = `${newUserName} ${newUserSurname}`

            }
        }
    })

    console.log(conversations)

}


///////////////////////////////////////////////////////////////
//CONVERSATION FUNCTIONS

//lists alll the conversations

function listConversations(currentUser, cb) {
    if (!conversations) cb(new Error("There are no conversations"))

    var convos = [];
    conversations.forEach(convo => {


        for (var i = 0; i < convo.members.length; i++) {

            if ((convo.members[i] == currentUser.name))
                convos.push(convo);

        }
    })
    cb(null, convos)
}

//add new conversation

function addConversation(currentUser, currentUserToken, conv, cb) {

    if (conv.members.length == 0 || conv.members.length == null) {
        cb(new Error("Conversation must be shown for at least 1 member"))
        return;
    }
    if (!conv.name || !conv.img) {
        throw new Error('Some conversation details are missing')
    }
    var newConversation = {
        token: currentUserToken,
        name: conv.name,
        img: conv.img,
        members: conv.members,
        messages: [
            {
                author: `${currentUser.name} ${currentUser.surname}`,
                ts: getDate(),
                content: `Welcome message from ${currentUser.name}`,
                img: currentUser.img,
                id: Date.now()
            }
        ]
    };

    if (!isConversationNew(newConversation)) {
        var err = new Error('Conversation already exists. Try different name')
        alert(err)
        throw err;
    }

    newConversation.members.push(currentUser.name);
    const url = 'https://my-database-7b462.firebaseio.com/conversations.json'
    axios.post(url, newConversation)
        .then(
            response => {
                newConversation.id = response.data.name;
                conversations.push(newConversation)
                cb(null, newConversation)
            })
        .catch(error => {
            if (error.response) {
                if (cb) cb(new Error('Request has been rejected'));
            }
        });
}


//checks whether the conversation exists already or is new
function isConversationNew(newConversation) {

    for (let i = 0; i < conversations.length; i++) {
        if (newConversation.name == conversations[i].name) {
            return false;
        }
    }
    return true;
}

//formats date for the message
function getDate() {
    var MyDate = new Date();
    MyDate.setDate(MyDate.getDate());

    var date = ('0' + MyDate.getDate()).slice(-2) + '/'
        + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '/'
        + MyDate.getFullYear() + ' ' + MyDate.getHours() + ':' + ('0' + MyDate.getMinutes()).slice(-2);

    return date;
}


//edit conversation data (name and photo)
function updateConversation(conversation, cb) {
    for (let i = 0; i < conversations.length; i++) {
        if (conversation.id == conversations[i].id) {
    
            var editConversationObject = conversations[i];
            editConversationObject.id = conversation.id;
            editConversationObject.img = conversation.img;
            editConversationObject.members = conversations[i].members;
            editConversationObject.messages = conversations[i].messages;
            editConversationObject.name = conversation.name;

            conversations.splice(i, 1, editConversationObject)


            let userRef = database.ref('conversations/' + conversation.id);
            userRef.update(editConversationObject);
        }
    }
    if (cb) cb(null, editConversationObject)
}

//leave the conversation
function leaveConversation(user, id, cb) {
    conversations.forEach((conversation, index) => {
        for (let i = 0; i < conversation.members.length; i++) {
            if (id == conversation.id && user.name == conversation.members[i]) {

                conversation.members.splice(i, 1);
                let userRef = database.ref('conversations/' + conversation.id);
                userRef.update(conversation);

                //DELETE CONVERSATION IF ALL MEMBERS LEFT
                if (conversation.members.length == 0 || conversation.members.length == null) {
                    conversations.splice(index, 1)
                    let userRefa = database.ref('conversations/' + conversation.id);
                    userRefa.remove()
                }
                if (cb) cb(null, conversation);
                return;
            }
        }
    })
}

//list messages for display
function listMessages(id, cb) {

    for (let i = 0; i < conversations.length; i++) {
        if (id == conversations[i].id) {
            var conversation = {
                id: conversations[i].id,
                img: conversations[i].img,
                members: conversations[i].members,
                messages: conversations[i].messages,
                name: conversations[i].name,
            };

            cb(conversation)
        }
    }
}

//checks if the users are members of convo and sends their data
function assignUsers(members, cb) {
    var membersArray = [];
    for (var i = 0; i < users.length; i++) {
        if (members.indexOf(users[i].name) != -1) {
            membersArray.push(users[i]);
        }
    };
    if (cb) cb(membersArray)
}

//add new message
function addMessage(messageText, conv, user) {
    if (!messageText) {
        var err = new Error("Type something");
        alert(err)
        throw err
    }
    var newMsg = {
        id: Date.now(),
        ts: getDate(),
        author: `${user.name} ${user.surname}`,
        content: messageText,
        img: user.img
    }
    
    conv.messages.push(newMsg)
    updateConversation(conv)
}

//remove message
function deleteMessage(user,messageId,name,cb) {
   
    var msgArray= []
    conversations.forEach(conversation => {
  
        for (let i = 0; i < conversation.messages.length; i++) {
            if (conversation.name == name && messageId == conversation.messages[i].id) {
                if(conversation.messages[i].author.includes(user.name)){
                   
                    conversation.messages.splice(i, 1);
                    msgArray = conversation.messages;
                    let userRef = database.ref('conversations/' + conversation.id + '/messages/');
                    userRef.set(msgArray)
                    if (cb) cb(null);
                    return;

                }else{
                    var err = new Error("You can't delete other Users messages");
                    alert(err)
                    throw err;
                }
            }
        }
    })
}

//add new members to conversation
function joinConversation(id,newMembersArray,currentMembers,cb){

    var listOfSelectedMembers = [];
    
    newMembersArray.forEach(newMember =>{
        listOfSelectedMembers.push(newMember.name)
    })
   
     conversations.forEach(conversation =>{
        if (id == conversation.id) {
            for(let i = 0; i < listOfSelectedMembers.length;i++){
                //if the name does not exist between current members
                if(currentMembers.indexOf(listOfSelectedMembers[i]) == -1){
                   currentMembers.push(listOfSelectedMembers[i])
                   let userRef = database.ref('conversations/' + conversation.id + '/members/');
                   userRef.set(currentMembers)
                   if(cb) cb(currentMembers)
                }else{
                    var err =new Error("This user/users are already in conversation");
                    alert(err)
                    throw err;
                }
            }
        }
    })
}

export default {
        getUsersData,
        addUser,
        login,
        listUsers,
        listAllUsers,
        updateUser,
        assignUsers,
        updateUserForMessages,

        listConversations,
        addConversation,
        updateConversation,
        leaveConversation,
        joinConversation,
        isConversationNew,

        listMessages,
        addMessage,
        deleteMessage,
        getDate,
    

    }

