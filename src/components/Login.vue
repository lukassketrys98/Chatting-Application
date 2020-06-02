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
              <md-button class="md-raised md-primary" @click="register">Accept</md-button>
              <md-button class="md-raised md-primary" @click="cancel">Cancel</md-button>
            </div>
          </md-content>
        </md-card>
      
      </div>
    </div>
  </div>

  <!-- <div>
    <div class="md-layout md-alignment-center">
      <div class="md-layout-item md-size-50 md-small-size-90">
        <md-card class="md-elevation-10">
          <md-toolbar class="md-accent">
            <span class="md-title">Login</span>
          </md-toolbar>

          <md-card-header class="md-primary">
            <div class="md-title">Please enter your login details.</div>
          </md-card-header>
          <md-card-content>
            <md-field>
              <label for="email">Email</label>
              <md-input type="email" name="email" />
            </md-field>
            <md-field>
              <label for="password">Password</label>
              <md-input type="text" name="password" />
            
            </md-field>
            <md-divider></md-divider>
          </md-card-content>

          <md-card-actions>
            <div class="md-layout-item md-size-50">
              <md-button class="md-raised md-accent">Sign up</md-button>
            </div>
            <div class="md-layout-item md-size-50 push-right">
              <md-button class="md-raised md-accent">Login</md-button>
            </div>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>-->
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
        password: "",

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
              console.log(att)
              Vue.set(this.$user, att, user[att]);
            }
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-card {
  margin-top: 200px;
}

.form{
  padding: 30px 15px;
}
.colored {
  background: #448aff;
  color: white;
  
}
</style>
