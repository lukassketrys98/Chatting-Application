var users;
var currentUser;
var conversations;

if (!localStorage['users']) {
    users = []
} else {
    users = JSON.parse(localStorage['users'])
}


if (!localStorage['Conversations']) conversations = [];
else {
    conversations = JSON.parse(localStorage['Conversations']);
    console.log(conversations)
}

function addUser(user, cb) {
    //level1 
    if (!user) throw new Error("User not specified");

    if (!user.email || !user.name || !user.surname || !user.password) {
        throw new Error('Some register details are missing')
    }

    //level1
    for (var id in users) {

        //level2
        // console.log(users[id])
        if (users[id].email == user.email) {
            //level3
            if (cb) {
                cb(new Error('User already exists'));
                return;
            }
        }
    }
    //level1
    var newUser = {
        email: user.email,
        password: user.password,
        name: user.name,
        surname: user.surname,
        img: user.img
    };
    //level1

    newUser.id = String(Date.now());
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    if (cb) cb(null, newUser);
}

function login(email, password, cb) {
    // console.log(email,password,cb)

    //1level

    if (!email) throw new Error('Email not specified');
    if (!password) throw new Error('Password not specified');

    // 1level
    for (var id in users) {
        // 2level
        if (users[id].email == email) {

            // 3level
            if (users[id].password == password) {

                // 4level
                var user = {
                    id: id,
                    email: users[id].email,
                    name: users[id].name,
                    surname: users[id].surname,
                    // img: users[id].img
                }
                // 4level
                if (cb) cb(null, id, user);
                return;
            }
            //3 level
            else {
                // 4 level
                if (cb) {
                    cb(new Error('Wrong password'));
                    return;
                }
            }
        }
    }
    // 1level
    if (cb) cb(new Error('Invalid credentials'));
}

// console.log(user.name)


// console.log(user)
function listUsers(token, query, cb) {
    var userId = users[token] ? token : null;
    if (!userId) {
        if (cb) cb(new Error('Invalid token'));
        return;
    }
    var results = [];
    for (var id in users) {
        var matches = !query || !Object.keys(query).length;
        if (!matches) {
            for (var cond in query) {
                if (String(users[id][cond]).indexOf(String(query[cond])) != -1) {
                    matches = true;
                    break;
                }
            }
        }
        if (matches) results.push({
            id: users[id].id,
            email: users[id].email,
            name: users[id].name,
            surname: users[id].surname,
            img: users[id].img
        });
    }
    if (cb) cb(null, results);
}


function listConversations(cb) {
    if (!conversations) cb(new Error("There is no conversations"))

    var convos = [];
    conversations.forEach(convo => {
      for (var i = 0; i < convo.members.length; i++) {
        if ((convo.members[i] == currentUser.name)) 
        convos.push(convo); 
      }
    })
    cb(null, convos)
  }
    // conversations.forEach(convo => {
    //   for (var i = 0; i < convo.members.length; i++) {
    //     if ((convo.members[i] == currentUser.name)) 
    //     convos.push(convo); 
    //   }
    // })
    // cb(null, convos)


function checkToken(token) {
    currentToken = token;
    console.log(currentToken)
}


function setCurrentUser(user) {
    currentUser = {
        token: user.token,
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        img: user.img,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

}


export default {
    addUser,
    listUsers,
    // updateUser,
    login,
    // addConversation,
    // updateConversation,
    listConversations,
    // joinConversation,
    // leaveConversation,
    // addMessage,
    // removeMessage,
    // listMessages,
    checkToken,
    setCurrentUser
}
