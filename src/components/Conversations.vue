<template>
  <div>
    <md-toolbar class="md-primary">
      <md-avatar>
        <md-icon>chat</md-icon>
      </md-avatar>
      <span class="md-title">Conversations</span>
      <div class="md-toolbar-section-end">
        <md-button class="md-icon-button">
          <md-icon>refresh</md-icon>
        </md-button>
        <md-button class="md-icon-button" to="/profile">
          <md-icon>account_circle</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="logout">
          <md-icon>exit_to_app</md-icon>
        </md-button>
      </div>
    </md-toolbar>

    <md-list-item :key="conv.id" v-for="conv in conversations">
      <md-avatar>
        <md-icon>chat</md-icon>
      </md-avatar>

      <span class="md-list-item-text">{{ conv.name }}</span>

      <md-button class="md-icon-button md-list-action">
        <md-icon class="md-primary" :to="'/conversation/' + conv.id">more_vert</md-icon>
      </md-button>
    </md-list-item>
  </div>
</template>
<script>

import Vue from 'vue'

export default {
  name: "Conversations",
  data() {
    return {
      conversations: []
    };
  },
  mounted() {
     this.refresh();
  },
  methods: {
       refresh() {
      this.conversations.splice(0, this.conversations.length);
      this.$db.listConversations((err, convos) => {
        if (err) alert("Error: " + err.message);
        else {
          convos.forEach(convos => {
            this.conversations.push(convos);
          });
        }
      });
      
    },
    logout(){
            Vue.set(this.$user, 'token', null);
    }
  }
};
</script>
<style>
</style>