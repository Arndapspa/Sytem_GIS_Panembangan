<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row">
                            <div class="col-12 mt-3">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0">Form Data Admin</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <Form :validation-schema="schema" @submit="handleSubmit">
                                    <div class="card custom-rounded-medium">
                                        <div class="card-body">
                                            <h6 class="mb-3">Silahkan lengkapi form dibawah ini dengan benar.</h6>
                                            <div class="spacer-medium"></div>
                                            <div class="row">
                                                <div :class="{'col-md-6': !id, 'col-md-12': id}">
                                                    <div class="form-group mb-3">
                                                        <label class="form-label">Nama</label>
                                                        <Field type="text" name="name" class="form-control custom-rounded-medium" placeholder="Masukkan nama" v-model="form.name"/>
                                                        <ErrorMessage name="name" :class="'text-danger'" />
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <label class="form-label">NIK</label>
                                                        <Field type="number" name="identity_number" class="form-control custom-rounded-medium" placeholder="Masukkan NIK" v-model="form.identity_number"/>
                                                        <ErrorMessage name="identity_number" :class="'text-danger'" />
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <label class="form-label">No. Telpon</label>
                                                        <Field type="text" v-mask="['+62 ###-####-####']" name="phone" class="form-control custom-rounded-medium" placeholder="+62 878-xxxx-xxxx" v-model="form.phone" />
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <label class="form-label">Email</label>
                                                        <Field type="text" name="email" :disabled="id != ''" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan email" v-model="form.email"/>
                                                        <ErrorMessage name="email" :class="'text-danger'" />
                                                         <div class="alert alert-info custom-rounded-medium p-2">
                                                            <i class="mdi mdi-information me-2"></i> Email ini akan digunakan sebagai username untuk login aplikasi
                                                         </div>
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <label class="form-label">Alamat</label>
                                                        <Field as="textarea" name="address" rows="4" class="form-control custom-rounded-medium" placeholder="Masukkan alamat" v-model="form.address"/>
                                                    </div>
                                                </div>
                                                <div class="col-md-6" v-if="!id">
                                                    <div class="custom-rounded-medium p-3 alert alert-primary">
                                                        <h5><i class="mdi mdi-information me-3"></i>Informasi Akun</h5>
                                                        <p>Silahkan masukkan password untuk login ke aplikasi</p>
                                                        <div class="spacer-medium"></div>
        
                                                        <div class="form-group" :class="{'mb-2': passwordStrength, 'mb-3': !passwordStrength}">
                                                            <label class="form-label">Password</label>
                                                            <div style="position: relative;">
                                                                <Field :type="togglePasswordVisibility[0] ? 'text' : 'password'" name="password" class="form-control" placeholder="Masukkan password" v-model="form.password" />
                                                                <i class="mdi" v-if="form.password" :class="{'mdi-eye': togglePasswordVisibility[0], 'mdi-eye-off': !togglePasswordVisibility[0]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[0] = !togglePasswordVisibility[0]"></i>
                                                            </div>
                                                            <ErrorMessage name="password" :class="'text-danger'" />
                                                        </div>
                                                        <div class="d-flex mb-3 fw-bold" v-if="passwordStrength" :class="{'text-danger': passwordStrength.level < 2, 'text-primary': passwordStrength.level < 4, 'text-success': passwordStrength.level >= 4}">
                                                            <i class="mdi me-2" :class="{'mdi-alert': passwordStrength.level < 3, 'mdi-check-circle': passwordStrength.level >= 3}"></i>
                                                            <div>{{passwordStrength.message}}</div>
                                                        </div>
                                                        <div class="form-group mb-3">
                                                            <label class="form-label">Konfirmasi Password</label>
                                                            <div style="position: relative;">
                                                                <Field :type="togglePasswordVisibility[1] ? 'text' : 'password'" name="password_confirm" class="form-control" placeholder="Masukkan konfirmasi password" v-model="form.confirmPassword" />
                                                                <i class="mdi" v-if="form.confirmPassword" :class="{'mdi-eye': togglePasswordVisibility[1], 'mdi-eye-off': !togglePasswordVisibility[1]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[1] = !togglePasswordVisibility[1]"></i>
                                                            </div>
                                                            <ErrorMessage name="password_confirm" :class="'text-danger'" />
                                                        </div>
                                                        <div class="alert alert-light custom-rounded-medium">
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
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer card-footer-custom-radius-medium">
                                            <div class="d-flex justify-content-end">
                                                <router-link to="/master-admin" class="btn border-light bg-white custom-rounded-medium me-2">Kembali</router-link>
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
import { doc, setDoc, getDoc, getDocs, query, collection, where } from "firebase/firestore";

import { useRoute } from 'vue-router';

import axios from 'axios';

export default {
    name: 'MasterKopak',
    data() {
        return {
            id: this.$route.params.id,
            form: {
                name: '',
                identity_number: '',
                email: '',
                phone: '',
                address: '',
                password: '',
                address: '',
                confirmPassword: '',
            },
            loading: null,
            togglePasswordVisibility: [false, false]
        }
    },
    components: {
        simplebar, Field, Form, ErrorMessage
    },
    setup() {
        const route = useRoute();
        
        const schema = yup.object({
            name: yup.string().required('Masukkan nama'),
            identity_number: yup.string().required('Masukkan NIK').min(16, "NIK minimal 16 digit").max(16, "NIK maksimal 16 digit"),
            email: yup.string().required('Masukkan email'),
            password: !route.params.id ? yup.string().required('Masukkan password').min(8, 'Masukkan password minimal 8 karakter') : null,
            password_confirm: !route.params.id ? yup.string().required('Masukkan password').min(8, 'Masukkan password minimal 8 karakter') : null,
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
        }
    },
    async mounted() {
        if (this.id) {
            const userDoc = await getDoc(doc(db, "users", this.id));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();

                this.form = userData
            }
        }
    },
    methods: {
        async handleSubmit() {
            if (this.checkNIK() == 0) {
                if (!this.id) {
                    this.registerAccount(this.form.email, this.form.password)
                } else {
                    this.saveUser(this.id)
                }
            } else {
                this.$toast.error('NIK sudah Digunakan');
            }
        },
        async saveUser(uid) {
            try {
                this.loading = this.$loading.show()
                // Buat akun baru menggunakan Firebase Authentication
                if (uid) {
                    // Simpan data tambahan pengguna di Firestore
                    await setDoc(doc(db, "users", uid), {
                        name: this.form.name,
                        identity_number: this.form.identity_number,
                        email: this.form.email,
                        phone: this.form.phone,
                        password: this.form.password,
                        address: this.form.address,
                        createdAt: this.id ? this.form.createdAt : new Date(),
                        role: 'admin'
                    });
                }
                
                this.loading.hide()
                this.$router.push({name: 'admin'})
                this.$toast.success('Data Admin Berhasil Disimpan');
            } catch(error) {                
                if (this.loading != null)
                    this.loading.hide()
                this.fetch = false

                let message = error.message || error.code

                if (message == 'auth/email-already-in-use')
                    message = 'Email sudah terdaftar, silahkan masukkan email lain!'
                else if (message == 'auth/invalid-email')
                    message = 'Email yang dimasukan tidak valid!'
                else if (message == 'auth/weak-password')
                    message = 'Kombinasi password lemah!'
                
                this.$toast.error(message);
            }
        },
        registerAccount(email, password) {
            this.loading = this.$loading.show()
            if (this.form.password == this.form.confirmPassword) {
                this.api
                    .post(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/register`,
                        {
                            email: email,
                            password: password
                        }
                    )
                    .then((response) => {
                        this.loading.hide()
                        if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                            this.saveUser(response.data.uid)
                        } else {
                            this.$toast.error(response.message);
                        }
                    })
                    .catch((error) => {
                        this.loading.hide()
                        this.$toast.error(error.response.data.error);
                    });
            } else {
                this.loading.hide()
                this.$toast.error('Konfirmasi password tidak sesuai!');
            }
        },
        async checkNIK() {
            const usersQuery = query(
                collection(db, "users"),
                where("identity_number", '==', this.form.identity_number),
                where("email", '!=', this.form.email),
            );
            const querySnapshot = await getDocs(usersQuery);                
            const dataUser = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return dataUser.length
        }
    }
}
</script>