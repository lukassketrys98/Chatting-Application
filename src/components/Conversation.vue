<template>
  <h1>Conversation {{id}}</h1>
</template>
<script>
import Vue from "vue";

export default {
  name: "Conversation",
  props: ["id"],
  data() {
    return {
      conversation: {}
    };
  },
  mounted() {
    if (this.id) {
      this.$db.listConversations(
        this.$user.token,
        { id: this.id },
        (err, convs) => {
          if (err) alert(err.message);
          else {
            for (var id in convs[0]) {
              Vue.set(this.conversation, id, convs[0][id]);
            }
          }
        }
      );
    }
  }
};
</script>
<style></style>