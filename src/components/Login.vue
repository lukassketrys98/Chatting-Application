<template>
  <div class="content">
    <md-toolbar class="md-primary md-layout md-alignment-center">
      <h3 class="md-title">Message App</h3>
    </md-toolbar>

    <div class="md-layout md-alignment-center">
      <div class="md-layout-item md-size-50 md-small-size-90">
        <md-card>
          <md-card-header class="md-elevation-3 colored">
            <span class="login-header md-title">{{mode}}</span>
          </md-card-header>

          <md-content v-if="mode == 'Login'">
            <div class="form">
              <md-field>
                <label>E-mail</label>
                <md-input v-model="user.email" autofocus></md-input>
              </md-field>
              <md-field md-has-password>
                <label>Password</label>
                <md-input v-model="user.password" type="password"></md-input>
              </md-field>
            </div>

            <md-button class="md-primary" @click="mode = 'Register'; clearForm()">Register</md-button>
            <md-button class="md-raised md-primary" @click="enter">Enter</md-button>
          </md-content>

          <md-content v-else>
            <!-- formulario register -->
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
              <md-field md-has-password>
                <label>Password</label>
                <md-input type="password" v-model="user.password"></md-input>
              </md-field>
              <div v-if="user.img">
                <img :src="user.img" />
              </div>
              <input
                id="file"
                type="file"
                @change="saveImage"
                accept="image/*"
                style="display:none;"
              />
              <md-button class="md-primary" @click="openImage">Set Image</md-button>
              <br />
              <md-button class="md-raised md-primary" @click="register">Accept</md-button>
              <md-button class="md-raised md-primary" @click="cancel">Cancel</md-button>
            </div>
          </md-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "Login",
  data() {
    return {
      mode: "Login",
      user: {
        name: "",
        surname: "",
        email: "",
        img: "",
        password: ""
      }
    };
  },
  methods: {
    enter() {
      console.log("Login.enter()");
      this.$db.login(
        this.user.email,
        this.user.password,
        (err, token, user) => {
          if (err) alert(err.message);
          else {
            Vue.set(this.$user, "token", token);

            for (var att in user) {
              
              Vue.set(this.$user, att, user[att]);
            }
            // this.$db.setCurrentUser(user);
            // this.$db.checkToken(token);
           
          }
       
        }
      );
    },
    cancel() {
      this.mode = "Login";
      this.clearForm();
    },
    register() {
      this.$db.addUser(this.user, (err, user) => {
        if (err) alert(err.message);
        else {
          alert(`New user ${user.name} ${user.surname} added successfuly`);
          this.clearForm();
          this.mode = "Login";
        }
      });
    },
    clearForm() {
      this.user = {
        name: "",
        surname: "",
        email: "",
        password: "",
        img: ""
      };
    },
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
    }
  }
};
</script>


<style scoped>
.md-card {
  margin-top: 200px;
}
.b {
  width: 500px;
  height: 200px;
}
.form {
  padding: 30px 15px;
}
.colored {
  background: #448aff;
  color: white;
}

img {
  border-radius: 50%;
  width: 85px;
  height: 85px;
  object-fit: cover;
  margin-left: 10px;
}
</style>
