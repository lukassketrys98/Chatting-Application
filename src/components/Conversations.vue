<template>
  <div >
 <md-app md-waterfall md-mode="fixed">
    <md-app-toolbar  class="md-primary">
      <md-avatar>
        <md-icon>chat</md-icon>
      </md-avatar>
      <span  class="md-title">Conversations</span>
      <div class="md-toolbar-section-end">
        <md-button class="md-icon-button" @click = "reloadPage">
          <md-icon>refresh</md-icon>
        </md-button>
        <md-button class="md-icon-button" to="/profile">
          <md-icon>account_circle</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="logout">
          <md-icon>exit_to_app</md-icon>
        </md-button>
      </div>
    </md-app-toolbar>
   <md-app-content>

    <md-list>
    <md-list-item :key="conv.id" v-for="conv in conversations">
      <md-avatar>
        <img :src="conv.img" alt="">
       
      </md-avatar>
      <span class="md-list-item-text">{{ conv.name }}</span>
      <md-menu md-size="medium" :md-offset-x="150" :md-offset-y="10">
        <md-button class="md-icon-button md-list-action">
          <md-icon md-menu-trigger class="md-primary">more_vert</md-icon>
        </md-button>
        <md-menu-content>
          <md-menu-item :to="'/conversation/' + conv.id + '/messages'">Open</md-menu-item>
          <md-menu-item  :to="{ name: 'Conversation', params: {id: conv.id, convTitle: conv.name, convImg: conv.img } }">Edit</md-menu-item>
          <md-menu-item @click="leaveConversation(conv.id)">Leave</md-menu-item>
        </md-menu-content>
      </md-menu>
    </md-list-item>
   </md-list>
    <md-button class="md-fab md-accent" to="/newConversation">
      <md-icon>chat</md-icon>
    </md-button>
   </md-app-content>
 </md-app> 

  </div>
</template>
<script>
import Vue from "vue";

export default {
  name: "Conversations",
  data() {
    return {
      conversations: [],
      isUserLoggedIn: true,
    
     
    };
  },
  mounted() {
    this.refresh();
    // console.log(this.conversations)
  },
  methods: {
    refresh() {
      this.conversations.splice(0, this.conversations.length);
      
      this.$db.listConversations(this.$user,(err, convos) => {
        if (err) alert("Error: " + err.message);
        else {
          convos.forEach(convo => {
            this.conversations.push(convo);
          });
        }
      });
    },
    leaveConversation(id){
      this.$db.leaveConversation(this.$user, id,(err,conversation)=>{
      if (err) alert("Error: " + err.message);
        else {
          alert(`You have successfuly left the ${conversation.name} conversation`)
          this.refresh();
        }
      });

      
    },
    isLoggedIn(){
      this.$db.isLoggedIn(this.$user)
    },
    logout() {
      Vue.set(this.$user, "token", null);
      // this.$db.setCurrentUser({});
    },
     reloadPage() {
       window.location.reload()
    },
    forParams(){
      this.$router.push({
        name: "Conversation",
        params: {
          // name: this.conv.name,
          id: this.$router.params.id
        }
      });
    }
  }
};
</script>
<style scoped>
 .md-app {
    max-height: 800px;
    border: 1px solid rgba(#000, .12);
  }

.md-list-item {
  list-style-type: none;
  margin: 20px 0;
}

.md-list{
  margin-bottom: 50px;
}

.md-fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 10;
}

.md-menu-item {
  margin: 0 auto;
}
</style>