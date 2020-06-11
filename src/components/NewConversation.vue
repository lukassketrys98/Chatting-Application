<template>
  <div>
    <md-app>
    <md-app-toolbar class="md-primary">
      <md-button class="md-icon-button" to="/conversations">
        <md-icon>close</md-icon>
      </md-button>

      <span class="md-title">Add New Conversation</span>
      <div class="md-toolbar-section-end"></div>
    </md-app-toolbar>
<md-app-content>
    <div class="form">
      <md-field>
        <label>Name</label>
        <md-input v-model="newConversationName"></md-input>
      </md-field>
      <span class="md-title">Add members</span>
      <md-list :key="user.id" v-for="user in memberList">
        <md-list-item>
          <md-checkbox
            v-model="membersForConversation"
            :value="user.name"
            class="md-list-item-text"
          ></md-checkbox>
          <label class="checkbox-label">{{user.name}}</label>
        </md-list-item>
      </md-list>

      <div v-if="newConversation.img">
        <img :src="newConversation.img" />
      </div>
      <input id="file" @change="saveImage" type="file" accept="image/*" style="display:none;" />
      <md-button class="md-primary" @click="openImage">Set Image</md-button>
      <br>
      <md-button class="md-primary md-raised" @click="addConversation">Accept</md-button>
    </div>
    </md-app-content>
    </md-app>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  name: "NewConversation",
  data() {
    return {
      memberList: [],
      membersForConversation: [],
      newConversationName: "",
      newConversation: {
        name: "",
        img: "",
        members: []
      }
    };
  },
  mounted() {
    this.listUsers();
  },
  methods: {
    listUsers() {
      this.$db.listUsers(this.$user, members => {
        this.memberList = members;
        console.log(this.memberList);
      });
    },
    saveImage() {
      var element = document.getElementById("file");
      var file = element.files[0];
      var reader = new FileReader();
      reader.onloadend = () => {
        Vue.set(this.newConversation, "img", reader.result);
      };
      reader.readAsDataURL(file);
    },

    openImage(event) {
      console.log("Profile.openImage()");
      document.getElementById("file").click();
    },
    addConversation() {
      this.newConversation.members = this.membersForConversation;
      this.newConversation.name = this.newConversationName;
      this.$db.addConversation(
        this.$user,
        this.$user.token,
        this.newConversation,
        (err,conversation) => {
          if (err) alert(err.message);
          else {
            alert(`You successfuly added new ${conversation.name} conversation`);
            this.$router.push({ path: "/conversations" });
          }
        }
      );
      console.log(this.newConversation);
    }
  }
};
</script>
<style scoped>
.md-app {
    max-height: 800px;
    border: 1px solid rgba(#000, .12);
  }
</style>