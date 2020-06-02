import Vue from 'vue'
import Router from 'vue-router'
import Conversations from '@/components/Conversations'
import Conversation from '@/components/Conversation'
import Messages from '@/components/Messages'
import Members from '@/components/Members'
import Profile from '@/components/Profile'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/conversations',
      name: 'Conversations',
      component: Conversations
    },
    {
      path: '/conversation/:id',
      name: 'Conversation',
      component: Conversation,
      props: true
    },
    
    {
      path: '/conversation/:id/:messages',
      name: 'Messages',
      component: Messages,
      props: true
    },
    {
      path: '/conversation/:id/:members',
      name: 'Members',
      component: Members,
      props: true
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '*',
      redirect: '/conversations'
    },
    
    
  ],
  mode: 'history' 
})
