<script setup>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="page">
    <NavBar v-if="$route.meta.navbar"></NavBar>
    <router-view></router-view>
    <Footer v-if="$route.meta.footer"></Footer>
  </div>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from './utils/firebase';
import { doc, getDoc } from "firebase/firestore";

import stores from './stores';


//file parent dari html/tampilan
export default {
  data() {
    return {
      user: null,
    }
  },
  mounted() {
    // Pantau status autentikasi pengguna
    onAuthStateChanged(auth, async(user) => {
      if (user) {
        // User is signed in
        this.user = user;

        if (user.email == 'superadmin@gmail.com') { // superadmin
            stores.commit('setuser', {
                name: 'Super Admin',
                email: user.email,
                role: 'superadmin'
            })
        } else { // other roles
            this.loading = this.$loading.show()
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
                const userData = {id: user.uid, ...userDoc.data()};
                stores.commit('setuser', userData)
            }
            this.loading.hide()
        }
      } else {
        // User is signed out
        this.user = null;

        // Redirect ke halaman login jika perlu
        this.$router.push("/signin");
      }
    });
  }
}
</script>