<template>
  <div>
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" to = "/conversations">
        <md-icon>arrow_back</md-icon>
      </md-button>
      <md-avatar>
        <md-icon>person</md-icon>
      </md-avatar>
      <span class="md-title">Profile</span>
      <div class="md-toolbar-section-end"></div>
    </md-toolbar>
    <div class="form">
      <md-field>
        <label>Name</label>
        <md-input v-model="user.name"></md-input>
      </md-field>
       <md-field>
        <label>Surname</label>
        <md-input v-model="user.surname"></md-input>
      </md-field>
       <md-field>
        <label>Email</label>
        <md-input v-model="user.email"></md-input>
      </md-field>
       <md-field>
        <label>Password</label>
        <md-input type = "password" v-model="user.password"></md-input>
      </md-field>
      <div v-if="user.img">
     
          <img :src="user.img" />
  
      </div>
      <input id="file" @change="saveImage" type="file" accept="image/*" style="display:none;" />
      <md-button class="md-primary" @click="openImage">Set Image</md-button>
      <br>
      <md-button class = "md-primary md-raised" @click="accept">Accept</md-button>
      <md-button class = "md-primary md-raised">Cancel</md-button>
    </div>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  name: "Profile",
  data() {
    return {
      user: {
        id: this.$user.id,
        email: this.$user.email,
        name: this.$user.name,
        surname: this.$user.surname,
        img: this.$user.img,
        token: this.$user.token
      }
    };
  },
  methods: {
    saveImage() {
      console.log("Profile.saveImage()");
      
      var element = document.getElementById("file");
      var file = element.files[0];
      var reader = new FileReader();
      reader.onloadend = () => {
        Vue.set(this.user, "img", reader.result);
      };
      reader.readAsDataURL(file);
    },

    openImage(event) {
      console.log("Profile.openImage()");
      document.getElementById("file").click();
    },

    accept() {
      console.log("Profile.accept()");
      
      this.$db.updateUser(this.$user.token, this.user, (err,user) => {
        if (err) alert(err.message);
        else {
          this.$user.email = user.email;
          this.$user.name = user.name;
          this.$user.surname = user.surname;
          this.$user.img = user.img;
          this.$router.back();
          // console.log(this.$user)
        }
      });
      // console.log(this.$user.token)
      // console.log(this.user)
    }
  }
};
</script>
<style scoped>
img{
  border-radius: 50%;
    width:85px;
    height:85px;
    object-fit: cover;
    margin-left: 10px;
}

/* .separate-line{
  margin-right: 100px;
} */
</style>