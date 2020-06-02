<template>
  <div>

   
<div class="md-layout md-alignment-center">
        <div class="md-layout-item md-size-50 md-small-size-90">
        <md-card class = "md-elevation-10">
    
 <md-toolbar class ="md-accent ">
      <span class="md-title">Sign Up</span>
    </md-toolbar>
  <md-toolbar class ="md-accent ">
      <span>This user already exists, try a different set of data</span>
    </md-toolbar>

      <md-card-header class = "md-primary">
        <div class="md-title">Please enter your registration details</div>
      </md-card-header>
            
        <ul>
            <li v-for="user in store">
                <img :src="user.image" alt="">

            </li>
        </ul>
         
            
              


<!-- form -->


<div class="set-avatar-field">

    <div class="photo">
        <img :src="avatar" class = "avataro" alt="">
    </div>
    <label class="custom-field">
        Set Image
        <input type="file" name = "image" @change="getImage">
    </label>

        <!-- <md-button href="#" class="md-raised md-accent" @click.prevent="upload">
            Upload
        </md-button>
    <md-button href="#" class="md-raised md-accent" @click="retrieve">
        Retrieve
        </md-button> -->


</div>

  



 
      <md-card-content>
          <md-field>
            <label for="name">Name</label>
            <md-input type="text" name="name" />
         </md-field>
         <md-field>
            <label for="suname">Surname</label>
            <md-input type="text" name="surname" />
         </md-field>
        <md-field>
            <label for="email">Email</label>
            <md-input type="email" name="email" :rules="[rules.required, rules.email]"/>
         </md-field>
        <md-field>
            <label for="password">Password</label>
            <md-input
             type="password" 
             name="password" 
             :rules="[rules.required]" 
             />
            <!-- <md-list-item class="md-inset"> -->
              
         </md-field>
       
         <md-divider ></md-divider>
         
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

  </div>
 
</template>

<script>
export default {
  
  data () {
    return {
        avatar: null,
        displayavatar: [],
        store: [],
        rules: {
            required: value => {
                !!value
            },
            email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Invalid e-mail.";
            }
        }
    }
  },
  methods:{
    getImage(e){
        let image = e.target.files[0];
        console.log(image)
        let reader = new FileReader();
        console.log(reader)
        reader.readAsDataURL(image);
        reader.onload = e => {
            console.log(e)
            this.avatar = e.target.result;
            
        }
        this.upload();
       this.retrieve();
    },
    upload(){
        const axios = require('axios');
        axios.post('https://my-database-7b462.firebaseio.com/users.json', {'image': this.avatar})
    
    },

    retrieve(){
    
const myRequest = new Request('https://my-database-7b462.firebaseio.com/users.json');

fetch(myRequest).then( response =>  response.json()).then( response => {
       console.log(response)
 
    var usersArray = [];
     for(let key in response){
       console.log(key)
     response[key].id = key;
    
    
       usersArray.push(response[key]);
      

     }
     
    //  for(let i = 0;i <usersArray.length;i++){
    //       if(us)
         
    //  }
    
     this.store = usersArray;
     console.log(this.store)
    

  });
 
    }
  
 }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-card{
  margin-top: 200px;
}

.push-right{
  text-align: right;
}

.image-preview{
    border: 2px solid black;
    width: 300px;
    height: 100px;
    border-radius: 50px;
    text-align: center;
    
}

.image-preview__image{
    display: none;
    width: 100%;
}


img{
    border-radius: 50%;
    /* border: 1px solid red; */
    background-image: url('https://cdn0.iconfinder.com/data/icons/mix1-1/200/Untitled-1-512.png');
    background-repeat: no-repeat;
    background-size: cover;
    width:100px;
    height:100px;
    object-fit: cover;
    margin-top: 15px;
    margin-bottom: 15px;
}

input[type=file]{
    display:none;
}

.custom-field{
    background: #ff5252;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    color: white;
    text-transform: uppercase;
    cursor: pointer;
    min-width: 88px;
    height: 36px;
    margin-top: 6px;
    user-select: none;
    border-radius: 2px;
    font-size: 14px;
    font-weight: 500;
    padding: 9px;
    text-align: center;
}


.set-avatar-field{
    text-align: center;
    
}

.photo{
   text-align: center;
}

</style>
