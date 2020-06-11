<template>
  <div>
    <md-app>
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" to="/conversations">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <md-avatar>
          <img :src="conversation.img" alt />
        </md-avatar>
        <span class="md-title">{{conversation.name}}</span>
        <div class="md-toolbar-section-end"></div>
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" @click="scrollToElement({behavior: 'smooth'})">
            <md-icon>arrow_downward</md-icon>
          </md-button>

          <md-button class="md-icon-button" @click="toMembersWindow">
            <md-icon>group</md-icon>
          </md-button>
        </div>
      </md-app-toolbar>
      <md-app-content>
        <div ref="messageDisplay" class="messages">
          <md-list>
            <md-list-item
              :class="`index-${index}`"
              :key="message.id"
              v-for="(message,index) in conversation.messages"
            >
              <md-avatar>
                <img :src="message.img" alt />
              </md-avatar>

              <div class="item">
                <div class="top">
                  <span style="font-weight: 700" class="md-list-item-text">{{ message.content }}</span>
                </div>
                <div class="bottom">
                  <span class="md-list-item-text">{{ message.author }}</span>
                  <div class="timestamp">
                    <span class="md-list-item-text">{{ message.ts }}</span>
                  </div>
                </div>
              </div>

              <md-button
                @click="deleteMessage(message.id)"
                class="mano md-icon-button md-list-action"
              >
                <md-icon class="md-primary">delete</md-icon>
              </md-button>
            </md-list-item>
          </md-list>
        </div>
      </md-app-content>
    </md-app>
    <div class="new-message-field">
      <md-field class="have-borders">
        <md-input v-model="newMessageText"></md-input>
      </md-field>
      <md-button @click="addMessage" class="send md-raised md-icon-button md-accent">
        <md-icon>send</md-icon>
      </md-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Messages",
  props: ["id"],
  data() {
    return {
      conversation: {
        id: "",
        img: "",
        name: ""
      },
      ida: this.id,
      newMessageText: "",
      userza: this.$user
    };
  },
  mounted() {
    this.listMessages();
  },
  methods: {
    listMessages() {
      this.$db.listMessages(this.ida, conv => {
        this.conversation = conv;
      });
    },

    scrollToElement(options, index) {
      var lastMessageIndex = this.last();
      const el = this.$el.getElementsByClassName(
        `index-${lastMessageIndex}`
      )[0];

      if (el) {
        el.scrollIntoView(options);
      }
    },

    toMembersWindow() {
      this.$router.push({
        name: "Members",
        params: {
          members: this.conversation.members,
          id: this.ida
        }
      });
    },
    addMessage() {
      this.$db.addMessage(this.newMessageText, this.conversation, this.$user);
      this.newMessageText = "";
    },
    last() {
      if (!this.conversation.messages) {
        console.log("no msg");
      } else {
        var lastIndex = this.conversation.messages.length - 1;
        return lastIndex;
      }
    },
    deleteMessage(id) {
      console.log(this.conversation);
      this.$db.deleteMessage(this.$user, id, this.conversation.name, err => {
        if (err) alert("Error: " + err.message);
        else {
          alert(`You have successfuly deleted the message`);
        }
      });
    }
  }
};
</script>
<style scoped>
.md-app {
  max-height: 800px;
  border: 1px solid rgba(#000, 0.12);
}
.md-list-item {
  list-style-type: none;
  margin-top: 20px;
}
.md-list {
  margin-bottom: 20px;
}

.item {
  display: flex;
  flex-direction: column;
  margin: -8px;
  width: 100%;
}
.anotherclass {
  background: red;
}

.bottom {
  display: flex;
  /* flex: 50% 50%; */
  margin-top: 5px;
}

/* .timestamp{
    margin-left: -1px;
} */
.new-message-field {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 40;
}

.have-borders {
  border: 2px solid grey;
  border-radius: 4px;
}
.md-field {
  margin-left: 15px;
  width: 70%;
}

.md-input {
  margin-left: 20px;
}

.send {
  margin-left: 25px;
  margin-top: 10px;
}

.md-avatar {
  margin: -15px;
}
</style>