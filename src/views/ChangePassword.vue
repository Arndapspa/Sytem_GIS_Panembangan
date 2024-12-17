<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row justify-content-center">
                            <div class="col-6 mt-3">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0">Ubah Password</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-6">
                                <Form :validation-schema="schema" @submit="handleSubmit">
                                    <div class="card custom-rounded-medium">
                                        <div class="card-body">
                                            <h6 class="mb-3">Silahkan masukkan password anda yang baru.</h6>
                                            <div class="spacer-medium"></div>
                                            <div class="form-group" :class="{'mb-2': passwordStrength, 'mb-3': !passwordStrength}">
                                                <label class="form-label">Password Lama</label>
                                                <div style="position: relative;">
                                                    <Field :type="togglePasswordVisibility[0] ? 'text' : 'password'" name="currPassword" class="form-control" placeholder="Masukkan password lama" v-model="form.currPassword" />
                                                    <i class="mdi" v-if="form.currPassword" :class="{'mdi-eye': togglePasswordVisibility[0], 'mdi-eye-off': !togglePasswordVisibility[0]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[0] = !togglePasswordVisibility[0]"></i>
                                                </div>
                                                <ErrorMessage name="currPassword" :class="'text-danger'" />
                                            </div>
                                            <div class="form-group" :class="{'mb-2': passwordStrength, 'mb-3': !passwordStrength}">
                                                <label class="form-label">Password Baru</label>
                                                <div style="position: relative;">
                                                    <Field :type="togglePasswordVisibility[1] ? 'text' : 'password'" name="password" class="form-control" placeholder="Masukkan password" v-model="form.password" />
                                                    <i class="mdi" v-if="form.password" :class="{'mdi-eye': togglePasswordVisibility[1], 'mdi-eye-off': !togglePasswordVisibility[1]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[1] = !togglePasswordVisibility[1]"></i>
                                                </div>
                                                <ErrorMessage name="password" :class="'text-danger'" />
                                            </div>
                                            <div class="d-flex mb-3 fw-bold" v-if="passwordStrength" :class="{'text-danger': passwordStrength.level < 2, 'text-primary': passwordStrength.level < 4, 'text-success': passwordStrength.level >= 4}">
                                                <i class="mdi me-2" :class="{'mdi-alert': passwordStrength.level < 3, 'mdi-check-circle': passwordStrength.level >= 3}"></i>
                                                <div>{{passwordStrength.message}}</div>
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Konfirmasi Password Baru</label>
                                                <div style="position: relative;">
                                                    <Field :type="togglePasswordVisibility[2] ? 'text' : 'password'" name="password_confirm" class="form-control" placeholder="Masukkan konfirmasi password" v-model="form.confirmPassword" />
                                                    <i class="mdi" v-if="form.confirmPassword" :class="{'mdi-eye': togglePasswordVisibility[2], 'mdi-eye-off': !togglePasswordVisibility[2]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[2] = !togglePasswordVisibility[2]"></i>
                                                </div>
                                                <ErrorMessage name="password_confirm" :class="'text-danger'" />
                                            </div>
                                            <div class="alert alert-info custom-rounded-medium">
                                                <h6>
                                                    <i class="mdi mdi-information me-2"></i>Rekomendasi kombinasi password :
                                                </h6>
                                                <ul class="mt-2 mb-0 font-size-12">
                                                    <li>Memiliki setidaknya 8 karakter</li>
                                                    <li>Mengandung minimal satu huruf kecil (a-z).</li>
                                                    <li>Mengandung minimal satu huruf besar (A-Z).</li>
                                                    <li>Mengandung minimal satu angka (0-9).</li>
                                                    <li>Mengandung minimal satu simbol (misalnya: !@#$%^&*()_+).</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="card-footer card-footer-custom-radius-medium">
                                            <div class="d-flex justify-content-end">
                                                <button type="button" @click="$router.push('/')" class="btn border-light bg-white custom-rounded-medium me-2">Kembali</button>
                                                <button type="submit" class="btn btn-primary custom-rounded-medium">Simpan</button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import simplebar from 'simplebar-vue';
import 'simplebar-core/dist/simplebar.css';

import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import { db } from '@/utils/firebase';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { useRoute } from 'vue-router';

import axios from 'axios';

export default {
    name: 'Profile',
    data() {
        return {
            togglePasswordVisibility: [false, false, false],
            form :{
                currPassword: '',
                password: '',
                confirmPassword: '',
            },
            loading: null
        }
    },
    components: {
        simplebar, Field, Form, ErrorMessage
    },
    setup() {
        const route = useRoute();
        
        const schema = yup.object({
            currPassword: !route.params.id ? yup.string().required('Masukkan password lama') : null,
            password: !route.params.id ? yup.string().required('Masukkan password').min(8, 'Password minimal 8 karakter') : null,
            password_confirm: !route.params.id ? yup.string().required('Masukkan password').min(8, 'Password minimal 8 karakter') : null,
        });

        const api = axios.create({
            timeout: 30000,
        });

        return {
            schema,
            api
        }
    },
    computed: {
        passwordStrength() {
            const rules = [
                { regex: /.{8,}/, message: 'Password lemah', level: 1 },
                { regex: /[a-z]/, message: 'Password sedang', level: 2 },
                { regex: /[A-Z]/, message: 'Password kuat', level: 3 },
                { regex: /[0-9]/, message: 'Password sangat kuat', level: 4 },
                { regex: /[\W_]/, message: 'Password sangat kuat', level: 5 }
            ];

            if (this.form.password) {
                const strength = rules.reduce((acc, rule) => acc + rule.regex.test(this.form.password), 0);
                return strength ? rules[strength - 1] : false;
            } else {
                return false
            }
        },
    },
    methods: {
        async handleSubmit() {
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan mengubah password`,
                    icon: 'warning',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Ya',
                    confirmButtonColor: '#159895',
                    denyButtonColor: '#c0c0c0',
                    denyButtonText: 'Tidak',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        if (this.form.password != this.form.confirmPassword) {
                            this.$toast.error('Konfirmasi password tidak sesuai!');
                        } else if (this.form.currPassword == this.form.password) {
                            this.$toast.error('Password yang digunakan sama dengan sebelumnya!');
                        } else {
                            const auth = getAuth()
                            const user = auth.currentUser;

                            // Buat objek kredensial
                            const credential = EmailAuthProvider.credential(user.email, this.form.currPassword);
                            if (user) {
                                this.loading = this.$loading.show()

                                reauthenticateWithCredential(user, credential)
                                .then(() => {
                                    updatePassword(user, this.form.password)
                                    .then(async () => {
                                        this.$toast.success('Password berhasil diubah');
                                        
                                        await signOut(auth);
                                        localStorage.removeItem('token')
                                        this.loading.hide()
                                        await this.saveUser(user.uid)
                                        setTimeout(() => {
                                            this.$router.push("/signin");
                                        }, 100);
                                    })
                                    .catch((error) => {
                                        this.$toast.error(`${error.message}`);
                                    });
                                })
                                .then(() => {
                                    console.log("Password berhasil diubah!");
                                })
                                .catch((error) => {
                                    console.error("Error:", error.message);
                                });
                            } else {
                                this.$toast.error('Anda harus masuk untuk mengubah password!.');
                            }
                        }
                    }
                });
        },
        async saveUser(uid) {
            try {
                // Buat akun baru menggunakan Firebase Authentication
                if (uid) {
                    const dataDoc = await getDoc(doc(db, "users", uid));
                    
                    if (dataDoc.exists()) {
                        const data = dataDoc.data();

                        delete data['password']

                        const currData = {
                            ...data,
                            password: this.form.password
                        }

                        await setDoc(doc(db, "users", uid), currData);
                    }
                }
            } catch(error) {
                console.log(error.message);
            }
        },
    }
}
</script>