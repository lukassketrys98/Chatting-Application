<template>
  <div>
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button">
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
      <div>
        <md-avatar v-if="user.img" class="md-large">
          <img :src="user.img" />
        </md-avatar>
      </div>
      <input id="file" @change="saveImage" type="file" accept="image/*" style="display:none;" />
      <md-button class="md-primary" @click="openImage">Set Image</md-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Profile",
  data() {
    return {
      user: {
        id: this.$user.id,
        email: this.$user.email,
        name: this.$user.name,
        surname: this.$user.surname,
        img: this.$user.img
      }
    };
  },
  methods: {
    saveImage() {
      console.log("Profile.saveImage()");
      var self = this;
      var element = document.getElementById("file");
      var file = element.files[0];
      var reader = new FileReader();
      reader.onloadend = function() {
        Vue.set(self.user, "img", reader.result);
      };
      reader.readAsDataURL(file);
    },

    openImage(event) {
      console.log("Profile.openImage()");
      document.getElementById("file").click();
    },

    accept() {
      console.log("Profile.accept()");
      this.$db.updateUser(this.$user.token, this.user, (err, usr) => {
        if (err) alert(err.message);
        else {
          this.$user.email = user.email;
          this.$user.name = user.name;
          this.$user.surname = user.surname;
          this.$user.img = user.img;
          this.$router.back();
        }
      });
    }
  }
};
</script>
<style></style>