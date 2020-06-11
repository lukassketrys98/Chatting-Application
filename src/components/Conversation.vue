<template>
  <div>
     <md-app>
    <md-app-toolbar class="md-primary">
      <md-button class="md-icon-button" to="/conversations">
        <md-icon>arrow_back</md-icon>
      </md-button>
      <md-avatar>
        <img :src="displayImg" alt />
      </md-avatar>
      <span class="md-title">{{title}}</span>
      <div class="md-toolbar-section-end"></div>
    </md-app-toolbar>
 <md-app-content>
    <div class="form">
      <md-field>
        <label>Name</label>
        <md-input v-model="conversation.name" :value="conversation.name"></md-input>
      
      </md-field>
      <div
        :class="{display: displayState}"
        class="try"
        :style="
                  {
                  backgroundImage:'url('+ displayImg +')'}"
      ></div>
      <div
        :class="{display: !displayState}"
        class="photo-container"
        :style="
                  {
                  backgroundImage:'url('+ conversation.img +')'}"
      >
       
      </div>

      <input id="file" @change="saveImage" type="file" accept="image/*" style="display:none;" />
      <md-button class="md-primary" @click="openImage">Set Image</md-button>
      <br>
      <md-button class="md-primary md-raised" @click="accept">Accept</md-button>
      <md-button class="md-primary md-raised" @click="aa">Cancel</md-button>
    </div>
     </md-app-content>
    </md-app>
    
  </div>
  
</template>
<script>
import Vue from "vue";

export default {
  name: "Conversation",
  props: ["id", "vardas"],

  data() {
    return {
      title: this.$route.params.convTitle,

      conversation: {
        id: "",
        img: this.$route.params.convImg,
        name: ''
      },
      ida: this.id,
      displayImg: this.$route.params.convImg,
      displayState: false
    };
  },
  created() {
    
   this.conversation.name = this.title
   console.log(this.conversation.name)
  },
  methods: {
    saveImage() {
      var element = document.getElementById("file");
      var file = element.files[0];
      var reader = new FileReader();
      reader.onloadend = () => {
        Vue.set(this.conversation, "img", reader.result);
      };
      reader.readAsDataURL(file);
      this.displayState = true;
    },
    aa() {
      console.log(this.ida);
      console.log(this.conversation);
    },

    openImage(event) {
      document.getElementById("file").click();
    },

    accept() {
      this.conversation.id = this.ida;
      this.$db.updateConversation(this.conversation, (err, conv) => {
        if (err) alert(err.message);
        else {
          console.log(conv);
          this.$router.back();
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
.try {
  height: 350px;
  background-size: cover;
  
}
.display {
  display: none;
}
.upload-photo-area {
  max-height: 500px;
  width: auto;
}

.photo-container {
  height: 350px;
  background-size: cover;
}
</style>