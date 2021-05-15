/*const images = {
    dmImg: "https://i.pinimg.com/originals/64/71/f2/6471f2d9c1892b0f419beb8b9e228d7d.png",
    replyImg: "https://iconvulture.com/wp-content/uploads/2017/12/reply-arrow.png",
    errorImg: "https://cdn1.iconfinder.com/data/icons/ios-11-glyphs/30/error-512.png",
    dmDisabled: "https://icon-library.com/images/x-icon-png/x-icon-png-25.jpg",
    dmEnabled: "https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/checkmark-24-512.png"
}

emit('chat:addTemplate', 'dm', `<img src=${images.dmImg} height="16"> <b>{0}</b>: {1}`);
emit('chat:addTemplate', 'reply', `<img src=${images.replyImg} height="16"> <b>{0}</b>: {1}`);
emit('chat:addTemplate', 'error', `<img src=${images.errorImg} height="16"> <b>{0}</b>: {1}`);
emit('chat:addTemplate', 'disabled', `<img src=${images.dmDisabled} height="16"> <b>{0}</b>: {1}`);
emit('chat:addTemplate', 'enabled', `<img src=${images.dmEnabled} height="16"> <b>{0}</b>: {1}`);*/

let Toggled = false;

emit('chat:addSuggestion', '/dm', 'Send a private message to a player.', [{name: 'ID', help: 'Server ID'}, {name: "message", help: "Message"}]);
emit('chat:addSuggestion', '/r', "Reply to a message, if you've been messaged before.", [{name: 'message', help: 'Message'}]);
emit('chat:addSuggestion', '/toggledm', "Allow or disallow other players from DMing you.", []);
emit('chat:addSuggestion', '/adm', 'Send a private message to a player as Staff.', [{name: 'ID', help: 'Server ID'}, {name: "message", help: "Message"}]);

onNet("dm:toggledm", () => {
    if (Toggled) {
        Toggled = false;
        emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^3^*DM | INFO", "DMs enabled, you can receive private messages now."]});
        //console.log("toggle dm is " + Toggled);
    } else {
        Toggled = true;
        emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^3^*DM | INFO", "DMs disabled, you cannot receive private messages now."]});
        //console.log("toggle dm is " + Toggled);
    }
})

onNet("dm:notsent", () => {
    emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^1^*DM | ERROR", "That player has disabled private messages."]});
})

onNet("dm:totarget", (id, name, message) => {
    //console.log("NEW MESSAGE :: SENDER " + id + " :: NAME " + name + " :: MESSAGE " + message);
    if (!Toggled) {
        emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^5^*DM from [" + id + "] " + name + "^r", message]});
    } else {
        emitNet("dm:togerror", id);
    }
})

onNet("dm:stafftotarget", (name, message) => {
    //console.log("NEW STAFF MESSAGE :: SENDER " + id + " :: NAME " + name + " :: MESSAGE " + message);
    emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^1^*DM from " + name + "^r", "^*" + message]});
})

onNet("dm:totargetreply", (id, name, reply) => {
    //console.log("REPLY :: SENDER " + id + " :: NAME " + name + " :: REPLY " + reply);
    if (!Toggled) {
        emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^4^*REPLY from [" + id  + "] " + name + "^r", reply]});
    } else {
        emitNet("dm:togerror", id);
    }
})

onNet("dm:invalidid", () => {
    
    emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^1^*DM | ERROR", "That player doesn't exist. Use a valid server ID."]})
});

onNet("dm:nomessage", () => {

    emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^1^*DM | ERROR", "You haven't provided a message."]})
});

onNet("dm:notmessaged", () => {

    emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^1^*DM | ERROR", "You haven't been messaged by anyone before, therefore you can't use /r."]})
});

onNet("dm:selfdmerror", () => {

    emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^1^*DM | ERROR", "You cannot DM yourself."]})
});

onNet("dm:addstaffmsg", (id, name, message) => {

    emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^6^*🍪 | " + name, "^r" + message]});
});

onNet("dm:addconsolemsg", (message) => {

    emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^3^*^_SERVER CONSOLE^r", message]});
});

onNet("dm:addplayermsg", (id, name, message) => {

    emit("chat:addMessage", { color: [255, 255, 255], multiline: true, args: ["^*[" + id + "] " + name + "^r", message]});
});