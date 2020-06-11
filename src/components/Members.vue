<template>
  <div>
    <md-app>
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" :to="'/conversation/' + id + '/messages'">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <md-avatar>
          <md-icon>group</md-icon>
        </md-avatar>
        <span class="md-title">Members</span>
        <div class="md-toolbar-section-end"></div>
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" @click="showDialog = true">
            <md-icon>person_add</md-icon>
          </md-button>
        </div>
      </md-app-toolbar>
      <md-app-content>
        <md-list>
          <md-list-item :key="member.id" v-for="member in displayMembers">
            <md-avatar>
              <img :src="member.img" alt />
            </md-avatar>
            <span class="md-list-item-text">{{ member.name }} {{ member.surname }}</span>
          </md-list-item>
        </md-list>

        <md-dialog
          :md-click-outside-to-close="true"
          :md-close-on-esc="true"
          :md-active.sync="showDialog"
        >
          <div>
            <md-table
              md-card
              @md-selected="onSelect"
              v-model="searched"
              md-sort="name"
              md-sort-order="asc"
              md-fixed-header
            >
              <md-table-toolbar>
                <div class="md-toolbar-section-start">
                  <h1 class="md-title">Select Users</h1>
                </div>
              </md-table-toolbar>
              <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
                <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>
              </md-table-toolbar>
              <md-table-empty-state
                md-label="No users found"
                :md-description="`No user found for this '${search}' query. Try a different search term`"
              >
              
              </md-table-empty-state>

              <md-table-row
                md-selectable="multiple"
                md-auto-select
                slot="md-table-row"
                slot-scope="{ item }"
              >
                <md-table-cell md-label="Avatar" md-sort-by="img">
                  <md-avatar v-if="item.img">
                    <img :src="item.img" alt />
                  </md-avatar>
                </md-table-cell>
                <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="Surname" md-sort-by="surname">{{ item.surname }}</md-table-cell>

                <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
              </md-table-row>
            </md-table>
            <md-field md-clearable class="md-toolbar-section-end">
              <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
            </md-field>
          </div>

          <md-dialog-actions>
            <md-button class="md-primary" @click="joinConversation(); showDialog = false">Add user</md-button>
            <md-button class="md-primary" @click="showDialog = false">Close</md-button>
          </md-dialog-actions>

          
        </md-dialog>
      </md-app-content>
    </md-app>
  </div>
</template>
<script>
const toLower = text => {
  return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.name).includes(toLower(term)));
  }

  return items;
};

export default {
  name: "Members",

  data() {
    return {
      id: this.$route.params.id,
      members: this.$route.params.members,
      displayMembers: [],
      showDialog: false,
      displayMembersForTable: [],
      search: null,
      searched: [],
      selected: []
    };
  },
  mounted() {
    this.assignUsers();
    this.listAllUsers();
    this.searched = this.displayMembersForTable;
  },
  methods: {
    assignUsers() {
      this.$db.assignUsers(this.members, displayMembersArray => {
        this.displayMembers = displayMembersArray;
      });
    },
    listAllUsers() {
      this.$db.listAllUsers(allMembers => {
        this.displayMembersForTable = allMembers;
      });
    },
    newUser() {
      window.alert("Noop");
    },
    searchOnTable() {
      this.searched = searchByName(this.displayMembersForTable, this.search);
    },
    onSelect(items) {
      this.selected = items;
    },
    getAlternateLabel(count) {
      let plural = "";

      if (count > 1) {
        plural = "s";
      }

      return `${count} user${plural} selected`;
    },
    joinConversation() {
      this.$db.joinConversation(
        this.id,
        this.selected,
        this.members,
        updatedMembers => {
        alert(`You successfuly added new member to this conversation`)

          this.members = updatedMembers;
        }
      );
      this.assignUsers();
      this.selected = [];
    }
  }
};
</script>
<style scoped>
.md-app {
  max-height: 800px;
  border: 1px solid rgba(#000, 0.12);
}

.md-list-item {
  list-style-type: none;
}

.md-dialog {
  margin: 30px 10px;
  /* padding: 30px 0px; */
}
/* .md-table {
  max-width: 320px;
}
.md-field {
  max-width: 320px;
} */
</style>